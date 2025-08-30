import CartProduct from "../model/cartproduct.model.js";

export const cart_products = async (req, res) => {
  try {
    const { cartItems } = req.body;

    // Get list of product names coming from frontend
    const newProductNames = cartItems.map(item => item.name);

    // 1️⃣ Delete items not in new request
    await CartProduct.deleteMany({
      childId: req.childId,
      parentId: req.parentId,
      productName: { $nin: newProductNames }
    });

    // 2️⃣ Upsert new/updated items
    for (const item of cartItems) {
      await CartProduct.findOneAndUpdate(
        {
          productName: item.name,
          childId: req.childId,
          parentId: req.parentId
        },
        {
          $set: {
            price: item.price,
            image: item.image,
            quantity: item.quantity
          },
          
        },
        { upsert: true, new: true }
      );
    }

    // 3️⃣ Return updated cart
    const updatedCart = await CartProduct.find({
      childId: req.childId,
      parentId: req.parentId
    });

    res.status(200).json({ message: "Cart synced successfully", cart: updatedCart });
  } catch (err) {
    console.error("Cart sync error:", err);
    res.status(500).json({ message: err.message });
  }
};
