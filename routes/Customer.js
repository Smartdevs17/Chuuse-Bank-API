const router = require("express").Router();
const verifyToken = require("../middleware/jwtAuth");
const {CreateAccount,AccessAccount,GetAccount} = require("../controllers/Customer");

router.post("/create_account",CreateAccount);
router.post("/login",AccessAccount);
router.get("/account_info/:id",GetAccount);

// router.get("/user",(req,res) => {
//     res.status(200).json({
//         success: true,
//         message: "successfully got all the requirements"
//     });
// })






module.exports = router;