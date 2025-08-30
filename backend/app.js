import express from 'express';
import connectDB from './src/config/mongo.config.js';
import cors from 'cors';
import dotenv from 'dotenv';

import cookieParser from "cookie-parser";
import child_routes from './src/routes/child.route.js';
import parent_routes from './src/routes/parent.route.js';

const app = express();
const PORT= 5000;

dotenv.config("./.env");
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();


app.use('/api/child', child_routes);
app.use('/api/parent', parent_routes);




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
