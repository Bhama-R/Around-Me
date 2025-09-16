const mongoose = require("mongoose");

const eventSchema = new mongoose. Schema ({
    title : {
        type : String,
        required: true
    },
    description : {
        type : String,
        required: true
    },
    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category"
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Users"
    },
    location : {
        address : String,
        mapLink : String,
        city :{
            type: String,
            required: true
        },
    },
    startDate : Date,
    endDate : Date,
    status: { 
        type: String, 
        enum: [
            "active", 
            "blocked"
        ], 
        default: "active" },
    participants: [
        { 
            name: String, 
            profile: String 
        }],
    restrictions: {
      gender: { 
        type: String, 
        enum: [
        "male", 
        "female", 
        "trans"
    ], 
        default: "any" 
    },
      age: { 
        min: Number, 
        max: Number 
    },
    place : String,
       
    },
    capacity: Number,
    foodPreference: { 
        type: String, 
        enum: [
            "none", 
            "veg", 
            "non-veg", 
            "jain"], 
            default: "none" },
    attachments: [String],
    contacts: [{ 
        name: String, 
        phone: String 
    }],
    parking: {
      parkingAvailable: String,
      parkingSpace: String,
    },
    fee: Number,
    paymentDetails: {
      AccountNumber: String,
      UPIID: String,
      IFSCcode: String,
    },
    agenda: [{ 
        time: String, title: String 
    }],
  },
  { timestamps: true }
);

module. exports = mongoose.model("Event", eventSchema);