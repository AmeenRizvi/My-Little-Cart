import Product from "../model/product.model.js";

const getProducts = async (req, res) => {
    try{
        const products = await Product.find({});

        res.json(products);
    }catch(err){
        res.status(500).json({message: err.message});
    }
}

export default getProducts;