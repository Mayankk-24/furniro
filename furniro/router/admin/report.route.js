const express = require("express");
const router = express.Router();
const ReportControl = require("../../controller/admin/report.control");
const { auth, isadmin } = require("../../middleware/auth.middleware");

router.get("/sales", auth, isadmin, ReportControl.sales);
router.get("/inventory", auth, isadmin, ReportControl.inventory);
router.get("/user-report", auth, isadmin, ReportControl.userreport);
router.get("/productsell", auth, isadmin, ReportControl.productSells);
router.get("/categorysell", auth, isadmin, ReportControl.categorySells);
router.get("/last5month", auth, isadmin, ReportControl.last5monthrevenue);

module.exports = router;