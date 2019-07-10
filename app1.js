var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');

var path = require("path");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/node-demo");
var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    clgName: String,
    courseName: String
});

var User = mongoose.model("User", nameSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/addname", (req, res) => {
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.send("Name saved to database");
            console.log(req.body.firstName);
        })
        .catch(err => {
            res.status(400).send("Unable to save to database");
        });
    User.find({}, function(err, users){
        //assert.equal(err, null);
        //res.json(users);
        console.log(JSON.stringify(users))
        res.render('history', {users:users});
        console.log(users[1].firstName)
    });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});