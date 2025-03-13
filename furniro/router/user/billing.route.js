const express = require("express");
const router = express.Router();
const BillingControl = require("../../controller/user/billing.control");
const { auth } = require("../../middleware/auth.middleware");

router.post("/payment", auth, BillingControl.paybill);
router.get("/orderitems", auth, BillingControl.orderitems);
router.get("/status/:orderId", auth, BillingControl.orderstatus);

module.exports = router;