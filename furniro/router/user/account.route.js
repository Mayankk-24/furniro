const express = require("express");
const router = express.Router();
const AccountControl = require("../../controller/user/account.control");
const { upload } = require("../../utils/cloudinaryConfig");
const { auth } = require("../../middleware/auth.middleware");

router.get("/profile", auth, AccountControl.profile);
router.put("/update", auth, upload.single("image"), AccountControl.update);
router.put("/changepass", auth, AccountControl.changepassword);
router.put("/wallet", auth, AccountControl.addWallet);

module.exports = router;