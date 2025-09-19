const express = require("express");
const router = express.Router();
const categorySchema = require("../Schema/categorySchema");
const categoryController = require("../Controllers/categoryController");


router.post("/createCategory", async(req,res) => {
    try{
        const dbActionfeedback = await categoryController.createCategory(req.body);
        if (dbActionfeedback.status){
            return res.status(201).json(dbActionfeedback.data);
        }else{
            return res.status(400).json({msg:dbActionfeedback.message});
        }
    }catch(err){
        console.error(err);
        return res.status(500).json({msg:"Unable to register user"});
    }
});

router.get("/getCategories", async (req,res)=>{
    try{
        const dbActionfeedback= await categoryController.getCategories(token);
        if(dbActionfeedback.status){
            return res.status(201).json({ msg: "User verified successfully" });
        }else{
            return res.status(400).json({msg: dbActionfeedback.message});
        }
    }catch(err){
        console.error(err);
        return res.status(500).json({msg: "Unable to verify user"});
    }
});

router.get("/getCategoryById/:id", async (req, res) => {
    try {
      const dbActionFeedback = await categoryController.getCategoryById(id);
      if (dbActionFeedback.status) {
        return res.status(200).json(dbActionFeedback.data);
      } else {
        return res.status(401).json({ msg: dbActionFeedback.message });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Unable to login" });
    }
  });
  
  router.post("/updateCategory/:id", async (req, res) => {
    try {
      const dbActionFeedback = await categoryController.updateCategory(id, req.body);
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
  
  router.put("/deleteCategory/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const dbActionFeedback = await categoryController.deleteCategory(id, req.body);
      if (dbActionFeedback.status) {
        return res.status(200).json(dbActionFeedback.data);
      } else {
        return res.status(404).json({ msg: dbActionFeedback.message });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Unable to delete Category" });
    }
  });
  
  
  module.exports = router;