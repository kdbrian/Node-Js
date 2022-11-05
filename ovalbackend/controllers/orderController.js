const Order = require('../models/order');
const Product = require('../models/product');
const catchAsync = require('../middlewares/catchAsync');
const { ObjectID }= require('bson');
const errorHandler = require('../utils/errorHandler');

exports.createOrder= catchAsync( async (req,res,next) =>{


    let order = await Order.create(req.body);

    // console.log(req.user);

    order.user= req.user.id;

    order = await order.save();

    res.status(200).json({
        success:true,
        order
    })
})

// orders/:id
exports.getOrderById= catchAsync( async (req,res,next) =>{

    if(! ObjectID.isValid(req.params.id)) return next(new errorHandler("Invalid Order id",400));

    const order = await Order.findById(req.params.id).populate('user','name email').populate('orderItems.product', 'name')

    if(! order ) return next(new errorHandler("Order not found"));

    res.status(200).json({
        success:true,
        order
    });

});


// /users/orders
exports.getUserOrders= catchAsync( async (req,res,next) =>{

    const orders = await Order.find({user:req.user.id});

    // if(! order ) return next(new errorHandler("Order not found"));

    res.status(200).json({
        success:true,
        count:orders.length,
        orders
    });

});

exports.getOrders = catchAsync( async (req,res,next) =>{

    const orders = await Order.find()

    let totalAmount = 0;

    orders.forEach(order =>
        totalAmount += order.totalPrice   
    );

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    });


});

// ? updating or processng an order
exports.updateOrder = catchAsync( async (req,res,next) =>{

    const order = await Order.findById(req.params.id);

    if(order.orderStatus === 'delivered') return next(new errorHandler("Order already delivered",400));

    order.orderItems.forEach(async it =>{
        await updateStock(it.product,it.quantity);
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now()

    await order.save();

    res.status(200).json({
        success:true,
        order
    })
});

/***
 * Function to update the products in stock
 */
async function updateStock(id,quantity){

    const product = await Product.findById(id);

    product.stock = (product.stock > 0)? product.stock - quantity: product.stock;

    await product.save();
}

// orders/:id
exports.deleteOrder= catchAsync( async (req,res,next) =>{

    if(! ObjectID.isValid(req.params.id)) return next(new errorHandler("Invalid Order id",400));

    const order = await Order.findById(req.params.id).populate('user','name email').populate('orderItems.product', 'name')

    if(! order ) return next(new errorHandler("Order not found"));
    
    await order.remove();

    res.status(204).json({
        success:true
    });

});