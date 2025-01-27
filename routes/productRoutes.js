import express from 'express'
import { createProductController,relatedProductController,getSingleProductController, getProductController, productPhotoController, deleteProductController, updateProductController, productFiltersController, productCountController, productListController, searchProductController, productCategoryController, braintreeTokenController, braintreePaymentController } from '../controllers/productController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import formidable from 'express-formidable'
import braintree from 'braintree'

const router = express.Router()

//routes
router.post('/create-product',
     requireSignIn,
      isAdmin,
       formidable(), 
       createProductController)

//routes
router.put('/update-product/:pid',
    requireSignIn,
     isAdmin,
      formidable(), 
      updateProductController)

//get products

router.get('/get-product', getProductController)

//single product
router.get("/get-product/:slug",getSingleProductController)

//get photo
router.get("/product-photo/:pid",productPhotoController)

//delete prodc
router.delete("/product/:pid",deleteProductController)

//filter product
router.post("/product-filters", productFiltersController);

//prod count
router.get('/product-count', productCountController)

//prod per page
router.get('/product-list/:page', productListController)

//search product
router.get('/search/:keyword',searchProductController)

//similar prod
router.get('/related-product/:pid/:cid', relatedProductController)

router.get('/product-category/:slug', productCategoryController)

//payment routes
//token
router.get('/braintree/token', braintreeTokenController)

//payments
router.post('/braintree/payment', requireSignIn, braintreePaymentController)


export default router