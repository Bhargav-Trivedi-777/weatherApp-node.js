require('dotenv').config()
const { response } = require("express");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");


app = express(); 
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    // res.sendFile(__dirname + "/index.html");
    res.render("index");
});



app.post("/",function(req,res){
   
const query = req.body.cityName; 
const units = "metric";
const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ process.env.OPEN_WEATHER_API_KEY +"&units="+units;

https.get(url,function(response){
    response.on("data",function(data){
        const weatherData = JSON.parse(data);
        if(weatherData.cod != 200){
            return res.render('failer',{message: weatherData.message});
        }
        if(weatherData.cod == 200)
        {
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imgUrl = "http://openweathermap.org/img/wn/"+ icon + "@2x.png";
            res.write("<h1>The temprature in "+ query +" is "+ temp + " degrees Celcius.<h1>");
            res.write("<p>The Weather Description is "+ description +"</p>");
            res.write("<img src="+ imgUrl +" alter='not found' width='300px' height='300px' />");
            res.send();
        }
    });
});
});

app.listen( process.env.PORT || "3000",function(){
    console.log("Server is running on port 3000");
});