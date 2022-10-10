/**
 * Function that catches errors in async functions
 * @param {* async function} fn 
 * @returns {* catches an error during execution of the function}
 */
module.exports=(fn)=>{
    return ((req,res,next)=>{
        fn(req,res,next).catch(err=>next(err));
    })
}