const express = require("express");
const { makeVideoCall } = require("../controllers/videoController");
const router = express.Router();

// POST Register new user
// route => api/register
router.route("/").get(makeVideoCall);

module.exports = router;
