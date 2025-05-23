import express from 'express';
import cors from 'cors';
import schoolRouter from './routes/school.route.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', schoolRouter);

app.listen(port, () => {
    console.log(`Server listening to port :${port}`);
});