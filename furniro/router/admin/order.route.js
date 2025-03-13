const express = require("express");
const router = express.Router();
const Ordercontrol = require("../../controller/admin/order.control");
const { auth, isadmin } = require("../../middleware/auth.middleware");

router.get("/all", auth, isadmin, Ordercontrol.allorder);
router.get("/single/:id", auth, isadmin, Ordercontrol.singleorder);
router.put("/update/:id", auth, isadmin, Ordercontrol.updateorder);
router.delete("/cancel/:id", auth, isadmin, Ordercontrol.cancelorder);
router.get("/ordersell", auth, isadmin, Ordercontrol.ordersells);
router.get("/orderreport", auth, isadmin, Ordercontrol.orderreport);

module.exports = router; 