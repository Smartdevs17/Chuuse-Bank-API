const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    accNo: {
        type: String,
        required: true
    },
    transdate: {
        type: Date,
        required: true
    },
    transtype: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    accbal: {
        type: Number,
        required: true
    },
    narration: {
        type: String,
        default: ""
    }

},{timestamps: true});

module.exports = mongoose.model("Transaction",transactionSchema);