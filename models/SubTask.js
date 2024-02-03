const mongoose = require('mongoose');
const subTaskSchema = new mongoose.Schema({
  task_id: {type : String},
  status: { type: Number, enum: [0, 1], default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date ,default:null, require:false},
  deleted_at: { type: Date ,default:null, require:false}
});

module.exports = mongoose.model('subTask', subTaskSchema);
