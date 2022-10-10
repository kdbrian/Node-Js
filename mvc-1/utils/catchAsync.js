module.exports=fn=>{
    return ((req,res,next)=>{
        fn(req,res,next).catch(err=>next(err))
    });//returning a function
}
