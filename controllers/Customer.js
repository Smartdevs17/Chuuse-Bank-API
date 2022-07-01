const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {NewAccount,ValidateAccount,GetCustomer} = require("../services/Customer");
const Customer = require("../models/Customer");


// Create New Account
const CreateAccount = async(req,res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password,salt);
        const {accName,bals} = req.body;
        

        const data = {
            accName: accName,
            bals: bals,
            password: hashPassword
        };

        // const newCustomer = await NewAccount(data);
        try {
            const newAccount = new Customer(data);
            newAccount.save().then(() => {
                return newAccount.generateAuthToken();
            }).then(token => {
                res.header("x-auth",token).status(200).json(newAccount)
            })
    
           
         } catch (error) {
             return {success: false, errorMessage: error.message, status: 500};
         }
    } catch (error) {
        res.statusCode(500).json(error.message)

    }
};

// Login Account
const AccessAccount = async(req,res) => {
    try {
   
            const {accNo,password} = req.body;
            const data = {
                accNo,password
            }

            const customer =  await ValidateAccount(data);
            const {status, ...result} = customer;
            if(status === 403){
                res.status(403).json({
                    success: false,
                    message: "Invalid Credentials"
                })
            }else{
                res.status(status).json({
                    accessToken: result.message.tokens[0].token
                });
            }
           
    } catch (error) {
        res.status(500).json(error.message)
    }
};


// Get Customer Account
const GetAccount = async(req,res) => {
    try {
        const bearerHeader = req.headers["authorization"];
        const id = req.params.id;

        if(typeof bearerHeader !== "undefined"){
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
    
            req.token = bearerToken
            let token = req.token;

        Customer.findByToken(token).then(user => {
            if(!user) return Promise.reject();
            if(user.accNo !== id){
                res.status(403).json({
                    success: false,
                    message: "Unauthorized access. Invalid credentials"
                });
    
            }else{
                res.status(200).json(user )
            }
        }).catch(err => {
            res.status(401).json(err);
        });

        }else{
            res.status(403).json({
                success: false,
                message: "Unauthorized access. Invalid accesstoken"
            });
        }


    } catch (error) {
        res.status(500).json(error.message)
    }
};



module.exports = {
    CreateAccount,
    AccessAccount,
    GetAccount,
}