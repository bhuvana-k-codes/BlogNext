const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

const VALID_TOPICS = ['Technology', 'Education', 'Career', 'Lifestyle', 'Ideas', 'Other'];

// @desc    Get all posts (optional topic filter)
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { topic } = req.query;
    const filter = {};

    if (topic && topic !== 'All') {
      filter.topic = topic;
    }

    const posts = await Post.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
});

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error fetching post' });
  }
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, topic } = req.body;

    if (!title || !content || !topic) {
      return res.status(400).json({ message: 'Title, content, and topic are required' });
    }

    if (!VALID_TOPICS.includes(topic)) {
      return res.status(400).json({ message: `Invalid topic. Must be one of: ${VALID_TOPICS.join(', ')}` });
    }

    const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
    const calculatedReadingTime = Math.max(1, Math.ceil(words / 200));

    const post = await Post.create({
      title,
      content,
      topic,
      author: req.user._id,
      readingTime: calculatedReadingTime
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name email');
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error creating post' });
  }
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (Owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, content, topic } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ownership check
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    if (topic && !VALID_TOPICS.includes(topic)) {
      return res.status(400).json({ message: `Invalid topic. Must be one of: ${VALID_TOPICS.join(', ')}` });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.topic = topic || post.topic;

    if (content) {
      const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
      post.readingTime = Math.max(1, Math.ceil(words / 200));
    }

    const updatedPost = await post.save();
    const populatedPost = await Post.findById(updatedPost._id).populate('author', 'name email');

    res.json(populatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Server error updating post' });
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ownership check
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Remove post & associated comments
    await Comment.deleteMany({ post: post._id });
    await Post.findByIdAndDelete(post._id);

    // Also clean up savedPosts references in Users
    await User.updateMany(
      { savedPosts: post._id },
      { $pull: { savedPosts: post._id } }
    );

    res.json({ message: 'Post and associated comments deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error deleting post' });
  }
});

// @desc    Toggle Save/Bookmark post
// @route   POST /api/posts/:id/save
// @access  Private
router.post('/:id/save', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const user = await User.findById(req.user._id);
    const isSaved = user.savedPosts.includes(post._id);

    if (isSaved) {
      user.savedPosts = user.savedPosts.filter(
        id => id.toString() !== post._id.toString()
      );
    } else {
      user.savedPosts.push(post._id);
    }

    await user.save();

    res.json({
      isSaved: !isSaved,
      savedPosts: user.savedPosts,
      message: isSaved ? 'Post removed from saved' : 'Post saved successfully'
    });
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ message: 'Server error toggling save post' });
  }
});

module.exports = router;
