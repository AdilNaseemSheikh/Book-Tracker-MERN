import React, { useState } from "react";
import { addBook } from "../../services/bookservice";
import Loader from "../loader/loader";
import { toast } from "react-toastify";

function AddBookForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pages, setPages] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addBook(title, author, pages);
      toast("Book added.", {
        type: "success",
      });
      setTitle("");
      setAuthor("");
      setPages("");
    } catch (error) {
      toast(`${error}`, {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md transform transition-all duration-500 hover:scale-105"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Add a New Book
        </h2>

        <div className="mb-6">
          <label
            className="block text-gray-700 mb-2 font-semibold"
            htmlFor="title"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 transition duration-300"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 mb-2 font-semibold"
            htmlFor="author"
          >
            Author
          </label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 transition duration-300"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 mb-2 font-semibold"
            htmlFor="pages"
          >
            Number of Pages
          </label>
          <input
            type="number"
            id="pages"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-300 transition duration-300"
            required
          />
        </div>

        <button
          onClick={handleSubmit}
          type="submit"
          className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 transform hover:scale-105"
        >
          Add Book
        </button>
      </form>
    </div>
  );
}

export default AddBookForm;
