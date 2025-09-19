const express = require("express");
const mongoose = require("mongoose");
const category = require ('../Schema/categorySchema');

async function createCategory(payload){
    try{
        const category = new category(payload);
        await category.save();
        return category;
    }catch(err){
        throw err;
    }
}

async function getCategories(filter = {}) {
    try{
        return await category.find(filter).populate("createdBy","name email" );
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
        return await category.findByIdAndUpdate(id, updates, {new:true});
    }catch(err){
        console.error("updateCategory",err);
        throw err;
    }
}


async function deleteCategory(id) {
    try {
      return await Category.findByIdAndDelete(id);
    } catch (err) {
      console.error("deleteCategory", err);
      throw err;
    }
  }
  
  module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
  };