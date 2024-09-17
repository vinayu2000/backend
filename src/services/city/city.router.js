import express from 'express';
import { CityController } from './city.controller.js';
import { AuthController } from '../auth/auth.controller.js';

const router = express.Router()

router.use(AuthController.validateToken)
router.route('/').post([CityController.createCityHandler])
router.route('/:id').get([CityController.getCityByPincode])

export { router as CityRouterService }