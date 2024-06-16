const {
  JWT_COOKIE_EXPIRES_IN,
  JWT_SECRET,
  JWT_EXPIRES_IN,
} = require("../constants");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: `${JWT_EXPIRES_IN}`,
  });
};

const createAndSendToken = (user, res, req, statusCode) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  // if user is using secure connection
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    cookieOptions.secure = true;
  }

  try {
    res.cookie("jwt", token, cookieOptions);
  } catch (error) {
    console.log(error);
  }

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    createAndSendToken(newUser, res, req, 201);
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError("Email already in use", 400));
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    createAndSendToken(user, res, req, 200);
  } catch (err) {
    next(err);
  }
};

// to protect the routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt; // for browser
    }
    if (!token) {
      return next(
        new AppError("You are not logged in. Please login to get access", 401)
      );
    }

    const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists", 401)
      );
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

exports.auth = async (req, res) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt; // for browser
  }
  if (!token) {
    return res.status(200).json({
      status: "unauth",
    });
  }

  const decoded = await promisify(jwt.verify)(token, JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return res.status(200).json({
      status: "unauth",
    });
  }

  res.status(200).json({
    status: "auth",
    user: currentUser,
  });
};

exports.logout = async (req, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };
  res.cookie("jwt", "random", {maxAge:0});

  res.status(200).json({ status: "success" });
};
