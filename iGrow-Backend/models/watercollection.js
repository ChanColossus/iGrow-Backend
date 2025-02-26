const mongoose = require('mongoose');

const WaterCollectionSchema = new mongoose.Schema({
    WaterSource: {
        type: String,
        required: [true, 'Please enter water source'],
    },
    WaterLevel: {
        type: String,
        required: [true, 'Please water level'],
    },
    createdAt: {
        type: String,
    },
});

const WaterCollection = mongoose.model("WaterCollection", WaterCollectionSchema);

module.exports = WaterCollection