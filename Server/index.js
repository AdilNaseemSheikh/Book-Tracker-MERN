// Setting up express API here
// imported express
const express = require("express");
// imported mongoose
const mongoose = require("mongoose");
const {
  signUp,
  login,
  protect,
  auth,
  logout,
} = require("./controllers/authController");
const globalErrorHandler = require("./utils/globalErrorHandler");
const Book = require("./models/book.model");
const AppError = require("./utils/appError");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const corsOptions = {
  origin: ["http://localhost:3001"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// request/response from server

app.get("/api/books/", protect, async (req, res, next) => {
  const userId = req.user.id;
  const books = await Book.find({ reader: userId });
  res.status(200).json({
    status: "success",
    data: { books },
  });
});

// using our model we are going to save data to databas
app.post("/api/books/", protect, async (req, res, next) => {
  const userId = req.user.id;
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({
      status: "fail",
      message: "Title and author are required",
    });
  }

  req.body.reader = userId;

  const book = await Book.create(req.body);

  res.status(201).json({
    status: "success",
    data: { book },
  });
});

app.patch("/api/books/:id", async (req, res, next) => {
  const { id } = req.params;
  const doc = await Book.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new AppError(`No Book found for this id(${id}) :(`, 404));
  }

  res.status(200).send({
    status: "success",
    data: { doc },
  });
});

app.delete("/api/books/:id", protect, async (req, res, next) => {
  const { id } = req.params;
  const doc = await Book.findByIdAndDelete(id);
  if (!doc) {
    return next(new AppError(`No Book found for this id(${id}) :(`, 404));
  }
  res.status(201).json({
    status: "success",
  });
});

app.post("/api/signup", signUp);
app.post("/api/login", login);
app.get("/api/auth", auth);
app.get("/api/logout", logout);

app.use(globalErrorHandler);

// Adding connection string
mongoose
  .connect(
    "mongodb+srv://qamarshehzad100:LUG4JvvjyRPaQcHo@backend-db.qoitaea.mongodb.net/Backend-DB"
  )
  .then(() => {
    console.log("Connected to database");

    app.listen(8000, () => {
      console.log("you are listning to port 8000");
    });
  })
  .catch((e) => {
    console.log("Connection failed", e);
  });
