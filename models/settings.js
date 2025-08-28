const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  platformName: {
    type: String,
    required: true
  },
  platformDescription: {
    type: String,
    required: true
  },
  supportEmail: {
    type: String,
    required: true
  },
  adminEmail: {
    type: String,
    required: true
  },
  notificationCounter: {
    type: Number,
    required: true,
    default: 0
  },
  inquiryNotification: {
    type: Boolean,
    required: true,
    default: true
  },
  packageNotification: {
    type: Boolean,
    required: true,
    default: true
  },
  providerNotification: {
    type: Boolean,
    required: true,
    default: true
  },
  reportNotification: {
    type: Boolean,
    required: true,
    default: false
  },
  smtpHost: {
    type: String,
    required: true
  },
  smtpPort: {
    type: Number,
    required: false
  },
  smtpUsername: {
    type: String,
    required: false
  },
  smtpPassword: {
    type: String,
    required: false
  },
  enableSSL: {
    type: Boolean,
    required: false
  },
  mapboxAccessToken: {
    type: String,
    required: false
  },
  apiRateCounter: {
    type: Number,
    required: false,
    default: 0
  },
  apiRateLimit: {
    type: Number,
    required: false
  },
  publicAPIAccess: {
    type: Boolean,
    required: false
  },
  autoBackup: {
    type: Boolean,
    required: true
  },
  retentionDays: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Setting', settingsSchema);