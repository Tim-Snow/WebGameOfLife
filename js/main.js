//include preset shapes such as in wiki? https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Examples_of_patterns
var width, height, canvas, context;
var state; //0 = init 1 = simulate
var uiShown;
var rowSpacing, colSpacing
var gridEnabled;

var gridColumns = 5;
var gridRows 	= 5;
var speed 		= 1.0;
var grid 		= new Array();
var gridStore 	= new Array();

cell = function(alive){
	this.alive 	= alive;
}

$(document).ready(function() {	
	width  		= $(window).width();
    height 		= $(window).height();
	canvas 		= $("#c")[0];
	$("#c").attr({width:width,height:height})
	context = canvas.getContext('2d');
	
	grid = createGrid(gridRows, gridColumns);
	/*for(var i = 0; i < gridColumns; i++){
		grid[i] = new Array();
		
		for(var j = 0; j < gridRows; j++){
			grid[i][j] = new cell(0);
		}
	}*/
	
	uiShown = true;
	state   = 0;
	
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
			if(grid[i][j].alive == 1){
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

function createGrid(x, y, existingGrid){
	var r = new Array();
	
	for(var i = 0; i < y; i++){
		r[i] = new Array();
		
		for(var j = 0; j < x; j++){
			if(existingGrid != undefined){
				r[i][j] = new cell(existingGrid[i][j].alive);
			} else {
				r[i][j] = new cell(0);
			}
		}
	}
	
	
	return r;
}

function changeRows(){
	/*console.log(grid);
	gridRows = $("input#rows").val();
	gridStore = createGrid(gridRows, gridColumns, grid);
	console.log(gridStore);
	grid = new Array();
	grid = cloneArray(gridStore);
	console.log(grid);
	draw();*/
	//create new grid and copy values
	//redraw
	//same for next 2 funcs
}

function changeCols(){
	gridColumns = $("input#cols").val();
}

function changeSpeed(){
	speed = $("input#speed").val();
}

function cloneArray(array){
	var copy = array.slice(0);
	
	for(var i = 0; i < copy.length; i++){
		copy[i] = cloneArray(copy[i]);
	}
	return copy;
}

function killCell(x, y){
	grid[x][y].alive = 0;
}

function createCell(x, y){
	grid[x][y].alive = 1;
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
		clickGrid(x, y);
	}
}

function clickGrid(x, y){
	if(grid[x][y].alive == 0){
			createCell(x, y);
		} else {
			killCell(x, y);
		}
		draw();
}

function onWindowResize(){
	width = $(window).width();
    height = $(window).height();
	draw();
}