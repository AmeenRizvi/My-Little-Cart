import express from 'express';
import { protectParent } from '../middleware/authMiddleware.js';
import { login_parent, logout_parent, register_parent } from '../controller/auth.route.parent.js';
import { cart_products } from '../controller/cartproduct.js';
import CartProduct from '../model/cartproduct.model.js';

const router = express.Router();

router.post('/register', register_parent );
router.post('/login', login_parent);
router.get('/dashboard/:id', protectParent ,(req, res) =>{
    return res.json({ message: "Dashboard" });
});
router.post('/cart', protectParent, cart_products);

router.get('/cartpage', protectParent, async (req, res) =>{
    try{
        
    //    console.log(req);
        const parentId = req.parentId;

        
        
        let items = await CartProduct.find({ parentId: parentId }) ;
        
        // console.log(items);
        return res.json(items);
    }catch(err){
        return res.status(500).json({message: err.message});
    }

} );
router.post('/logout', logout_parent);
export default router;
