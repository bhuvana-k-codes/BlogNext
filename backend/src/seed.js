const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const connectDB = require('./config/db');

dotenv.config();

const sampleUsers = [
  {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    password: 'password123'
  },
  {
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    password: 'password123'
  },
  {
    name: 'David Miller',
    email: 'david@example.com',
    password: 'password123'
  }
];

const samplePosts = [
  {
    title: 'Getting Started with Modern Full-Stack Web Development',
    topic: 'Technology',
    content: `Full-stack web development combines front-end and back-end development skills to build complete web applications from start to finish. When building full-stack applications, understanding how the front-end user interface communicates with back-end REST APIs and database models is essential.

In this article, we explore how React, Node.js, Express, and MongoDB work seamlessly together. React manages application state and UI rendering. Express defines clear RESTful API routes to process client requests. Mongoose maps object data to MongoDB documents securely.

Building projects like BlogNest gives beginners practical experience with real user authentication, JWT tokens, state management, and CRUD operations.`
  },
  {
    title: '5 Daily Habits for a Productive Tech Career',
    topic: 'Career',
    content: `Building a successful career in technology isn't just about writing code for hours; it's about consistency, continuous learning, and clear communication.

Here are 5 daily habits that can transform your growth:
1. Block time for focused deep work every morning without distractions.
2. Read tech articles or documentation for 20 minutes daily.
3. Write clean, readable code and document your key design choices.
4. Seek feedback early and learn from pull request reviews.
5. Practice clear verbal and written communication with your teammates.`
  },
  {
    title: 'The Art of Mindful Reading in a Digital Age',
    topic: 'Lifestyle',
    content: `In a world full of rapid notifications, endless social feeds, and quick snippets, long-form reading has become a superpower. Mindful reading allows us to slow down, process complex ideas, and develop deep focus.

Creating a calm reading environment—turning off phone notifications, using clean reading interfaces, and setting aside dedicated quiet time—helps re-train our brains to absorb deeper knowledge.`
  },
  {
    title: 'Why Project-Based Learning Beats Passive Tutorials',
    topic: 'Education',
    content: `Many aspiring developers fall into the 'tutorial hell' trap: watching hours of video tutorials without ever building projects independently.

Project-based learning forces you to solve real errors, design database models, structure components, and debug live API calls. When you build real applications from scratch, concepts stick much faster and build true confidence.`
  },
  {
    title: 'Building Minimalist Software: Less is More',
    topic: 'Ideas',
    content: `Simplicity in software design is not about taking away features; it's about giving users exactly what they need without overwhelming noise. Clean UI, fast response times, and intuitive interfaces create delightful user experiences.`
  }
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing old data...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    console.log('Creating sample users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }

    console.log('Creating sample posts...');
    const createdPosts = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const author = createdUsers[i % createdUsers.length];
      const post = await Post.create({
        ...samplePosts[i],
        author: author._id
      });
      createdPosts.push(post);
    }

    console.log('Creating sample comments...');
    await Comment.create({
      content: 'Great post! Extremely informative and well written.',
      author: createdUsers[1]._id,
      post: createdPosts[0]._id
    });

    await Comment.create({
      content: 'I completely agree with the points on tutorial hell. Building real apps made all the difference for me!',
      author: createdUsers[0]._id,
      post: createdPosts[3]._id
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
