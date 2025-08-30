import express from 'express';
import Parent from '../model/parent.model.js';
import { register_child, login_child, get_child_profile, logout_child } from '../controller/auth.route.child.js';
import { login_parent, register_parent, get_parent_profile } from '../controller/auth.route.parent.js';
import { protect } from '../middleware/authMiddleware.js';
import { cart_products } from '../controller/cartproduct.js';
import CartProduct from '../model/cartproduct.model.js';
import { logout } from '../../../frontend/src/store/slice/authSlice.js';
const router = express.Router();


router.post('/register', register_child);
router.post('/login', login_child);
router.get('/dashboard/:id', protect,  (req, res) =>{
    return res.json({ message: "Dashboard" });
})
router.post('/cart', protect, cart_products);
router.get('/cartpage', protect,  async (req, res) =>{
    try{
        console.log(req.childId);
        const childId = req.childId;
        const parentId = req.parentId;

        
        
        let items = await CartProduct.find({ parentId: parentId }) ;
        
        console.log(items);
        return res.json(items);
    }catch(err){
        return res.status(500).json({message: err.message});
    }

})
router.post('/logout', logout_child);
// router.get('/child/profile/:childId', get_child_profile);
// router.get('/parent/profile/:parentId', get_parent_profile);


export default router;