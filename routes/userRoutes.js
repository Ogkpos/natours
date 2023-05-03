
const express = require("express");



const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const reviewController = require("./../controllers/reviewController");
const viewsController = require("./../controllers/viewsController");
const bookingController = require("./../controllers/bookingController");
const bookingRouter=require('../routes/bookingRoutes')

const router = express.Router();



router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);


router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);


//protects all routes after this middleware 
router.use(authController.protect);
router.patch(
  "/updateMyPassword",
  // authController.protect,
  authController.updatePassword
);

router.get(
  "/me",
  // authController.protect,
  userController.getMe,
  userController.getUser
  );


  
  router.patch("/updateMe", 
  //authController.protect, 
  userController.uploadUserPhoto,
userController.resizeUserPhoto,
userController.updateMe
);
router.delete("/deleteMe",
//authController.protect, 
userController.deleteMe 
);



//Protect and restrict to admin after this middleware
router.use(authController.restrictTo('admin'))

//:id/bookings
//router.route('/:id/bookings')
//.get(bookingController.getAllBookings)
//.post(bookingController.createBooking)
router.use('/:id/bookings',bookingRouter)

router
.route(`/`)
.get(userController.getAllUsers)
.post(userController.createUser);

router
.route(`/:id`)
.get(userController.getUser) 
.patch(userController.updateUser)
.delete(userController.deleteUser);


module.exports = router;

