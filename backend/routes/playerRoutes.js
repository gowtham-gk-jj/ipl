const express = require("express");
const Player = require("../models/Player");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

/* ================= SINGLE ADD PLAYER ================= */
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

/* ================= BULK 12 PLAYER ADD ================= */
router.post(
  "/bulk-form",
  protect,
  authorize("host"),
  upload.any(), // important
  async (req, res) => {
    try {
      const { category, nationality, capStatus } = req.body;

      const players = [];

      // Multer stores files in req.files
      const fileMap = {};
      req.files.forEach((file) => {
        fileMap[file.fieldname] = file.filename;
      });

      // Loop through 12 players
      for (let i = 0; i < 12; i++) {
        const name = req.body[`players[${i}][name]`];
        const basePrice = req.body[`players[${i}][basePrice]`];
        const imageField = `players[${i}][image]`;

        if (name && basePrice) {
          players.push({
            name,
            category,
            nationality,
            capStatus,
            basePrice: Number(basePrice),
            image: fileMap[imageField] || null
          });
        }
      }

      await Player.insertMany(players);

      res.json({ message: "12 Players Added Successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ================= GET PLAYERS ================= */
router.get("/", async (req, res) => {
  const players = await Player.find().populate("soldTo");
  res.json(players);
});

/* ================= UPDATE PLAYER ================= */
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

/* ================= DELETE PLAYER ================= */
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

module.exports = router;
