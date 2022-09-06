const mongoose = require('mongoose');
const mongoURL = "mongodb://localhost:27017/inotebook"

//Function to connect mongodb server
const connectedToMongo = () => {
    mongoose.connect(mongoURL, () =>{
        console.log("connected to mongo success");
    })
}

module.exports = connectedToMongo;