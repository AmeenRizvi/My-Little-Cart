import jwt from "jsonwebtoken";
import Child from "../model/child.model.js";
import Parent from "../model/parent.model.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken; // assuming you're using cookies
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded successfully:', decoded);
    // console.log(decoded);

    const user = await Child.findById(decoded.id);


    // Attach IDs to request
    req.childId = user._id;
    req.parentId = user.parent;

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const protectParent = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken; // assuming you're using cookies
    // console.log(token);

    // console.log(req);
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);

    const user = await Parent.findById(decoded.id);
    console.log(user);

    // Attach IDs to request
    
    req.parentId = user._id;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
