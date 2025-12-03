exports.triggerFeed = async (req, res) => {
  console.log("Feeding triggered!");
  return res.json({ message: "Servo feeding activated!" });
};
