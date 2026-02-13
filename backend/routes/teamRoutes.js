const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  async (req, res) => {
    try {
      const { name, budget, email, password } = req.body;

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create team user login
      const teamUser = await User.create({
        email,
        password: hashedPassword,
        role: "team"
      });

      // Create team
      const team = await Team.create({
        name,
        budget,
        remainingPurse: budget,
        playerCount: 0,
        owner: teamUser._id
      });

      res.status(201).json(team);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);
