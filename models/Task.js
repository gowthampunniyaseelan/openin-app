const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user_id: {type : String},
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: Number},
  due_date: { type: Date },
  status: {
    type: String,
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    default: 'TODO'
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date,default: null  },
  deleted_at: { type: Date,default: null  }
});

module.exports = mongoose.model('task', taskSchema);
