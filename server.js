const express = require('express');//Set up the express module
const app = express();
const router = express.Router();

router.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '/index.html'));
});

router.get('/leaderboard-gen', function(req, res){
    res.sendFile(__dirname+"/public/pages/leaderboard-gen.html")
})

router.get('/replay-editor', function(req, res){
    res.sendFile(__dirname+"/public/pages/replay-editor.html")
})


app.use(express.static("public"));
app.use("/", router)
app.use("/leaderboard-gen", router)
app.use("/replay-editor", router)

app.use(function(req, res, next) {
    res.status(404);
    res.sendFile(__dirname + '/public/pages/404.html');
});

let server = app.listen(3000, function(){
    console.log("App server is running on port 3000");
    console.log("to end press Ctrl + C");
});