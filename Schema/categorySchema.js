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
        enum : [
            "Music",
            "sports",
            "technology",
            "art",
            "literature",
            "dance",
            "drama",
            "food",
            "other",
        ],
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User"
    },
    status: { 
        type: String, 
        enum: [
            "active", 
            "blocked"
        ], 
        default: "active" },
}, { timestamps: true }
);

module. exports = mongoose.model("Category", categorySchema);