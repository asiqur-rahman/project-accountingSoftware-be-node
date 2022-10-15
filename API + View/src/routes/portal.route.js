const express = require('express');
const router = express.Router();
const portalController = require('../controllers/portal.controller');
const {auth,isLogedIn} = require('../middleware/auth.middleware');
const {role} = require('../utils/enum.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
 
router.get('/portal-user-profile', auth(), awaitHandlerFactory(portalController.portalProfile_Get));
router.post('/portal-user-profile', auth(), awaitHandlerFactory(portalController.portalProfile_Post));

router.post('/portal-force-change-password', auth(), awaitHandlerFactory(portalController.forceChangePassword_Post));

router.get(['/portal-get-dashboard-apexData','/portal-get-dashboard-apexData/:forData'], auth(role.SuperUser,role.Admin), awaitHandlerFactory(portalController.dashboardForApex));

router.get('/portal-get-dashboard', auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.forceChangePassword_Get), awaitHandlerFactory(portalController.dashboard));

router.get("/portal-set-tv-ads", auth(role.SuperUser,role.Admin,role.Manager),awaitHandlerFactory(portalController.tvAdsIndex));
router.get("/portal-tv-ads-create", auth(role.SuperUser,role.Admin,role.Manager),awaitHandlerFactory(portalController.tvAdsCreate_Get));
router.post("/portal-tv-ads-create/:adsName", auth(role.SuperUser,role.Admin,role.Manager),awaitHandlerFactory(portalController.tvAdsCreate_Post));
router.get("/portal-tv-ads-delete/:adsName", auth(role.SuperUser,role.Admin,role.Manager),awaitHandlerFactory(portalController.tvAdsDelete_Get));

router.get(["/portal-user-list"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalUserList));
router.get(["/portal-username-check/:username"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalUsernameCheck));
router.get(["/portal-user-create","/portal-user-create/:id"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalUserCreate_Get));
router.post(["/portal-user-create","/portal-user-create/:id"], auth(),awaitHandlerFactory(portalController.portalUserCreate_Post));
router.get(["/portal-user-password-reset/:userId","/portal-profile-password-reset/:userId&:isProfile"], auth(),awaitHandlerFactory(portalController.portalUserPasswordReset_Get));
router.get(["/portal-user-change-status/:userId"], auth(),awaitHandlerFactory(portalController.portalUserChangeStatus_Get));
// router.get("/portal-user-create/:id", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalUserCreate_Get));
router.get("/portal-user-delete/:id", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalUserDelete_Get));
router.get(["/get-portal-user-list-data","/get-portal-user-list-data/:roleId"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.getPortalUserListData));

router.get(["/portal-employee-list"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalEmployeeList));
router.get("/portal-employee-create", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalEmployeeCreate_Get));
router.post("/portal-employee-create", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalEmployeeCreate_Post));
router.get("/portal-employee-create/:id", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalEmployeeCreate_Get));
router.get("/portal-employee-delete/:id", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalEmployeeDelete_Get));
router.get(["/get-portal-employee-list-data","/get-portal-employee-list-data/:roleId"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.getPortalEmployeeListData));

router.get(["/portal-supplier-list"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSupplierList));
router.get("/portal-supplier-create", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSupplierCreate_Get));
router.post(["/portal-supplier-create"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSupplierCreate_Post));
router.get("/portal-supplier-create/:id", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSupplierCreate_Get));
router.get("/portal-supplier-delete/:id", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSupplierDelete_Get));
router.get(["/get-portal-supplier-list-data","/get-portal-supplier-list-data/:roleId"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.getPortalSupplierListData));

router.post("/portal-employee-face-verification/:employeeCode", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalEmployeeFaceVerification_Get));

router.get(["/portal-sales-list"], auth(role.SuperUser,role.Admin), awaitHandlerFactory(portalController.portalSalesList));
router.get("/portal-sales-create", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSalesCreate_Get));
router.post("/portal-sales-create", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSalesCreate_Post));
router.get("/portal-sales-create/:id", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSalesCreate_Get));
router.get("/portal-sales-delete/:id", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSalesDelete_Get));
router.get(["/get-portal-sales-list-data/:fromDate&:toDate","/get-portal-sales-list-data/:roleId"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.getPortalSalesListData));

router.get(["/portal-supply-list"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSupplyList));
router.get(["/portal-supply-create","/portal-supply-create/:id"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSupplyCreate_Get));
router.post(["/portal-supply-create","/portal-supply-create/:id"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSupplyCreate_Post_Pre),awaitHandlerFactory(portalController.portalSupplyCreate_Post));
router.get("/portal-supply-view/:id", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSupplyView_Get));
router.get("/portal-supply-file-download/:id&:fileName", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSupplyFileDownload));
router.get("/portal-supply-delete/:id", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalSupplyDelete_Get));
router.get(["/get-portal-supply-list-data/:fromDate&:toDate","/get-portal-supply-list-data/:roleId"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.getPortalSupplyListData));

router.get(["/portal-wages-list"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalWagesList));
router.get(["/portal-wages-create","/portal-wages-create/:id"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalWagesCreate_Get));
router.post(["/portal-wages-create","/portal-wages-create/:id"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalWagesCreate_Post));
router.get("/portal-wages-delete/:id", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalWagesDelete_Get));
router.get(["/get-portal-wages-list-data/:fromDate&:toDate","/get-portal-wages-list-data/:roleId"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.getPortalWagesListData));

router.get(["/portal-expense-list"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalExpenseList));
router.get(["/portal-expense-create","/portal-expense-create/:id"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalExpenseCreate_Get));
router.post(["/portal-expense-create","/portal-expense-create/:id"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalExpenseCreate_Post));
// router.get("/portal-expense-create/:id", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalExpenseCreate_Get));
router.get("/portal-expense-delete/:id", auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalExpenseDelete_Get));
router.get(["/get-portal-expense-list-data/:fromDate&:toDate","/get-portal-expense-list-data/:roleId"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.getPortalExpenseListData));

