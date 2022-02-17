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

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/jobs/:zipcode/zipcode/:distance/distance").get(getJobsInRadius);

router
  .route("/jobs/:id")
  .put(isAuthenticatedUser, authorizeRoles("employeer", "admin"), updateJob)
  .delete(isAuthenticatedUser, authorizeRoles("employeer", "admin"), deleteJob)
  .get(getJob);

router
  .route("/jobs")
  .get(getJobs)
  .post(isAuthenticatedUser, authorizeRoles("employeer", "admin"), newJob);

router.route("/stats/:topic").get(jobStats);

module.exports = router;
