const express = require("express");

const app = express();

const PORT = process.env.PORT || 5000;

const forex_routes = require("./routes/forexRoutes");
const short_routes = require("./routes/shortRoutes");
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use("/api", forex_routes);
app.use("/apii", short_routes);

const start = async () => {
    try{
        app.listen(PORT, () => {
            console.log(`${PORT} Yes I am connected`);
        })
    } catch (error){
        console.log("Error for connection");
    }
};

start();