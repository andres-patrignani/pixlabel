let img;
let canvas;
let filename;
let totalcols;
let totalrows;
let table;
let zoomCheckbox;
let cursorPosition;
let cursorColorValue;
let cursorColorBackground;
let pixelArrayValue;

function preload(){
    img = loadImage('public/img/cover_crop.jpg');
}


function setup(){
    pixelDensity(1);

    canvasElement = document.getElementById('canvas');
    canvas = createCanvas(canvasElement.offsetWidth,windowHeight*0.7);
    canvas.parent('canvas');
    canvas.mousePressed(getPixelValue);

    pixelArrayElement = document.getElementById('pixelArray');
    pixelArrayValue = parseFloat(pixelArrayElement.value);
    setTableRows(pixelArrayValue);

    pixelArray.addEventListener('change',function(){
        let r;
        if(recordLabel.value == 0){
            r = true;
        } else {
            r = confirm('This action will delete ' + recordLabel.value + ' records');
        }
        if (r == true) {
            pixelArrayValue = parseFloat(pixelArrayElement.value);
            setTableRows(pixelArrayValue);
            recordLabel.value = table.getRowCount();
        }
    })


    btnUpload = createFileInput(gotFile);
    btnUpload.parent('fileInput');
    statusLabel = document.getElementById('statusLabel');
    cursorPosition = document.getElementById('cursorPosition');
    cursorColorValue = document.getElementById('cursorColorValue');
    cursorColorBackground = document.getElementById('cursorColorBackground');
    zoomCheckbox = document.getElementById('zoomCheckbox');
    labelCheckbox = document.getElementById('labelCheckbox');
    labelColorPicker = document.getElementById('labelColorPicker');

    btnClear = document.getElementById('clearTableBtn');

    btnClear.addEventListener('click', function(){
        if(recordLabel.value > 0){
            let r = confirm('Click OK to confirm the deletion of ' + recordLabel.value + ' records.');
            if (r == true) {
                table.clearRows();
                recordLabel.value = table.getRowCount();
                btnClear.disabled = true;
                //location.reload();
            }
        }
    })
    cursor(CROSS)
    pixelLabel = document.getElementById("pixelLabel");
    recordLabel = document.getElementById("recordLabel");
    downloadTableBtn = document.getElementById("downloadTableBtn");
    downloadTableBtn.addEventListener("click", function(){
        saveTable(table,'pixlabel.csv')
    });

    downloadCanvasBtn = document.getElementById("downloadCanvasBtn");
    downloadCanvasBtn.addEventListener("click", function(){
        saveCanvas(canvas,'pixlabel.jpg')
    });

    tickMarkLabel = document.getElementById("tickMarkLabel");
    pixelLabel.addEventListener('keyup', function(){
        setTimeout(function(){ tickMarkLabel.innerHTML = '&#x2713;' }, 1000);
    })

    pixelLabel.addEventListener('keydown', function(){
        tickMarkLabel.innerHTML = ''
    })
    
    loadImageToCanvas(img);
    filename = 'example.jpg';
}

let drawOnce = false;
function draw() {


    let RGBA = get(mouseX, mouseY);
    if(mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height){
        cursorPosition.innerHTML = 'ROW:' + floor(mouseY) + '   ' + 'COL:' + floor(mouseX);
        cursorColorValue.innerHTML = 'R:' + RGBA[0] + '  ' + 'G:' + RGBA[1] + '  ' + 'B:' + RGBA[2] + '  ' + 'A:' + RGBA[3];
        cursorColorBackground.style.backgroundColor =  color(RGBA[0], RGBA[1], RGBA[2], RGBA[3])
    } else {
        cursorPosition.innerHTML = 'ROW:' + '' + '   ' + 'COL:' + '';
        cursorColorValue.innerHTML = 'R:' + '' + '  ' + 'G:' + '' + '  ' + 'B:' + '' + '  ' + 'A:' + '';
        cursorColorBackground.style.backgroundColor =  color(255, 255, 255, 255)
    }
}


