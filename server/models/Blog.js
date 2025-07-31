import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
    minlength: [20, 'Content must be at least 20 characters long']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    trim: true,
    default: 'general'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  readTime: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

blogSchema.pre('save', function(next) {
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.length > 150 ? this.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...' : this.content.replace(/<[^>]*>/g, '');
  }
  if (this.content) {
    const wordCount = this.content.split(' ').length;
    this.readTime = Math.ceil(wordCount / 200) || 1;
  }
  next();
});
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.virtual('likeCount').get(function() {
  return this.likes ? this.likes.length : 0;
});
blogSchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model('Blog', blogSchema);