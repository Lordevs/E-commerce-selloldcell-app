const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
        baseDeliveryCharge: {
            type: Number,
            default: 0,
        },
        extraItemCharge: {
            type: Number,
            default: 0,
        },
        taxes: [
            {
                label: String,
                percentage: Number,
            },
        ],
    },
    { timestamps: true }
);

const settingsModel = mongoose.model("settings", settingsSchema);
module.exports = settingsModel;
