require("dotenv").config();
const cors = require("cors");

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const userRoutes = require('./Routes/userRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const fakeReportRoutes = require('./Routes/fakeReportRoutes');
const interestRoutes = require('./Routes/interestRoutes');
const eventRoutes = require('./Routes/eventRoutes');
const attendeeRoutes = require('./Routes/attendeeRoutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173" }));  

app.use('/users',userRoutes);
app.use('/category',categoryRoutes);
app.use('/fakeReport',fakeReportRoutes);
app.use('/interest',interestRoutes);
app.use('/event',eventRoutes);
app.use('/ateendee',attendeeRoutes);
app.use("/uploads", express.static("uploads"));



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

