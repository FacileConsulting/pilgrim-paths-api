const mongoose = require('mongoose');

const inquiriesSchema = new mongoose.Schema({
  inquiryName: {
    type: String,
    required: true
  },
  inquiryNumber: {
    type: String,
    required: true
  },
  inquiryDate: {
    type: String,
    required: true
  },
  inquiryPackage: {
    type: String,
    required: true
  },
  inquiryProvider: {
    type: String,
    required: true
  },
  inquiryRatingProvider: {
    type: String,
    required: true
  },
  inquiryTravelersNumber: {
    type: String,
    required: true
  },
  inquiryStartDate: {
    type: String,
    required: true
  },
  inquiryEndDate: {
    type: String,
    required: true
  },
  inquiryDeparture: {
    type: String,
    required: true
  },
  inquiryMessage: {
    type: String,
    required: true
  },
  inquiryEmail: {
    type: String,
    required: true
  },
  inquiryPhone: {
    type: String,
    required: true
  },
  inquiryResponse: {
    type: Array,
    required: true
  },
  inquiryStatus: {
    type: String,
    required: true,
    default: 'Pending'
  },
});

module.exports = mongoose.model('Inquiry', inquiriesSchema);