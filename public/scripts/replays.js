let file_selector;

function upload_failed(){
    document.getElementById("file-upload-backdrop").style="animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;"
    setTimeout(()=>{document.getElementById("file-upload-backdrop").style="animation: none;"},400)
}

function handleFile(file){
    document.getElementById("replay-title").innerHTML = file.name;
}

function setState(state){
    if (state == 0){
        document.getElementById("file-upload-input").style="display: default;"
        document.getElementById("file-display").style="display: none;"
    } else if (state == 1){
        document.getElementById("file-upload-input").style="display: none;"
        document.getElementById("file-display").style="display: default;"
        file_drop.style = "height:400px;"
    }
}

function file_uploaded(event=null){
    file = 'dataTransfer' in event ? event.dataTransfer.files : file_selector.files[0];
    if (event){event.preventDefault()}
    try {
        handleFile(file);
        setState(1);
    } catch (err) {
        upload_failed();
    }
}

window.onload = function(){
    file_selector = document.getElementById("file-selector") 
    file_selector.onchange = file_uploaded;
    file_drop = document.getElementById("file-upload-backdrop")
    document.getElementById("upload-tip").innerHTML = 'FileReader' in window ? "choose a file or drag it here" : "choose a file"
    file_drop.ondragover =  file_drop.ondragenter = function(evt){
        evt.preventDefault();evt.stopPropagation();
    }
    file_drop.ondrop = file_uploaded;
}