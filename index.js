import express from "express";
import ejs from 'ejs';
import axios from "axios";

const app = express();
const port = process.emv.PORT;
const apiKey = "9e2653682c0cd4575d081fb8763a8514"

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.post("/submit", async (req, res) => {
    let city = req.body.city;
    let country = req.body.country;
    try{
        const Geolocate = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=5&appid=${apiKey}`);
        const Location = Geolocate.data;
        // console.log(Location)
        if(Location){
            const Response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${Location[0].lat}&lon=${Location[0].lon}&appid=${apiKey}`)
            let info = Response.data;
            res.render("index.ejs", {
                info: info,
            })
            res.json({info})
        }
    }catch(error){
        console.error("Failed to make request:", error.message);
        // res.render("index.ejs", {
        //   content: error.message,
        // });
      }

})

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
})