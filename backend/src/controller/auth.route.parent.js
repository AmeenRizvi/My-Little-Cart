import Parent from "../model/parent.model.js";
import Child from "../model/child.model.js";
import { cookieOptions } from "../config/config.js";
import { signToken } from "../utils/helper.js";

export const register_parent = async (req, res) => {
    const { name, email, password } = req.body;
    
    const userExist = await Parent.findOne({ email });
    if(userExist){
        console.log("User already exists");
        return res.status(400).json({ message: "User already exists "});
        
    }

    const user = new Parent({
        name, email, password
    });

    try{
        await user.save();

        const token = signToken({ id: user._id });
        req.user = user;
        res.cookie('accessToken', token, cookieOptions);


        res.status(201).json({ message: "User created successfully" });
        console.log("User created successfully");

    } catch(err){
        res.status(500).json({ message: err.message });
    }
}

export const login_parent = async (req, res) =>{
    const { email, password } =  req.body;
    let userExist = await Parent.findOne({ email });
    if(!userExist){
        console.log("User does not exist");
        return res.status(400).json({ message: "User does not exist" });
    }
    // console.log('parent logged in !');
    const token = signToken({ id: userExist._id });
    
    req.user = userExist;

    console.log(req.user);
    
    res.cookie('accessToken', token, cookieOptions);
    console.log('parent logged in')
    return res.status(200).json({ message: "User logged in successfully", user: userExist });
}

export const logout_parent = async(req, res) =>{
    console.log('parent logged out')
    res.clearCookie('accessToken', cookieOptions);
    res.status(200).json({ message: "User logged out successfully" });
}

// Get parent profile with children information
export const get_parent_profile = async (req, res) => {
    try {
        const { parentId } = req.params;

        const parent = await Parent.findById(parentId)
            .populate('children', 'name email avatar')
            .select('-password');

        if (!parent) {
            return res.status(404).json({ message: "Parent not found" });
        }

        res.status(200).json({
            message: "Parent profile retrieved successfully",
            parent: {
                id: parent._id,
                name: parent.name,
                email: parent.email,
                children: parent.children
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

