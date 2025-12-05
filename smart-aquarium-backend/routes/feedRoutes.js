const express = require("express");
const router = express.Router();

let feedFlag = false;   // <-- This tells ESP32 to feed

// ---------------------------
// USER TRIGGERS FEED (React)
// ---------------------------
router.post("/trigger", (req, res) => {
  feedFlag = true;  // ESP32 will see this
  console.log("🐟 FEED TRIGGER RECEIVED FROM WEBSITE");
  res.json({ success: true, message: "Feed command sent to ESP32" });
});

// ---------------------------
// ESP32 CHECKS FEED STATUS
// ---------------------------
router.get("/status", (req, res) => {
  if (feedFlag) {
    feedFlag = false;  // Reset so it doesn’t feed multiple times
    return res.json({ feed: true });
  }

  return res.json({ feed: false });
});

module.exports = router;
