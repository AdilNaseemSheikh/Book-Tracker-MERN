import React from "react";
import ViewBooksGrid from "../components/ViewBooksGrid/ViewBooksGrid";

function ViewAllBooks() {
  return (
    <div className="pl-6 pr-16 sm:pl-30 sm:pr-16 md:pl-10 md:pr-16 lg:pl-72 lg:pr-16">
      <div className="max-h-screen overflow-auto">
        <ViewBooksGrid />
      </div>
    </div>
  );
}

export default ViewAllBooks;
