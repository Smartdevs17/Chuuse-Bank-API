const Customer = require("../models/Customer");
const {GetStatement,Deposit,Withdrawal} = require("../services/Transaction")





//Get Customer Account Statement
const GetAccountStatement = async(req,res) => {
  

    try {
        const bearerHeader = req.headers["authorization"];
        const id = req.params.id;

        if(typeof bearerHeader !== "undefined"){
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
    
            req.token = bearerToken
            let token = req.token;

   

        Customer.findByToken(token).then((user) => {
            if(!user) return Promise.reject();

            else if(user.accNo !== id){
                res.status(401).json({
                    success: false,
                    message: "Invalid Credentials"
                })  
            }else{

                const statement = GetStatement(id).then(results =>{
                    const {status,...result} = results;
                        res.status(status).json(result); 
                             });
            }

        }).catch(err => {
            
                res.status(401).json({
                    success: false,
                    message: "Invalid Token"
                })
        })

        }else{
            res.status(401).json({
                success: false,
                message: "Missing Token"
            })
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
}



const MakeDeposit = async(req,res) => {
   
    try {
        const bearerHeader = req.headers["authorization"];

        if(typeof bearerHeader !== "undefined"){
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
    
            req.token = bearerToken
            let token = req.token;

        const {accNo,amount} = req.body;
        const data = {
            accNo,amount
        }

        Customer.findByToken(token).then((user) => {
            if(!user) return Promise.reject();

            else if(user.accNo !== accNo){
                res.status(403).json({
                    success: false,
                    message: "Invalid Credentials"
                })  
            }else{

            const newdeposit = Deposit(data).then(response => {
                const {status,...result} = response;
                res.status(status).json(result);
            })
          
            }

        }).catch(err => {
            
                res.status(401).json({
                    success: false,
                    message: "Invalid Token",
                    errorMessage: err
                })
        })

        }else{
            res.status(403).json({
                success: false,
                message: "Missing Token"
            })
        }

    } catch (error) {
        res.status(500).json(error.message);
    }
};


const MakeWithdrawal = async(req,res) => {
   
    try {
        const bearerHeader = req.headers["authorization"];

        if(typeof bearerHeader !== "undefined"){
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
    
            req.token = bearerToken
            let token = req.token;

            const {accNo,password,amount} = req.body;
                const data = {
                    accNo,amount,password
                }

        Customer.findByToken(token).then((user) => {
            if(!user) return Promise.reject();

            else if(user.accNo !== accNo){
                res.status(401).json({
                    success: false,
                    message: "Invalid Credentials"
                })  
            }else{

                 const newWithdrawal = Withdrawal(data).then(response => {
                    const {status,...result} = response;
                    res.status(status).json(result)
                 })
                
            }

        }).catch(err => {
            
                res.status(401).json({
                    success: false,
                    message: "Invalid Token"
                })
        })

        }else{
            res.status(401).json({
                success: false,
                message: "Missing Token"
            })
        }

    }catch (error) {
        res.status(500).json(error.message);
    }
}



module.exports = {
    GetAccountStatement,
    MakeDeposit,
    MakeWithdrawal
}