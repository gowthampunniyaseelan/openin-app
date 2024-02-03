const express = require("express");
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const {phone_number} = req.body;
    const users = await User.create({phone_number:phone_number});
    const token = jwt.sign({ id: users._id,phone_number:users.phone_number },process.env.SECRET_KEY_FOR_AUTH);
    users.token = token;
    users.phone_number = undefined;
    const message = "User Created Successfully!";
    res.cookie('token', token,{
      httpOnly:true
    }).status(201).json({
        success:true,
        code:201,
        token,
        users,
        message:message
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
