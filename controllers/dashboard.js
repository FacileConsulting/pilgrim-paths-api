const { constant } = require('../constant');
const {
  updateSettings,
  getSettings,
  getDashboard,
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

exports.dashboard = async (req, res) => {
  const { 
    c200, 
    c500, 
    yS,
    nS,
    dashboard, 
  } = constant();
  try {
    const { stat, message } = await apiChecker();
    if (stat) {
      return res.status(stat).json({ error: message });
    }
    const type = req.body.type;
    if (type === dashboard.fetch) {
      const result = await getDashboard({ _id: '6899669c88070a0970315bcc' });
      if (!result) {
        return res.status(c200).send({ ...dashboard.noDashboard });
      } else {
        res.status(c200).send({
          status: yS,
          data: result || false
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(c500).send({ ...providers.error });
  }
};
