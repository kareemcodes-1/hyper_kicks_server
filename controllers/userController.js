import expressAsyncHandler from "express-async-handler";
import User from "../models/User.js";
import { generateToken } from "../generateToken.js";

const getAllUsers = expressAsyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
    }
});

const registerUser = expressAsyncHandler(async (req, res) => {
    try {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({message: "Name, Email and Password are required"});
    }

    const userExists = await User.findOne({email});

    if(userExists){
        return res.status(400).json({message: "User already exists"});
    }

    const user = await User.create({
        name,
        email,
        password
    });

    await user.save();

    generateToken(res, user._id);

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
    });
    } catch (error) {
        console.log(error)
    }
});

const loginUser = expressAsyncHandler(async (req, res) => {
    try {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "Email and Password are required"});
    }

    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        generateToken(res, user._id);

       res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
       });
    }else{
        res.status(400).json({message: "Invalid credientials"});
    }
    } catch (error) {
        console.log(error)
    }
});

const Logout = expressAsyncHandler(async (req, res) => {
    try {
       res.cookie('jwt', '', {
          maxAge: new Date(0)
       });

       res.status(200).json({message: "Logged out success!"});
    } catch (error) {
        console.log(error)
    }
});

const getUserProfile = expressAsyncHandler(async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password
        });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

const updateUserProfile = expressAsyncHandler(async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          const { name, email, avatar } = req.body;
          if (name) user.name = name;
          if (email) user.email = email;
          if (avatar) user.avatar = avatar;
      
          if (req.body.password) {
            if (req.body.old_password && (await user.matchPassword(req.body.old_password))) {
              user.password = req.body.password;
            } else {
              return res.status(400).json({ message: "Old password doesn't match" });
            }
          }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar
        });
    } catch (error) {
        console.log(error);
    }
});




export {getAllUsers, registerUser, loginUser, Logout, getUserProfile, updateUserProfile}