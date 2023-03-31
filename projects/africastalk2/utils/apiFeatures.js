class APIFeatures {

    constructor(query,queryString){

        this.query=query;
        this.queryString=queryString;
    }

    search(){

        //the search keyword (q)
        const keyWD = this.queryString.q ? {

            name:{
                $regex: this.queryString.q,

                //to indicate that it is case insensitive
                $options: 'i'
            }

        } : {}


        this.query = this.query.find({...keyWD});

        return this;
    }


    filter(){

        //creating a copy of the query string
        const queryCopy = {...this.queryString };

        // console.log(queryCopy);

        //? removing fields from the query which will not be used in the filtering
        const removeFields = ['q','limit','page'];

        //remove the fields from the query str
        removeFields.forEach( el => delete queryCopy[el]);

        // console.log(queryCopy);

        // ! advance filter for price and ratings

        let queryStr = JSON.stringify(queryCopy);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        this.query=this.query.find(JSON.parse(queryStr));

        return this;

    }


    paginate(resPerPage){

        const currentPage = Number(this.queryString.page) || 1 ;

        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);

        return this;

    }
}

module.exports = APIFeatures;