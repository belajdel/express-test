const express=require('express')
require('dotenv').config()

const app = express();

const port=process.env.PORT 
app.use(express.static('public'));
console.log(port)
//default route
app.get('/', (req, res) => {
    res.send("hell world!")
})
app.get('/home', (req, res) => {
    res.send("test")
})


app.listen(port,() => {
    console.log("listening on", port)
}
    )
    