router.get(["/portal-master-report"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalMasterReport_Get));
router.post(["/portal-master-report"], auth(role.SuperUser,role.Admin),awaitHandlerFactory(portalController.portalMasterReport_Post));

router.get(["/portal-tally-customer-list"], auth(role.SuperUser,role.Admin,role.Manager,role.Employee),awaitHandlerFactory(portalController.portalTallyCustomerList));
router.get(["/get-portal-tally-customer-list-data"], auth(role.SuperUser,role.Admin,role.Manager,role.Employee),awaitHandlerFactory(portalController.getPortalTallyCustomerListData));
router.get(["/portal-tally-customer-create","/portal-tally-customer-create/:id"], auth(role.SuperUser,role.Admin,role.Manager,role.Employee),awaitHandlerFactory(portalController.portalTallyCustomerCreate_Get));
router.post(["/portal-tally-customer-create","/portal-tally-customer-create/:id"], auth(role.SuperUser,role.Admin,role.Manager,role.Employee),awaitHandlerFactory(portalController.portalTallyCustomerCreate_Post));
router.get("/portal-tally-customer-delete/:id", auth(role.SuperUser,role.Admin,role.Manager,role.Employee),awaitHandlerFactory(portalController.portalTallyCustomerDelete_Get));
router.get(["/portal-tally-create","/portal-tally-create/:id"], auth(role.SuperUser,role.Admin,role.Manager,role.Employee),awaitHandlerFactory(portalController.portalTallyCreate_Get));
router.post(["/portal-tally-create","/portal-tally-create/:id"], auth(role.SuperUser,role.Admin,role.Manager,role.Employee),awaitHandlerFactory(portalController.portalTallyCreate_Post));
router.get(["/portal-tally-list"], auth(role.SuperUser,role.Admin,role.Manager,role.Employee),awaitHandlerFactory(portalController.portalTallyList));
router.get("/portal-tally-delete/:id", auth(role.SuperUser,role.Admin,role.Manager,role.Employee),awaitHandlerFactory(portalController.portalTallyDelete_Get));
router.get(["/get-portal-tally-list-data/:fromDate&:toDate&:tallyCustomerId"], auth(role.SuperUser,role.Admin,role.Manager,role.Employee),awaitHandlerFactory(portalController.getPortalTallyListData));
router.get(["/portal-tally-invoice-create/:fromDate&:toDate&:tallyCustomerId"], auth(role.SuperUser,role.Admin,role.Manager,role.Employee),awaitHandlerFactory(portalController.portalTallyInvoiceCreate));

router.post(["/portal-employee-attendance"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.portalEmployeeCash_Post));
router.get(["/portal-employee-attendance","/portal-employee-attendance/:id"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.forceChangePassword_Get),awaitHandlerFactory(portalController.portalEmployeeAttendance_Get));
router.get(["/portal-attendance-history"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.forceChangePassword_Get),awaitHandlerFactory(portalController.portalAttendanceHistory_Get));
router.get(["/portal-attendance-addNew"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.forceChangePassword_Get),awaitHandlerFactory(portalController.portalAttendanceAddNew_Get));
router.post(["/portal-attendance-addNew"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.forceChangePassword_Get),awaitHandlerFactory(portalController.portalAttendanceAddNew_Post));
router.get(["/portal-attendance-history-data"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.forceChangePassword_Get),awaitHandlerFactory(portalController.portalAttendanceHistoryData_Get));
router.get(["/portal-attendance-entry"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.forceChangePassword_Get),awaitHandlerFactory(portalController.portalAttendanceEntry_Get));
router.get(["/portal-employee-attendance-edit/:userId&:date"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.forceChangePassword_Get),awaitHandlerFactory(portalController.portalEmployeeAttendance_Edit));
router.get(["/portal-employee-attendance-approve/:userId&:date"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.forceChangePassword_Get),awaitHandlerFactory(portalController.portalEmployeeAttendance_Approve));
router.post(["/portal-employee-attendance-update/:id&:newDate"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.forceChangePassword_Get),awaitHandlerFactory(portalController.portalEmployeeAttendanceUpdate_Post));
router.get(["/get-portal-employee-attendance-entry","/get-portal-employee-attendance-entry/:userId&:date"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.forceChangePassword_Get),awaitHandlerFactory(portalController.portalEmployeeAttendanceEntry));
router.get(["/get-portal-employee-attendance-pending-data","/get-portal-employee-attendance-pending-data/:fromDate&:toDate"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.forceChangePassword_Get),awaitHandlerFactory(portalController.portalEmployeeAttendanceListData_Pending));
router.get(["/get-portal-employee-attendance-approved-data","/get-portal-employee-attendance-approved-data?_","/get-portal-employee-attendance-approved-data/:fromDate&:toDate"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.forceChangePassword_Get),awaitHandlerFactory(portalController.portalEmployeeAttendanceListData_Approved));
router.post(["/portal-employee-attendance/:employeeCode&:attendanceFor"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.portalEmployeeAttendance_Post));

router.get(["/portal-documentation-download"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.portalDocumentationFileDownload));
router.get(["/portal-software-download"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.portalSoftwareFileDownload));

router.get(["/portal-custom-invoice-create"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.portalCustomInvoiceCreate_Get));
router.post(["/portal-custom-invoice-create"], auth(role.SuperUser,role.Admin,role.Employee,role.Manager),awaitHandlerFactory(portalController.portalCustomInvoiceCreate_Post));

module.exports = router;