const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db');
const schedule = require('node-schedule');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/taskRoutes');
const registerUserRoutes = require('./routes/registerUserRoutes');
const callStatusRoutes = require("./routes/callStatusRoutes")
const cookieParser = require('cookie-parser');
const schedulePriority = require("./util/schedule");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false } ));

app.post('/register', registerUserRoutes);
app.post('/create-task', taskRoutes);
app.post('/create-subtask', taskRoutes);
app.get('/get-alltask', taskRoutes);
app.get('/get-allsubtask', taskRoutes);
app.put('/update-task', taskRoutes);
app.put('/update-subtask', taskRoutes);
app.put('/delete-task', taskRoutes);
app.put('/delete-subtask', taskRoutes);
app.post("/events",callStatusRoutes);
schedule.scheduleJob("0 0 * * *", schedulePriority.schedule);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
