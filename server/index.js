const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const UserModel = require("./models/user.js");
const ProductModel = require("./models/Product.js");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Serve static files (uploaded images)
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/E-Waste", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// 📌 User Register
app.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res.json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    res.json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.json({ message: "No user found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Password is incorrect" });
    }
    res.json({ message: "Login Successful", userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get User Details
app.post("/getUser", (req, res) => {
  const { id } = req.body;
  UserModel.findById(id)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json("User not found");
      }
    })
    .catch((err) => res.status(500).json(err));
});

// 📌 Add Product (with image upload)
app.post("/addProduct", upload.single("image"), async (req, res) => {
  try {
    const { description, price, contact, userId } = req.body;
    const image = req.file.filename;

    const newProduct = new ProductModel({
      image,
      description,
      price,
      contact,
      userId,
    });

    await newProduct.save();
    res.json({ message: "Product added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get All Products
app.get("/products", async (req, res) => {
  try {
    const products = await ProductModel.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Mark product as sold
app.post("/buyProduct", async (req, res) => {
  const { productId, buyerId } = req.body;

  try {
    const product = await ProductModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.sold) return res.json({ message: "Already sold" });

    product.sold = true;
    product.buyerId = buyerId;
    await product.save();

    res.json({ message: "Purchase successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Get My Orders
app.post("/myOrders", async (req, res) => {
  const { userId } = req.body;

  try {
    const orders = await ProductModel.find({ buyerId: userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ✅ Start Server
app.listen(6002, () => {
  console.log("Server is running on port 6002");
});