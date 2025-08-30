import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const parentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }, 
    password: {
        type: String,
        required: true,
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Child",
        },
    ],
    cart: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CartProduct",
            },
        ],
})

parentSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

parentSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

const Parent = mongoose.model("Parent", parentSchema);

export default Parent;