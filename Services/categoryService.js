const express = require("express");
const mongoose = require("mongoose");
const Category = require ('../Schema/categorySchema');
const Event = require ('../Schema/eventSchema');

async function createCategory(payload){
    try{
        const newCategory = new Category(payload);
        await newCategory.save();
        return newCategory;
    }catch(err){
        throw err;
    }
}

async function getCategories(filter = {}) {
    try{
        return await Category.find(filter).populate("createdBy","name email" );
    }catch(err){
        console.error("getCategories",err);
        throw err;
    }
}

async function getCategoryById(id) {
    try {
      return await Category.findById(id).populate("createdBy", "name email");
    } catch (err) {
      console.error("getCategoryById", err);
      throw err;
    }
  }

async function updateCategory(id, updates){
    try{
        return await Category.findByIdAndUpdate(id, updates, {new:true});
    }catch(err){
        console.error("updateCategory",err);
        throw err;
    }
}

async function deactivateCategory(categoryId) {
  // Mark events as inactive
  await Event.updateMany(
    { category: categoryId },
    { $set: { status: "inactive" } }
  );

  // Mark category as inactive
  return await Category.findByIdAndUpdate(
    categoryId,
    { $set: { status: "inactive" } },
    { new: true }
  );
}


  module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deactivateCategory,
  };