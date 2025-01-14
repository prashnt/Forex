const express = require("express");
const router = express.Router();

const {sendSignal} = require("../controllers/forexController");
const {shortsendSignal} = require("../controllers/shortController");
router.post("/forex",sendSignal);
router.post("/short",shortsendSignal);

module.exports= router;