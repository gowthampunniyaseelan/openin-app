const Task = require('../models/Task');
const SubTask = require("../models/SubTask")
exports.getAllTasks = async (req, res) => {
  try {
    const priority = req.query.priority;
    const dueDate = req.query.dueDate;
    const startingIndex = parseInt(req.query.startingIndex) || 0;
    const pageLimit = 10;
    const criteria = {};
    if (priority) {
      criteria.priority = priority;
    }
    if (dueDate) {
      criteria.due_date = { $lte: dueDate };
    }
      
    const tasks = await Task.find(criteria)
      .skip(startingIndex * pageLimit)
      .limit(pageLimit);
    
    res.json({code:200,success:true,tasks:tasks});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllSubTasks = async (req, res) => {
  try {
    const taskId = req.query.taskId;
    const startingIndex = parseInt(req.query.startingIndex) || 0;
    const pageLimit = 10;
    const criteria = {};
    if (taskId) {
      criteria.task_id = taskId;
    }      
    const subTasks = await SubTask.find(criteria)
      .skip(startingIndex * pageLimit)
      .limit(pageLimit);
    
    res.json({code:200,success:true,subTasks:subTasks});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createTask = async (req, res) => {
  try {
    const { title, description, due_date,priority} = req.body;
    const tasks = await Task.create({
      user_id:req.id,
      title:title,
      description:description,
      due_date:due_date,
      priority:priority
    });

    res.status(201).json({code:201,success:true,tasks:tasks});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSubTask = async (req, res) => {
  try {
    const subTask = await SubTask.create({
      task_id:req.task_id
    });
    res.status(201).json({code:201,success:true,subTask:subTask});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const id = req.query.id
  const {due_date,status} = req.body;
  const criteria = {}
  if(due_date){
    criteria.due_date = due_date
  }
  if(status){
    criteria.status = status
  }
  criteria.updated_at = new Date();
  try {
    const task = await Task.findOneAndUpdate({
      _id:id,
    },criteria,{ new: true } );
    res.status(201).json({code:201,success:true,task:task});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSubTask = async (req, res) => {
  const id = req.query.id
  const {status} = req.body;
  const criteria = {}
  if(status === 0 || status === 1){
    criteria.status = parseInt(status)
  }
  criteria.updated_at = new Date();
  try {
    const subTask = await SubTask.findOneAndUpdate({
      _id:id,
    },criteria,{ new: true } );
    if(subTask.status === 1){
      const taskCriteria = {}
      taskCriteria.status = "IN_PROGRESS"
      const task = await Task.findOneAndUpdate({
        _id:subTask.task_id,
      },taskCriteria,{ new: true } );
      res.status(201).json({code:201,success:true,subTask:subTask,task:task});
    }else{
      res.status(201).json({code:201,success:true,subTask:subTask});
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const id = req.query.id
  const criteria = {}
  criteria.deleted_at = new Date();
  try {
    const task = await Task.findOneAndUpdate({
      _id:id,
    },criteria,{ new: true } );
    const subTask = await SubTask.updateMany({
      task_id:task._id,
    },criteria,{ new: true } );
    res.status(201).json({code:201,success:true,task:task,subTask:subTask});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSubTask = async (req, res) => {
  const id = req.query.id
  const criteria = {}
  criteria.deleted_at = new Date();
  try {
    const subTask = await SubTask.findOneAndUpdate({
      _id:id,
    },criteria,{ new: true } );

    const allSubTask = await SubTask.find({
      task_id:subTask.task_id,
      status:1,
      deleted_at:null
    });

    if(!allSubTask || allSubTask.length === 0){
      const taskCriteria = {}
      taskCriteria.status = "TODO"
      const task = await Task.findOneAndUpdate({
        _id:subTask.task_id,
      },taskCriteria,{ new: true } );
      res.status(201).json({code:201,success:true,subTask:subTask,task:task});
    }else{
      res.status(201).json({code:201,success:true,subTask:subTask});
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};