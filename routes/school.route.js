import express from 'express';
import { addSchool, listSchools } from '../controllers/school.controller.js';
import { body } from 'express-validator';

const schoolRouter = express.Router();

schoolRouter.post('/addSchool', 
    body('name').notEmpty(),
    body('address').notEmpty(),
    body('latitude').isFloat({ min: -90, max: 90 }),
    body('longitude').isFloat({ min: -180, max: 180 }),
    addSchool
);

schoolRouter.get('/listSchools', listSchools);

export default schoolRouter;