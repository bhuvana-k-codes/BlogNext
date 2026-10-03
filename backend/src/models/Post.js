const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Post content is required']
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      enum: ['Technology', 'Education', 'Career', 'Lifestyle', 'Ideas', 'Other'],
      default: 'Other'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    readingTime: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

// Calculate reading time before saving
postSchema.pre('save', function (next) {
  if (this.content) {
    const words = this.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    this.readingTime = Math.max(1, Math.ceil(words / 200));
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
