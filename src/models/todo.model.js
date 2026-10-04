const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in-progress', 'completed'],
        message: '{VALUE} is not a valid status (allowed: pending, in-progress, completed)'
      },
      default: 'pending',
      lowercase: true,
      trim: true
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid priority (allowed: low, medium, high)'
      },
      default: 'medium',
      lowercase: true,
      trim: true
    },
    dueDate: {
      type: Date,
      default: null
    },
    tags: {
      type: [String],
      default: []
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      }
    }
  }
);

// Synchronize status and isCompleted before saving
todoSchema.pre('save', function () {
  if (this.isModified('status')) {
    this.isCompleted = this.status === 'completed';
  } else if (this.isModified('isCompleted')) {
    this.status = this.isCompleted ? 'completed' : 'pending';
  }
});

// Indexes for query performance
todoSchema.index({ status: 1 });
todoSchema.index({ priority: 1 });
todoSchema.index({ createdAt: -1 });
todoSchema.index({ title: 'text', description: 'text' });

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
