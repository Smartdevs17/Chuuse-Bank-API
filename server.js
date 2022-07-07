const http = require("http");
const mongoose = require("mongoose")
const app = require("./app");
const server = http.createServer(app);
const {connection} = require("./database/config");

// beforeAll(async () => {
//      await mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true});
//   });



const port = process.env.PORT || 5000;
server.listen(port,() => {
    console.log(`Server started running on port ${port}`);
});