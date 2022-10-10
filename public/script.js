
//fetching the functionality container
let funcContElem = document.getElementById("func-div").children;

//pencil click functionality
let pencilElem = document.getElementById("pencil");

pencilElem.addEventListener("click", (e) => {
    let pencilModal = document.getElementById("pencil-modal-cont");
    if (pencilModal.style.display == '') {
        pencilModal.style.display = 'block';
    } else {
        pencilModal.style.display = '';
    }
})


//pencil color selection functionality
let colorBtns = document.querySelectorAll(".color-btn");

colorBtns.forEach(elem => {
    elem.addEventListener("click", (e) => {
        let color = window.getComputedStyle(elem).backgroundColor;

        colorBtns.forEach(btn => {
            if (btn.classList.contains("active")) {
                btn.classList.remove("active");
                btn.style.transform = "scale(1)"
                btn.style.boxShadow = '';
            }
            elem.classList.add("active");
            elem.style.transform = "scale(1.2)";
            elem.style.boxShadow = "0 0 5px";
            pencilColor = color;
            socket.emit("updatePenColor",pencilColor);
        })
    })
})

let pencilSlider = document.getElementById("slider");

pencilSlider.addEventListener("change", (e) => {
    const pencilSizeValue = e.target.value;
    pencilWidth = pencilSizeValue;
    socket.emit("updatePenWidth",pencilWidth);
    // console.log(value);
})


//ham buttonn functionality
let hamIcon = document.getElementById("ham-icon");

hamIcon.addEventListener("click", (e) => {
    let icon = hamIcon;

    let funcCont = document.getElementById("func-div");

    if (icon.classList.contains("fa-bars")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
        funcCont.style.display = "flex";
    } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
        funcCont.style.display = 'none';
    }
})

//implementing eraser click functionality
let eraserElem = document.getElementById("eraser");

eraserElem.addEventListener("click", (e) => {
    let eraserModalCont = document.querySelector(".eraser-cont");

    if (eraserModalCont.style.display == '') {
        eraserModalCont.style.display = 'flex';
    } else {
        eraserModalCont.style.display = '';
    }
})



//Upload functionality

let upload = document.getElementById("upload");

upload.addEventListener("click", (e) => {
    let uploadInputElem = document.createElement('input');
    uploadInputElem.setAttribute("type", "file");
    uploadInputElem.click();

    uploadInputElem.addEventListener("change", (e) => {
        let uploadedNote = uploadInputElem.files[0];

        console.log(uploadedNote);
        let uploadedNoteUrl = URL.createObjectURL(uploadedNote);

        console.log(uploadedNoteUrl);

        let noteTemplate = `<div class="sticky-head-cont">
            <button class="note-btn mini" title="minimize"></button>
            <button class="note-btn close" title="close"></button>
        </div>

        <div class="sticky-note-cont">
            <img src=${uploadedNoteUrl} class="sticky-textarea">
        </div>`

        makeStickyNote(noteTemplate);
    })
})

//general sticky note template
let stickyNoteTemp = `<div class="sticky-head-cont">
        <button class="note-btn mini" title="minimize"></button>
        <button class="note-btn close" title="close"></button>
    </div>

    <div class="sticky-note-cont">
        <textarea name="sticky-note" class="sticky-textarea" ></textarea>
    </div>`

//sticky note functionality
let stickyNoteIcon = document.getElementById("sticky-note-icon");
stickyNoteIcon.addEventListener("click", (e) => {
    makeStickyNote(stickyNoteTemp);
});

//function to make new sticky note
function makeStickyNote(noteTemplate) {

    let stickyNoteDiv = document.createElement("div");
    stickyNoteDiv.className = "sticky-cont";

    stickyNoteDiv.innerHTML = noteTemplate;

    document.body.appendChild(stickyNoteDiv);

    console.log(stickyNoteDiv);

    let minimize = stickyNoteDiv.querySelector(".mini")
    let close = stickyNoteDiv.querySelector(".close");

    handleAction(minimize, close, stickyNoteDiv);

    stickyNoteDiv.addEventListener("mousedown", (e) => {
        dragAndDrop(stickyNoteDiv, e);
    });

    stickyNoteDiv.ondragstart = function () {
        return false;
    }
}

//drag and drop functionality
function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the element on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the element, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}

//sticky note minimize and remove functionality
function handleAction(minimize, close, element) {

    // let minimize=document.getElementById(`mini-${id}`);
    // let close=document.getElementById(`close-${id}`);

    close.addEventListener("click", (e) => {
        element.remove();
    })

    minimize.addEventListener("click", (e) => {
        let textCont = element.querySelector(".sticky-note-cont");

        console.log(textCont);

        let displayStyle = window.getComputedStyle(textCont).display;

        if (displayStyle == 'block') {
            textCont.style.display = 'none'
        } else {
            textCont.style.display = 'block';
        }
    })
}