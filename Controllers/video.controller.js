const { comment } = require("postcss");
const createError = require("../error.js");
const Video = require("../Models/video.model.js");

const addVideo = async (req, res, next) => {
  const newVideo = new Video({
    title: req.body.title,
    subject: req.body.subject,
    teacher: req.body.teacher,
    year: req.body.year,
    url: req.body.url,
  });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
    
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedVideo);
  } catch (err) {
    next(err);
  }
};

const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not found!"));
   
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("The video has been deleted.");
  } catch (err) {
    next(err);
  }
};

const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("The view has been increased.");
  } catch (err) {
    next(err);
  }
};

const getAllVideos = async (req, res, next) => {
  try {
    const { subject, year, teacher } = req.query;

    const query = {};
    if (subject) {
      query.subject = subject;
    }
    if (year) {
      query.year = year;
    }
    if (teacher) {
      query.teacher = teacher;
    }

    const video = await Video.find(query);
    res.status(200).json(video);
  } catch (err) {
    next(err);
  }
};

const getVideoComments = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const comments = await fetchVideoComments(videoId);
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
const fetchVideoComments = async (videoId) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }
    return video.comments;
  } catch (error) {
    throw error;
  }
};
const postVideoComments = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const newComment = {
      username: req.body.username,
      body: req.body.body,
      date: req.body.date,
    };
    const comments = addVideoComments(videoId, newComment);
    res.status(200).send("Comment has been added!");
  } catch (error) {
    next(error);
  }
};

const addVideoComments = async (videoId, newComment) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }
    video.comments.push(newComment);
    await video.save();
  } catch (error) {
    throw error;
  }
};

const deleteVideoComments = async (req, res, next) => {
  try {
    const { videoId, commentId } = req.params;
    await removeVideoComments(videoId, commentId);
    res.status(200).send("Comment has been removed!");
  } catch (error) {
    next(error);
  }
};

const removeVideoComments = async (videoId, commentId) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }
    video.comments = video.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );
    await video.save();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addVideo,
  updateVideo,
  deleteVideo,
  getVideo,
  addView,
  getAllVideos,
  getVideoComments,
  postVideoComments,
  deleteVideoComments,
};
