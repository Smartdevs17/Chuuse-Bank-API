const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const Customer = require("../../../models/Customer");

const customerOneID = new ObjectID();
const customerTwoID = new ObjectID();

const customers = [{
  _id: customerOneID,
  accName: "First User",
  password: "testpassword",
  bals: 10000,
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: customerOneID, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: customerTwoID,
  accName: "Second User",
  password: "mypassword",
  bals: 50000,
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: customerTwoID, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}]



var populateCustomer = (done) => {
    Customer.remove({}).then(() => {
      return Customer.insertMany(customers);
    }).then(() => done());
  };


  module.exports = {
      populateCustomer
  }