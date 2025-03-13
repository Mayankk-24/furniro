const express = require("express");
const router = express.Router();
const CoupanControl = require("../../controller/admin/coupan.control");
const { auth, isadmin } = require("../../middleware/auth.middleware");

router.post("/add", auth, isadmin, CoupanControl.add);
router.get("/all", auth, isadmin, CoupanControl.allcoupan);
router.get("/single/:id", auth, isadmin, CoupanControl.singlecoupan);
router.put("/update/:id", auth, isadmin, CoupanControl.updatecoupan);
router.delete("/delete/:id", auth, isadmin, CoupanControl.deletecoupan);

module.exports = router;