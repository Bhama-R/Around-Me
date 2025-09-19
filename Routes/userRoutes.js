const express = require("express");
const router = express.Router();
const userSchema = require("../Schema/userSchema");
const userController = require("../Controllers/userController");

router.post("/register", async(req,res) => {
    try{
        const dbActionfeedback = await userController.register(req.body);
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

router.get("/verify:token", async (req,res)=>{
    try{
        const dbActionfeedback= await userController.verifyUser(token);
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

router.post("/login", async (req, res) => {
    try {
      const dbActionFeedback = await userController.login(req.body);
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
  
  router.post("/resend-verification", async (req, res) => {
    try {
      const { email } = req.body;
      const dbActionFeedback = await userController.resendVerification(email);
      if (dbActionFeedback.status) {
        return res.status(200).json({ msg: "Verification email resent" });
      } else {
        return res.status(400).json({ msg: dbActionFeedback.message });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Unable to resend verification" });
    }
  });
  
  router.put("/profile/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const dbActionFeedback = await userController.updateProfile(id, req.body);
      if (dbActionFeedback.status) {
        return res.status(200).json(dbActionFeedback.data);
      } else {
        return res.status(404).json({ msg: dbActionFeedback.message });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Unable to update profile" });
    }
  });
  
  router.put("/deactivate/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const dbActionFeedback = await userController.deactivateAccount(id);
      if (dbActionFeedback.status) {
        return res.status(200).json({ msg: "Account deactivated and events handled" });
      } else {
        return res.status(400).json({ msg: dbActionFeedback.message });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Unable to deactivate account" });
    }
  });
  
  router.get("/", async (req, res) => {
    try {
      const dbActionFeedback = await userController.getAllUser();
      if (dbActionFeedback.status) {
        return res.status(200).json(dbActionFeedback.data);
      } else {
        return res.status(404).json({ msg: dbActionFeedback.message });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Unable to fetch users" });
    }
  });
  
  router.put("/role/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const dbActionFeedback = await userController.updateRole(id, role);
      if (dbActionFeedback.status) {
        return res.status(200).json({ msg: "Role updated successfully" });
      } else {
        return res.status(400).json({ msg: dbActionFeedback.message });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Unable to update role" });
    }
  });
  
  module.exports = router;