import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const protectRoute = expressAsyncHandler(async (req, res, next) => {
    let token = req.cookies?.jwt;
    console.log(token);
  
    if (!token) {
      return res.status(401).json({ message: "Unauthorized, token not found" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
  
      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      next();
    } catch (error) {
      return res.status(400).json({ message: "Invalid token" });
    }
  });

  export const adminMiddleware = expressAsyncHandler(async (req, res, next) => {
       let token;
       token = req.cookies.jwt;

       if(!token){
          return res.status(404).json({message: "Token not found"});
       }

       try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.userId).select('-password');
          if(!user){
              return res.status(404).json({message: "User not found"});
          }

          if(user.role !== "admin"){
            return res.status(404).json({message: "Access denied, not an admin"});
          }

          req.user = user;
          next();
       } catch (error) {
          return res.status(400).json({message: "Invalid token"});
       }
  });
  