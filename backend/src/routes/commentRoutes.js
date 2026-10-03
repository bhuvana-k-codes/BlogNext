const express = require('express');
const router = express.Router({ mergeParams: true });
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { postId } = req.params;
    
    const postExists = await Post.findById(postId);
    if (!postExists) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ post: postId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error fetching comments' });
  }
});

// @desc    Add a comment to a post
// @route   POST /api/posts/:postId/comments
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content cannot be empty' });
    }

    if (content.length > 300) {
      return res.status(400).json({ message: 'Comment exceeds 300 character limit' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      content: content.trim(),
      author: req.user._id,
      post: postId
    });

    const populatedComment = await Comment.findById(comment._id).populate('author', 'name email');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
});

module.exports = router;
