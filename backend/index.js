// All imports start from here---
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User.js");
const Post = require("./models/Posts.js");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Multer = require("multer");
const cloudinary = require("cloudinary");
const path = require("path");
dotenv.config();
// All imports end here---
const app = express();
const salt = bcrypt.genSaltSync(10);
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// some secret variables--
const db = process.env.DB;
const jwtSecret = process.env.JWT_SECRET;

// cloudinary image upload functionality starts here--
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}
const storage = new Multer.memoryStorage();
const upload = Multer({
  storage,
});
// cloudinary image upload functionality ends here--

// DB connection ---
mongoose
  .connect(db, {
    useNewUrlParser: true,
  })
  .then(() => console.log("database connected!"))
  .catch((err) => console.log(err.stack));

// api routes start from here---
// user register route--
app.post("/register", upload.single("file"), async (req, res) => {
  try {
    let cldRes;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      cldRes = await handleUpload(dataURI);
    }

    const { username, password, email, desc, link } = req.body;

    if (username === "" || password === "" || email === "") {
      return res.status(404).json({ message: "please fill all the input" });
    }

    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
      email,
      desc,
      link,
      cover: req.file ? cldRes.secure_url : undefined,
    });

    res.status(201).json({
      data: userDoc,
      message: "successfully registered.",
    });
  } catch (err) {
    if (err.code === 11000) {
      const duplicateKeys = Object.keys(err.keyValue).join(",");
      err.message = `Duplicate field entered: ${duplicateKeys}`;
    }
    res.status(404).json({
      message: err.message,
    });
  }
});

// user login route---
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });

    if (email === "" || password === "") {
      return res
        .status(404)
        .json({ message: "Please enter proper email and password." });
    }

    const passOk = await bcrypt.compare(password, userDoc.password);
    if (!passOk) {
      return res.status(404).json({ message: "Wrong password!" });
    }
    if (passOk) {
      jwt.sign(
        { username: userDoc.username, id: userDoc.id, cover: userDoc.cover },
        jwtSecret,
        { expiresIn: "1d" },
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({
            id: userDoc._id,
            username: userDoc.username,
            message: "Successfully logged in.",
          });
        }
      );
    }
  } catch (err) {
    res.status(404).json({
      message: "Something went wrong!",
    });
  }
});

// home routes--
app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, (err, info) => {
      if (err) throw err;
      res.json(info);
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: "Something went wrong!",
    });
  }
});

// userDetails route---
app.get("/user-details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userDoc = await User.findById(id);
    res.status(200).json({
      success: true,
      username: userDoc.username,
      desc: userDoc.desc,
      link: userDoc.link,
      cover: userDoc.cover,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Something went wrong!",
    });
  }
});
// user-profile-data routes --
app.get("/user-profile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userDoc = await User.findById(id);
    const postDoc = await Post.find()
      .populate("author", {
        username: 1,
        _id: 1,
        cover: 1,
      })
      .sort({ createdAt: -1 });
    const filteredPost = postDoc.filter((post) => {
      return id === post.author._id.valueOf();
    });
    res.status(200).json({
      success: true,
      username: userDoc.username,
      desc: userDoc.desc,
      link: userDoc.link,
      cover: userDoc.cover,
      filteredPost,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Something went wrong!",
    });
  }
});
// user-details-edit page--
app.patch("/user-details-edit/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    let cldRes;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      cldRes = await handleUpload(dataURI);
    }

    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, info) => {
      if (err) throw err;
      const { username, desc, link } = req.body;
      const userDoc = await User.findById(id);

      await User.findByIdAndUpdate(id, {
        username,
        desc,
        link,
        cover: req.file ? cldRes.secure_url : userDoc.cover,
      });
      res.status(201).json({ userDoc, message: "successfully updated" });
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Something went wrong!",
    });
  }
});

// user logout routes---
app.post("/logout", (req, res) => {
  try {
    const { token } = req.cookies;

    res.cookie("token", "").json({
      token: token,
      message: "Successfully logged out!",
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: "Somthing went wrong!",
    });
  }
});

// create post routes--
app.post("/create-post", upload.single("file"), async (req, res) => {
  let cldRes;
  if (req.file) {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    cldRes = await handleUpload(dataURI);
  }

  try {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      if (title === "" || summary === "" || content === "") {
        return res
          .status(404)
          .json({ message: "Please enter all the required fields!" });
      }
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: req.file ? cldRes.secure_url : undefined,
        author: info.id,
      });
      res.status(201).json({
        postDoc,
        message: "Successfully post created.",
      });
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "something went wrong!",
    });
  }
});

// get post data --
app.get("/post", async (req, res) => {
  try {
    const postDoc = await Post.find()
      .populate("author", {
        username: 1,
        _id: 1,
        cover: 1,
      })
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: postDoc,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "something went wrong!",
    });
  }
});

// get single post data --
app.get("/single-post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate("author", {
      username: 1,
      _id: 1,
    });

    res.status(200).json({ status: "success", data: postDoc });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "something went wrong!",
    });
  }
});

// get post data for editing--
app.get("/edit-post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate("author", {
      username: 1,
      _id: 1,
    });

    res.status(200).json({ status: "success", data: postDoc });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "something went wrong!",
    });
  }
});

// edit single post --
app.patch("/edit-post/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    let cldRes;
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      cldRes = await handleUpload(dataURI);
    }

    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) return;
      if (!isAuthor) {
        return res.status(400).json("You are not the author!");
      }

      await Post.findByIdAndUpdate(id, {
        title,
        summary,
        content,
        cover: req.file ? cldRes.secure_url : postDoc.cover,
      });
      res.json({ postDoc, message: "Successfully post updated" });
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: "Something went wrong!",
    });
  }
});

// search routes --
app.get("/search", async (req, res) => {
  try {
    const { search } = req.query;

    const posts = await Post.find({
      title: { $regex: search, $options: "i" },
    })
      .populate("author", {
        username: 1,
        cover: 1,
        _id: 1,
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Fetched posts",
      data: posts,
    });
  } catch (error) {
    res.status(404).json({
      status: "Failed",
      message: "Something went wrong!",
    });
  }
});
// static file handling--
const __variableOfChoice = path.resolve();
app.use(express.static(path.join(__variableOfChoice, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__variableOfChoice, "frontend", "dist", "index.html"));
});

// server creation---
app.listen(process.env.PORT || 4000, () => {
  console.log(`Listening on port 4000`);
});
