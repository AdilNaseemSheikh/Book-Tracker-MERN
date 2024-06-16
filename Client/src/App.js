import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddNewBooks from "./pages/AddNewBooks";
import ViewAllBooks from "./pages/ViewAllBooks";
import Layout from "./UI/Layout";
import Login from "./pages/Login";
import ProtectedRoute from "./pages/Protected";
import { authenticate } from "./Slices/auth";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(authenticate());
  }, [dispatch]);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<ViewAllBooks />} />
            <Route path="addbook" element={<AddNewBooks />} />
            <Route path="viewbooks" element={<ViewAllBooks />} />
            {/* <Route path="logout" element={<Logout />} /> */}
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
