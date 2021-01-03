export default class Cell {	
	constructor(ctx, rowNum, colNum, width, height) {
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.rowNum = rowNum;
		this.colNum = colNum;

		this.xCord = this.colNum * this.width;
		this.yCord = this.rowNum * this.height;

		this.visited = false;
		this.walls = {
			topWall: true,
			bottomWall: true,
			leftWall: true,
			rightWall: true
		};
	}

	drawCell() {
		this.ctx.strokeStyle = "white";
		this.ctx.lineWidth = 2;

		if (this.walls.topWall)
			this.drawTopWall(this.xCord, this.yCord);
		
		if (this.walls.bottomWall)
			this.drawBottomWall(this.xCord, this.yCord);
		
		if (this.walls.leftWall)
			this.drawLeftWall(this.xCord, this.yCord);
		
		if (this.walls.rightWall)
			this.drawRightWall(this.xCord, this.yCord);
		
	}

	drawTopWall() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.xCord, this.yCord);
		this.ctx.lineTo(this.xCord + this.width, this.yCord);
		this.ctx.stroke();
	}
	drawBottomWall() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.xCord, this.yCord + this.height);
		this.ctx.lineTo(this.xCord + this.width, this.yCord + this.height);
		this.ctx.stroke();
	}
	drawLeftWall() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.xCord, this.yCord);
		this.ctx.lineTo(this.xCord, this.yCord + this.height);
		this.ctx.stroke();
	}
	drawRightWall() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.xCord + this.width, this.yCord);
		this.ctx.lineTo(this.xCord + this.width, this.yCord + this.height);
		this.ctx.stroke();
	}

	removeWalls(nextCell) {
		let columnDiff = nextCell.colNum - this.colNum;
		let rowDiff = nextCell.rowNum - this.rowNum;

		switch (columnDiff) {
			case 1:
				this.walls.rightWall = false;
				nextCell.walls.leftWall = false;
				break;
			case -1:
				this.walls.leftWall = false;
				nextCell.walls.rightWall = false;
		}

		switch (rowDiff) {
			case 1:
				this.walls.bottomWall = false;
				nextCell.walls.topWall = false;
				break;
			case -1:
				this.walls.topWall = false;
				nextCell.walls.bottomWall = false;
		}
	}

	// choose next cell to visit
	next(grid) {
		let topNeighbor = this.rowNum !== 0 ? 
										grid[this.rowNum - 1][this.colNum] : undefined;

		let bottomNeighbor = this.rowNum !== grid.length - 1 ? 
										grid[this.rowNum + 1][this.colNum] : undefined;

		let leftNeighbor = this.colNum !== 0 ? 
										grid[this.rowNum][this.colNum - 1] : undefined;

		let rightNeighbor = this.colNum !== grid[0].length - 1 ? 
										(grid[this.rowNum][this.colNum + 1]) : undefined;

		
		let unVisited = [];

		if (topNeighbor && !topNeighbor.visited) 					unVisited.push(topNeighbor);
		if (bottomNeighbor && !bottomNeighbor.visited) 		unVisited.push(bottomNeighbor);
		if (leftNeighbor && !leftNeighbor.visited) 				unVisited.push(leftNeighbor);
		if (rightNeighbor && !rightNeighbor.visited) 			unVisited.push(rightNeighbor);

		if (unVisited.length !== 0)
			return unVisited[Math.floor(Math.random() * unVisited.length)];
		else return undefined;
	}
}