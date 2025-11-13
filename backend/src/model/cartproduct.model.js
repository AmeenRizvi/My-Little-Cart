import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    price: {
        type: Number,
        required: true,
    },
    image : {
        type : String,
        required: true,
    },
});

const cartProductSchema = new mongoose.Schema({
    items: [cartItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
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
    },
    isActive : {
        type: Boolean,
        default: true,
    },
}, {timestamps : true} );

const CartProduct = mongoose.model("CartProduct", cartProductSchema);

export default CartProduct;