const path = require('path');
const multer = require('multer');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var x = ''
const extractFileName = (file) => {
  
  x=Date.now() + path.extname(file.originalname);
  return x;
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/event-posters');
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, extractFileName(file));
  }
});

const upload = multer({ storage: storage });

const eventSchema = new Schema({
 eventName: String,
 eventDescription:String,
 societyName: String,
 eventDate:String,
 eventTime:String,
 eventType:String,
 venue:String,
  img: {
    data: Buffer,
    contentType: String,
    imageName:String
  }
});

const event = mongoose.model('event', eventSchema);

function addEvent(datas,imgDatas){
    console.log(x);
    const newEvent = new event();
    newEvent.eventName = datas.name;
    newEvent.eventDescription = datas.des;
    newEvent.societyName = datas.sn;
    newEvent.eventDate = datas.eD;
    newEvent.eventTime = datas.eT;
    newEvent.eventType = datas.evty;
    newEvent.venue = datas.ven;


  
    newEvent.img.data = imgDatas.imgData;
    newEvent.img.contentType = imgDatas.imgContentType; 
    newEvent.img.imageName = x;
    newEvent.save();
    console.log("Insertion Successfull");
  
  }

  function findEvents() {
    return new Promise(async (resolve, reject) => {
        try {
            // Use an object to specify the projection fields (include or exclude)
            const all = await event.find({}, {
                eventName: 1,
                eventDescription: 1,
                societyName: 1,
                eventDate: 1,
                eventTime: 1,
                eventType: 1,
                venue: 1,
                'img.imageName': 1,
                _id: 1 // Exclude _id field if you don't need it
            }).lean();

            resolve(all);
        } catch (err) {
            reject(err);
        }
    });
}

function findOnetoUpdate(element_id){
  return new Promise(async(resolve,reject)=>{
    try{
      const x = await event
        .findById(element_id)
        .select({
          eventName: 1,
          eventDescription: 1,
          societyName: 1,
          eventDate: 1,
          eventTime: 1,
          eventType: 1,
          venue: 1,
          _id: 1,
          
        })
        .exec();

      resolve(x);

    }
    catch(err){
      reject(err);
    }
  })
}

function removeEvents(documentIdToDelete) {
  return new Promise(async (resolve, reject) => {
   try{
    const p=await event.findById({ _id: documentIdToDelete }); 
    product = await event.deleteOne({ _id: documentIdToDelete });
    
    resolve(p)

   }
   catch(err){
    reject(err);

   }
  });
}

function updateMethod(element_id,data){
  return new Promise(async(resolve,reject)=>{
    
    try{
      const updateFields={
        eventName : data.name,
        eventDescription : data.des,
        societyName : data.sn,
        eventDate : data.eD,
        eventTime : data.eT,
        eventType : data.evty,
        venue : data.ven
      }
      const updatedevent = await event.findByIdAndUpdate(element_id, updateFields, { new: true });
      resolve(updatedevent);
    }
    catch(err){
      reject(err);
    }

  })
}



  module.exports = {
    upload,
    addEvent,
    event,
    findEvents,
    removeEvents,
    findOnetoUpdate,updateMethod
    
}
    

