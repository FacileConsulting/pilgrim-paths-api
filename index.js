const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const connectDB = require('./db');
const healthRoute = require('./routes/health');
const providersRoute = require('./routes/providers');
const packagesRoute = require('./routes/packages');
const inquiriesRoute = require('./routes/inquiries');
const dashboardRoute = require('./routes/dashboard');
const settingsRoute = require('./routes/settings');
const app = express();

dotenv.config();
app.use(bodyParser.json({ limit: "100mb" })); 
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

// console.log('@@@@@##', process.env.REACT_APP_API_URL);
app.use(cors({
  // origin: process.env.REACT_APP_API_URL,
  origin: "*",
  methods: "GET,POST"
}));

/**
 * Connect to the database method call
 */
connectDB();

app.use("/api/health", healthRoute);
app.use("/api/providers", providersRoute);
app.use("/api/packages", packagesRoute);
app.use("/api/inquiries", inquiriesRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/settings", settingsRoute);

// console.log('PORT : ', process.env.PORT);
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`Backend server is running! on ${port}`);
});

// 60 seconds
server.timeout = 60000; 
