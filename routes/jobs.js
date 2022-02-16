const express = require("express");
const router = express.Router();

// Importing jobs controller methods
const {
  getJobs,
  newJob,
  getJobsInRadius,
  updateJob,
  deleteJob,
  getJob,
  jobStats,
} = require("../controllers/jobsController");

router.route("/jobs/:zipcode/zipcode/:distance/distance").get(getJobsInRadius);

router.route("/jobs/:id").put(updateJob).delete(deleteJob).get(getJob);

router.route("/jobs").get(getJobs).post(newJob);

router.route("/stats/:topic").get(jobStats);

module.exports = router;
