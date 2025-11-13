import CartProduct from "../model/cartproduct.model.js";

export const cart_products = async (req, res) => {
  try {
    const { cartItems, actionType } = req.body; // actionType = "add" or "buy"
    const { childId, parentId } = req;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Invalid or empty cart data" });
    }

    let cart = await CartProduct.findOne({ childId });

    // 🆕 Create cart if not exists
    if (!cart) {
      const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      cart = await CartProduct.create({
        items: cartItems.map((item) => ({
          productId: item._id || item.p_id,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        totalPrice,
        childId,
        parentId,
      });

      return res.status(201).json({ message: "Cart created successfully", cart });
    }

    // 🟡 Handle “Buy Now” separately — replace the entire cart
    if (actionType === "buy") {
      cart.items = cartItems.map((item) => ({
        productId: item._id || item.p_id,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      }));
    } else {
      // 🟢 Normal “Add to Cart” — merge logic
      for (const newItem of cartItems) {
        const productId = String(newItem._id || newItem.p_id);
        const existingItem = cart.items.find(
          (item) => String(item.productId) === productId
        );

        if (existingItem) {
          existingItem.quantity += newItem.quantity;
          existingItem.price = newItem.price;
          existingItem.image = newItem.image;
        } else {
          cart.items.push({
            productId,
            quantity: newItem.quantity,
            price: newItem.price,
            image: newItem.image,
          });
        }
      }
    }

    // 🧮 Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      message:
        actionType === "buy"
          ? "Cart replaced successfully (Buy Now)"
          : "Cart updated successfully",
      cart,
    });
  } catch (err) {
    console.error("❌ Cart update error:", err);
    res.status(500).json({ message: err.message });
  }
};
