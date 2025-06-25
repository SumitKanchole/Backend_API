import express from "express";
import { createUser, getProfile, SignIn, SignOut,VerifyEmail } from "../controller/user.controller.js";
import { body } from "express-validator";
import { auth } from "../middleware/auth.js";
const router = express.Router();


router.post("/", body("name", "name is required").notEmpty(),
    body("name", "Only Alphabets are allowed").isAlpha(),
    body("email", "email id is required").notEmpty(),
    body("email", "invalid email id").isEmail(),
    body("password", "password is required").notEmpty(),
    body("contact", "contact number is required").notEmpty(),
    body("contact", "only digits are allowed").isNumeric(), createUser
);
router.post("/signIn",SignIn);
router.post("/verification", VerifyEmail);
router.get("/profile",auth, getProfile);
router.post("/signout",auth, SignOut);

export default router;