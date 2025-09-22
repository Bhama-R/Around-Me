const express = require('express');
const userService = require('../Services/userService');
const userSchema = require('../Schema/userSchema');

async function register(req, res) {
  try {
    const result = await userService.register(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function verifyUser(req, res) {
  try {
    const result = await userService.verifyUser(req.params.token, res);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const result = await userService.login(req.body.email, res);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const result = await userService.updateProfile(req.user.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deactivateAccount(req, res) {
  try {
    const result = await userService.deactivateAccount(req.user.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getAllUser(req, res) {
  try {
    const result = await userService.getAllUser();
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateRole(req, res) {
  try {
    const result = await userService.updateRole(req.params.id, req.body.role);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  register,
  verifyUser,
  login,
  updateProfile,
  deactivateAccount,
  getAllUser,
  updateRole,
};
