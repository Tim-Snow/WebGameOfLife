//include preset shapes such as in wiki? https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Examples_of_patterns
var width, height, canvas, context;
var state; //0 = init 1 = simulate
var uiShown;
var rowSpacing, colSpacing
var gridEnabled;

var gridColumns = 15;
var gridRows 	= 5;
var speed 		= 1.0;
var grid 		= new Array();
var gridStore 	= new Array();

function Cell(alive){
	this.alive 	= alive;
}

$(document).ready(function() {	
	width  		= $(window).width();
    height 		= $(window).height();
	canvas 		= $("#c")[0];
	$("#c").attr({width:width,height:height})
	context = canvas.getContext('2d');
	
	grid = createGrid(gridRows, gridColumns);
	//gridStore = grid.slice(0);
	
	uiShown = true;
	state   = 0;
	gridEnabled = 1;
	
	$("#hidebutton").click(function() {
		if(uiShown){
			$("#ui").animate({ left: '-100px', opacity: 0.3}, 500 );
			uiShown = false;
		} else {
			$("#ui").animate({ left: '0%', opacity: 1.0}, 500 );
			uiShown = true;
		}
	});

	canvas.addEventListener("mousedown", getClickPos, false);
	
	$('#gridOn').prop('checked', false);
	$('input:checkbox').change( function() {
		if($(this).is(":checked")){	gridEnabled = 1; }
		else { 						gridEnabled = 0; }
		draw();
    });
	
	draw();
	mainLoop();
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

function mainLoop(){	
	if(state == 1){
	//loop at speed determined from text box
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

function resizeGrid(existingGrid, newR, newC){
	var r = new Array();
	
	r =  createGrid(newC, newR);
	console.log(r);

	for(var i = 0; i < newR; i++){		
		for(var j = 0; j < newC; j++){
			if(existingGrid[i][j] == null){
				r[i][j].alive = 0;
			} else {
				r[i][j].alive = existingGrid[i][j].alive;
			}
		}
	}

	/*var r = existingGrid.splice(0, newR);
	
	for(var i = 0; i < newR; i++){
		r[i] = existingGrid.splice(0, newC);
	}
	
	for(var i = 0; i < newR; i++){		
		for(var j = 0; j < newC; j++){
			r[i][j] = new Cell(1);
		}
	}*/

	return r;
}

function changeRows(){
	gridRows = $("#gRows").val();
	grid = new Array();
	grid = createGrid(gridRows, gridColumns);
	draw();
}

function changeCols(){
	gridColumns = $("#gCols").val();
	grid = new Array();
	grid = createGrid(gridRows, gridColumns);
	draw();
}

function changeSpeed(){
	speed = $("#speed").val();
}

function cloneArray(array, newR, newC){
	var copy = array.slice(0);
	
	for(var i = 0; i < copy.length; i++){
		copy[i] = cloneArray(copy[i]);
	}
	
	return copy;
}

function killCell(r, c){
	grid[r][c].alive = 0;
}

function createCell(r, c){
	grid[r][c].alive = 1;
	console.log("Cell created - Row: " + r + " Column: " + c);
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
		console.log("Click - Row:" + y + " Column:" + x);
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