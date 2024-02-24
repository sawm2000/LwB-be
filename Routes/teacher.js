const express = require('express')
const router = express.Router()
const {update, deleteUser, getUser, getAllUsers} = require('../Controllers/teacher.controller')


const verifyToken = require ("../verifyToken")
  
  //update teacher
  router.put("/:id", verifyToken, update);
  
  //delete teacher
  router.delete("/:id", verifyToken, deleteUser);
  
  
  //get a teacher
  router.get("/:id", getUser);

  //get all teachers
  router.get("/", getAllUsers);

module.exports = router