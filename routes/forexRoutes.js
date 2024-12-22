const express = require("express");
const router = express.Router();

const {sendSignal} = require("../controllers/forexController");
router.post("/forex",sendSignal);

module.exports= router;