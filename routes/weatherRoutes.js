import express from 'express';
import { getWeather, navigateWeather, searchWeather, showWeatherDetails } from '../controllers/weatherController.js';

const router = express.Router();

router.get('/', getWeather);
router.post('/search', searchWeather);
router.post('/pagination', navigateWeather);
router.post('/details', showWeatherDetails);

export { router as weatherRoutes };