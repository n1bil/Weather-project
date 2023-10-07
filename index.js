import express from 'express';
import axios from 'axios';
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const API_KEY = "468be9cf8e397711d8bb840fad102c64";
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const cardsPerPage = 12;
let startIndex = 0;
let location = '';

function currentTime() {
    const currentDate = new Date();
    
    const formattedDate = currentDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    
    return formattedDate;
}

const fetchData = async ()=> {
    const response = await axios.get(`${BASE_URL}?q=berlin&units=metric&cnt=${cardsPerPage}&appid=${API_KEY}`);
    return parse(response.data);
}

app.get('/', async (req, res) => {
    try {
        const result = await fetchData();
        res.render('index.ejs', { json: result, startIndex: startIndex, currentDate: currentTime() });
    } catch (error) {
        console.log(error.response.data);
        res.status(500);
    }
});

app.post('/', async (req, res) => {
    const result = await fetchData();
    const list = result.list;
    const action = req.body.action;

    if (action === 'back' && startIndex > 0) {
        startIndex -= 1;
    } else if (action === 'forward' && startIndex + 6 < list.length) {
        startIndex += 1;
    }

    res.redirect('/');
});

app.post('/search', async (req, res) => {
    try {
        location = req.body['location'];
        const response = await axios.get(`${BASE_URL}?q=${location}&units=metric&cnt=${cardsPerPage}&appid=${API_KEY}`);
        const result = parse(response.data);
        res.render('index.ejs', { json: result, startIndex: startIndex, currentDate: currentTime() });
    } catch (error) {
        console.log(error.response.data);
        res.status(500);
    }
})

app.post('/details', async (req, res) => {
    if (location) {
        const response = await axios.get(`${BASE_URL}?q=${location}&units=metric&cnt=${cardsPerPage}&appid=${API_KEY}`);
        const result = parse(response.data);
        const parseDate = parseSun(result);
        const choice = req.body['choice'];

        res.render('index.ejs', { number: choice, json: parseDate, startIndex: startIndex, currentDate: currentTime() } );
    } else {
        const result = await fetchData();
        const parseDate = parseSun(result);
        const choice = req.body['choice'];

        res.render('index.ejs', { number: choice, json: parseDate, startIndex: startIndex, currentDate: currentTime() } );
    }  
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

function parseSun(result) {
    const sunriseDate = new Date(result.city.sunrise * 1000).toLocaleTimeString();
    const sunsetDate = new Date(result.city.sunset * 1000).toLocaleTimeString();

    result.city.sunrise = sunriseDate;
    result.city.sunset = sunsetDate;

    return result;
}

function parse(data) {
    data.list.forEach(element => {
        let parseTemp = element.main.temp.toString().substring(0,2);
        element.main.temp = parseTemp;

        let parseFeelsLike = element.main.feels_like.toString().substring(0,2);
        element.main.feels_like = parseFeelsLike;

        let parseHour = new Date(element.dt_txt).getHours();
        // element.dt_txt = parseHour;

        let parseVisibility = element.visibility / 1000;
        element.visibility = parseVisibility;
    });
    return data;
}


function getRandomCity() {
    const capitals = ["Paris", "London", "Berlin", "Madrid", "Tokyo", "Athens", "Kiev", "Stockholm", "Copenhagen", "Riga", "Vienna"];    
    const randomIndex = Math.floor(Math.random() * capitals.length);
    return capitals[randomIndex];
}

