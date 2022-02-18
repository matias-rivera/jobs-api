const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updatePassword,
  updateUser,
  deleteUser,
  getAppliedJobs,
  getPublishedJobs,
  getUsers,
  deleteUserByAdmin,
} = require("../controllers/usersController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.use(isAuthenticatedUser);

router.route("/me").get(getUserProfile);
router.route("/me/jobs/applied").get(authorizeRoles("user"), getAppliedJobs);

router
  .route("/me/jobs/published")
  .get(authorizeRoles("employeer", "admin"), getPublishedJobs);

router.route("/me/update").put(updateUser);

router.route("/password/update").put(updatePassword);

router.route("/me/delete").delete(deleteUser);

router.route("/users/:id").delete(authorizeRoles("admin"), deleteUserByAdmin);

router.route("/users").get(authorizeRoles("admin"), getUsers);

module.exports = router;
