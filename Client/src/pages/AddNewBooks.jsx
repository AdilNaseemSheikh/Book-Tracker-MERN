import React from "react";
import AddBookForm from "../components/AddBookForm/AddBookForm";

function AddNewBooks() {
  return (
    <div className="pl-6 pr-16 sm:pl-30 sm:pr-16 md:pl-10 md:pr-16 lg:pl-72 lg:pr-16">
      <div>
        {/* added form component */}
        <AddBookForm />
      </div>
    </div>
  );
}

export default AddNewBooks;
