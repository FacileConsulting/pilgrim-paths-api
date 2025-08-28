const { ObjectId } = require('mongodb');
const Provider = require('./models/providers');
const Package = require('./models/packages');
const Inquiry = require('./models/inquiries');
const Dashboard = require('./models/dashboard');
const Setting = require('./models/settings');


const getSettings = async (query) => {
  return await Setting.findOne(query);
}

const updateSettings = async (query, data) => {
  return await Setting.updateOne({ _id: new ObjectId(query) }, { $set: data } );
}

const createDashboard = (query) => {
  return new Dashboard(query);
}

const getDashboard = async (query) => {
  return await Dashboard.findOne(query);
}

const updateDashboard = async (query, data) => {
  return await Dashboard.updateOne({ _id: new ObjectId(query) }, { $set: data } );
}

const createInquiry = (query) => {
  return new Inquiry(query);
}

const getAllInquiries = async (query) => {
  return await Inquiry.find(query);
}

const updateInquiry = async (query, data) => {
  return await Inquiry.updateOne({ _id: new ObjectId(query) }, { $set: data } );
}

const createPackage = (query) => {
  return new Package(query);
}

const getAllPackages = async (query) => {
  return await Package.find(query);
}

const deletePackage = async (query) => {
  return await Package.deleteOne({ _id: new ObjectId(query) });
}

const updatePackage = async (query, data) => {
  return await Package.updateOne({ _id: new ObjectId(query) }, { $set: data } );
}

const getPackage = async (query) => {
  return await Package.findOne(query);
}

const createProvider = (query) => {
  return new Provider(query);
}

const getAllProviders = async (query) => {
  return await Provider.find(query);
}

const deleteProvider = async (query) => {
  return await Provider.deleteOne({ _id: new ObjectId(query) });
}

const updateProvider = async (query, data) => {
  return await Provider.updateOne({ _id: new ObjectId(query) }, { $set: data } );
}

const getProvider = async (query) => {
  return await Provider.findOne(query);
}

const saveInDB = async (data) => {
  await data.save();
}

module.exports = {
  getSettings,
  updateSettings,
  createDashboard,
  getDashboard,
  updateDashboard,
  createInquiry,
  getAllInquiries,
  updateInquiry,
  getAllPackages,
  createPackage,
  deletePackage,
  updatePackage,
  getPackage,
  getAllProviders,
  createProvider,
  deleteProvider,
  updateProvider,
  getProvider,
  saveInDB
};