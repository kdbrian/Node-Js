class APIFeatures {

    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }


    filter(){

        const queryObj={...this.queryStr}//destructuring the query object

        const exclude=['page','limit','sort','fields'];

        //removing the excluded fields
        exclude.forEach(el => {
            delete queryObj[el]//deleting elemnt that matches from the query object     
        });


        /**Query with addition parameters e.g{price:{$lte:10}} */
        // typed as ?price[lte]=10

        let queryStr=JSON.stringify(queryObj)

        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(match)=> `$${match}`)//using regex to replace gt with $gte

        // advanced filtering
        // console.log(req.query,JSON.parse(queryStr));
       
        // let query= tourModel.find(JSON.parse(queryStr))//normal way of filtering data

        this.query.find(JSON.parse(queryStr));

        return this;

    }

    sort(){
        // 3.sorting
        
        if(this.queryStr.sort){
            const sortBy=this.queryStr.sort.split(',').join(' ');
            this.query=this.query.sort(sortBy);  //sorts in ascending order preciding (-) sorts in descending i.e sort=-price
        }else{
            //incase the user doesnt specify
            this.query=this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields(){

        // 4.limiting data

        if(this.queryStr.fields){
            const fields=this.queryStr.fields.split(',').join(' ');
            this.query=this.query.select(fields);
        }else{
            this.query=this.query.select('-__v')//exxcluding a field
        }

        return this;
    }

    paginate(){

         // 5.Pagination

         const pageNo= this.queryStr.page * 1 || 1

         const limit= this.queryStr.limit * 1 || 5
 
         const skip=(pageNo - 1)*limit
 
         this.query=this.query.skip(skip).limit(limit);
 
         return this;
    }

}


module.exports= APIFeatures;