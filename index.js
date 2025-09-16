const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
 


const connectToDB = async () => {
    try{
        await mongoose.connect('mongodb://localhost:27017/Event', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

connectToDB();

const port =3000;
app.listen(port, () =>{
    console.log("Server started successfully");
});

