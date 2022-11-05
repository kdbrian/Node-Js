const { ObjectId } = require('bson');
const Product = require('../models/product');
const errorHandler=require('../utils/errorHandler');
const catchAsync = require('../middlewares/catchAsync');
const APIFeatures=require('../utils/apiFeatures');


//create a new product
exports.newProduct= catchAsync( async (req,res,next) =>{

    req.body.user = req.user._id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
});

exports.getProduct= catchAsync(async (req,res,next) => {

    // results per page

    const resPerPage = 4;

    const productCount = await Product.countDocuments();

    //! url?q="search keyword"

    const features = new APIFeatures(Product.find(),req.query).search().filter().paginate(resPerPage)

    const products= await features.query;

    res.status(200).json({
        success:true,
        count:products.length,
        productCount,
        data:{
            products
        }
    });    
}
)

exports.getProductById = catchAsync(async (req,res,next) =>{

    if(! ObjectId.isValid(req.params.id)) return next(new errorHandler("Invalid object id",400));

    const product = await Product.findById(req.params.id);

    if(!product)return next(new errorHandler("Product not found",404));

    res.status(200).json({
        success:true,
        product
    });
})

exports.updateProduct = catchAsync(async (req,res,next) =>{

    if(! ObjectId.isValid(req.params.id)) return next(new errorHandler("Invalid object id",400));

    const product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true, runValidators:true});

    res.status(200).json({
        success:true,
        product
    })
})

exports.deleteProduct = catchAsync(async (req,res,next) =>{

    if(! ObjectId.isValid(req.params.id)) return next(new errorHandler("Invalid object id",400));

    await Product.findByIdAndDelete(req.params.id);


    res.status(204).json({
        success:true,
        message:"Product deleted"
    }) 
})

// ! creating new reviews 
exports.createProductReview = catchAsync( async (req,res,next) =>{

    const {rating, comment, productId}  = req.body

    const review ={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment:String(comment)
    };

    const product = await Product.findById(productId);

    
    //checking if the user has reviewed the product before
    const isReviewed = product.reviews.find(
        r => r.name.toString() === req.user.name.toString()
    );

    if(isReviewed){

        product.reviews.forEach( rvw => {

            
            if(rvw.name.toString() === req.user.name.toString()){

                rvw.comment = String(comment);
                rvw.rating = String(rating);
            }
        });

    }else{

        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;

    }

    product.ratings = product.reviews.reduce((acc,item) => item.rating + acc,0)/product.reviews.length;

    await product.save();
    
    res.status(200).json({
        success:true
    });
})

// ? getting a products reviews
exports.getProductReviews = catchAsync( async (req,res,next) =>{

    const product = await Product.findById(req.query.id);

    if(! product) return next(new errorHandler("Product not found",404));

    res.status(200).json({
        success:true,
        count:product.reviews.length,
        reviews:product.reviews
    })
})

// ? deleting  a products review
exports.deleteProductReview = catchAsync( async (req,res,next) =>{

    let product = await Product.findById(req.query.id);

    if(! product) return next(new errorHandler("Product not found",404));

    const reviews = product.reviews.filter(rvw => 
        rvw.name.toString() !== req.user.name
    )

    let ratings =0;

    if(product.reviews.length > 1)
        ratings = product.reviews.reduce((acc,item) => item.rating + acc,0)/reviews.length;
    else
        ratings = product.reviews[0];

    const numOfReviews = reviews.length;

    product = await Product.findByIdAndUpdate(req.query.id,{reviews,ratings,numOfReviews},{new : true, runValidators:true})
    
    res.status(204).json({
        success:true, 
    })
})