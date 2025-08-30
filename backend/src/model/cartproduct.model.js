import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    productName : {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Product",
        // required: true,
        type : String,
    },
    price : {
        type : Number,
        required: true,
    },
    image : {
        type : String,
        required: true,
    },
    
    quantity: {
        type : Number,
        default : 1,
    },
    childId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child",
        required: false,
    },
    parentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parent",
        required: false,
    }
})

const CartProduct = mongoose.model("CartProduct", cartProductSchema);

export default CartProduct;