//include preset shapes such as in wiki? https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Examples_of_patterns
var width, height, canvas, context;
var state; //0 = init 1 = simulate

var optionsShown;
var gridShown;
var gridColumns = 100;
var gridRows = 60;

var rowSpacing, colSpacing

var grid = new Array();

cell = function(alive){
	this.alive = alive;
}

$(document).ready(function() {	
	width = $(window).width();
    height = $(window).height();

	canvas = $("#c")[0];
	$("#c").attr({width:width,height:height})
	context = canvas.getContext('2d');
	
	for(var i = 0; i < gridColumns; i++){
		grid[i] = new Array();
		
		for(var j = 0; j < gridRows; j++){
			grid[i][j] = new cell(0);
		}
	}
	
	state = 0;
	
	canvas.addEventListener("mousedown", getClickPos, false);
	
	draw();
	mainLoop();
});

function getClickPos(event){
	if(event.x != undefined && event.y != undefined){
		var x = event.x;
		var y = event.y;
	} else {
		x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	
	x = Math.ceil(x/colSpacing) - 1;
	y = Math.ceil(y/rowSpacing) - 1;
	
	if(state == 0){
		clickGrid(x, y);
	}
}

function clickGrid(x, y){
	if(grid[x][y].alive == 0){
			grid[x][y].alive = 1;
		} else {
			grid[x][y].alive = 0;
		}
		draw();
}

function draw(){
	//Clear
	context.clearRect(0, 0, width, height);
  
	//Draw grid
	colSpacing = Math.ceil(width/gridColumns);
	rowSpacing = Math.ceil(height/gridRows);
	
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
	
	//Draw cells
	for(var i = 0; i < gridColumns; i++){
		for(var j = 0; j < gridRows; j++){
			if(grid[i][j].alive == 1){
				context.fillRect( colSpacing * i, rowSpacing * j, colSpacing, rowSpacing);
			}
		}
	}
}

function mainLoop(){	
	if(state == 1){
		for(var i = 0; i < gridColumns; i++){
			for(var j = 0; i < gridRows; j++){
				checkRules(i, j);
			}
		}
		
		updateCells();
	}
}

function checkRules(x, y){
	var numAliveSurrounding = 0;
	
	//PAUSE STATE e.g. do not alter cells this stage
	//check status of surrounding cells
	//
	//	x-1y-1	y-1		x+1y-1
	//	x-1		c		x+1
	//	x-1y+1	y+1		x+1y+1
	//
	//	Check that boundaries will be taken in to consideration
	//
	//Any live cell with fewer than two live neighbours dies, as if caused by under-population.
	//if(numAliveSurrounding < 2) store state dead
	//Any live cell with two or three live neighbours lives on to the next generation.
	//if(numAliveSurrounding == 2) store state alive if already alive
	//Any live cell with more than three live neighbours dies, as if by over-population.
	//if(numAliveSurrounding > 3) store state dead
	//Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
	//if(numAliveSurrounding == 3) store state alive
}

function updateCells(){

}

function killCell(x, y){
	grid[x][y].alive = 0;
}

function createCell(x, y){
	grid[x][y].alive = 1;
}

function onWindowResize(){
	width = $(window).width();
    height = $(window).height();
	draw();
}