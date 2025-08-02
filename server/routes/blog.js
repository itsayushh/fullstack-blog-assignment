import express from 'express';
import Blog from '../models/Blog.js';
import { authenticateToken, authorizeRole, checkOwnership } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all blogs with pagination and filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    let query = { status: 'published' };
    
    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by author
    if (req.query.author) {
      query.author = req.query.author;
    }
    
    // Filter by tags
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.tags = { $in: tags };
    }

    // Sort options
    let sortOptions = { createdAt: -1 };
    if (req.query.sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (req.query.sort === 'popular') {
      sortOptions = { views: -1, likes: -1 };
    } else if (req.query.sort === 'title') {
      sortOptions = { title: 1 };
    }

    const blogs = await Blog.find(query)
      .populate('author', 'username avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-content'); // Exclude full content for list view

    const total = await Blog.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalBlogs: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ 
      message: 'Server error fetching blogs' 
    });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('likes', 'username');

    if (!blog) {
      return res.status(404).json({ 
        message: 'Blog not found' 
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json({ blog });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ 
      message: 'Server error fetching blog' 
    });
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog
// @access  Private (authenticated users)
router.post('/', authenticateToken,authorizeRole(['admin', 'author']), async (req, res) => {
  try {
    const { title, content, excerpt, tags, category, status } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        message: 'Title and content are required'
      });
    }

    const blog = new Blog({
      title,
      content,
      excerpt,
      author: req.user._id,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      category: category || 'general',
      status: status || 'published'
    });

    await blog.save();
    
    // Populate author info for response
    await blog.populate('author', 'username avatar');

    res.status(201).json({
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ 
      message: 'Server error creating blog' 
    });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog
// @access  Private (blog owner or admin)
router.put('/:id', authenticateToken, checkOwnership(Blog), async (req, res) => {
  try {
    const { title, content, excerpt, tags, category, status } = req.body;
    
    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = content;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (tags) updates.tags = tags.split(',').map(tag => tag.trim());
    if (category) updates.category = category;
    if (status) updates.status = status;

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('author', 'username avatar');

    res.json({
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ 
      message: 'Server error updating blog' 
    });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog
// @access  Private (blog owner or admin)
router.delete('/:id', authenticateToken, checkOwnership(Blog), async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    
    res.json({ 
      message: 'Blog deleted successfully' 
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ 
      message: 'Server error deleting blog' 
    });
  }
});

// @route   POST /api/blogs/:id/like
// @desc    Toggle like on a blog
// @access  Private
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ 
        message: 'Blog not found' 
      });
    }

    const userLikedIndex = blog.likes.indexOf(req.user._id);
    
    if (userLikedIndex > -1) {
      // Unlike the blog
      blog.likes.splice(userLikedIndex, 1);
    } else {
      // Like the blog
      blog.likes.push(req.user._id);
    }

    await blog.save();

    res.json({
      message: userLikedIndex > -1 ? 'Blog unliked' : 'Blog liked',
      likeCount: blog.likes.length,
      isLiked: userLikedIndex === -1
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ 
      message: 'Server error toggling like' 
    });
  }
});

// @route   GET /api/blogs/user/:userId
// @desc    Get blogs by specific user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ 
      author: req.params.userId,
      status: 'published' 
    })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content');

    const total = await Blog.countDocuments({ 
      author: req.params.userId,
      status: 'published' 
    });

    res.json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total
      }
    });
  } catch (error) {
    console.error('Get user blogs error:', error);
    res.status(500).json({ 
      message: 'Server error fetching user blogs' 
    });
  }
});

// @route   GET /api/blogs/my/posts
// @desc    Get current user's blogs (including drafts)
// @access  Private
router.get('/my/posts', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-content');

    const total = await Blog.countDocuments({ author: req.user._id });

    res.json({
      blogs,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalBlogs: total
      }
    });
  } catch (error) {
    console.error('Get my blogs error:', error);
    res.status(500).json({ 
      message: 'Server error fetching your blogs' 
    });
  }
});

export default router;