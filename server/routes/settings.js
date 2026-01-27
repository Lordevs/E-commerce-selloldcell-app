const express = require("express");
const router = express.Router();
const settingsController = require("../controller/settings");
const { loginCheck, isAdmin } = require("../middleware/auth");

router.get("/get-settings", settingsController.getSettings);
router.post("/update-settings", loginCheck, isAdmin, settingsController.updateSettings);

module.exports = router;
