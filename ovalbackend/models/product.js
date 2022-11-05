const mongoose=require('mongoose');

const productSchema = mongoose.Schema({

    name:{
        type:String,
        required:[true,'please enter a product name'],
        trim:true,
        maxLength:[100, 'product name cannot exceed 100 chars']
    },

    price:{
        type:Number,
        required:[true,'please enter a product name'],
        maxLength:[5, 'product name cannot exceed 5 chars'],
        default:0.0
    },

    description:{
        type:String,
        required:[true,'please enter a product description']    
    },

    ratings:{
        type:Number,
        default:0
    },

    //will be using cloudinary
    //!the product images from 3rd party server
    images:[
        {
            public_id:{
                type:String,
                required:[true,'a image reference id is required']
            },

            url:{
                type:String,
                required:[true,'a image reference id is required']
            }
            
        }
    ],

    category:{
        type:String,
        required:[true,'please categorise the product'],
        enum:{
            values:[
                'Electronics',
                'Accessories',
                'Cameras',
                'Headphones',
                'Laptop',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],

            message:'Please select correct category for the product'
        }
    },

    stock:{
        type:Number,
        required:[true,'please enter the amount in stock'],
        maxLength:[5,'Product cannot exceed 5'],
        default:0
    },

    numOfReviews:{
        type:Number,
        default:0
    },

    reviews:[
        {
            name:{
                type:String,
                required:true
            },

            rating:{
                type:Number,
                required:true
            },

            comment:{
                type:String,
                required:true
            }
        }
    ],

    //? the user who created the product
    user:{
        type:mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
    },
    
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('Product',productSchema);