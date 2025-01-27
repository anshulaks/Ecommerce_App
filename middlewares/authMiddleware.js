import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js"; // Ensure the correct path to your user model

// Middleware to verify JWT token
export const requireSignIn = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header is present
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Token not provided" });
    }

    // Extract token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded token (e.g., user info) to the request object
    next();
  } catch (error) {
    console.log("Token Verification Error:", error.message); // Log the error for debugging
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};

// Middleware to check if the user is an admin
export const isAdmin = async (req, res, next) => {
  try {
    // Ensure the user ID exists in the decoded token
    if (!req.user?._id) {
      return res.status(401).send({ message: "Unauthorized access" });
    }

    // Find the user in the database using the decoded user ID
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if the user's role is admin (role: 1)
    if (user.role !== 1) {
      return res.status(403).send({ message: "Access denied: Admins only" });
    }

    // User is an admin, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log("Admin Middleware Error:", error.message); // Log the error for debugging
    return res.status(500).send({
      success: false,
      message: "Error in admin middleware",
      error: error.message,
    });
  }
};
