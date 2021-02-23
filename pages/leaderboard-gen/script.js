var canvas, ctx;
var characters = ["zetterburn","orcane","forsburn","etalus","ori","clairen","elliana","wrastor","kragg","maypul","absa","ranno","sylvanos","shovel knight"]
var charicons, charicons2, backdrop;
var font_colors =  [
    ["rgba(0,0,0,0)","rgba(0,0,0,255)","rgba(255,255,255,255)"], // Default font color set
    ["rgba(0,0,0,0)","rgba(0,0,0,255)","rgba(255,187,49)"], // Rank increase color set
    ["rgba(0, 0, 0, 0)","rgba(0,0,0,255)","rgba(255,153,102,255)"], // Rank decrease color set
    ["rgba(0, 0, 0, 0)","rgba(0,0,0,255)","rgba(200,200,200,255)"] // Rank new color set
]

function script_onLoaded(){
    canvas = document.getElementById("leaderboard")
    if (canvas.getContext){
        ctx = canvas.getContext("2d");
        {
            backdrop = new Image();
            backdrop.onload = function () {
                ctx.drawImage(backdrop, 0, 0);
            };
            backdrop.src = "/pages/leaderboard-gen/template.png"
        }
    }
    charicons = new Image();
    charicons.src = "https://raw.githubusercontent.com/benwang2/RoA-Ranking-Generator/main/assets/charicons.png"
    charicons2 = new Image();
    charicons2.src = "https://raw.githubusercontent.com/benwang2/RoA-Ranking-Generator/main/assets/charicons2.png"
}

var cmatrix = {}
{
    fetch('https://raw.githubusercontent.com/benwang2/pr-generator/main/assets/cmatrix.csv')
    .then(response => response.text())
    .then(data => {
        temp = data.split("\n");
        while (temp.length > 0){
            let cdata = temp[0].split(",");
            pixels = []
            char = cdata.shift()
            let [width, height] = [cdata.shift(), cdata.shift()]
            for (let x = 0; x < width; x++){
                pixels[x] = []
                for (let y = 0; y < height; y++){
                    pixels[x][y] = cdata.shift()
                }
            }
            cmatrix[char] = pixels
            temp.shift()
        }
        console.log("Font matrix loaded")
    });
}

function cleanText(text){
    text = text.toUpperCase()
    for (let i = 0; i < text.length; i++){
        if (cmatrix[text.charAt(i)] == undefined){
            text = text.replace(text.charAt(i),"")
        }
    }
    return text
}

function drawCharacter(x, y, char, colors=font_colors[0]){
    let cdata = cmatrix[char]
    for (let col = 0; col < cmatrix[char].length; col++){
        for (let row = 0; row < cmatrix[char][0].length; row++){
            ctx.fillStyle = cdata[col][row] == 0 ? colors[0] : (cdata[col][row] == 1 ? colors[1] : colors[2])
            ctx.fillRect(x+(col*4), y+(row*4), 4, 4)
        }
    }
    return char != " " ? 4*(cmatrix[char].length-1) : 8
}

function getWidthOfText(text){
    text = cleanText(text);
    let bounds = 0;
    for (let i = 0; i < text.length; i++){
        let char = text[i]
        bounds += char != " " ? (cmatrix[char].length-1)*4 : 8
    }
    return bounds+4
}

function writeText(x, y, text, colors=font_colors[0]){
    text = cleanText(text);
    let offset = 0;
    for (let i = 0; i < text.length; i++){
        let char = text[i]
        offset += drawCharacter(x+offset, y, char, colors=colors);
    }
}

function setLeaderboardTitle(text){
    writeText(166, 27, text);
}

function setCellNameText(cell, text){
    writeText(166, 75+(48 * cell), text);
}

function setCellMain(cell, main){
    main = main.toLowerCase()
    if (characters.includes(main)){
        let index = characters.indexOf(main);
        let offset = index*36;
        ctx.drawImage(charicons, 0, offset+1, 92, 35, 658, 79+(48*cell), 92, 36)
    }
}

function setCellSecondary(cell, main){
    main = main.toLowerCase()
    if (characters.includes(main)){
        let index = characters.indexOf(main);
        let offset = index*36;
        ctx.drawImage(charicons2, 0, offset+1, 92, 35, 762, 79+(48*cell), 92, 36);
    }
}

function setCellRankDelta(cell, change, delta){
    colors = (change == "+" ? font_colors[1] : change == "-" ? font_colors[2] : font_colors[3]);
    if (delta == 0 && change != "new"){colors = font_colors[0]}
    let text = (change == "+" ? "+ "+delta : change == "-" ? "- "+delta : "new")
    text = delta == 0 && change != "new" ? "- -" : text
    writeText(999-getWidthOfText(text), 75+48*cell, text, colors=colors)
}

function generateLeaderboard(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backdrop, 0, 0);
    let rows = document.getElementsByClassName("row-base")
    setLeaderboardTitle(document.getElementById("pr-title").value)
    if (rows.length > 1){ // we just need to ignore the first row since it's a template
        for (let i = 1; i < rows.length; i++){
            setCellNameText(i-1, document.getElementById("row-name-"+i).value)
            let main = document.getElementById("row-main-"+i)
            setCellMain(i-1, main.options[main.selectedIndex].value)
            let secondary = document.getElementById("row-secondary-"+i) 
            setCellSecondary(i-1, secondary.options[secondary.selectedIndex].value)
            let change = document.getElementById("row-rank-sign-"+i)
            change = change.options[change.selectedIndex].text
            let delta = document.getElementById("row-rank-delta-"+i).value
            setCellRankDelta(i-1, change, delta)
        }
    }
}
