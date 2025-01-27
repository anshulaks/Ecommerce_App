import express from 'express'

import {loginController, registerController, testController ,forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'

const router=express.Router()


router.post('/register', registerController)
router.post('/login', loginController)


router.post('/forgot-password', forgotPasswordController)
router.get('/test', requireSignIn,isAdmin, testController)

//protected  user route auth
router.get("/user-auth", requireSignIn,(req,res) => {
    res.status(200).send({ok: true});
});

//admin auth
router.get("/admin-auth", requireSignIn,isAdmin, (req,res) => {
    res.status(200).send({ok: true});
});

//updateProfile
router.put("/profile", requireSignIn, updateProfileController)

//orders
router.get('/orders', requireSignIn, getOrdersController)

//all orders
router.get('/all-orders', requireSignIn,isAdmin, getAllOrdersController)

//order update status
router.put("/order-status/:orderId" 
    , requireSignIn, isAdmin, orderStatusController)
export default router