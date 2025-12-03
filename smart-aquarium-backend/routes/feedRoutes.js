const express = require("express");
const router = express.Router();
const { triggerFeed } = require("../controllers/feedController");

router.post("/trigger", triggerFeed);

module.exports = router;
