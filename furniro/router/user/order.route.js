const express = require("express");
const router = express.Router();
const Ordercontrol = require("../../controller/user/order.control");
const { auth } = require("../../middleware/auth.middleware");

router.get("/create", auth, Ordercontrol.createorder);
router.get("/single", auth, Ordercontrol.singleorder);
router.put("/update/:Id", auth, Ordercontrol.updateorder);
router.delete("/delete/:Id", auth, Ordercontrol.deleteorder);

module.exports = router; 