const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require("../middlewares/auth");
const checkPriority = require("../middlewares/checkPriority");
const checkTask = require("../middlewares/checkTask");
router.post('/create-task', auth.isTokenValid,  checkPriority.updatePriority, taskController.createTask);
router.post('/create-subtask', auth.isTokenValid,checkTask.isTask,taskController.createSubTask);
router.get('/get-alltask', auth.isTokenValid,taskController.getAllTasks);
router.get('/get-allsubtask', auth.isTokenValid, taskController.getAllSubTasks);
router.put('/update-task', auth.isTokenValid, taskController.updateTask);
router.put('/update-subtask', auth.isTokenValid, taskController.updateSubTask);
router.put('/delete-task', auth.isTokenValid, taskController.deleteTask);
router.put('/delete-subtask', auth.isTokenValid, taskController.deleteSubTask);


module.exports = router;
