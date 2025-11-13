import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    p_id : {
        type: Number,
        required: true,
        unique: true,
    },
    name : {
        type: String,
        required: true,
    },
    price : {
        type: Number,
        required: true,
    },
    originalPrice : {
        type: Number
        
    },
    image : {
        type: String
        
    },
    rating : {
        type: Number,
        
    },
    reviews : {
        type: Number,
        
    },
    category : {
        type: String,
        required: true,
    },
    isNew : {
        type: Boolean,
        
    },
    isFavorite : {
        type: Boolean,
        
    },
    inStock : {
        type: Boolean,
        
    },
    description : {
        type: String,
        
    },
})

const Product = mongoose.model("Product", productSchema);

export default Product;
