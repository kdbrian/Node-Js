//! function to check if a document account is suspended

/***
 * function to check if a document account is suspended
 * @param {current document}
 * @return {Boolean}
 */
module.exports=(doc)=>{
    return (doc.isActive === true) && (doc.accountSuspended !== true ) ;
}