function setTableRows(pixels){
    table = new p5.Table();
    table.addColumn('RECORD');
    table.addColumn('FILENAME');
    table.addColumn('LABEL');
    table.addColumn('COL');
    table.addColumn('ROW');
    table.addColumn('TOTALCOLS');
    table.addColumn('TOTALROWS');
    table.addColumn('TIMESTAMP');
    for(let i = 0; i < pixels; i++){
        let colNumber = i + 1;
        table.addColumn('R' + colNumber);
        table.addColumn('G' + colNumber);
        table.addColumn('B' + colNumber);
        //table.addColumn('A'+posPix);
    }
}

function gotFile(file){
    if (file.type === 'image'){
        filename = file.name;
        img = loadImage(file.data,loadImageToCanvas);
    }
}

function loadImageToCanvas(img){
    aspectRatio = img.width / img.height;
    sideSize = floor(canvasElement.offsetWidth);
    canvas.resize(sideSize, floor(sideSize/aspectRatio));
    image(img, 0, 0, canvas.width, canvas.height);
}

function getPixelValue(){

    let posX;
    let posY;
    if(pixelArrayValue === 49.0){
        posX = [-3, -2, -1, 0, 1, 2, 3, -3, -2, -1, 0, 1, 2, 3, -3, -2, -1, 0, 1, 2, 3, -3, -2, -1, 0, 1, 2, 3, -3, -2, -1, 0, 1, 2, 3, -3, -2, -1, 0, 1, 2, 3, -3, -2, -1, 0, 1, 2, 3];
        posY = [-3, -3, -3, -3, -3, -3, -3, -2, -2, -2, -2, -2, -2, -2, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3];
    }
    else if(pixelArrayValue === 25.0){
        posX = [-2, -1, 0, 1, 2, -2, -1, 0, 1, 2, -2, -1, 0, 1, 2, -2, -1, 0, 1, 2, -2, -1, 0, 1, 2];
        posY = [-2, -2, -2, -2, -2, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2];
    }
    else if(pixelArrayValue === 9.0){
        posX = [-1, 0, 1, -1, 0, 1, -1, 0, 1];
        posY = [-1, -1, -1, 0, 0, 0, 1, 1, 1];
    } else if(pixelArrayValue === 1.0){
        posX = [0];
        posY = [0];
    }

    let pointerX = floor(mouseX);
    let pointerY = floor(mouseY);
    
    if(labelCheckbox.checked){
        stroke(labelColorPicker.value)
        strokeWeight(7); 
        point(mouseX, mouseY)
        textSize(20);
        strokeWeight(0.5); 
        rectMode(CORNER);
        fill(labelColorPicker.value);

        if(mouseX+100 > canvasElement.offsetWidth){
            textAlign(RIGHT)
            text(pixelLabel.value, mouseX-7, mouseY+5) 
        } else {
            textAlign(LEFT)
            text(pixelLabel.value, mouseX+7, mouseY+5) 
        }
    }
   

    let timestamp = new Date();
    let newRow = table.addRow();
    newRow.set('FILENAME', filename)
    newRow.set('LABEL', pixelLabel.value)
    newRow.set('COL', pointerX);
    newRow.set('ROW', pointerY);
    newRow.set('TOTALROWS', canvas.height);
    newRow.set('TOTALCOLS', canvas.width);
    newRow.set('TIMESTAMP', timestamp.toISOString());

    for(let i = 0; i < pixelArrayValue; i++){
        let colNumber = i + 1;
        let RGBA = get(pointerX + posX[i], pointerY + posY[i])
        newRow.set('R' + colNumber, RGBA[0]);
        newRow.set('G' + colNumber, RGBA[1]);
        newRow.set('B' + colNumber, RGBA[2]);
        //newRow.set('A'+posPix, RGBA[3]);
    }
    
    newRow.set('RECORD', table.getRowCount())
    recordLabel.value = table.getRowCount();
    if(table.getRowCount() === 0){
        btnClear.disabled = true;
    } else {
        btnClear.disabled = false;
    }
    
}