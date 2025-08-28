const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  activity: {
    type: Array,
    required: false
  },
  totalProvidersLastMonth: {
    type: Number,
    required: true,
    default: 0
  },
  activePackagesLastMonth: {
    type: Number,
    required: true,
    default: 0
  },
  newInquiriesLastMonth: {
    type: Number,
    required: true,
    default: 0
  },
  revenueLastMonth: {
    type: Number,
    required: true,
    default: 0
  },
  revenueCurrMonth: {
    type: Number,
    required: true,
    default: 0
  },
  totalProvidersCurrMonth: {
    type: Number,
    required: true,
    default: 0
  },
  activePackagesCurrMonth: {
    type: Number,
    required: true,
    default: 0
  },
  newInquiriesCurrMonth: {
    type: Number,
    required: true,
    default: 0
  },
});

module.exports = mongoose.model('Dashboard', dashboardSchema);