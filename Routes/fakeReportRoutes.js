const express = require("express");
const router = express.Router();
const fakeReportSchema = require("../Schema/categorySchema");
const fakeReportController = require("../Controllers/categoryController");


router.post("/createReport", async(req,res) => {
    try{
        const dbActionfeedback = await fakeReportController.createReport(req.body);
        if (dbActionfeedback.status){
            return res.status(201).json(dbActionfeedback.data);
        }else{
            return res.status(400).json({msg:dbActionfeedback.message});
        }
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:"Unable to create fake report"});
    }
});

router.get("/getReports", async (req,res)=>{
    try{
        const dbActionfeedback= await fakeReportController.getReports(token);
        if(dbActionfeedback.status){
            return res.status(201).json(dbActionfeedback.data);
        }else{
            return res.status(400).json({msg: dbActionfeedback.message});
        }
    }catch(err){
        console.error(err);
        return res.status(500).json({msg: "Unable to verify user"});
    }
});

router.get("/getReportById/:id", async (req, res) => {
    try {
      const dbActionFeedback = await fakeReportController.getReportById(id);
      if (dbActionFeedback.status) {
        return res.status(200).json(dbActionFeedback.data);
      } else {
        return res.status(401).json({ msg: dbActionFeedback.message });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Unable to get the report" });
    }
  });
  
  router.post("/updateReport/:id", async (req, res) => {
    try {
      const dbActionFeedback = await fakeReportController.updateReport(id, req.body);
      if (dbActionFeedback.status) {
        return res.status(200).json({ msg: " Category Updated " });
      } else {
        return res.status(400).json({ msg: dbActionFeedback.message });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Unable to update category" });
    }
  });

  
  module.exports = router;