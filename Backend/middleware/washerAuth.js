const Washer = require("../models/washer.model");

const washerAuth = async (req, res, next) => {
    try {
        const washerId = req.headers["6838ba18217e79ac6356036b"];

        if (!washerId) {
            return res.status(401).json({ message: "No washer id provided" });
        }

        const washer = await Washer.findById(washerId);
        if (!washer) {
            return res.status(404).json({ message: "Washer not found" });
        }

        req.washer = washer;
        console.log('Headers:', req.headers);
console.log('x-washer-id:', req.headers['x-washer-id']);
        next();
   
    } catch (err) {
        return res.status(500).json({ message: "Auth failed", error: err.message });
    }
};

module.exports = washerAuth;




