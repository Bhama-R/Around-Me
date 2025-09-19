const express = require("express");
const mongoose = require("mongoose");
const user = require ('../Schema/userSchema');
const Event = require("../Schema/eventSchema");
const Interest = require("../Schema/interestSchema");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

async function register (userData) {
    const existing = await user.findOne({ email : userDate.email});
    if ( existing) throw new Error ("User already registered");

    const token = crypto.randomBytes(32).toString("hex");

    const user = new user({
        ...userData,
        status: "blocked",
        token: token,
    });

    await  user.save();
    return { message: "Check your Gmail for Verification Link"};
}

async function verifyUser (token) {
    const foundUser = await user.findOne({ token });
    if(!foundUser) throw new Error("Invalid token");

    const tokenAge = Date.now() - new Date(foundUser.createdAt).getTime();
    if (tokenAge > 7 * 24 * 60 * 60 * 1000) {
        throw new Error("Token expired, please login");
    }

    user.status ="active";
    user.token = undefined
    user.cookieKey = crypto.randomBytes(16).toString("hex");
    await user.save();

    const loginToken = jwt.sign(
        { id : foundUser._id, role: foundUser.role },
        process.env.JWT_SECRET || "secret", 
        { expiresIn: "7d"}
    );
    return { user: foundUser, loginToken };
}

async function login (email) {
    const foundUser = await user.findOne({ email });
    if (!foundUser) throw new Error ("User not found");

    if (foundUser.status !== "active") {
        return await resendVerification(email);
    }

    const token = jwt.sign(
        { id : foundUser._id, role: foundUser.role },
        process.env.JWT_SECRET || "secret", 
        { expiresIn: "7d"}
    );
    return { user: foundUser, token };
}

async function resendVerification(email) {
    const existingUser = await user.findOne({email});
    if(!existingUser) throw new Error ("user not found");

    if (existingUser.status ===" active") {
        throw new Error("User already verified, please login");
    }

    const newToken = crypto.randomBytes(32).toString("hex");
    existingUser.token = newToken;
    existingUser.createdAt = new Date ();
    await existingUser.save();
    return { message: "A new verification link has been sent to your email" };
}

async function updateProfile(userId, updateData) {
    const user = await user.findByIdAndUpdate(userId, updateData, {new: true});
    return user;
}

async function deactivateAccount(userId) {
    const userDoc = await user.findByIdAndUpdate(userId, {status: "inactive"}, { new: true});
    if (!userDoc) throw new Error("User not found");

    const createdEvents = await Event.find({ createdBy: userId });

    const interests = await Interest.find({ userId })
        .populate("eventId", "title startDate location.status");

    await Event.updateMany(
        { createdBy: userId },
        { $set: { status: "blocked" } }
    );

    await Interest.updateMany(
        { userId, status: { $in: ["pending", "approved"] } },
        {
            $set: {
                status: "withdrawn",
                withdrawnAt: new Date(),
                withdrawReason: "User deactivated account",
            },
        }
    );

    return {
        message: "Account deactivated successfully",
        deactivatedUser: userDoc,
        createdEvents: createdEvents.map(e => ({
            id: e._id,
            title: e.title,
            startDate: e.startDate,
            location: e.location.city,
            status: "blocked",
        })),
        withdrawnInterests: interests.map(i => ({
            eventId: i.eventId._id,
            title: i.eventId.title,
            startDate: i.eventId.startDate,
            status: "withdrawn",
        })),
    };
}

async function getAllUser() {
    const user = await user.find();
    return user;
}
async function updateRole(userId, role){
    const user = await user.findByIdAndUpdate(userId, { role }, {new: true });
}

module.exports = {
    register,
    verifyUser,
    login,
    resendVerification,
    updateProfile,
    deactivateAccount,
    getAllUser,
    updateRole
};