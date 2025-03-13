const express = require("express");
const router = express.Router();
const AdminControl = require("../../controller/admin/admin.control");
const { upload } = require("../../utils/cloudinaryConfig");
const { auth, isadmin } = require("../../middleware/auth.middleware");

router.post("/register", AdminControl.register);
router.post("/login", AdminControl.login);
router.get("/single", auth, isadmin, AdminControl.singleuser);
router.put("/update", upload.single("image"), auth, isadmin, AdminControl.update);
router.put("/changePass", auth, isadmin, AdminControl.changePass);
router.put("/logout", auth, isadmin, AdminControl.logout);

module.exports = router;