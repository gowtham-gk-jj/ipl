const express = require("express");
const Player = require("../models/Player");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");
const csv = require("csv-parser");
const fs = require("fs");
const router = express.Router();

/* ADD PLAYER */
router.post(
  "/",
  protect,
  authorize("host"),
  upload.single("image"),
  async (req, res) => {
    try {
      const player = await Player.create({
        name: req.body.name,
        category: req.body.category,
        nationality: req.body.nationality,
        capStatus: req.body.capStatus,
        basePrice: req.body.basePrice,
        image: req.file ? req.file.filename : null
      });

      res.json(player);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* GET PLAYERS */
router.get("/", async (req, res) => {
  const players = await Player.find().populate("soldTo");
  res.json(players);
});

/* UPDATE PLAYER */
router.put(
  "/:id",
  protect,
  authorize("host"),
  upload.single("image"),
  async (req, res) => {
    try {
      const updateData = {
        name: req.body.name,
        category: req.body.category,
        nationality: req.body.nationality,
        capStatus: req.body.capStatus,
        basePrice: req.body.basePrice
      };

      if (req.file) {
        updateData.image = req.file.filename;
      }

      const player = await Player.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json(player);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* DELETE PLAYER */
router.delete(
  "/:id",
  protect,
  authorize("host"),
  async (req, res) => {
    try {
      await Player.findByIdAndDelete(req.params.id);
      res.json({ message: "Player deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);
/* BULK UPLOAD PLAYERS (CSV) */
router.post(
  "/bulk",
  protect,
  authorize("host"),
  upload.single("file"),
  async (req, res) => {
    try {
      const players = [];

      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {
          players.push({
            name: row.name,
            category: row.category,
            nationality: row.nationality,
            capStatus: row.capStatus,
            basePrice: Number(row.basePrice),
            matches: Number(row.matches || 0),
            runs: Number(row.runs || 0),
            image: row.image || null
          });
        })
        .on("end", async () => {
          await Player.insertMany(players);
          fs.unlinkSync(req.file.path);
          res.json({ message: "12 Players Uploaded Successfully" });
        });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
