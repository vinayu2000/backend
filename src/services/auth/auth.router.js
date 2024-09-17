import express from 'express';
import { AuthController } from './auth.controller.js'

const router = express.Router();

router.route('/signup').post([AuthController.createUserHandler])
router.route('/login').post([AuthController.loginHandler])
router.use(AuthController.validateToken)
router.route('/').get([AuthController.getUserByLoggedInUserId])

export { router as AuthRouterService }