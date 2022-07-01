const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

const random = (min = 1000000000, max = 9999999999) => {
    let num = Math.random() * (max - min) + min;

    return Math.floor(num);
};


const customerSchema = new mongoose.Schema({
    accName: {
        type: String,
        unique: true
    },
    accNo: {
        type: String,
        unique: true,
        default: () => random(),
    },
    password: {
        type: String,
        required: true
    },
    bals: {
        type: Number,
        min: 500
    },
    tokens: [{
        access: {
            type: String
        },
        token: {
            type: String
        }
    }]

},{timestamps: true});
 

customerSchema.methods.toJSON = function (){
    let customer = this;
    let customerObject = customer.toObject();

    return _.pick(customerObject,["_id","accName","accNo","bals"])
};

customerSchema.methods.generateAuthToken = function(){
    let customer = this;

    let access = "auth";
    let token = jwt.sign({_id: customer._id.toHexString(),access},process.env.JWT_SECRET).toString();

    customer.tokens = customer.tokens.concat([{access,token}]);
    
    return customer.save().then(() => {
        return token;
    })
}

customerSchema.statics.findByToken = function(token){
    let customer = this;
    let decoded;

    try {
        decoded = jwt.verify(token,process.env.JWT_SECRET)
    } catch (error) {
        // console.log(error.message)
        return Promise.reject();
    }

    return Customer.findOne({
        "_id": decoded._id,
        "tokens.access": "auth",
        "tokens.token": token
    })
}

const Customer = mongoose.model("Customer",customerSchema);
module.exports = Customer; 



