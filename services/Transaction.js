const Customer = require("../models/Customer");
const Transaction = require("../models/Transaction");
const bcrypt = require("bcrypt");


const GetStatement = async(id) => {
    try {
        const customerTrans = await Transaction.find({accNo: id});
        if(customerTrans){
            return{success: true,message: customerTrans, status: 200};
        }else{
            return{success: true,message: "No transaction recorded", status: 200};
        }
    } catch (error) {
        return {success: false, errorMessage: error.message, status: 500};  
    }


};


const Deposit = async(data) => {
    try {
        const customer = await Customer.findOne({accNo: data.accNo});
        if(!customer){
            return {success: false,status: 400,message: "Bad request. No account number recorded"};
        }else if(data.amount > 1000000 || data.amount < 100){
            return {success: false,status: 400,message: "Bad Request"};
        }else{
            const currentBal = customer.bals;
            const totalBalance = currentBal + data.amount;
            const trans = {
                accNo: customer.accNo,
                transdate: Date.now(),
                transtype: "Deposit",
                amount: data.amount,
                accbal: totalBalance
            }

           try {
                const newDeposit = await Transaction(trans);
                const savedDeposit = await newDeposit.save();
                const updates = {
                    bals: totalBalance,
                    updatedAt: Date.now()
                }
                const deposit =   await Customer.updateOne({accNo: customer.accNo},{bals: totalBalance},{upsert: true});
                return{success: true,message:`${data.amount} deposited successfully`, status: 200};
           } catch (error) {
                return {success: false, errorMessage: error.message, status: 500};  
           }

        }
    } catch (error) {
        return {success: false, errorMessage: error.message, status: 500};  
    }
};

const Withdrawal = async(data) => {
    try {
        const customer = await Customer.findOne({accNo: data.accNo});

        if(data.amount < 1 || !customer ){
            return {success: false,status: 400,message: "Bad request."};
        }
        const validPassword = await bcrypt.compare(data.password, customer.password);
        if(!validPassword){
            return {success: false,status: 400,message: "Bad request. Invalid credentials"};
        }
       else if(customer){

        const currentBal = customer.bals;
        const totalBalance = currentBal - data.amount;
        if(totalBalance >= 500){
            const trans = {
                accNo: customer.accNo,
                transdate: Date.now(),
                transtype: "Deposit",
                amount: data.amount,
                accbal: totalBalance
            }

            try {
                const newWithdrawal = await Transaction(trans);
                const savedWithdrwalnewWithdrawal = await newWithdrawal.save();
                const updates = {
                    bals: totalBalance,
                    updatedAt: Date.now()
                }
                const deposit =   await Customer.updateOne({accNo: customer.accNo},{bals: totalBalance},{upsert: true});
                return{success: true,message: `${data.amount} withdrawn successfully`, status: 200};
            } catch (error) {
                return {success: false, errorMessage: error.message, status: 500};  
            }
        }else{
            return {success: false,status: 400,message: "Bad request. Insufficient funds"}; 
        } 
    }
    } catch (error) {
        return {success: false, errorMessage: error.message, status: 500};  
    }
};



module.exports = {
    GetStatement,
    Deposit,
    Withdrawal,
}