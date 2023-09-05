// const path = require('path');
// const multer = require('multer');
const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const fs = require('fs');

module.exports.connect=function(){
    mongoose.connect("mongodb://localhost:27017/SBSJCET_Admin");
    console.log("database connected");
}

