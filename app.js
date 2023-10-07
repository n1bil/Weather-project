import express from 'express';
import bodyParser from 'body-parser';
import { weatherRoutes } from './routes/weatherRoutes.js';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/', weatherRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
