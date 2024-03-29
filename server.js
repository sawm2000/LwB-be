require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./Routes/auth");
const teacherRoutes = require("./Routes/teacher");
const videoRoutes = require("./Routes/video");
const studentRoutes = require("./Routes/student");
const subjectRouter = require("./Routes/subject");
const yearRouter = require("./Routes/year");
const quizRouter = require("./Routes/quiz");
const notesRoutes = require("./Routes/notes");
const bodyParser = require("body-parser");
const eventRoutes = require("./Routes/event");

app.use(cors());
const uri = process.env.DB_URL;
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
}
connect();
app.use(express.json());
app.use(cookieParser());
app.use("/", authRoutes);
app.use("/teachers", teacherRoutes);
app.use("/students", studentRoutes);
app.use("/videos", videoRoutes);
app.use("/events", eventRoutes);
app.use("/notes", notesRoutes);

// subjects
app.use("/subjects", subjectRouter);
// Year
app.use("/years", yearRouter);
// Quiz
app.use("/quiz", quizRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.listen("8000", () => {
  console.log("server started on 8000");
});
