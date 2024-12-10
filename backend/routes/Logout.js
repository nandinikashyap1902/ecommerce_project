const express = require("express");
const router = express.Router();

// Logout endpoint
router.post("/logout", (req, res) => {
  // Clear the token cookie
  res.clearCookie("token", {
    httpOnly: true,
            secure: false,
            
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
