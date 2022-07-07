const Customer = require("../models/Customer");
const bcrypt  = require("bcrypt");
const jwt = require("jsonwebtoken");

//Create New Customer Account
const NewAccount = async(data) => {
     try {
        const newAccount = new Customer(data);
        newAccount.save().then(() => {
            return newAccount.generateAuthToken();
        }).then(token => {
            return token
        });

       
     } catch (error) {
         return {success: false, errorMessage: error.message, status: 500};
     }

};

// Login Customer
const ValidateAccount = async(data) => {
    try {
        const customer = await Customer.findOne({accNo: data.accNo});

        if(!customer){
            return {success: false,status: 403,message: "Invalid credentails"};
        }

        const validPassword = await bcrypt.compare(data.password,customer.password);

        if(!validPassword){
            return {success: false,status: 403,message: "Invalid credentails"};
        }
        const {password, ...others} = customer._doc;
        return{success: true,message: others, status: 200};
    } catch (error) {
        return {success: false, errorMessage: error.message, status: 500};
    }
};

const GetCustomer = async(id) => {
    try {
        const getCustomer = await Customer.findOne({accNo: id});
        if(!getCustomer){
            return {success: false,status: 404,message: "NO customer found with that account number!!!"};
        }
        const {password, ...others} = getCustomer._doc;
        return{success: true,message: others, status: 200};
    } catch (error) {
        return {success: false, errorMessage: error.message, status: 500};
    }
}

module.exports = {
    NewAccount,
    ValidateAccount,
    GetCustomer,
}