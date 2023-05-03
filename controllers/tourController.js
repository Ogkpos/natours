const fs = require("fs");
const { toUSVString } = require("util");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../utils/appError");

const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an Image! please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 3,
  },
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  //console.log(req.files);
  if (!req.files.imageCover || !req.files.images) return next();

  //Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`starter/public/img/tours/${req.body.imageCover}`);

  //Images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`starter/public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );
  console.log(req.body);
  next();
});




//const tours = JSON.parse(
//    fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`)
//  );

//exports.checkID=(req,res,next,val)=>{
//    console.log(`Tour id is: ${val}`);
//    if (req.params.id * 1 > tours.length) {
//        return res.status(404).json({
//          status: "failed",
//          message: "Invalid ID",
//        });
//      }
//      next()
//}

//exports.checkBody=(req,res,next)=>{
//        if(!req.body.name||!req.body.price){
//            return res.status(404).json({
//                status:'fail',
//                message:'Missing name or price'
//            })
//        }
//        next()
//}

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

//exports.getAlltours =catchAsync( async (req, res,next) => {
//
//    //BUILD THE QUERY
//    //1A.FILTERING
//    //const queryObj={...req.query}
//    //const excludedFields=['page','sort','limit','fields']
//    //excludedFields.forEach(el=>delete queryObj[el])
//    // console.log(req.query,queryObj);
//    //const query= Tour.find(queryObj)
//
//    //const tours=await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')
//    //{difficulty:'easy',duration:{$gte:5}}
//    //{ duration: { '$gte': '5' }, difficulty: 'easy' }
//
//    //1B.ADVANCED FILTERING
//    //let queryStr=JSON.stringify(queryObj)
//    //queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
//    // console.log(JSON.parse(queryStr));
//
//    //let query= Tour.find(JSON.parse(queryStr))
//
//    // //2. SORTING
//    // if(req.query.sort){
//    //   const sortBy=req.query.sort.split(',').join(' ')
//    //   //query=query.sort(req.query.sort)
//    //   //console.log(sortBy);
//    //   query=query.sort(sortBy)
//    //   //sort('price ratingsAverage)
//    // }else{
//    //   //query=query.sort('-createdAt')
//    //  //query=query.sort('_id')
//    // }
//
//    // //3.FIELD LIMITING
//    // if(req.query.fields){
//    //   const fields=req.query.fields.split(',').join(' ')
//    //   //query=query.select('name duration price')
//    //   console.log(fields);
//    //   query=query.select(fields)
//    // }else{
//    //   query=query.select('-__v')
//    // }
//
//    ////4.PAGINATION
//    //const page=req.query.page*1||1
//    //const limit=req.query.limit*1||100
//    //const skip=(page-1)*limit
//    //
//    ////query=query.skip(10).limit(100)
//    ////page=3&limit=10 1-10pg1, 11-20pg2, 21-30pg3
//    ////limit=resltsPerPage
//    //query=query.skip(skip).limit(limit)
//
//    //if(req.query.page){
//    //  const numOfTours=await Tour.countDocuments()
//    //  console.log(numOfTours);
//    //  if(skip>=numOfTours)throw new Error('This page does not exist')
//    //}
//
//    //EXECUTE THE QUERY
//    const features = new APIFeatures(Tour.find(), req.query)
//      .filter()
//      .sort()
//      .limitFields()
//      .paginate()
//    const tours = await features.query;
//
//    //SEND RESPONSE
//    res.status(200).json({
//      status: "success",
//      results: tours.length,
//      data: {
//        tours,
//      },
//    });
//  // catch (err) {
//  //  res.status(404).json({
//  //    status: "Fail",
//  //    message: err.message,
//  //  });
//  //}
//});

exports.getAllTours = factory.getAll(Tour);

