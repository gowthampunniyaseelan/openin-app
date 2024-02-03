const Task = require('../models/Task');
const User = require('../models/User');
const express = require('express');
const app = express();
const completedMap = new Map();
var userId;
exports.schedule = async () => {
  try {
    const currentDate = new Date();
    await Task.updateMany(
      {},
      [
        {
          $set: {
            priority: {
              $cond: {
                if: { $lte: ["$due_date", currentDate] },
                then: 0,
                else: {
                  $cond: {
                    if: { $lte: [{ $abs: { $subtract: ["$due_date", currentDate] } }, 2 * 24 * 60 * 60 * 1000] },
                    then: 1,
                    else: {
                      $cond: {
                        if: { $lte: [{ $abs: { $subtract: ["$due_date", currentDate] } }, 4 * 24 * 60 * 60 * 1000] },
                        then: 2,
                        else: 3
                      }
                    }
                  }
                }
              }
            }
          }
        }
      ],
    );
    const updatedTasks = await Task.find({});
    
    const tasks = await Task.find().sort({ priority: 1 });

    for (let i = 0; i< tasks.length; i++) {
      const user = await User.findOne({_id:tasks[i].user_id})
      userId = tasks[i].user_id
      if(i!=0){
       let previousUser = await User.findOne({_id:tasks[i-1].user_id})
        if(previousUser.callHistory[previousUser.callHistory.length-1].callStatus === "no-answer"){
          let promises = await this.makeCall(user);
          if(promises && promises.length > 0){
            if (completedMap.get(user._id)) {  
              console.log(`Call made for user ${user._id}. Stopping further calls.`);
              break;
            }
          }
        }
      }
      else{
        let promises = await this.makeCall(user);
        if(promises && promises.length > 0){
          if (completedMap.get(user._id)) {  
            console.log(`Call made for user ${user._id}. Stopping further calls.`);
            break;
          }
        }
      }
    }

  } catch (err) {
    console.log(err);
  }
};

exports.makeCall = async (user) => {
  try {
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = require("twilio")(accountSid, authToken);

    const promise = new Promise((resolve, reject) => {
        if (completedMap.has(user._id) && completedMap.get(user._id)) {
            console.log(`Call already made for user ${user._id}. Skipping.`);
            resolve("Call already made. Skipping.");
            return;
        }

        client.calls.create({
            url: process.env.TWILIO_URL,
            to: user.phone_number,
            from: process.env.TWILIO_NO,
            statusCallback: process.env.STATUS_CALLBACK_URL,
            statusCallbackMethod: 'POST',
            statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed', 'cancelled', 'busy', 'failed', 'no-answer'],
        })
        .then(call => {
            completedMap.set(user._id, true);
            resolve("Successfully finished");
        })
        .catch(error => {
            reject(error);
        });
    });

    return promise;
  } catch (error) {
    console.error('Error making call:', error);
  }
};

exports.callStatus = async (req,res) => {
  try {
    await User.updateOne({_id:userId},
      { 
        $push: { 
          callHistory: {
            callTime: new Date(),
            callStatus: req.body.CallStatus
          }
        }
      }
    )
  } catch (error) {
    console.error('Error processing event:', error);
    res.status(500).send('Error processing event');
  }
}