const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user's saved posts
// @route   GET /api/user/saved-posts
// @access  Private
router.get('/saved-posts', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedPosts',
      populate: { path: 'author', select: 'name email' }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.savedPosts || []);
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    res.status(500).json({ message: 'Server error fetching saved posts' });
  }
});

// @desc    Add post to recently viewed list
// @route   POST /api/user/recently-viewed/:postId
// @access  Private
router.post('/recently-viewed/:postId', protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(req.user._id);
    
    // Remove if already in array to move to top
    user.recentlyViewed = user.recentlyViewed.filter(
      id => id.toString() !== postId.toString()
    );

    // Unshift to add to front of array
    user.recentlyViewed.unshift(postId);

    // Limit array size to 10
    if (user.recentlyViewed.length > 10) {
      user.recentlyViewed = user.recentlyViewed.slice(0, 10);
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate({
      path: 'recentlyViewed',
      populate: { path: 'author', select: 'name email' }
    });

    res.json(updatedUser.recentlyViewed);
  } catch (error) {
    console.error('Error updating recently viewed:', error);
    res.status(500).json({ message: 'Server error updating recently viewed' });
  }
});

// @desc    Get user's recently viewed posts
// @route   GET /api/user/recently-viewed
// @access  Private
router.get('/recently-viewed', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'recentlyViewed',
      populate: { path: 'author', select: 'name email' }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out null posts (in case a saved post was deleted)
    const validPosts = (user.recentlyViewed || []).filter(p => p !== null);

    res.json(validPosts);
  } catch (error) {
    console.error('Error fetching recently viewed posts:', error);
    res.status(500).json({ message: 'Server error fetching recently viewed posts' });
  }
});

module.exports = router;
