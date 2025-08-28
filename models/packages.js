const mongoose = require('mongoose');

const packagesSchema = new mongoose.Schema({
  providerId: {
    type: String,
    required: true
  },
  isDraft: {
    type: Boolean,
    required: true
  },
  packageTitle: {
    type: String,
    required: true
  },
  packageType: {
    type: String,
    required: true
  },
  packageRoomType: {
    type: String,
    required: true
  },
  packageCategory: {
    type: String,
    required: true
  },
  packageImage: {
    type: String,
    required: false
  },
  packageDeparture: {
    type: String,
    required: true
  },
  packageCurrency: {
    type: String,
    required: true
  },
  packageDescription: {
    type: String,
    required: false
  },
  packageProvider: {
    type: String,
    required: true
  },
  packageDuration: {
    type: String,
    required: true
  },
  packageStartDate: {
    type: String,
    required: false
  },
  packageEndDate: {
    type: String,
    required: false
  },
  packageDepartureDescription: {
    type: String,
    required: false
  },
  packageLocations: {
    type: String,
    required: true
  },
  packageMakkahHotel: {
    type: String,
    required: false
  },
  packageMadinahHotel: {
    type: String,
    required: false
  },
  packagePriceFrom: {
    type: String,
    required: true
  },
  packagePriceTo: {
    type: String,
    required: true
  },
  packageCapacity: {
    type: String,
    required: false
  },  
  packageMinimumBooking: {
    type: String,
    required: false
  },  
  packageInclusions: {
    type: String,
    required: false
  },  
  packageExclusions: {
    type: String,
    required: false
  },   
  packageFeatured: {
    type: Boolean,
    required: false
  },   
  packageActive: {
    type: Boolean,
    required: false
  },   
  packageInstantBooking: {
    type: Boolean,
    required: false
  }, 
  packageRating: {
    type: String,
    required: false
  },
  packageTags: {
    type: String,
    required: false
  },
});

module.exports = mongoose.model('Packages', packagesSchema);