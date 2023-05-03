const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

//router.get('/overview',(req,res)=>{
//  res.status(200).render('overview',{

//      title:'All Tours'
//  })
//})
//router.get('/tour',(req,res)=>{
//  res.status(200).render('tour',{
//      title:'The forest Hiker'
//  })
//})

router.get(
  "/",
  bookingController.createBookingCheckout, 
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get("/tour/:slug", authController.isLoggedIn, viewsController.getTour);
router.get('/signup',viewsController.getSignupForm)
router.get("/login", authController.isLoggedIn, viewsController.getLoginForm);
router.get("/me", authController.protect, viewsController.getAccount);
router.get("/my-tours", authController.protect, viewsController.getMyTours);
router.get('/my-reviews',authController.isLoggedIn,viewsController.getMyReviews)

//router.post('/submit-user-data',authController.protect, viewsController.updateUserData)
/*
router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);
*/
module.exports = router;
