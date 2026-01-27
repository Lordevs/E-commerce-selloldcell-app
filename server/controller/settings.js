const settingsModel = require("../models/settings");

class Settings {
    async getSettings(req, res) {
        try {
            let settings = await settingsModel.findOne({});
            if (!settings) {
                // Create default settings if not exists
                settings = new settingsModel({
                    baseDeliveryCharge: 10,
                    extraItemCharge: 1,
                    taxes: [],
                });
                await settings.save();
            }
            return res.json({ settings });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async updateSettings(req, res) {
        let { baseDeliveryCharge, extraItemCharge, taxes } = req.body;
        console.log("Updating settings with:", { baseDeliveryCharge, extraItemCharge, taxes });
        try {
            let settings = await settingsModel.findOne({});
            if (!settings) {
                console.log("No settings found, creating new one.");
                settings = new settingsModel({
                    baseDeliveryCharge,
                    extraItemCharge,
                    taxes,
                });
            } else {
                console.log("Existing settings found, updating.");
                settings.baseDeliveryCharge = baseDeliveryCharge;
                settings.extraItemCharge = extraItemCharge;
                settings.taxes = taxes;
            }
            let save = await settings.save();
            if (save) {
                console.log("Settings saved successfully.");
                return res.json({ success: "Settings updated successfully", settings: save });
            }
        } catch (err) {
            console.log("Error updating settings:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

const settingsController = new Settings();
module.exports = settingsController;
