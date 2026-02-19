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
  authorize("host", "admin"),
  upload.single("image"),
  async (req, res) => {
    try {
      const player = await Player.create({
        name: req.body.name,
        category: req.body.category,
        nationality: req.body.nationality,
        capStatus: req.body.capStatus,
        basePrice: Number(req.body.basePrice),
        image: req.file ? req.file.filename : null,
        isSold: false,
        soldPrice: 0,
        soldTo: null
      });

      res.json(player);
    } catch (err) {
      console.error("Add Player Error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

/* ================= BULK ADD ================= */
router.post(
  "/bulk-form",
  protect,
  authorize("host", "admin"),
  upload.any(),
  async (req, res) => {
    try {
      const { category, nationality, capStatus } = req.body;

      const players = [];
      const fileMap = {};

      if (req.files) {
        req.files.forEach((file) => {
          fileMap[file.fieldname] = file.filename;
        });
      }

      for (let i = 0; i < 12; i++) {
        const name = req.body[`name_${i}`];
        const basePrice = req.body[`price_${i}`];

        if (name && basePrice) {
          players.push({
            name,
            category,
            nationality,
            capStatus,
            basePrice: Number(basePrice),
            image: fileMap[`image_${i}`] || null,
            isSold: false,
            soldPrice: 0,
            soldTo: null
          });
        }
      }

      if (players.length === 0) {
        return res.status(400).json({ message: "No valid players submitted" });
      }

      await Player.insertMany(players);

      res.json({
        message: `${players.length} Players Added Successfully`
      });

    } catch (err) {
      console.error("Bulk Insert Error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

/* ================= GET PLAYERS (FIXED) ================= */
router.get("/", async (req, res) => {
  try {
    const players = await Player.find()
      .populate("soldTo", "teamName remainingPurse")
      .populate("auctionedBy", "name");

    res.json(players);

  } catch (err) {
    console.error("Get Players Error:", err);
    res.status(500).json({ message: err.message });
  }
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
        basePrice: Number(req.body.basePrice)
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
      console.error("Update Player Error:", err);
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
      console.error("Delete Player Error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
