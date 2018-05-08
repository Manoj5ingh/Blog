var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var serveIndex = require('serve-index');
var app = express();

mongoose.connect('mongodb://localhost/mydb');
var PostSchema = mongoose.Schema({
    title : { type:String , required:true},
    body : String,
    tag : { type:String , enum: ['Tech', 'Daily']},
    posted : { type:Date , default:Date.now}
},{collection:'post'});

var LoginSchema = mongoose.Schema({
    userId : { type:String, required:true},
    password : { type:String, required:true},
    userType : { type:String, required:true}
},{collection: 'users'});

var PostModel = mongoose.model("PostModel",PostSchema);
// var LoginModel = mongoose.model("LoginModel",LoginSchema);

app.use(express.static(__dirname + '/public'));
app.use('/ftp', express.static('public/ftp'), serveIndex('public/ftp', {'icons': true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get("/api/getposts",getPosts);
app.post("/api/blogpost",createPost);
app.delete("/api/blogpost/:id",deletePost);
app.get("/api/blogpost/:id",getPostById);
app.put("/api/blogpost/:id",updatePost);


function getPosts(req,res){
    PostModel.find().then(
        function(posts){
            res.json(posts);
        },
        function(err){
            res.sendStatus(400);
        }
    )
}

function createPost(req,res){
    // console.log(req.body);
    PostModel.create(req.body).then(
        function(postObj){
            res.json(200);
        },
        function(error){
            res.sendStatus(400);
        }
    );
    // res.json(req.body);
}

function getPostById(req,res){
    var postId = req.params.id;
    PostModel.findById(postId).then(
        function (post){
            res.json(post);
        },
        function (err){
            res.sendStatus(400);
        }
    );
    
}

function deletePost(req,res){
    var postId = req.params.id;
    PostModel.remove({_id:postId}).then(
        function (status){
            res.sendStatus(200);
        },
        function (){
            res.sendStatus(400);
        }
    );

}

function updatePost(req,res){
    var postId = req.params.id;
    var post = req.body;
    PostModel.update({_id:postId},{
        title : post.title,
        body : post.body
    }).then(
        function (status){
            res.sendStatus(200);
        },
        function (err){
            res.sendStatus(400);
        }
    );
}


app.listen(80);