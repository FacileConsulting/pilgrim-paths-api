const { constant } = require('../constant');
const { 
  getSettings,
  updateSettings,
  getDashboard,
  updateDashboard,
  createProvider,
  getAllProviders,
  deleteProvider,
  updateProvider,
  getProvider,
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

exports.providers = async (req, res) => {
  const { 
    c200, 
    c500, 
    yS,
    nS,
    providers, 
  } = constant();
  try {
    const { stat, message } = await apiChecker();
    if (stat) {
      return res.status(stat).json({ error: message });
    }
    const type = req.body.type;
    const { providerId } = req.body;
    providerId ? delete req.body.providerId : null; 
    delete req.body.type;

    const settingsChange = async () => {
      const settings = await getSettings({ _id: '689d5ad061d5569a4efe288f' });
      console.log('dfdfdfssd', settings);
      if (settings.providerNotification) {
        await updateSettings('689d5ad061d5569a4efe288f', {      
          notificationCounter: settings.notificationCounter + 1
        });
      }
    }
    if (type === providers.create) {
      const providerData = await createProvider({
        ...req.body
      });
      const dashboard = await getDashboard({ _id: '6899669c88070a0970315bcc' });
      const result = await updateDashboard('6899669c88070a0970315bcc', {      
        activity: [
          {
            time: new Date(),
            type: 'provider',
            name: req.body.providerName,
            title: 'New Provider Registration',
            status: req.body.providerStatus.charAt(0).toUpperCase() + req.body.providerStatus.slice(1)
          }, 
          ...dashboard.activity]
      });
      await settingsChange();
      await saveInDB(providerData);
      res.status(c200).send({ ...providers.created });
    } else if (type === providers.fetchAll) {
      const query = {};
      const providersAllData = await getAllProviders(query);
      console.log('req.body', providers.fetchAll);
      if (!providersAllData || providersAllData.length == 0) {
        res.status(c200).send({ ...providers.failed });
      } else {
        const result = await updateDashboard('6899669c88070a0970315bcc', {      
          totalProvidersCurrMonth: providersAllData.length
        });
        res.status(c200).send({
          status: yS,
          data: providersAllData
        });
      }
    } else if (type === providers.delete) {
      // Delete the document by ID
      const result = await deleteProvider(providerId);
      // console.log("$$$$$$$$$delte", result);
      if (result.deletedCount === 1) {        
        const dashboard = await getDashboard({ _id: '6899669c88070a0970315bcc' });
        const result = await updateDashboard('6899669c88070a0970315bcc', {      
          activity: [
            {
              time: new Date(),
              type: 'provider',
              name: req.body.providerName,
              title: 'Provider Deleted',
              status: 'Deleted'
            }, 
            ...dashboard.activity]
        });
        await settingsChange();
        return res.status(c200).send({ ...providers.deleted });
      } else {
        return res.status(c200).send({ ...providers.notFound });
      }
    } else if (type === providers.update) {
      // Update exist pilgrimage booking data
      const result = await updateProvider(providerId, {      
        ...req.body
      });
      if (result.nModified) {               
        const dashboard = await getDashboard({ _id: '6899669c88070a0970315bcc' });
        const result = await updateDashboard('6899669c88070a0970315bcc', {      
          activity: [
            {
              time: new Date(),
              type: 'provider',
              name: req.body.providerName,
              title: 'Provider Edited',
              status: req.body.providerStatus.charAt(0).toUpperCase() + req.body.providerStatus.slice(1)
            }, 
            ...dashboard.activity]
        });
        await settingsChange();
        return res.status(c200).send({ ...providers.updated });
      } else if (result.nModified === 0) {
        return res.status(c200).send({ ...providers.notUpdated });
      } else {
        return res.status(c200).send({ ...providers.notFound });
      }
    } else if (type === providers.fetch) {
      const result = await getProvider({ _id: providerId });

      if (!result) {
        return res.status(c200).send({ ...providers.noProvider });
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
