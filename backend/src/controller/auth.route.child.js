import { cookieOptions } from "../config/config.js";
import Child from "../model/child.model.js";
import Parent from "../model/parent.model.js";
import wrapAsync from "../utils/tryCatchWrapper.js";
import { signToken } from "../utils/helper.js";

export const register_child = wrapAsync( async (req, res) => {
    const { name, email, parentEmail, password } = req.body;

    const userExist = await Child.findOne({ email });
    if(userExist){
        console.log("User already exists");
        return res.status(400).json({ message: "User already exists "});

    }

    const parentExist = await Parent.findOne({ email: parentEmail });
    if(!parentExist){
        console.log("Please register parent account first");
        return res.status(400).json({ message: "Parent account not valid. Please register parent account first"});

    }

    const user = new Child({
        name,
        email,
        parentEmail,
        password,
        parent: parentExist._id
    });

    try{
        // Save the child
        await user.save();

        // Add child to parent's children array
        parentExist.children.push(user._id);
        await parentExist.save();

        

        const token = signToken({ id: user._id });
        req.user = user;
        res.cookie('accessToken', token, cookieOptions);
        res.status(201).json({
            message: "Child account created successfully and linked to parent",
            childId: user._id,
            parentId: parentExist._id
        });

        console.log("Child account created successfully and linked to parent");

    } catch(err){
        res.status(500).json({ message: err.message });
    }
})

export const login_child = wrapAsync( async (req, res) =>{
    const { email, password } = await req.body;
    // console.log(email, password);

    let userExist = await Child.findOne({ email });
    if(!userExist){
        console.log("User does not exist");
        return res.status(400).json({ message: "User does not exist" });
    }

    const token = signToken({ id: userExist._id, parentId : userExist.parent });
    req.user = userExist;
    
    // req.childId = userExist._id;
    // req.parentId = userExist.parent;
    res.cookie('accessToken', token, cookieOptions);
    
    console.log('child logged in');
    return res.status(200).json({ message: "User logged in successfully", user: {userExist} });
})

export const logout_child = wrapAsync( async(req, res) =>{
    console.log("child logged out");
    res.clearCookie('accessToken', cookieOptions);
    res.status(200).json({ message: "User logged out successfully" });
})

// Get child profile with parent information
export const get_child_profile = async (req, res) => {
    try {
        const { childId } = req.params;

        const child = await Child.findById(childId)
            .populate('parent', 'name email')
            .select('-password');

        if (!child) {
            return res.status(404).json({ message: "Child not found" });
        }

        res.status(200).json({
            message: "Child profile retrieved successfully",
            child: {
                id: child._id,
                name: child.name,
                email: child.email,
                parentEmail: child.parentEmail,
                avatar: child.avatar,
                parent: child.parent
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}