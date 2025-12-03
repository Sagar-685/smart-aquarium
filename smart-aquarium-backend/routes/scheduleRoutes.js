const express = require("express");
const router = express.Router();
const {
  addSchedule,
  getSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");

router.post("/add", addSchedule);
router.get("/all", getSchedule);
router.delete("/:id", deleteSchedule);   // NEW

module.exports = router;
