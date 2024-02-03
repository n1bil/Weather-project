import { getRandomCity, fetchLocationData, parseSun, currentTime } from '../services/weatherService.js';


let startIndex = 0;
let location = getRandomCity();

export async function getWeather(req, res) {
    try {
        const result = await fetchLocationData(location);
        res.render('index.ejs', { json: result, startIndex: startIndex, currentDate: currentTime() });
    } catch (error) {
        if (error.response && error.response.data) {
            console.error(error.response.data);
            res.status(500).send(error.response.data);
        } else {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    }
}

export async function searchWeather(req, res) {
    try {
        location = req.body['location'];
        const result = await fetchLocationData(location);
        res.render('index.ejs', { json: result, startIndex: startIndex, currentDate: currentTime() });
    } catch (error) {
        console.error(error.response.data);
        res.status(500).send(error.response.data);
    }
}

export async function navigateWeather(req, res) {
    const result = await fetchLocationData(location);
    const list = result.list;
    const action = req.body.action;

    if (action === 'back' && startIndex > 0) {
        startIndex -= 1;
    } else if (action === 'forward' && startIndex + 6 < list.length) {
        startIndex += 1;
    }

    res.render('index.ejs', { json: result, startIndex: startIndex, currentDate: currentTime() });
}

export async function showWeatherDetails(req, res) {
    const result = await fetchLocationData(location);

    const parseDate = parseSun(result);
    const choice = req.body['choice'];

    res.render('index.ejs', { number: choice, json: parseDate, startIndex: startIndex, currentDate: currentTime() });
}
