const express = require("express");
const crypto = require("crypto");
const { protect } = require("../middlewares/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// @route   GET /api/user/me
// @desc    Get logged in user profile and links
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/user/links
// @desc    Add a new link
// @access  Private
router.post("/links", protect, async (req, res) => {
  const { title, url } = req.body;

  if (!title || !url) {
    return res.status(400).json({ message: "Please provide a title and url" });
  }

  try {
    const user = await User.findByPk(req.user.id);

    const newLink = { _id: crypto.randomUUID(), title, url };
    
    // In Sequelize, updating JSON columns requires re-assigning or doing what we do below:
    const updatedLinks = [...user.links, newLink];
    user.links = updatedLinks;
    await user.save();

    res.json(user.links);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   DELETE /api/user/links/:linkId
// @desc    Delete a link
// @access  Private
router.delete("/links/:linkId", protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    const updatedLinks = user.links.filter(
      (link) => link._id !== req.params.linkId
    );

    user.links = updatedLinks;
    await user.save();

    res.json(user.links);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   GET /api/user/:username
// @desc    Get public profile by username
// @access  Public
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
      attributes: ['username', 'links']
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
