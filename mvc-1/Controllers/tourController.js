const fs=require('fs');
const tourModel=require(`./../models/tour.js`);
const APIFeatures=require('./../utils/apiFeatures');
const catchAsync=require('./../utils/catchAsync');
const appError=require('./../utils/appError');
const validator=require('validator');
//hadling all user functions

exports.createTour= catchAsync( async (req,res,next)=>{ //asynchronous function

   const newTour=await tourModel.create(req.body)
    
    res.status(200).json({
        message:"Created tour successfully",
        status:"success",
        data:{
            tour:newTour
        }
    });
})

exports.aliasTopFiveTours=(req,res,next)=>{

    req.query.limit='5';
    req.query.sort='-ratings,price'
    req.query.fields='name,summary,price,difficulty,ratings'

    next();
}


exports.getTours= catchAsync (async (req,res,next)=>{
    // .paginate()
     const features=new APIFeatures(tourModel.find(),req.query).filter().sort().limitFields();
    
    const result=await features.query;

        //SENDING RESPONSE
        res.status(200).json({
            status:"Success",
            records:result.length,
            data:{
                result
            }
        }); 
})

exports.getTourById=catchAsync(async (req,res,next)=>{
    const result= await tourModel.findById(req.params.id);

    if(!result){ // if the result is a null

        return next(new appError('No tour found with the id',404));
    }
 
         res.status(200).json({
             status:"Success",
             data:{
                 result
             }
         }); 
     
})


exports.updateTour=catchAsync(async (req,res,next)=>{

    const result=await tourModel.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators:true//used to make sure the updates align with the schema
        })

        if(!result){ // if the result is a null

            return next(new appError('No tour found with the id',404));
        }
        res.status(200).json({
            status:"Success",
            data:{
                result
            }
        });
})

exports.deleteTour=catchAsync(async (req,res,next)=>{
    
        const result=await tourModel.findByIdAndDelete(req.params.id)

        if(!result){ // if the result is a null

            return next(new appError('No tour found with the id',404));
        }

        res.status(204).json({
            status:"Success"
        });
        
})

exports.getTourStats=catchAsync( async (req,res,next)=>{

    const stats=await tourModel.aggregate([//contains an array of stages objects e.g $match,$group,$sort
            {
                $match:{
                    ratings:{$gte:4.5}
                }
            },{

                $group:{
                    /**Used when getting statistics about the data and grouping */
                    _id:{ $toUpper :'$difficulty'},
                    totalRatings:{$sum: '$ratingsQuantity' },
                    numTours:{$sum: 1},
                    avgRating:{$avg: '$ratings' } ,
                    avgPrice:{$avg: '$price' },
                    minPrice:{$min: '$price'},
                    maxPrice:{$max: '$price'}
                }
            },{
                $sort:{
                    //only use fields in the group
                    avgPrice: -1
                }
            }
        ])


        res.status(200).json({
            status:"Success",
            data:{
                stats
            }
        })
})


//
/**function to calculate the busiest month in a year
 * In terms of No. Tours in a month
 * return the month
 * the name of the tours in an array
 */

exports.getMonthlyPlan= catchAsync(async (req,res,next)=>{

    const year=req.params.year*1;

        const plan= await tourModel.aggregate([
            {
                // get the dates
                $unwind: '$startDates'
            },
            {
                // match dates in specified range
                $match:{ startDates:{
                    // date format yyyy-mm-dd
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)

                   }
               }
            },
            {

                //group according to month
            $group:{
                        _id:{$month: '$startDates'},//what we use to group
                        numTours: {$sum : 1},
                        tours:{$push: '$name'}//creates an arrays of all the tours in  that month
                    }
                },
            {
                $addFields:{
                    //adds a field
                    month: '$_id'
                }

            },

            {
                $project:{ // makes a field either visible(1) or invisible(0)
                        _id:0
                }
            },

            {
                $sort:{
                    numTours: -1    
                }
            }
            
        ]);

        res.status(200).json({
            status:"Success",
            data:{
                plan
            }
        })

})

