//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
mongoose.connect("mongodb://localhost:27017/dailybugleDB", { useNewUrlParser: true, useUnifiedTopology: true });

const blogSchema = new mongoose.Schema({
    heading: {
        type: String,
        required:true
    },
    content: String
});
const BlogList = new mongoose.model('BlogList',blogSchema);

app.get(['/', '/home'], function (req, res) {
    BlogList.find({},function(err,foundItems){
        if(!err){
            res.render('home', { blogPost:foundItems});
        }
    }) 
});

app.get('/about', function (req, res) {
    res.render('about');
})

app.get('/contact', function (req, res) {
    res.render('contact');
})

app.get('/compose', function (req, res) {
    res.render('compose');
})

app.post('/compose', function (req, res) {
    var post = new BlogList({
        heading: req.body.postHeading,
        content: req.body.postContent
    });
    post.save();
    console.log(post);    
    res.redirect('home');
})

app.get("/posts/:topic/:id", function (req, res) {

    const requestedTitle = _.lowerCase(req.params.topic);
    const requestedTitleId = req.params.id
    console.log(requestedTitleId);
    console.log(requestedTitle); 
    BlogList.findOne({_id:requestedTitleId},function(err,foundItems){
        if(!err){
            if(foundItems){
                // console.log(foundItems);                
                res.render('post',{postheader:foundItems.heading,postbody:foundItems.content});
            }else
            console.log('false');
            
        }
    });
});

app.listen(3000, function () {
    console.log('Server Started at port 3000');
});