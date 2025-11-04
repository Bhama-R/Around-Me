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
    await userService.verifyUser(req.params.token, res);
    // ✅ On success → redirect to Home
    return res.redirect("http://localhost:5173/home");
  } catch (err) {
    console.log("❌ Verification failed:", err.message);
    // ✅ If expired/invalid → redirect to login with query param
    return res.redirect("http://localhost:5173/login?error=expired");
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

async function resendVerification(req, res) {
  try {
    const result = await userService.resendVerification(req.body.email);
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
    const result = await userService.getAllUser(req.user);
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

async function suspendUser(req, res) {
  try {
    const result = await userService.suspendUser(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function activateUser(req, res) {
  try {
    const result = await userService.activateUser(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function checkAuth(req, res) {
  try {
    const result = await userService.checkAuth(req);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(401).json({ status: false, message: err.message });
  }
}

module.exports = {
  register,
  verifyUser,
  login,
  resendVerification,
  updateProfile,
  deactivateAccount,
  getAllUser,
  updateRole,
  suspendUser,
  activateUser,
  checkAuth
};
