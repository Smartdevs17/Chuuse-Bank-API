
const verifyToken = (req,res,next) => {
    const bearerHeader = req.headers["authorization"];

    if(typeof bearerHeader !== "undefined"){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        req.token = bearerToken
        let token = req.token;
        Customer.findByToken(token).then((user) => {
            if(!user) return Promise.reject();

            req.user = user;
            req.toker = token;

        })
    }else{
        res.status(403).json({
            success: false,
            message: "Unauthorized access. Invalid accesstoken"
        });
    }
}

module.exports = verifyToken;
