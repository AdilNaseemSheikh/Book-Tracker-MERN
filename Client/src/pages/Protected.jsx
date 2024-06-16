import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/loader/loader";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();

  const { loading, authenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authenticated) navigate("/login");
  }, [authenticated, navigate]);

  if (loading) return <Loader />;

  return children;
}

export default ProtectedRoute;
