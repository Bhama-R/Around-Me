const express = require('express');
const userService = require('../Services/userService');
const userSchema = require('../Schema/userSchema');

// Register new user
async function register(req, res) {
    try{
        const response = await userService.register(req.body);
        res.status(201).json(response)
    }catch(err) {
        res.status(400).json({error: err.message });
    }
}

// Verify user by token
async function verifyUser(req, res) {
    try {
        const response = await userService.verifyUser(token);
        res.status(201).json(response);
    }catch(err) {
        res.status(400).json({error: err.message});
    }
}

//login
async function login(req,res) {
    try{
        const response = await userService.login(email);
        res.status(201).json(response);
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

// Resend verification link
async function resendVerification(req, res) {
    try{
        const response = await userService.resendVerification(email);
        res.status(201).json(response);
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

//Update profile
async function updateProfile(req,res) {
    try{
        const response = await userService.updateProfile(req.params.id, req.body);
        res.status(201).json(response);
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

// Deactivate Account 
async function deactivateAccount(req, res) {
    try{
        const response = await userService.deactivateAccount(req.params.id);
        res.status(201).json(response);
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

// Get all user
async function getAllUser(req, res) {
    try{
        const response = await userService.getAllUser();
        res.status(201).json(response);
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

// update user role
async function updateRole(req, res) {
    try{
        const response = await userService.updateRole(req.params.id);
        res.status(201).json(response);
    }catch(err){
        res.status(400).json({error: err.message});
    }
}

module.exports ={
    register,
    verifyUser,
    login,
    resendVerification,
    updateProfile,
    deactivateAccount,
    getAllUser,
    updateRole
}