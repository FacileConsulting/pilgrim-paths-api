const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
const cron = require('node-cron');
const { MongoClient, GridFSBucket } = require("mongodb");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc.js');
const timezone = require('dayjs/plugin/timezone.js');
const fs = require("fs");
const path = require("path");
const exec = require('child_process').exec;
const spawn = require('child_process').spawn;
const { constant } = require('../constant');
const {
  getDashboard,
  updateSettings,
  getSettings,
  saveInDB
} = require('../mongo');

dayjs.extend(utc);
dayjs.extend(timezone);

const apiChecker = async () => {
  const settings = await getSettings({ _id: '689d5ad061d5569a4efe288f' });
  if (!settings.publicAPIAccess) {
    return { stat: 403, message: "Forbidden" };
  }
  if (settings.apiRateCounter <= settings.apiRateLimit) {
    await updateSettings('689d5ad061d5569a4efe288f', {      
      apiRateCounter: settings.apiRateCounter + 1
    });
    return { stat: undefined };
  } else {
    return { stat: 429, message: "Rate limit exceeded" }; 
  }
}

const transportCreate = ({ smtpHost, smtpPort, enableSSL, smtpUsername, smtpPassword }) => {
  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: enableSSL,
    auth: {
      user: smtpUsername,
      pass: smtpPassword
    },
    tls: { rejectUnauthorized: false } // allows self-signed certs
  });
}

const transporting = async (obj) => {
  try {
    const transporter = transportCreate(obj);

    // Verify SMTP connection
    await transporter.verify();
    return transporter;
  } catch (error) {
    console.error("❌ SMTP connection failed:", error.message);
  }
}

// Function to get today's activities in HTML
const getTodaysActivityHTML = (activity) => {
  const today = dayjs().tz("Asia/Kolkata").format("DD-MM-YYYY");

  const todaysData = activity.filter(item => {
    const itemDate = dayjs(item.time).tz("Asia/Kolkata").format("DD-MM-YYYY");
    return itemDate === today;
  });

  if (todaysData.length === 0) {
    return `<p>No activity for today (${today}).</p>`;
  }

  let tableRows = todaysData
    .map(
      item => `
        <tr>
          <td>${dayjs(item.time).tz("Asia/Kolkata").format("HH:mm")}</td>
          <td>${item.name}</td>
          <td>${item.title}</td>
          <td>${item.status}</td>
        </tr>`
    )
    .join("");

  return `
    <h2>Today's Activities (${today})</h2>
    <table border="1" cellpadding="5" cellspacing="0">
      <tr>
        <th>Time</th>
        <th>Name</th>
        <th>Title</th>
        <th>Status</th>
      </tr>
      ${tableRows}
    </table>
  `;
}

const createDatabaseBackup = async() => {
  const uri = process.env.MONGODB_URI; 
  const dbName = process.env.MONGODB_NAME;               
  const backupFile = `backup_${Date.now()}.gz`;
  exec(`mongodump --archive=${backupFile} --gzip`, async (err) => {
    if (err) return { stat: 500, obj: { error: message } }; 
    console.log("Backup created:", backupFile);
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db(dbName);

      const bucket = new GridFSBucket(db, { bucketName: "backups" });
      const uploadStream = bucket.openUploadStream(backupFile);
      fs.createReadStream(backupFile).pipe(uploadStream);

      uploadStream.on("finish", () => {
        console.log("Backup stored in MongoDB (GridFS)");
        fs.unlinkSync(backupFile);
        client.close();
        return { stat: c200, obj: { ...settings.dbCreated } };
      });
    } catch (err) {
      console.error("MongoDB upload error:", err);
    }
  });
}

const cronSchedule = async () => {
  // Schedule job for after 1 hour to reset the API Rate Counter
  cron.schedule("0 * * * *", async () => {
    try { 
      await updateSettings('689d5ad061d5569a4efe288f', {      
        apiRateCounter: 0
      });
    } catch (error) {
      console.error("❌ Failed to reset apiRateCounter to zero:", error.message);
    }
  });

  // Schedule job for 6:00 PM daily to send the daily activity report
  cron.schedule("0 18 * * *", async () => {
    const result = await getSettings({ _id: '689d5ad061d5569a4efe288f' });
    try { 
      const { reportNotification, smtpUsername, adminEmail } = result;
      const transporter = await transporting(result);
      if (result && reportNotification) {
        const dashboard = await getDashboard({ _id: '6899669c88070a0970315bcc' });
        const { activity } = dashboard;
        const htmlContent = getTodaysActivityHTML(activity);

        await transporter.sendMail({
          from: smtpUsername,
          to: adminEmail,
          subject: "Daily Activity Report",
          html: htmlContent
        });

        console.log("✅ Email sent with today's activity");
      }
    } catch (error) {
      console.error("Failed to send scheduled email:", error.message);
    }

    try {
      if (result && result.autoBackup) {
        const { stat, obj } = await createDatabaseBackup();
        if (stat) {
          return res.status(stat).send(obj);
        }
      }
    } catch (error) {
      console.error("Failed to auto create backup for database:", error.message);
    }
  });
}

