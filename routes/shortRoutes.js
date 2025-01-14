const express = require("express");
const router = express.Router();

const {shortsendSignal} = require("../controllers/shortController");
router.post("/short",shortsendSignal);

module.exports= router;