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
  authorize("host", "admin"), // ✅ allow admin also
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
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);

/* ================= BULK 12 PLAYER ADD ================= */
router.post(
  "/bulk-form",
  protect,
  authorize("host", "admin"), // ✅ allow admin
  upload.fields(
    Array.from({ length: 12 }, (_, i) => ({
      name: `players[${i}][image]`,
      maxCount: 1
    }))
  ),
  async (req, res) => {
    try {
      const { category, nationality, capStatus } = req.body;

      const players = [];

      for (let i = 0; i < 12; i++) {
        const name = req.body[`players[${i}][name]`];
        const basePrice = req.body[`players[${i}][basePrice]`];

        if (name && basePrice) {
          const imageFile =
            req.files?.[`players[${i}][image]`]?.[0]?.filename || null;

          players.push({
            name,
            category,
            nationality,
            capStatus,
            basePrice: Number(basePrice),
            image: imageFile
          });
        }
      }

      if (players.length === 0) {
        return res.status(400).json({ message: "No valid players submitted" });
      }

      await Player.insertMany(players);

      res.json({ message: "12 Players Added Successfully" });
    } catch (err) {
      console.error("Bulk error:", err);
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
  authorize("host", "admin"),
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
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);

/* ================= DELETE PLAYER ================= */
router.delete(
  "/:id",
  protect,
  authorize("host", "admin"),
  async (req, res) => {
    try {
      await Player.findByIdAndDelete(req.params.id);
      res.json({ message: "Player deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
