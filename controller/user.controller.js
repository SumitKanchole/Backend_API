import { validationResult } from "express-validator";
import { User } from "../model/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config()


export const createUser = async (request, response, next) => {
    try {
        const errors = validationResult(request);
        console.log(errors);
        
        if (!errors.isEmpty()) return response.status(400).json({ error: "Bad request", errorMessages: errors.array() });
        let { password, name, contact, email } = request.body;
        const saltKey = bcrypt.genSaltSync(12);
        password = bcrypt.hashSync(password, saltKey);
        let result = await User.create({ name, password, contact, email });
        await SendEmail(email,name);
        return response.status(201).json({ message: "user created successfully...", user: result });

    }
    catch (err) {
        console.log(err);
        return response.status(500).json({ error: "Internal Server Error" })
    }
}



export const SignIn = async (request, response, next) => {
    try {
        let { email, password } = request.body;

        let user = await User.findOne({ email });

        if (!user.isVerified) {
            return response.status(401).json({ error: "Unauthorized user | Account is not Verified.." });
        }
        if (!user) {
            return response.status(401).json({ error: "Unauthorized user | Email id not found" });
        }
        let status = await bcrypt.compareSync(password, user.password);
        user.password = undefined;
        
        status && response.cookie("token",generateToken(user.userId, user.email ,user.contact));
        return status ? response.status(200).json({ message: "Sign In Successfully.." ,user}) : response.status(401).json({ error: "Unauthorized user | Invalid password" });

    }
    catch (err) {
        console.log(err); 
        return response.status(500).json({ error: "Internal Server Error" })
    }
}


export const VerifyEmail = async (request, response, next) => {
    try {
        const { email } = request.body;
        const updateVerifiedStatus = { $set: { isVerified: true } };

        let result = await User.updateOne({ email },updateVerifiedStatus );
        console.log(result);
        
        return response.status(200).json({message:"Account Verified Successfully..."})
    }
    catch (err) {
        return response.status(500).json({ Error: "Internal Server Error.." });
    }
}


export const SendEmail = (email, name) => {
    return new Promise((resolve, reject) => {
    
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
          
        let mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Account Verification',
            html: `<h4>Dear ${name}</h4>
            <p>Thank You for ragistration. To Verify your account Please Click on Below Button</p>
            <form method="post" action="http://localhost:3000/user/verification">
              <input type="hidden" name="email" value="${email}"/>
              <button type="submit" style="background-color: green; color:white; width:100px;padding:12px; border: none; border: 1px solid grey; border-radius:10px;">Verify</button>
            </form>
            <p>
            <h6> Thank You </h6> 
            Backend API 
             </p>`
        };
          
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
          
    });
}


export const getProfile = async (request, response, next) => {
    User.find()
        .then(result => {
        return response.status(200).json({message:"Get All Profile successfully",result})
        }).catch(err => {
        return response.status(500).json({Error:"Internal Server Error..."})
    })
}

export const SignOut = async (request, response, next) => {
    try {
        response.clearCookie("token");
        return response.status(200).json({ message: "Sign Out Successfully....." });
    }
    catch (err) {
        return response.status(500).json({ Error: "Internal Server Error." })
    }
}


const generateToken = (userId, email,contact) => {
    let payload = { userId, email,contact };
    let token = jwt.sign(payload, process.env.TOKEN_SECRET);
    console.log(token);
    return token;
    
}