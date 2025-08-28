const { constant } = require('../constant');
const { 
  getSettings,
  updateSettings,
  getDashboard,
  updateDashboard,
  createInquiry,
  getAllInquiries,
  updateInquiry,
  saveInDB
} = require('../mongo');

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

exports.inquiries = async (req, res) => {
  const { 
    c200, 
    c500, 
    yS,
    nS,
    inquiries, 
  } = constant();
  try {
    const { stat, message } = await apiChecker();
    if (stat) {
      return res.status(stat).json({ error: message });
    }
    console.log('req.body', req.body);
    const type = req.body.type;
    const inquiryId = req.body._id;
    inquiryId ? delete req.body._id : null; 
    delete req.body.type;
    if (type === inquiries.fetchAll) {
      const query = {};
      const inquiriesAllData = await getAllInquiries(query);
      console.log('req.body', inquiries.fetchAll);
      if (!inquiriesAllData || inquiriesAllData.length == 0) {
        res.status(c200).send({ ...inquiries.failed });
      } else {
        const result = await updateDashboard('6899669c88070a0970315bcc', {
          newInquiriesCurrMonth: inquiriesAllData.filter(item => item.inquiryStatus === 'Pending').length
        });
        res.status(c200).send({
          status: yS,
          data: inquiriesAllData
        });
      }
    } else if (type === inquiries.update) {
      const result = await updateInquiry(inquiryId, {      
        ...req.body
      });
      if (result.nModified) {
        const dashboard = await getDashboard({ _id: '6899669c88070a0970315bcc' });
        const result = await updateDashboard('6899669c88070a0970315bcc', {      
          activity: [
            {
              time: new Date(),
              type: 'inquiry',
              name: req.body.inquiryProvider,
              title: `Inquiry Updated: ${req.body.inquiryPackage}`,
              status: req.body.inquiryStatus
            }, 
            ...dashboard.activity]
        });
        return res.status(c200).send({ ...inquiries.updated });
      } else if (result.nModified === 0) {
        return res.status(c200).send({ ...inquiries.notUpdated });
      } else {
        return res.status(c200).send({ ...inquiries.notFound });
      }
    } else if (type === inquiries.create) {
      const inquiryData = await createInquiry({
        ...req.body
      });
      await saveInDB(inquiryData);
      const dashboard = await getDashboard({ _id: '6899669c88070a0970315bcc' });
      const result = await updateDashboard('6899669c88070a0970315bcc', {      
        activity: [
          {
            time: new Date(),
            type: 'inquiry',
            name: req.body.inquiryProvider,
            title: `Inquiry Created: ${req.body.inquiryPackage}`,
            status: req.body.inquiryStatus || 'Pending'
          }, 
          ...dashboard.activity]
      });
      res.status(c200).send({ ...inquiries.created });
    }
  } catch (error) {
    console.error(error);
    return res.status(c500).send({ ...inquiries.error });
  }
};
