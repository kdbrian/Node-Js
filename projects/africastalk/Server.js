const App = require('./App.js')
const connectDb = require('./utils/connectDb.js')


const dbURI = process.env.DB_URI

const PORT = process.env.PORT || 8080


connectDb(dbURI);


App.listen( PORT, ()=>{

    console.log(`Server started at http://localhost:${PORT}/`);
})