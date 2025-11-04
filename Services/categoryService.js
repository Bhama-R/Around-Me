const Category = require("../Schema/categorySchema");
const Event = require("../Schema/eventSchema");

async function createCategory(payload) {
  try {
    const newCategory = new Category(payload);
    await newCategory.save();
    return newCategory;
  } catch (err) {
    throw err;
  }
}

async function getCategories(filter = {}) {
  try {
    return await Category.find(filter).populate("createdBy", "name email");
  } catch (err) {
    console.error("getCategories", err);
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

async function updateCategory(id, updates) {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedCategory) throw new Error("Category not found");

    // 🔹 If category status becomes inactive, deactivate all its events
    if (updates.status && updates.status === "inactive") {
      await Event.updateMany(
        { category: id },
        { $set: { status: "inactive" } }
      );
    }

    // 🔹 (Optional) If category becomes active again, reactivate its events
    if (updates.status && updates.status === "active") {
      await Event.updateMany(
        { category: id },
        { $set: { status: "active" } }
      );
    }

    return updatedCategory;
  } catch (err) {
    console.error("updateCategory", err);
    throw err;
  }
}

// 🔹 Explicit function to deactivate a category (and its events)
async function deactivateCategory(categoryId) {
  try {
    // Mark all events as inactive first
    await Event.updateMany(
      { category: categoryId },
      { $set: { status: "inactive" } }
    );

    // Then mark the category as inactive
    return await Category.findByIdAndUpdate(
      categoryId,
      { $set: { status: "inactive" } },
      { new: true }
    );
  } catch (err) {
    console.error("deactivateCategory", err);
    throw err;
  }
}

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deactivateCategory,
};
