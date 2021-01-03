import Cell from "./cell.js";
import Player from "./player.js";

export default class Maze {	
	constructor(ctx, width, height, rows, columns) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.rows = rows;
		this.columns = columns;
		this.cellWidth = width / columns;
		this.cellHeight = height / rows;

		this.grid = []; // to store individual cells
		this.stack = []; // to push each visited cell for tracking previous steps
	}

	//define grid
	setup() {
		for (let rowNum = 0; rowNum < this.rows; rowNum++) {
			let row = [];

			for (let colNum = 0; colNum < this.columns; colNum++) {
				let cell = new Cell(this.ctx, rowNum, colNum, this.cellWidth, this.cellHeight);
				row.push(cell);
			}
			this.grid.push(row);
		}
		// will be used to place player diagonally opposite to goal
		this.gridLastRow = this.grid.length - 1;
		this.gridLastColumn = this.grid[0].length - 1;

		this.player = new Player(this);

		// show preparing-stuff
		document.querySelector(".preparing-grid").classList.add("show");

		//set random starting point
		this.currentCell = this.startPoint();
		this.drawMap();
	}


	drawMap() {
		let canvas = document.querySelector("canvas");
		canvas.width = this.width;
		canvas.height = this.height;

		this.currentCell.visited = true;
		this.grid.forEach(row => (row.forEach(col => col.drawCell())));

		let nextCell = this.currentCell.next(this.grid);
		if (nextCell) {
			nextCell.visited = true;
			
			this.stack.push(this.currentCell);
			this.currentCell.removeWalls(nextCell);
			this.currentCell = nextCell;
		}

		// else if we can go back
		else if (this.stack.length > 0) {
			this.currentCell = this.stack.pop();
		}
		
		// if can't go back, set goal & player
		if (this.stack.length === 0) {
			this.goal = this.currentCell;
			this.drawGoal(this.goal);

			// set player
			this.player.setPlayer();
			// remove Preparing Screen
			document.querySelector(".preparing-grid").classList.remove("show");
			return;
		}
		
		window.requestAnimationFrame(_ => this.drawMap());
	}

	// point to start drawing cell (either of four corners)
	startPoint() {
		let corners = [this.grid[0][0], this.grid[this.gridLastRow][0], this.grid[0][this.gridLastColumn],
		this.grid[this.gridLastRow][this.gridLastColumn]];

		return corners[Math.floor(Math.random() * 4)];
	}

	drawGoal(goal) {
		let cheese = new Image();

		cheese.width = goal.width * 2;			// scale cheese inside goal cell
		cheese.height = goal.height * 2;

		// adjust cheese position according to its size
		cheese.xPos = goal.xCord - cheese.width/4;
		cheese.yPos = goal.yCord - cheese.height/8;

		cheese.onload = ()=> goal.ctx.drawImage(cheese, cheese.xPos, cheese.yPos, cheese.width, cheese.height);
		cheese.src = "./images/cheese.svg";
	}
}