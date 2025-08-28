const constant = () => {
  const yS = 'success';
  const nS = 'error';
  return {
    c200: 200,
    c500: 500,
    yS,
    nS,
    health: {
      valid: {
        message: 'Health API called successfully',
        status: yS
      },
      error: {
        message: 'Error in /health',
        status: nS
      }
    },
    settings: {
      dbCreate: 'DB_BACKUP_CREATE',
      dbRestore: 'DB_BACKUP_RESTORE',
      update: 'SETTINGS_UPDATE',
      fetch: 'SETTINGS_FETCH',
      systemStatus: 'SYSTEM_STATUS',
      noSettings: {
        message: 'Settings does not exit. Contact Admin',
        noSettings: true,
        status: yS
      },
      notUpdated: {
        message: 'No Modification in Settings',
        notUpdated: true,
        status: yS
      },
      dbCreated: {
        message: 'Database Backup created successfully',
        dbCreated: true,
        status: yS
      },
      dbRestored: {
        message: 'Database Backup restored successfully',
        dbRestored: true,
        status: yS
      },
      updated: {
        message: 'Settings updated successfully',
        updated: true,
        status: yS
      },
      notFound: {
        message: 'Settings does not found',
        notFound: true,
        status: yS
      },
      failed: {
        message: 'Something went wrong. Please check with admin',
        data: [],
        status: yS
      },
      errorType: {
        message: 'Error in /settings API ',
        status: nS
      },
      error: {
        message: 'Error in /settings method',
        status: nS
      }
    },
    dashboard: {
      create: 'DASHBOARD_CREATE',
      update: 'DASHBOARD_UPDATE',
      fetch: 'DASHBOARD_FETCH',
      noDashboard: {
        message: 'Dashboard does not exit. Contact Admin',
        noDashboard: true,
        status: yS
      },
      notUpdated: {
        message: 'No Modification in Dashboard',
        notUpdated: true,
        status: yS
      },
      updated: {
        message: 'Dashboard updated successfully',
        updated: true,
        status: yS
      },
      notFound: {
        message: 'Dashboard does not found',
        notFound: true,
        status: yS
      },
      failed: {
        message: 'Something went wrong. Please check with admin',
        data: [],
        status: yS
      },
      created: {
        message: 'Dashboard created successfully',
        created: true,
        status: yS
      },
      errorType: {
        message: 'Error in /dashboard API ',
        status: nS
      },
      error: {
        message: 'Error in /dashboard method',
        status: nS
      }
    },
    inquiries: {
      create: 'INQUIRY_CREATE',
      update: 'INQUIRY_UPDATE',
      fetchAll: 'INQUIRY_FETCH_ALL',
      created: {
        message: 'Inquiry created successfully',
        created: true,
        status: yS
      },
      noInquiry: {
        message: 'Inquiry does not exit. Contact Admin',
        noInquiry: true,
        status: yS
      },
      notUpdated: {
        message: 'No Modification in Inquiry',
        notUpdated: true,
        status: yS
      },
      updated: {
        message: 'Inquiry updated successfully',
        updated: true,
        status: yS
      },
      notFound: {
        message: 'Inquiry does not found',
        notFound: true,
        status: yS
      },
      failed: {
        message: 'Something went wrong. Please check with admin',
        data: [],
        status: yS
      },
      errorType: {
        message: 'Error in /inquiry API ',
        status: nS
      },
      error: {
        message: 'Error in /inquiry method',
        status: nS
      }
    },
    packages: {
      create: 'PACKAGE_CREATE',
      update: 'PACKAGE_UPDATE',
      fetchAll: 'PACKAGE_FETCH_ALL',
      fetch: 'PACKAGE_FETCH',
      delete: 'PACKAGE_DELETE',
      deleted: {
        message: 'Package deleted successfully',
        deleted: true,
        status: yS
      },
      noPackage: {
        message: 'Package does not exit. Contact Admin',
        noPackage: true,
        status: yS
      },
      notUpdated: {
        message: 'No Modification in Package',
        notUpdated: true,
        status: yS
      },
      updated: {
        message: 'Package updated successfully',
        updated: true,
        status: yS
      },
      notFound: {
        message: 'Package does not found',
        notFound: true,
        status: yS
      },
      failed: {
        message: 'Something went wrong. Please check with admin',
        data: [],
        status: yS
      },
      created: {
        message: 'Package created successfully',
        created: true,
        status: yS
      },
      errorType: {
        message: 'Error in /packages API ',
        status: nS
      },
      error: {
        message: 'Error in /packages method',
        status: nS
      }
    },
    providers: {
      create: 'PROVIDER_CREATE',
      update: 'PROVIDER_UPDATE',
      fetchAll: 'PROVIDER_FETCH_ALL',
      fetch: 'PROVIDER_FETCH',
      delete: 'PROVIDER_DELETE',
      deleted: {
        message: 'Provider deleted successfully',
        deleted: true,
        status: yS
      },
      noProvider: {
        message: 'Provider does not exit. Contact Admin',
        noProvider: true,
        status: yS
      },
      notUpdated: {
        message: 'No Modification in Provider',
        notUpdated: true,
        status: yS
      },
      updated: {
        message: 'Provider updated successfully',
        updated: true,
        status: yS
      },
      notFound: {
        message: 'Provider does not found',
        notFound: true,
        status: yS
      },
      failed: {
        message: 'Something went wrong. Please check with admin',
        data: [],
        status: yS
      },
      created: {
        message: 'Provider created successfully',
        created: true,
        status: yS
      },
      errorType: {
        message: 'Error in /providers API ',
        status: nS
      },
      error: {
        message: 'Error in /providers method',
        status: nS
      }
    }
  }
}

module.exports = {
  constant
};