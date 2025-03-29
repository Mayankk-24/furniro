const express = require("express");
const router = express.Router();
const BillingControl = require("../../controller/user/billing.control");
const { auth } = require("../../middleware/auth.middleware");

router.post("/payment", auth, BillingControl.paybill);
router.put("/payment-success",auth,BillingControl.paymentSuccess);
router.get("/orderitems", auth, BillingControl.orderitems);
router.get("/status/:orderId", auth, BillingControl.orderstatus);
router.post("/refund", auth, BillingControl.refundRequest);
router.post("/cancle/:Id", auth, BillingControl.cancleRequest);
router.post("/walletpayment", auth, BillingControl.walletPayment);

module.exports = router;