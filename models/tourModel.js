const mongoose = require("mongoose");
const slugify=require('slugify')
//const validator=require("validator");
//const Review = require("./reviewModel");
//const { findById } = require("./userModel");
//const User=require("./userModel")


const toursSchema=new mongoose.Schema({ 
    name:{
      type:String,
      required:[true,'A tour must have a name'],
      unique:true,
      trim:true,
      maxLength:[40,'A tour name must have less than or equal 40 characters'],
      minLength:[10,'A tour name must have more than or equal 10 characters'],
     // validate:[validator.isAlpha,'Tour name must only contain characters']
    },
    slug:String,
    duration:{
      type:Number,
      required:[true,'A tour must have a duration']
    },
    maxGroupSize:{
      type:Number,
      required:[true,'A tour must have a group size']
    },
    difficulty:{
      type:String,
      required:[true,'A tour must have a difficulty'],
      enum:{
        values:['easy','medium','difficult'],
        message:'Difficulty is either easy,medium or difficult'
      } 
    },
    ratingsAverage:{
      type:Number,
      default:4.5,
      min:[1,'Rating must be above 1.0'],
      max:[5,'Rating must be below 5.0'],
      set:val=>Math.round(val*10)/10
    },
    ratingsQuantity:{
      type:Number,
      default:0
    },
    price:{
      type:Number,
      required:[true,'A tour must have a price']  
    },
    priceDiscount:{
      type:Number,
      validate:{
        validator:function(val){
          //This only points to current doc on new document creation
          return val<this.price
        },
        message:'Discount price({VALUE})should be below regular price'
      }
    },
    summary:{
      type:String,
      trim:true,
      required:[true,'A tour must have a description']
    },
    description:{
      type:String,
      trim:true
    },
    imageCover:{
      type:String,
      required:[true,'A tour must have a cover image']
    },
    images:[String],
    createdAt:{
      type:Date,
      default:Date.now(), 
      select:false
    },
    startDates:[Date],
    //startDates:[
    //  { 
    //    date:{
    //      type:Date,
    //      required:[true,'A tour must have a group size']
    //    },
    //    participants:{
    //      type:Number,
    //      default:0
    //    },
    //    soldOut:{
    //      type:Boolean,
    //      default:false
    //    }
    //  }
    //],
    secretTour:{
      type:Boolean,
      default:false
    },
    startLocation:{
      type:{
        type:String,
        default:'Point',
        enum:['Point']
      },
      coordinates:[Number],
      address:String,
      description:String
    }, 
    locations:[
      {
        type:{
          type:String,
          default:'Point',
          enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
      }
    ], 
    //guides:Array
    guides:[
      {
        type:mongoose.Schema.ObjectId,
        ref:"User"
      }
    ],
    //Child referencing, we replace this with virtual populate
    //reviews:[
    //  {
    //  type:mongoose.Schema.ObjectId,
    //  ref:'Review'
    //  }
    //]
  },{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
  })

//Read performance with index
//toursSchema.index({price:1})

//Compound index Read performance with index
toursSchema.index({price:1,ratingsAverage:1}) 
toursSchema.index({slug:1})

toursSchema.index({startLocation:'2dsphere'})




toursSchema.virtual('durationWeeks').get(function(){
  return this.duration/7
})

//Virtual populate
toursSchema.virtual('reviews',{
  ref:"Review",
  foreignField:'tour',
  localField:'_id'
})



//Document Middleware:runs before save/create command
toursSchema.pre('save',function(next){
  this.slug=slugify(this.name,{lower:true})
  next()
})

//Embedding
//toursSchema.pre("save",async function(next){
//  const guidesPromises=this.guides.map(async id=>await User.findById(id))
//  this.guides=await Promise.all(guidesPromises)
//})




//toursSchema.pre('save',function(next){
//  console.log('will save document...');
//  next()
//})
//
//toursSchema.post('save',function(doc,next){
//  console.log(doc);
//  next()
//})


//Query Middleware
//toursSchema.pre('find',function(next){
  toursSchema.pre(/^find/,function(next){
  this.find({secretTour:{$ne:true}})
  this.start=Date.now()
  next()
})

toursSchema.pre(/^find/,function(next){
  this.populate({
    path:'guides',
    select:'-__v'
  })
  next()
})



toursSchema.post(/^find/,function(docs,next){
  console.log(`Query took ${Date.now()-this.start} milliseconds!`);

  next()
})


  

//Aggregation Middleware
//toursSchema.pre('aggregate',function(next){
//  this.pipeline().unshift({$match:{secretTour:{$ne:true}}})
//  console.log(this.pipeline());
//  next()
//})
  const Tour=mongoose.model('Tour',toursSchema)

  


module.exports=Tour
