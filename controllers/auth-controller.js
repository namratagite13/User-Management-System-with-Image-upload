require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


//register controller
const registerUser = async(req, res) =>{

    try{
        //extracting user info
        const {username, email, password, role} = req.body;


        //checking if user already exists 
        const checkExistingUser = await User.findOne(
            // is a MongoDB query operator that allows you to find documents where at least one of several conditions is true.
            {$or:[{username}, {email}]}
        )
        if(checkExistingUser){
            return res.status(500).json({
                success: false,
                message: 'User already exists, try with different username or password.'
            })

        }

        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        //creating new user
        const newlyCreatedUser = new User({
            username,
            email,
            password : hashPassword,
            role: role|| 'user'
        });

        await(newlyCreatedUser).save();

        if(newlyCreatedUser){
            res.status(201).json({
               success:true,
               message: 'User registered successfully!!' 
            })
        }else{
            res.status(500).json({
                success: false,
                message: 'Unable to register user, Please try again later.'
            })
        }


    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Please try again later"
        })

    }
}

const loginUser = async(req,res)=>{
    try{
        //requesting user info
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if(!user){
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            })
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(!isPasswordMatched){
            res.status(400).json({
                success:false,
                message: "Invalid credentials"
            })

        }

        //create token
        const accessToken = jwt.sign({
            userId : user._id,
            username : user.username,
            role: user.role,
            email: user.email
           
        }, process.env.JWT_SECRET_KEY,{
            expiresIn: '30m'
        }
    )

    res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        accessToken
    })

        
    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong, Please try again later."
        })

    }
}

const changePassword = async(req, res) =>{
    try{
        const userId = req.userInfo.userId;
        const {oldPassword, newPassword} = req.body;

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found!"
            })
        };

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success: false,
                message: 'Old password is not correct!'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = newHashedPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully!!"
        })



    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong, Please try again later.'
        })

    }

}

const getUserProfile = async(req, res) =>{
    
    try{
        const userId = req.userInfo.userId;
        const user = await User.findById(userId);
    
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found!"
            })
        };

         
        const username = req.userInfo.username;
        const role= req.userInfo.role;
        const email = req.userInfo.email;
       
        
        
        res.status(201).json({
            success: true,
            username: username,
            email: email,
            role: role,
            userId: userId
        })

        
        
    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message: "Something went wrong, Please try again later."
        })

    }
}

const updateUserProfile = async(req, res) =>{
    try{
        const userId = req.userInfo.userId;
        const {username, email} = req.body;

        const user = await User.findById(userId);

    
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found!"
            })
        }

        if(username && username !== user.username){
            const existingUserWithUsername = await User.findOne({username});

            if(existingUserWithUsername){
                return res.status(409).json({
                    success: false,
                    message : "Username is already taken"
                })
            }
            user.username = username;
        }

        if(email && email !== user.email){
            const existingUserWithEmail = await User.findOne({email});

            if(existingUserWithEmail){
                return res.status(409).json({
                    success: false,
                    message : "Email is already taken"
                })
            }
            user.email = email;
        }

        await user.save();
        res.status(200).json({
            success: true,
            message: "User profile updated successfully!",
            data:{
                updatedUsername: user.username,
                updatedEmail: user.email
            }
        })


       
    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message: "Something went wrong, Please try again later."
        })

    }

}

const deleteUser = async(req, res) =>{

    try{
        const userId = req.userInfo.userId;
        const user = await User.findById(userId);

    
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User not found!"
            })
        }
        const findIdAndDelete = req.params.id;
        const {username, password} = req.body;
        if(password === user.password){
            const deleteUser = await User.findByIdAndDelete(findIdAndDelete)
        }

        await user.save()

        res.status(200).json({
            success:true,
            message:"user deleted successfully"
        })


    
    }catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message: "Something went wrong, Please try again later."
        })

    }
}


module.exports = { registerUser, loginUser, changePassword, getUserProfile, updateUserProfile, deleteUser}