const path = require('path');
const express = require('express');//Set up the express module
const app = express();
const router = express.Router();

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/index.html'));
});

router.get('/leaderboard-gen', function(req, res){
    res.sendFile(__dirname+"/pages/leaderboard-gen/leaderboard.html")
})

app.use("/resources", express.static(path.join(__dirname, 'resources')))
app.use("/pages", express.static(path.join(__dirname, 'pages')))

app.use("/", router)
app.use("/leaderboard-gen", router)
app.use("/replay-editor", router)

let server = app.listen(3000, function(){
    console.log("App server is running on port 3000");
    console.log("to end press Ctrl + C");
});