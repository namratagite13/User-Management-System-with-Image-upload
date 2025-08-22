const Image = require('../models/Image');

const uploadToCloudinary = require('../helpers/CloudinaryHelper');
const fs = require('fs')
const cloudinary = require('cloudinary');


const uploadImage = async(req, res) =>{
    try{
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: 'file is required! Please upload an image!!'
            })
        }

        const {url, publicId} = await uploadToCloudinary(req.file.path);

        const newlyUploadedImage = new Image({
            url, 
            publicId,
            uploadedBy: req.userInfo.userId
        });

        await newlyUploadedImage.save();

        res.status(201).json({
            success:true,
            message: 'Image uploaded successfully!',
            
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong! Please try again!'
        })


    }
};

const fetchImageController = async(req, res) =>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page-1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit);



        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

        if(images){
            res.status(200).json({
                success: true,
                currentPage: page,
                totalPages: totalPages,
                totalImages : totalImages,
                data: images
            })
        };
    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again later!'
        })

    }
};

const deleteImage = async(req, res) =>{
    try{

        const imageToBeDeleted = req.params.id;
        const userId = req.userInfo.userId;
        const image = await Image.findById(imageToBeDeleted);
       

        if(!image){
            return res.status(404).json({
                success: false,
                message: "Image not found! please try again."
            })
        }

        if(image.uploadedBy.toString() !== userId){
            return res.status(403).json({
                success: false,
                message: "You are not authorized user! please try again."
            })
        }

        await cloudinary.uploader.destroy(image.publicId);

        await Image.findByIdAndDelete(imageToBeDeleted);
        res.status(200).json({
            success: true,
            message: "Image deleted successfully!"
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message: "Something went wrong! please try again later."
        })

    }

};


module.exports = {uploadImage, fetchImageController, deleteImage}