import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res)=>{
    try{
        const email = req.body.email.toLowerCase();
        const {fullName, password} = req.body;
        const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
        
        if(!email || ! fullName || !password) return res.status(400).json({message: "Required Field Empty"});

        if(password.length < 6) return res.status(400).json({message: "Password should be greater than 6 digits"});

        const user = await User.findOne({email});
        if(user) return res.status(403).json({message:"User already exist"});

        const hashedPassword = await bcrypt.hash(password,SALT_ROUNDS);

        const newUser = new User({email, fullName, password: hashedPassword});

        if(newUser){
            await newUser.save();
            
            generateToken(newUser._id, res);

            return res.status(201).send({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt,
            })
        }else{
            return res.status(400).send({message:"Invalid User Data"});
        }


    }catch(error){
        console.log(`Error in Signup`, error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
export const login = async (req, res)=>{
    try {
        const email = req.body.email?.toLowerCase();
        const {password} = req.body;

        if(!email || !password) return res.status(400).json({message:"Provide all required fields"});

        const user = await User.findOne({email});

        if(!user) return res.status(404).json({message:"Invalid Credentials!"});

        const isPassValid = await bcrypt.compare(password,user.password);
        if(!isPassValid) return res.status(404).json({message:"Invalid Credentials!"});

        generateToken(user._id,res);

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
        })


    } catch (error) {
        console.log(`Error in Login`, error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
export const logout = (req, res)=>{
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logged Out!"});
}
export const updateProfile = async (req,res)=>{
    
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic) return res.status(400).json({message:"Profile picture is required"});

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId,{
            profilePic: uploadResponse.secure_url,
        },{new:true}).select("-password");

        res.status(201).json(updatedUser);
        
    } catch (error) {
        console.log(`Error in Update Profile`, error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}
export const checkAuth = (req,res)=>{
    try {
        res.json(req.user);
    } catch (error) {
        console.log(`Error in Auth Check`, error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}