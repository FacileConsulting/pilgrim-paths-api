const mongoose = require('mongoose');

const providersSchema = new mongoose.Schema({
  isDraft: {
    type: Boolean,
    required: true
  },
  providerStatus: {
    type: String,
    required: true
  },
  providerEmployees: {
    type: String,
    required: true
  },
  providerServices: {
    type: String,
    required: false
  },
  providerVerificationStatus: {
    type: String,
    required: true
  },
  providerName: {
    type: String,
    required: true
  },
  providerDescription: {
    type: String,
    required: false
  },
  providerEmail: {
    type: String,
    required: true
  },
  providerPhone: {
    type: String,
    required: true
  },
  providerWebsite: {
    type: String,
    required: false
  },
  providerAddress: {
    type: String,
    required: false
  },
  providerLicense: {
    type: String,
    required: false
  },
  providerEstablished: {
    type: String,
    required: true
  },
  providerAdminNotes: {
    type: String,
    required: false
  },  
  providerPackages: {
    type: Number,
    required: true,
    default: 0
  },
  providerRating: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Providers', providersSchema);