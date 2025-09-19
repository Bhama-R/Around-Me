const categoryServices = require("../Services/categoryService");

async function createCategory(req, res) {
  try {
    const payload = {
      name: req.body.name,
      description: req.body.description,
      icon: req.body.icon,
      status:req.body.status,
      createdBy: req.body.createdBy, 
    };
    const category = await categoryServices.createCategory(payload);
    return res.status(201).json({ msg: "Category created", category });
  } catch (err) {
    return res.status(500).json({ msg: "Unable to create category", error: err.message });
  }
}

async function getCategories(req, res) {
  try {
    const categories = await categoryServices.getCategories();
    return res.json({ categories });
  } catch (err) {
    return res.status(500).json({ msg: "Unable to fetch categories" });
  }
}

async function getCategoryById(req, res) {
  try {
    const id = req.params.id;
    const category = await categoryServices.getCategoryById(id);
    if (!category) return res.status(404).json({ msg: "Category not found" });
    return res.json({ category });
  } catch (err) {
    return res.status(500).json({ msg: "Error fetching category" });
  }
}

async function updateCategory(req, res) {
  try {
    const id = req.params.id;
    const updates = req.body;
    const category = await categoryServices.updateCategory(id, updates);
    if (!category) return res.status(404).json({ msg: "Category not found" });
    return res.json({ msg: "Category updated", category });
  } catch (err) {
    return res.status(500).json({ msg: "Error updating category" });
  }
}

async function deleteCategory(req, res) {
  try {
    const id = req.params.id;
    const category = await categoryServices.deleteCategory(id);
    if (!category) return res.status(404).json({ msg: "Category not found" });
    return res.json({ msg: "Category deleted", category });
  } catch (err) {
    return res.status(500).json({ msg: "Error deleting category" });
  }
}

module.exports = { createCategory,
    getCategories, 
    getCategoryById,
     updateCategory, 
     deleteCategory };
