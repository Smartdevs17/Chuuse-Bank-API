const router = require("express").Router();
const verifyToken = require("../middleware/jwtAuth");
const {CreateAccount,AccessAccount,GetAccount} = require("../controllers/Customer");

router.post("/create_account",CreateAccount);
router.post("/login",AccessAccount);
router.get("/account_info/:id",GetAccount);






module.exports = router;