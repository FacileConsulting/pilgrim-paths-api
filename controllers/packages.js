const { constant } = require('../constant');
const { 
  getSettings,
  updateSettings,
  getDashboard,
  updateDashboard,
  createPackage,
  getAllPackages,
  deletePackage,
  updatePackage,
  getPackage,
  saveInDB,
  getAllProviders,
  updateProvider
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

exports.packages = async (req, res) => {
  const { 
    c200, 
    c500, 
    yS,
    nS,
    packages, 
  } = constant();
  try {
    const { stat, message } = await apiChecker();
    if (stat) {
      return res.status(stat).json({ error: message });
    }
    console.log('req.body', req.body);
    const type = req.body.type;
    const { packageId } = req.body;
    packageId ? delete req.body.packageId : null; 
    delete req.body.type;

    const settingsChange = async () => {
      const settings = await getSettings({ _id: '689d5ad061d5569a4efe288f' });
      console.log('dfdfdfssd', settings);
      if (settings.packageNotification) {
        await updateSettings('689d5ad061d5569a4efe288f', {      
          notificationCounter: settings.notificationCounter + 1
        });
      }
    }

    if (type === packages.create) {
      const packageData = await createPackage({
        ...req.body
      });
      const dashboard = await getDashboard({ _id: '6899669c88070a0970315bcc' });
      await updateDashboard('6899669c88070a0970315bcc', {      
        activity: [
          {
            time: new Date(),
            type: 'package',
            name: req.body.packageProvider,
            title: `Package Created: ${req.body.packageTitle}`,
            status: req.body.packageActive ? 'Active' : 'Inactive'
          }, 
          ...dashboard.activity]
      });
      await settingsChange();
      await saveInDB(packageData);
      res.status(c200).send({ ...packages.created });
    } else if (type === packages.fetchAll) {
      const query = {};
      const packagesAllData = await getAllPackages(query);

      if (!packagesAllData || packagesAllData.length == 0) {
        res.status(c200).send({ ...packages.failed });
      } else {
        // To count packages as per each provider
        const grouped = Object.values(
          packagesAllData.reduce((acc, obj) => {
            const key = obj.packageProvider;
            if (!acc[key]) {
              acc[key] = { provider: key, length: 0 };
            }
            acc[key].length += 1;
            return acc;
          }, {})
        );

        const providersAllData = await getAllProviders(query);
        await Promise.all(
          grouped.map(async (group) => {
            const providerMatch = providersAllData.find(
              (item) => item.providerName === group.provider
            );
            if (providerMatch) {
              await updateProvider(providerMatch._id, {
                providerPackages: group.length,
              });
            }
          })
        );

        const result = await updateDashboard('6899669c88070a0970315bcc', {      
          activePackagesCurrMonth: packagesAllData.filter(item => item.packageActive === true).length
        });
        res.status(c200).send({
          status: yS,
          data: packagesAllData
        });
      }
    } else if (type === packages.delete) {
      // Delete the document by ID
      const result = await deletePackage(packageId);
      // console.log("$$$$$$$$$delte", result);
      if (result.deletedCount === 1) {
        const dashboard = await getDashboard({ _id: '6899669c88070a0970315bcc' });
        const result = await updateDashboard('6899669c88070a0970315bcc', {      
          activity: [
            {
              time: new Date(),
              type: 'package',
              name: req.body.packageProvider,
              title: `Package Deleted: ${req.body.packageTitle}`,
              status: 'Deleted'
            }, 
            ...dashboard.activity]
        });
        await settingsChange();
        return res.status(c200).send({ ...packages.deleted });
      } else {
        return res.status(c200).send({ ...packages.notFound });
      }
    } else if (type === packages.update) {
      const result = await updatePackage(packageId, {      
        ...req.body
      });
      if (result.nModified) {      
        const dashboard = await getDashboard({ _id: '6899669c88070a0970315bcc' });
        const result = await updateDashboard('6899669c88070a0970315bcc', {      
          activity: [
            {
              time: new Date(),
              type: 'package',
              name: req.body.packageProvider,
              title: `Package Updated: ${req.body.packageTitle}`,
              status: req.body.isDraft ? 'Draft' : 'Active'
            }, 
            ...dashboard.activity]
        });
        await settingsChange();
        return res.status(c200).send({ ...packages.updated });
      } else if (result.nModified === 0) {
        return res.status(c200).send({ ...packages.notUpdated });
      } else {
        return res.status(c200).send({ ...packages.notFound });
      }
    } else if (type === packages.fetch) {
      const result = await getPackage({ _id: packageId });

      if (!result) {
        return res.status(c200).send({ ...packages.noPackage });
      } else {
        res.status(c200).send({
          status: yS,
          data: result || false
        });
      }
    }

  } catch (error) {
    console.error(error);
    return res.status(c500).send({ ...packages.error });
  }
};
