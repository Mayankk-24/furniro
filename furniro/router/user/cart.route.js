const express = require("express");
const router = express.Router();
const CartControl = require("../../controller/user/cart.control");
const { auth } = require("../../middleware/auth.middleware");

router.post("/add/:Id", auth, CartControl.addcart);
router.post("/direct/:Id", auth, CartControl.directCart);
router.get("/single", auth, CartControl.singleUserCart);
router.patch("/update/:Id", auth, CartControl.updatecart);
router.delete("/delete/:Id", auth, CartControl.deletecart);
router.get("/totalamount/:Id", auth, CartControl.totalamount);

module.exports = router;