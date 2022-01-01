//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});
const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);

// ........Request targeting all articles.................
app.route("/articles")
.get(function(req,res){
  Article.find(function(err,foundArticles){
    if(!err){
      res.send(foundArticles);
    }
  });
})
.post(function(req,res){

  const newArticle=new Article({
    title:req.body.title,
    content:req.body.content
  });
   newArticle.save(function(err){
     if(!err){
       res.send("Successfully saved");
     }else{
       console.log(err);
     }
   });
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("successfully deleted");
    }else{
      console.log(err);
    }
  });
});

// .........request targeting a specific atricle............

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      console.log("No matching found");
    }
  });
})
.put(function(req, res){

const articleTitle = req.params.articleTitle;
Article.update(
    {title: articleTitle},
    {$set:{title:req.body.title,content: req.body.content}},
    {overwrite: true},
    function(err){
      if (!err){
        res.send("Successfully updated the content of the selected article.");
      } else {
        console.log(err);
      }
    }
    );
})
.patch(function(req,res){
  Article.update(
    {title:req.params.articleTitle},
    {$set:{title:req.body.title,content: req.body.content}},
    {overwrite: true},
    function(err){
      if (!err){
        res.send("Successfully updated the content of the selected article.");
      } else {
        console.log(err);
      }
    }
  );
})
.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
    function(err){
      if(!err){
        res.send("Successfully Deleted");
      }else{
        res.send(err);
      }
    }
  );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