//exports.getTour =catchAsync( async (req, res,next) => {
//
//    //  const tour = tours.find((el) => el.id === id);
//    //const id = req.params.id *1
//    //Tour.findOne({_id:req.params.id})
//    const tour = await Tour.findById(req.params.id).populate('reviews')
//    //.populate({
//    //  path:'guides',
//    //  select:'-__v'
//    //})
//
//    if(!tour){
//      return next(new AppError('No tour found with that ID',404))
//    }
//
//    res.status(200).json({
//      status: "success",
//      data: {
//        tour,
//      },
//    });
//  // catch (err) {
//  //  res.status(404).json({
//  //    status: "Failed",
//  //    message: err,
//  //  });
//  //}
//});

exports.getTour = factory.getOne(Tour, { path: "reviews" });

//  exports.createTour = (req, res) => {
//    const newId = tours[tours.length - 1].id + 1;
//    const newTour = Object.assign({ id: newId }, req.body);
//    tours.push(newTour);
//    fs.writeFile(
//      `${__dirname}/starter/dev-data/data/tours-simple.json`,
//      JSON.stringify(tours),
//      (err) => {
//        res.status(201).json({
//          status: "success",
//          data: {
//            tour: newTour,
//          },
//        });
//      }
//    );
//  };

//const catchAsync=fn=>{
//  return (req,res,next)=>{
//
//    fn(req,res,next).catch(err=>next(err))
//  }
//}

//exports.createTour =catchAsync( async (req, res,next) => {
//  const newTour = await Tour.create(req.body);
//  res.status(201).json({
//    status: "success",
//    data: {
//      tour: newTour,
//    },
//  });
// // try {
// //   //const newTour=new Tour({})
// //   //newTour.save()
////
// //   const newTour = await Tour.create(req.body);
////
// //   res.status(201).json({
// //     status: "success",
// //     data: {
// //       tour: newTour,
// //     },
// //   });
// // } catch (err) {
// //   res.status(400).json({
// //     status: "Failed",
// //     message: err,
// //   });
// // }
//});
exports.createTour = factory.createOne(Tour);
//exports.UpdateTour =catchAsync( async (req, res,next) => {
//
//    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//      new: true,
//      runValidators: true,
//    });
//
//    if(!tour){
//      return next(new AppError('No tour found with that ID',404))
//    }
//
//    res.status(200).json({
//      status: "success",
//      data: {
//        tour,
//      },
//    });
//  // catch (err) {
//  //  res.status(404).json({
//  //    status: "Failed",
//  //    message: err,
//  //  });
//  //}
//});

exports.updateTour = factory.updateOne(Tour);

//exports.deleteTour =catchAsync( async (req, res,next) => {
//
//    //   if (req.params.id * 1 > tours.length) {
//    //     return res.status(404).json({
//    //       status: "failed",
//    //       message: "Invalid ID",
//    //     });
//    //   }
//    const tour=await Tour.findByIdAndDelete(req.params.id);
//
//    if(!tour){
//      return next(new AppError('No tour found with that ID',404))
//    }
//
//    res.status(204).json({
//      status: "success",
//      data: null,
//    });
//  // catch (err) {
//  //  res.status(404).json({
//  //    status: "Failed",
//  //    message: err,
//  //  });
//  //}
//});

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async function(req, res, next) {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        //_id:'$ratingsAverage',
        numRatings: { $sum: "$ratingsQuantity" },
        numTours: { $sum: 1 },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match:{_id:{$ne:'EASY'}}
    // }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
  // catch (error) {
  //  res.status(404).json({
  //    status: "Failed",
  //    message: error,
  //  });
  //}
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
  // catch (error) {
  //  res.status(404).json({
  //    status: "Failed",
  //    message: error,
  //  });
  //}
});

//41.199838, -99.783713
//tours-within/:distance/center/:latlng/unit/:unit
///tours-within/233/center/41.199838,-99.783713/unit/mi
//tours-within?distance=233&center&latlng=34&unit='mi'

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;
  if (!lat || !lng) {
    return next(
      new AppError(
        "Plese provide latitude and longitude in the format latlng",
        400
      )
    );
  }
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const multiplier = unit === "mi" ? 0.00062137 : 0.001;

  if (!lat || !lng) {
    return next(
      new AppError(
        "Plese provide latitude and longitude in the format latlng",
        400
      )
    );
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      data: distances,
    },
  });
});
