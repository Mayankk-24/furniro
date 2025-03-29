const express = require("express");
const router = express.Router();
const AccountControl = require("../../controller/user/account.control");
const { upload } = require("../../utils/cloudinaryConfig");
const { auth } = require("../../middleware/auth.middleware");

router.get("/profile", auth, AccountControl.profile);
router.put("/update", auth, upload.single("image"), AccountControl.update);
router.put("/changepass", auth, AccountControl.changepassword);
router.put("/addwallet", auth, AccountControl.addWallet);
router.get("/getuserpurchases", auth, AccountControl.getUserPurchases);
router.get("/wallettransacation", auth, AccountControl.getWalletTransactions);

module.exports = router;