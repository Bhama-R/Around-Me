const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name : {
        type: String,
    },
    description : {
        type : String,
    },
    icon : {
        type : String,
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User"
    },
    status: { 
        type: String, 
        enum: [
            "active", 
            "inactive"
        ], 
        default: "active" },
}, { timestamps: true }
);

module. exports = mongoose.model("Category", categorySchema);