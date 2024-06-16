import React, { useEffect, useState } from "react";

import { deleteBook, getBooks, updateBook } from "../../services/bookservice";
import Loader from "../loader/loader";
import Empty from "../empty/empty";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";

const itemsPerPage = 10;

function ViewBooksGrid() {
  const [books, setBooks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBookIndex, setCurrentBookIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthor, setEditAuthor] = useState("");
  const [editPages, setEditPages] = useState("");
  const { username } = useSelector((state) => state.auth);

  useEffect(() => {
    const get = async () => {
      setIsLoading(true);
      try {
        const res = await getBooks();
        setBooks(res.data.books);
      } catch (error) {
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };
    get();
  }, []);

  const handleEdit = (index) => {
    const book = books[index];
    setEditTitle(book.title);
    setEditAuthor(book.author);
    setEditPages(book.pages);
    setIsEditing(true);
    setCurrentBookIndex(index);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);

    try {
      await deleteBook(id);
      const updatedBooks = books.filter((book) => book._id !== id);
      setBooks(updatedBooks);
      toast("Book Deleted.", {
        type: "success",
      });
    } catch (error) {
      toast("Something went wrong.", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }

    setIsEditing(false);
    setCurrentBookIndex(null);
  };

  const handleSave = async (id) => {
    setIsLoading(true);

    try {
      await updateBook(id, {
        title: editTitle,
        author: editAuthor,
        pages: editPages,
      });

      const updatedBooks = books.map((book, index) =>
        index === currentBookIndex
          ? { ...book, title: editTitle, author: editAuthor, pages: editPages }
          : book
      );
      setBooks(updatedBooks);

      toast("Book updated.", {
        type: "success",
      });
    } catch (error) {
      toast("Something went wrong.", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }

    setIsEditing(false);
    setCurrentBookIndex(null);
    setEditTitle("");
    setEditAuthor("");
    setEditPages("");
  };

  const totalPages = Math.ceil(books.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  // const paginatedBooks = books.slice(startIndex, startIndex + itemsPerPage);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-4xl">
        {username && <Typography>{username}'s Books</Typography>}
        <table className="w-full bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600 pr-5">
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Author</th>
              <th className="py-3 px-4 text-left">No of Pages</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.length ? (
              books.map((book, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 px-4">
                    {isEditing && currentBookIndex === startIndex + index ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none"
                      />
                    ) : (
                      book.title
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {isEditing && currentBookIndex === startIndex + index ? (
                      <input
                        type="text"
                        value={editAuthor}
                        onChange={(e) => setEditAuthor(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none"
                      />
                    ) : (
                      book.author
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {isEditing && currentBookIndex === startIndex + index ? (
                      <input
                        type="number"
                        value={editPages}
                        onChange={(e) => setEditPages(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none"
                      />
                    ) : (
                      book.pages
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {isEditing && currentBookIndex === startIndex + index ? (
                      <>
                        <button
                          onClick={() => handleSave(book._id)}
                          className="bg-green-500 text-white py-1 px-2 rounded-md mr-2 hover:bg-green-600 transition duration-300"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setCurrentBookIndex(null);
                          }}
                          className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition duration-300"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(startIndex + index)}
                          className="bg-blue-500 text-white py-1 px-2 rounded-md mr-2 hover:bg-blue-600 transition duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
                          className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition duration-300"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <Empty />
            )}
          </tbody>
        </table>

        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`mx-1 px-3 py-1 rounded-lg ${
                currentPage === index + 1
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              } transition duration-300`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewBooksGrid;
