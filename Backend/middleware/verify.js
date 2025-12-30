import jwt from "jsonwebtoken";

const verifyUser = async (req, res, next) => {
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({
      message: "You are not authenticated",
      tokenExpired: true,
    });
  }

  try {
    const tokenData = jwt.verify(token, process.env.SECRET_KEY);
    req.user = tokenData;
    next();
  } catch (error) {
    // Check if error is token expiration
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
        tokenExpired: true,
      });
    }

    res.status(403).json({
      message: "Not authorized, Token is not valid",
      tokenExpired: false,
    });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

export { verifyUser, authorizeAdmin };