cronSchedule();

exports.settings = async (req, res) => {
  const { 
    c200, 
    c500, 
    yS,
    nS,
    settings, 
  } = constant();
  try {
    const { stat, message } = await apiChecker();
    console.log('stat', stat);
    if (stat) {
      return res.status(stat).json({ error: message });
    }
    const type = req.body.type;
    delete req.body.type;
    if (type === settings.fetch) {
      const result = await getSettings({ _id: '689d5ad061d5569a4efe288f' });
      if (!result) {
        return res.status(c200).send({ ...settings.noSettings });
      } else {
        res.status(c200).send({
          status: yS,
          data: result || false
        });
      }
    } if (type === settings.systemStatus) {
      let obj = {};
      mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      try {
        await mongoose.connection.db.admin().ping();
        obj.databaseStatus = "Connected";
      } catch {
        obj.databaseStatus = "Disconnected";
      }

      try {
        const result = await getSettings({ _id: '689d5ad061d5569a4efe288f' });
        const transporter = transportCreate(result);
        await transporter.verify();
        obj.emailStatus = "Active";
      } catch {
        obj.emailStatus = "Inactive";
      }

      try {
        let gfsBucket = new GridFSBucket(mongoose.connection.db, {
          bucketName: "backups",
        });
        const cursor = gfsBucket.find({}).limit(1);
        const files = await cursor.toArray();
        obj.fileStatus = files ? "Online" : "Online"; // GridFS works even empty
      } catch {
        obj.fileStatus = "Offline";
      }

      return res.status(c200).send({ ...obj });

    } else if (type === settings.update) {
      await transporting(req.body);

      const result = await updateSettings('689d5ad061d5569a4efe288f', {      
        ...req.body
      });
      if (result.nModified) { 
        return res.status(c200).send({ ...settings.updated });
      } else if (result.nModified === 0) {
        return res.status(c200).send({ ...settings.notUpdated });
      } else {
        return res.status(c200).send({ ...settings.notFound });
      }
    } else if (type === settings.dbCreate) {
      const { stat, obj } = await createDatabaseBackup();
      if (stat) {
        return res.status(stat).send(obj);
      }
    } else if (type === settings.dbRestore) {
      const uri = process.env.MONGODB_URI; 
      const dbName = process.env.MONGODB_NAME; 
      const restoreLatestBackup = async() => {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db(dbName);

        const bucket = new GridFSBucket(db, { bucketName: "backups" });

        // Find latest backup
        const files = await db.collection("backups.files").find().sort({ uploadDate: -1 }).limit(1).toArray();
        console.log("files", files);
        if (!files.length) {
          console.log("No backups found.");
          return;
        }

        const latestFile = files[0];
        const localPath = `restore_${Date.now()}.gz`;
        console.log("restoreFile", localPath);

        // Download from GridFS
        const downloadStream = bucket.openDownloadStream(latestFile._id);
        const writeStream = fs.createWriteStream(localPath);

        downloadStream.pipe(writeStream);

        writeStream.on("finish", () => {
          console.log("Backup downloaded locally:", localPath);

          // Run mongorestore
          const restore = spawn("mongorestore", [
            `--gzip`,
            `--archive=${localPath}`,
            `--drop` 
          ]);

          restore.stdout.on("data", data => console.log(data.toString()));
          restore.stderr.on("data", data => console.error(data.toString()));

          restore.on("close", async (code) => {
            console.log(`mongorestore exited with code ${code}`);
            await client.close();           
            return res.status(c200).send({ ...settings.dbRestored });
          });
        });
      }

      restoreLatestBackup();
    }
  } catch (error) {
    console.error(error);
    return res.status(c500).send({ ...settings.error });
  }
};
