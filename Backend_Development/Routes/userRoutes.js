const express = require("express");
const router = express.Router();
const {registerUser, loginUser, userInfo} = require("../Controllers/userControllers");
const validateToken = require("../middlewares/validateToken");

router.post('/register', registerUser);
router.post('/login', loginUser);
// router.post('/adminLogin', loginAdmin);
router.get('/info',validateToken, userInfo);

module.exports = router;