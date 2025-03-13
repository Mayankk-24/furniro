const express = require("express");
const router = express.Router();
const UserControl = require("../../controller/admin/user.control");
const { auth, isadmin } = require("../../middleware/auth.middleware");

// router.get("/all", auth, isadmin, UserControl.alluser);
// router.get("/single/:id", auth, isadmin, UserControl.singleuser);
// router.put("/update/:id", auth, isadmin, UserControl.updateuser);
// router.delete("/delete/:id", auth, isadmin, UserControl.deleteuser);

router.post("/adduser", auth, isadmin, UserControl.addUser);
router.get("/all", auth, isadmin, UserControl.alluser);
router.get("/single/:id", auth, isadmin, UserControl.singleuser);
router.put("/update/:id", auth, isadmin, UserControl.update);
router.put("/status/:id", auth, isadmin, UserControl.changeStatus);
router.delete("/delete/:id", auth, isadmin, UserControl.deleteuser);


module.exports = router;