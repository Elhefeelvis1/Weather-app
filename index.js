import express from "express";
import ejs from 'ejs';
import axios from "axios";
import { IPinfoWrapper } from "node-ipinfo";
import env from "dotenv";

env.config();
const app = express();
const port = 3000;
const apiKey = process.env.API_KEY;
const ipinfoWrapper = new IPinfoWrapper(process.env.IPINFO_KEY);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", async(req, res) => {
    res.render("index.ejs");
    const ipinfo = await ipinfoWrapper.lookupIp("102.90.103.167");
    console.log(ipinfo.countryCode);
    console.log(req.ip)
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