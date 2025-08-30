import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const childSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    parentEmail: {
        type: String,
        required: true,
    },
    parent:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent",
        required: true,
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dvqjyjyqy/image/upload/v1677777777/kids-ecommerce/default-avatar.png",
    },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CartProduct",
        },
    ],
})

childSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

childSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

const Child = mongoose.model("Child", childSchema);

export default Child;

