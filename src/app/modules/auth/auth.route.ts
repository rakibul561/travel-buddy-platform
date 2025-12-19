
import express from 'express'
import { AuthController } from './auth.controller'
import { authRateLimiter } from '../../middlewares/authRateLimiter'
const router = express.Router()

router.post("/login",authRateLimiter,AuthController.login)
router.post("/logout",AuthController.logout)



export const AuthRoutes = router