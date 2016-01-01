var width, height, canvas, context;
var state;
var uiShown;
var rowSpacing, colSpacing

var gridEnabled = 0;
var gridColumns = 100;
var gridRows 	= 60;
var speed 		= 100; //change to slider
var grid 		= new Array();
var nextState	= new Array();

function Cell(alive){
	this.alive 	= alive;
}

$(document).ready(function() {	
	width  		= $(window).width();
    height 		= $(window).height();
	canvas 		= $("#c")[0];
	$("#c").attr({width:width,height:height})
	context 	= canvas.getContext('2d');
	
	grid 		= createGrid(gridRows, gridColumns);
	uiShown 	= true;
	state   	= 0;
	
	$("#hidebutton").click(function() {
		if(uiShown){
			$("#ui").animate({ left: '-100px', opacity: 0.3}, 500 );
			uiShown = false;
		} else {
			$("#ui").animate({ left: '0%', opacity: 1.0}, 500 );
			uiShown = true;
		}
	});
	
	$("#templates-min").click(function() {
		$("#templates-min").css("visibility","hidden");
		$("#templates-max").css("visibility","visible");
	});
	
	$("#templates-max").click(function() {
		$("#templates-max").css("visibility","hidden");
		$("#templates-min").css("visibility","visible");
	});

	canvas.addEventListener("mousedown", getClickPos, false);
	
	$('#gridOn').prop('checked', false);
	$('input:checkbox').change( function() {
		if($(this).is(":checked")){	gridEnabled = 1; }
		else { 						gridEnabled = 0; }
		draw();
    });
	
	draw();
});

function draw(){
	colSpacing = Math.ceil(width/gridColumns);
	rowSpacing = Math.ceil(height/gridRows);
	
	//Clear
	context.clearRect(0, 0, width, height);
  
	//Draw grid
	if(gridEnabled){
		for(var i = 0; i < gridColumns; i++){
			context.beginPath();
			context.moveTo((colSpacing * (i+1)), 0);
			context.lineTo((colSpacing * (i+1)), height);
			context.stroke();
		}
		

		for(var i = 0; i < gridRows; i++){
			context.beginPath();
			context.moveTo(0, (rowSpacing * (i+1)));
			context.lineTo(width, (rowSpacing * (i+1)));
			context.stroke();
		}
	}
	
	//Draw cells
	for(var i = 0; i < gridColumns; i++){
		for(var j = 0; j < gridRows; j++){
			if(grid[j][i].alive == 1){
				context.fillRect( colSpacing * i, rowSpacing * j, colSpacing, rowSpacing);
			}
		}
	}
}

function start(){
	if(state !== 1){
		state = 1;
		console.log(speed);
		var interval = 1000 - speed;
		$("#startbutton").css("background-color", "#55AA55");
		setInterval(function mainLoop() { if(state == 1){stepLogic();} }, interval);
	}
}

function stop(){
	$("#startbutton").css("background-color", "#000000");
	state = 0;
}

function stepLogic(){
	
	nextState = new Array();
	nextState 	= createGrid(gridRows, gridColumns);
	
	for(var r = 0; r < gridRows; r++){
		for(var c = 0; c < gridColumns; c++){	
			checkRules(r, c);
		}
	}
	
	updateCells();
	draw();
}

function checkRules(r, c){
	var numAliveSurrounding = 0;
	nextState[r][c].alive = 0;
	
	for(var i = -1; i < 2; i++){
		for(var j = -1; j < 2; j++){
			if(r + i >= 0 && r + i < grid.length){
				if(c + j >= 0 && c + j < gridColumns){
					if(i == 0 && j == 0){} else {
						if(grid[(r+i)][(c+j)].alive == 1){
							numAliveSurrounding += 1;
						}
					}
				}
			}
		}
	}
			
	if(grid[r][c].alive === 0){
		if(numAliveSurrounding === 3){
			nextState[r][c].alive = 1;
		} else {
			nextState[r][c].alive = 0;
		}
	} else {
		if(numAliveSurrounding === 2 || numAliveSurrounding === 3){
			nextState[r][c].alive = 1;
		} else {
			nextState[r][c].alive = 0;
		}
	}
}

function updateCells(){
	grid = new Array();
	grid = nextState;
	draw();
}

function createGrid(r, c){
	var ar = new Array();
	
	for(var i = 0; i < r; i++){
		ar[i] = new Array();
		
		for(var j = 0; j < c; j++){
			ar[i][j] = new Cell(0);
			ar[i][j].alive = 0;
		}
	}
	
	return ar;
}

function changeRows(){
	gridRows = $("#gRows").val();
	grid = new Array();
	grid = createGrid(gridRows, gridColumns);
	nextState = createGrid(gridRows, gridColumns);
	draw();
}

function changeCols(){
	gridColumns = $("#gCols").val();
	grid = new Array();
	grid = createGrid(gridRows, gridColumns);
	nextState = createGrid(gridRows, gridColumns);
	draw();
}

function changeSpeed(){
	if($("#speed").val() > 999){
		speed = 999;
		$("#speed").val("999");
	} else {
		speed = $("#speed").val();
	}
}

function killCell(r, c){
	grid[r][c].alive = 0;
}

function createCell(r, c){
	grid[r][c].alive = 1;
}

function getClickPos(event){
	var x;
	var y;
	
	if(event.x != undefined && event.y != undefined){
		x = event.x;
		y = event.y;
	} else {
		x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	
	x = Math.ceil(x/colSpacing) - 1;
	y = Math.ceil(y/rowSpacing) - 1;
	
	if(state == 0){
		clickGrid(y, x);
	}
}

function cloneArray(array){
	if(Array.isArray(array)){
		var copy = array.slice(0);
		
		for(var i = 0; i < copy.length; i++){
			for(var j = 0; j < copy[i].length; j++){
				copy[i][j] = new Cell(array[i][j].alive);

			}
		}
		return copy;
	}
}

function clickGrid(r, c){
	if(grid[r][c].alive == 0){
			createCell(r, c);
		} else {
			killCell(r, c);
		}

		draw();
}

function onWindowResize(){
	width = $(window).width();
    height = $(window).height();
	draw();
}