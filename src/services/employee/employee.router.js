import express from 'express';
import { EmployeeController } from './employee.controller.js';
import { AuthController } from '../auth/auth.controller.js';

const router = express.Router();

router.use(AuthController.validateToken)
router.route('/').post([EmployeeController.createEmployeeHandler])
router.route('/:id').get([EmployeeController.getEmployeeDetailsHandler])

export {router as EmployeeRouterService}