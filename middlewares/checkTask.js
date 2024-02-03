const Task = require('../models/Task');
exports.isTask = async (req, res, next) => {
  try {
    const task_id = req.query.task_id;
    const task = await Task.findOne({
      _id:task_id
    })
    if(task){
      req.task_id = task_id
      next();
    }else{
      res.status(404).send({code:404,message:"Create task before creating subtask"})
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};