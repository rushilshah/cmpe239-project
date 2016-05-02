/**
 * Created by cbsejpal on 5/2/2016.
 */

var express = require('express');
var router = express.Router();

var multer = require('multer');

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({ storage : storage}).single('file');
var csv = require("fast-csv");

router.post('/uploadFile', function(req, res) {


    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        }
        console.log("File is uploaded");

        dir.files('./public/uploads/', function(err, files) {
            if (err) throw err;
            //console.log(files);
            //console.log();
            console.log("filename "+ files[0]);
            //var source = files[0].substring( files[0].indexOf('\\')+1,  files[0].indexOf('\\',  files[0].indexOf('\\')+1));

            var stream = fs.createReadStream(".\\"+ files[0]);

            var jsonObject = {};

            jsonObject.source = "";

            jsonObject.data = [];
            var csvStream = csv()
                .on("data", function(data){

                    if(data[3] == "wmc" || ! (data.length > 0)){

                    }
                    else {
                        //wmc-3, dit-4, noc-5, cbo-6, rfc-7, lcom-8, bugs-23

                        var newCluster = {
                            wmc: parseFloat(data[3]),
                            dit: parseFloat(data[4]),
                            noc: parseFloat(data[5]),
                            cbo: parseFloat(data[6]),
                            rfc: parseFloat(data[7]),
                            lcom: parseFloat(data[8]),
                        };

                        jsonObject.data.push(newCluster);
                    }
                })
                .on("end", function(err){
                    //cb(mainData, counter++, length, filename);
                    var length = "" + jsonObject.data.length;
                    fs.unlinkSync(files[0]);
                    res.end(length);
                });

            stream.pipe(csvStream);
        });
    });


});

module.exports = router;