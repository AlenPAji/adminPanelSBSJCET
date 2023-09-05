
const mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var passport = require("passport");
const LocalStrategy = require('passport-local').Strategy; 


const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,

  password: String,
});

userSchema.plugin(passportLocalMongoose);

const user = mongoose.model("user", userSchema);

passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

function register(userData, request, response1) {
    return new Promise(async (resolve, reject) => {
      user.register(
        { username: userData.admin_id },
        userData.admin_pas,
        function (err, user) {

            if (err) {
                console.log(err);
              } else {

                console.log("successfully created an account");
              
                response1.redirect("/admin");


                // request.login(user, function(err) {
                //   if (!err) {
                //     response1.redirect('/admin/admin-dashboard');
                //   } else {
                //     console.log(err)
                //   }
                // });
              }

        }
      );
    });
 
}




function doLogin(req, res) {
  console.log(req.body.username)
  if (!req.body.username) {
    res.json({ success: false, message: 'Username was not given' });
  } else {
    if (!req.body.password) {
      res.json({ success: false, message: 'Password was not given' });
    } else {
      passport.authenticate('local', function (err, user, info) {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          if (!user) {
            res.json({ success: false, message: 'Username or password incorrect' });
          } else {
            req.login(user, function (err) {
              if (err) {
                res.json({ success: false, message: err });
              } else {

                res.redirect('/admin/admin-dashboard');

              }
            });
          }
        }
      })(req, res);
    }
  }
}




// function register(userData, request, responce) {
//   return new Promise(async (resolve, reject) => {
//     user.register(
//       { username: userData.admin_id },
//       userData.admin_pas,
//       function (err, user) {
//         if (err) {
//           console.log(err);
//           reject(new Error("Error while processing"));
//         } else {
//           passport.authenticate("local")(request, responce, function () {
//             resolve(
//               "SUCCESSFULLY AUTHENTICATED THE USER LOAD THE ADMIN DASH BOARD"
//             );
//             responce.redirect("/admin/admin-dashboard");
//           });
//         }
//       }
//     );

//     // userData.admin_pas = await bcrypt.hash(userData.admin_pas, 10);
//     // const newuser = new user();
//     // newuser.name = userData.admin_id;

//     // newuser.password = userData.admin_pas;

//     // newuser.save();

//     // resolve(newuser);
//   });
// }



module.exports = {
  register,
  doLogin
};
