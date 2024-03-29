const Student = require("../Models/student.model.js");
const bcrypt = require("bcrypt");
const createError = require ("../error")

const update = async (req, res, next) => {
  try {
    const userExists = await Student.findOne({ userName: req.body.userName });
    if (userExists) {
      return next(createError(400, "Username already exists!"));
  }
    const { userPassword, ...otherInfo } = req.body;

    const updatedUser = await Student.findByIdAndUpdate(
      req.params.id,
      {
        $set: otherInfo,
      },
      { new: true }
    );

    if (userPassword) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.userPassword, salt);

      updatedUser.userPassword = hash;
      await updatedUser.save();
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).json("Student has been deleted.");
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await Student.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await Student.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { getUser, deleteUser, update, getAllUsers };
