import express from 'express';
import CartProduct from '../model/cartproduct.model.js';
import { cart_products } from '../controller/cartproduct.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/dashboard/:id', (req, res) =>{
    return res.json({ message: "Dashboard" });

});
router.post('/cart', protect , cart_products);
router.get('/cartpage', protect ,async (req, res) =>{
    try{
        console.log(req.childId);
        const childId = req.childId;
        const parentId = req.parentId;

        
        
        let items = await CartProduct.find({ childId: childId }) ;
        
        // else if(parentId)
        // {
        //     let items = await CartProduct.find({ parentId: parentId });
        // }

        console.log(items);
        return res.json(items);
    }catch(err){
        return res.status(500).json({message: err.message});
    }

})



export default router;