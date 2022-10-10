let canvas = document.querySelector(".canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let tool = canvas.getContext("2d");

let flag = false;
let pencilWidth = "3";
let pencilColor = "black";
let eraserActive = false;
let eraserSize = 5;
let undoRedoTracker = [];
let track;


//function to implement draw functionality of canvas

canvas.addEventListener("mousedown", (e) => {
    flag = true;
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    socket.emit("beginPath", data);
});

canvas.addEventListener("mouseup", (e) => {

    let stateImgUrl = canvas.toDataURL();
    // console.log(stateImgUrl);

    undoRedoTracker.push(stateImgUrl);
    track = undoRedoTracker.length - 1;

    socket.emit("updateTrackerData",{undoRedoTracker,track});

    flag = false;
    tool.closePath();
});

canvas.addEventListener("mousemove", (e) => {

    if (flag) {
        let data = {
            x: e.clientX,
            y: e.clientY
        }
        socket.emit("drawPath", data);
    }
});

// canvas.addEventListener("mouseout", (e) => {
//     flag = false;
//     tool.closePath();
// });

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}


function drawPath(strokeObj) {

    //if true, means mouse btn is pressed and path will be drawn along the mouse movement

    tool.lineWidth = pencilWidth;
    tool.strokeStyle = pencilColor;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();

}

//erase functionality
let prevColor;
let prevWidth;

eraserElem.addEventListener("click", (e) => {
    eraserActive = !eraserActive;

    if (eraserActive) {
        prevColor = pencilColor;
        prevWidth = pencilWidth;

        pencilColor = "white";
        pencilWidth = eraserSize;
        socket.emit("updatePenColor", pencilColor);
        socket.emit("updatePenWidth", pencilWidth);
    } else {
        pencilColor = prevColor;
        pencilWidth = prevWidth;
        socket.emit("updatePenColor", pencilColor);
        socket.emit("updatePenWidth", pencilWidth);
    }
})


//eraser resizing functionality
let eraserSizeElem = document.getElementById("eraser-slider");

eraserSizeElem.addEventListener("change", (e) => {
    eraserSize = e.target.value;
    if (eraserActive) {
        pencilWidth = eraserSize;
        socket.emit("updatePenWidth", pencilWidth);
    }
})


//download functionality

let downloadBtn = document.getElementById("download");

downloadBtn.addEventListener("click", download);

function download(e) {

    let imgUrl = canvas.toDataURL("image/png", 0.3);

    let a = document.createElement("a");

    a.href = imgUrl;
    a.setAttribute("download", "myNote.png");
    // document.body.appendChild(a);
    a.click();
}

let undo = document.getElementById("undo")
let redo = document.getElementById("redo");

undo.addEventListener("click", (e) => {

    if (track > 0) {
        track--;
        let trackObj = {
            trackValue: track,
            undoRedoTracker
        }

        socket.emit("undo", trackObj);
        // undoRedoAction(trackObj);
    }
})

redo.addEventListener("click", (e) => {

    if (track < undoRedoTracker.length - 1) {
        track++;
        let trackObj = {
            trackValue: track,
            undoRedoTracker
        }

        socket.emit("redo", trackObj);
        // undoRedoAction(trackObj);
    }
})


//Redo Undo fucntionality
function undoRedoAction(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    // console.log(undoRedoTracker);
    // console.log(track);

    let imgUrl = undoRedoTracker[track];
    let image = new Image();

    // console.log(image);

    image.onload = (e) => {
        tool.clearRect(0, 0, canvas.width, canvas.height);
        tool.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    image.src = imgUrl;
}

// ================================================================

//socket event emitters
socket.on("beginPath", (data) => {
    beginPath(data);
});

socket.on("drawPath", (data) => {
    drawPath(data);
})

socket.on("updatePenColor", (data) => {
    pencilColor = data;
})

socket.on("updatePenWidth", data => {
    pencilWidth = data;
})

socket.on("redo", data => {
    undoRedoAction(data);
})

socket.on("undo", data => {
    undoRedoAction(data);
})

socket.on("updateTrackerData",data=>{
    undoRedoTracker=data.undoRedoTracker;
    track=data.track;
    undoRedoAction({trackValue:track, undoRedoTracker});
})