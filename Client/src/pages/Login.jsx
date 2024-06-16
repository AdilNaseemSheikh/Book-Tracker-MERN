import { useEffect, useState } from "react";
import styles from "../components/loader/loader.module.css";
import { useNavigate } from "react-router-dom";
import Logo from "../images/BookTracker2.jpg";
import { login, signup } from "../services/authservice";
import { toast } from "react-toastify";
import Loader from "../components/loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { authenticate } from "../Slices/auth";

function Login() {
  const [email, setEmail] = useState("adil@gmail.com");
  const [firstname, setFirstname] = useState("");
  const [password, setPassword] = useState("pass1234");
  const [type, setType] = useState("login");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { authenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [navigate, authenticated]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (type === "signup") {
        await signup(email, password, firstname);
        toast.success("Signup successfull");
        dispatch(authenticate());
      } else {
        await login(email, password);
        toast.success("Login successfull");
        dispatch(authenticate());
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during login!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className={styles.container}>
      <div className={styles.card}>
        <div
          style={{
            width: "150px",
            margin: "20px 0",
          }}
        >
          <img
            style={{
              height: "100%",
              width: "100%",
            }}
            src={Logo}
            alt="crowd-funding-logo-icon"
          />
        </div>

        {type === "signup" && (
          <>
            <input
              className={styles.input}
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              type="text"
              placeholder="Name"
            />
          </>
        )}

        <input
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          placeholder="Email"
        />
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button
          disabled={isLoading}
          className={styles.button}
          onClick={handleSubmit}
          type="submit"
        >
          {isLoading ? "Processing..." : "Submit"}
        </button>

        <button
          className=" ml-auto cursor-pointer"
          onClick={() =>
            setType((type) => (type === "login" ? "signup" : "login"))
          }
        >
          {type === "login" ? "Signup" : "Signin"}
        </button>
      </div>
    </div>
  );
}

export default Login;
