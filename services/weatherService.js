import axios from 'axios';

const API_KEY = "468be9cf8e397711d8bb840fad102c64";
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

export async function fetchLocationData(location) {
    try {
        const response = await axios.get(`${BASE_URL}?q=${location}&units=metric&cnt=12&appid=${API_KEY}`);
        return parse(response.data);
    } catch (error) {
        console.error(error.response.data);
        throw error;
    }
}

export function parseSun(result) {
    const sunriseDate = new Date(result.city.sunrise * 1000).toLocaleTimeString();
    const sunsetDate = new Date(result.city.sunset * 1000).toLocaleTimeString();

    result.city.sunrise = sunriseDate;
    result.city.sunset = sunsetDate;

    return result;
}

function parse(data) {
    data.list.forEach(element => {
        let parseTemp = element.main.temp.toString().substring(0, 2);
        element.main.temp = parseTemp;

        let parseFeelsLike = element.main.feels_like.toString().substring(0, 2);
        element.main.feels_like = parseFeelsLike;

        let parseVisibility = element.visibility / 1000;
        element.visibility = parseVisibility;
    });
    return data;
}

export function currentTime() {
    const currentDate = new Date();
    
    const formattedDate = currentDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    
    return formattedDate;
}

export function getRandomCity() {
    const capitals = ["Paris", "London", "Berlin", "Madrid", "Tokyo", "Athens", "Kiev", "Stockholm", "Copenhagen", "Riga", "Vienna"];    
    const randomIndex = Math.floor(Math.random() * capitals.length);
    return capitals[randomIndex];
}