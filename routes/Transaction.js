const router = require("express").Router();
const {GetAccountStatement,MakeDeposit,MakeWithdrawal} = require("../controllers/Transaction");

router.get("/account_statement/:id",GetAccountStatement);
router.post("/deposit",MakeDeposit);
router.post("/withdrawal",MakeWithdrawal);







module.exports = router;