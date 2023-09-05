var express = require("express");
var admhelpers = require("../adminHelpers/createacc");
var evthelpers = require("../adminHelpers/forevents");
var passport = require("passport");
var router = express.Router();
const upload = evthelpers.upload;
const fs = require("fs");
var path = require("path");
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("adminValidation", { title: "Express" });
});

router.get("/create-account", function (req, res, next) {
  res.render("adminaccgenerate", { title: "Express" });
});

router.post("/create-account", (req, res) => {
  console.log(req.body);

  admhelpers.register(req.body, req, res);
});

router.post("/", (req, res) => {
  console.log(req.body);
  admhelpers.doLogin(req, res);
});

router.get("/admin-dashboard", function (req, res, next) {
  if (req.isAuthenticated()) {
    evthelpers.findEvents().then((responce) => {
      console.log(responce);
      
      res.render("dash-board", { responce  });
    });
  } else {
    res.redirect("/admin");
  }
});

router.get("/admin-dashboard/add-event", function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render("add-event");
  } else {
    res.redirect("/admin");
  }
});



router.post(
  "/admin-dashboard/add-event",
  upload.single("eventPoster"),

  (req, res) => {
    if (req.isAuthenticated()) {
      var event_details = {
        name: req.body.eventName,
        des: req.body.eventDescription,
        sn: req.body.societyName,
        eD: req.body.eventDate,
        eT: req.body.eventTime,
        evty: req.body.eventType,
        ven: req.body.venue,
      };

      var imgDetails = {
        imgData: fs.readFileSync(req.file.path),
        imgContentType: req.file.mimetype,
      };

      evthelpers.addEvent(event_details, imgDetails);

     

     

      res.redirect("/admin/admin-dashboard")
    } else {
      res.redirect("/admin");
    }
  }
);

router.get("/admin-dashboard/delete/:event", function (req, res, next) {
  if (req.isAuthenticated()) {
    const id=req.params.event;
    evthelpers.removeEvents(id).then((responce)=>{
      console.log(responce.img.imageName);
      const imgnam=responce.img.imageName;
      const parentDirectory = path.resolve(__dirname, '..');
      console.log(parentDirectory);
      
      const imagePath = path.join(parentDirectory, 'public', 'event-posters', imgnam);
      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('File does not exist:', err);
          res.status(404).json({ error: 'File not found' });
        } else {
          // Proceed with deletion
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error('Error deleting the image:', err);
              
            } else {
              console.log('Image deleted successfully');
             
            }
          });
        }
      });
      // Use fs.unlink to delete the image file
    
      res.redirect("/admin/admin-dashboard");
    })
  } else {
    res.redirect("/admin");
  }
});

router.get("/admin-dashboard/update/:event", function (req, res, next) {
  if (req.isAuthenticated()) {
    const id=req.params.event;
    evthelpers.findOnetoUpdate(id).then((responce)=>{
      console.log(responce);
      res.render("update-events",{responce});
    })
   
    

  } else {
    res.redirect("/admin");
  }
});

router.post("/admin-dashboard/update/:event",function(req,res,next){

  if (req.isAuthenticated()) {
  var update_details = {
    name: req.body.eventName,
    des: req.body.eventDescription,
    sn: req.body.societyName,
    eD: req.body.eventDate,
    eT: req.body.eventTime,
    evty: req.body.eventType,
    ven: req.body.venue,
  };
  console.log(update_details)

  evthelpers.updateMethod(req.params.event,update_details).then((responce)=>{
    console.log(responce);
    
  })

  res.redirect("/admin/admin-dashboard")
  //res.redirect("/admin/admin-dashboard");
}
else{
  res.redirect("/admin");
}
})

router.get('/admin-dashboard/log-out', (req, res) => {
  

  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/admin/admin-dashboard');
  })

});
module.exports = router;
