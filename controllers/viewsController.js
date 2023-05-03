
const Tour = require('../models/tourModel');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');



exports.getOverview=catchAsync( async(req,res)=>{
  //1.Get all tour data from collection
  const tours=await Tour.find()

  //2.Build template

  //3.Render that template using tour data from 1


  res.status(200).render('overview',{
    title:'All Tours',
    tours
  })
})

exports.getTour=catchAsync( async(req,res,next)=>{
  //1.Get data for requested tour, reviews and tour guide
  const tour=await Tour.findOne({slug:req.params.slug}).populate({
    path:'reviews',
    fields:'review rating user'
  })

  if(!tour){
    return next(new AppError('There is no tour with that name',404))
  }

  // Now we have access to user and tour. So now here we can determine
  // if tour is booked or not.

  const booking=await Booking.findOne({user:res.locals.user,tour:tour})
  let commentExist
  if(res.locals.user){
    commentExist=tour.reviews.some(review=>review.user.id===res.locals.user.id)
  }
  let booked
  if(booking){
    booked=true
  }else{
    booked=false
  }





  //2. Build template

  //3 .Render that template using  data from 1
  res.status(200).render('tour',{
    title:`${tour.name} Tour`,
    tour,
    booked,
    commentExist
})
})

exports.getLoginForm=(req,res)=>{
  res.status(200).render('login',{
    title: 'Log into your account'
  })
}

exports.getSignupForm=(req,res)=>{
  res.status(200).render('signup',{
    title:'Sign up, to get started'
  })
}

exports.getAccount=(req,res)=>{
  res.status(200).render('account',{
    title:'Your account'
  })
}


exports.getMyTours=catchAsync( async(req,res,next)=>{
  //Find all bookings
 const bookings= await Booking.find({user:req.user.id})
  //find tours with the returned id
  const tourIds=bookings.map(el=>el.tour) 
  const tours=await Tour.find({_id:{$in:tourIds}})
  console.log(tourIds);
  res.status(200).render('overview',{
    title:'My Tours',
    tours
  })
})

exports.getMyReviews=catchAsync( async(req,res,next)=>{
  //Find all reviews on currently logged in user
  const reviews=await Review.find({user:res.locals.user.id})
  .populate({
    path:'tour',
    select:'name slug'
  })
  console.log(reviews);
  
  

  res.status(200).render('reviews',{
    title:'My reviews',
    reviews,
    toursName:true 
  })
})



exports.updateUserData=catchAsync( async(req,res,next)=>{
  const updatedUser=await User.findByIdAndUpdate(req.user.id,{
    name:req.body.name,
    email:req.body.email
  },{
    new:true,
    runValidators:true
  })
  res.status(200).render('account',{
    title:'Your account',
    user:updatedUser
  })
  
})

exports.confirmEmail=catchAsync(async (req,res,next)=>{
  const email=await User.findOne({email:req.params.email})
  res.status(200).render('verifyEmail',{
    title:'Email verification',
    email
  })
})



 

/*

exports.getTour=(req,res)=>{
  res.status(200).render('tour',{
    title:'All Tours'
})
}
/*
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
*/