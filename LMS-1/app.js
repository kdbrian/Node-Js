const express=require('express');
const app=express();
const morgan=require('morgan');
const errorHandler=require('./controllers/errorController');

const studentRoutes=require('./routes/students');
const userRoutes=require('./routes/user');
const libraryRoutes=require('./routes/library');

if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

// body parser
app.use(express.json());
app.set('view engine','ejs');

//serving html pages
app.use(express.static('public'));

//content to be used by views
app.use('/css',express.static(__dirname+'public/css'))
app.use('/js',express.static(__dirname+'public/js'))
app.use('/img',express.static(__dirname+'public/img'))

app.get('/',(req,res)=>{
    res.render('index',{org:"Brian Prac"})
})

// routes
app.use('/api/lms/v1/users',userRoutes);
app.use('/api/lms/v1/students',studentRoutes);
app.use('/api/lms/v1/library',libraryRoutes);

//unhandled routes handling
app.all('*',(req,res)=>{
    
    const msg=`Cannot ${req.method} ${req.url}...`

    res.render('404',{msg});
})

//handling errors in the global scope
app.use(errorHandler);
module.exports=app;