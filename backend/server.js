// server.js

const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("./models/User");
const Email = require("./models/mails");
const connectDB = require("./db/connection");
const Conversation = require("./models/Conversation");

const app = express();
const port = process.env.PORT || 8000;

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Connect DB FIRST
connectDB();

// ✅ Routes

// @route   POST /api/register
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const isAlreadyExist = await User.findOne({ email });

    if (isAlreadyExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// @route   POST /api/login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, "SECRET_KEY", { expiresIn: "1d" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// @route   conversation list
app.post("/api/conversation", async (req, res) => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      return res.status(400).json({ message: "from and to required" });
    }

    const existing = await Conversation.findOne({
      members: { $all: [from, to] },
    });

    if (existing) {
      return res.status(200).json({
        message: "Conversation already exists",
        conversationId: existing._id,
      });
    }

    const newConversation = new Conversation({
      members: [from, to],
    });

    const saved = await newConversation.save();
    console.log("✅ Saved:", saved);

    res.status(201).json({
      message: "Conversation created",
      conversationId: saved._id,
    });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get conversations by userId
app.get("/api/conversations/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({
      members: userId,
    })
      .populate("members", "name email") // 👈 THIS IS THE FIX
      .sort({ createdAt: -1 });

    res.status(200).json(conversations);

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

// Send Mail
app.post("/api/sendMail", async (req, res) => {
  try {
    // ✅ Get authenticated user from token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "SECRET_KEY");
    const userId = decoded.id;

    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({
        message: "Please enter all fields",
      });
    }

    // ✅ Find recipient by email
    const recipient = await User.findOne({ email: to });
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // ✅ Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(recipient._id)
    ) {
      return res.status(400).json({
        message: "Invalid user IDs",
      });
    }

    // ✅ Save email
    const newMail = new Email({
      from: userId,
      to: recipient._id,
      subject,
      message: body,
    });

    const savedMail = await newMail.save();

    // ✅ Create conversation automatically (VERY IMPORTANT)
    await Conversation.findOneAndUpdate(
      {
        members: { $all: [userId, recipient._id] },
      },
      {
        $setOnInsert: {
          members: [userId, recipient._id],
        },
      },
      { upsert: true }
    );

    res.status(201).json({
      message: "Email sent successfully",
      mail: savedMail,
    });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

//fetch mails for inbox
app.get("/api/inbox/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params;

    // Find the user by email first
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const mails = await Email.find({ to: user._id })
      .populate("from", "name email")
      .populate("to", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(mails);

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
});

//fetch registered users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email");
    const usersData = users.map((user) => ({
      name: user.name,
      email: user.email,
      userId: user._id,
    }));
    return res.status(200).json({ users: usersData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ Start Server AFTER small delay (ensures DB connects)
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
