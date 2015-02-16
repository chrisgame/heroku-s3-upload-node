var express = require('express');
var http = require('http');
var path = require('path');
var aws = require('aws-sdk');

var app = express();
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('port', process.env.PORT || 5000);
app.use(express.static(path.join(__dirname, 'public')));

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET

app.get('/account', function(req, res){
      res.render('account.html');
});

app.get('/sign_s3', function(req, res){
  aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY, region: 'eu-west-1'});
  var s3 = new aws.S3();
  var s3_params = {
    Bucket: S3_BUCKET,
    Key: req.query.s3_object_name,
    Expires: 60,
    ContentType: req.query.s3_object_type,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3_params, function(err, data){
    if(err){
      console.log(err);
    }
    else{
      var return_data = {
        signed_request: data,
        url: 'https://s3-eu-west-1.amazonaws.com/'+S3_BUCKET+'/'+req.query.s3_object_name
      };
      res.write(JSON.stringify(return_data));
      res.end();
    }
  });
});

app.post('/submit_form', function(req, res){
  username = req.body.username;
  full_name = req.body.full_name;
  avatar_url = req.body.avatar_url;
  console.log('username', username);
  console.log('full name', full_name);
  console.log('avatar_url', avatar_url);
 });

app.listen(app.get('port'));
