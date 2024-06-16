const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

//Here are creating schema for book
const BookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter book title"],
    },
    author: {
      type: String,
      required: [true, "Please enter book author"],
    },
    pages: {
      type: Number,
      required: true,
      default: 1,
    },
    reader: {
      type: String,
    },
  },
  {
    Timestamps: true,
    // due to this timestamps : true WE HAVE TO EXTRA FIELDS CREATED AT AND UPDATED AT
  }
);

// let's allow mongodb to use this above created schema and converted to model here
const Book = mongoose.model("Book", BookSchema);
// Now let's export this schema
module.exports = Book;

// Let's go to index.js to save data to model
