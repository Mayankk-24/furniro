const express = require("express");
const router = express.Router();
const ItemsControl = require("../../controller/admin/related_item.control");
const { auth, isadmin } = require("../../middleware/auth.middleware");
const { upload } = require("../../utils/cloudinaryConfig");

router.post("/add", auth, isadmin,ItemsControl.additem)
router.get("/all", auth, isadmin, ItemsControl.allCard);
router.get("/single/:id", auth, isadmin, ItemsControl.single);
router.put("/update/:id", auth, isadmin, ItemsControl.change);
router.delete("/delete/:id", auth, isadmin,ItemsControl.deleteitem);

module.exports = router;