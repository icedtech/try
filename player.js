export default class Player {
	constructor(maze) {
		this.maze = maze;
		this.ctx = maze.ctx;
		this.width = maze.cellWidth;
		this.height = maze.cellHeight;
		this.stepCount = 0;
	}

	setPlayer() {
		// set player to diagonally opposite cell
		this.colNum = 	this.maze.goal.colNum === 0 	? this.maze.gridLastColumn : 0;
		this.rowNum = 	this.maze.goal.rowNum === 0 	? this.maze.gridLastRow : 0;

		this.drawPlayer();
	}

	drawPlayer() {
		//update Coordinates of player
		this.xCord = this.colNum * this.width;
		this.yCord = this.rowNum * this.height;

		let mouse = new Image();
		
		mouse.height = this.height * 1.5;					// scale mouse inside 'player' cell
		mouse.yPos = this.yCord - mouse.height/6;		// adjust vertical pos according to mouse's height

		// 'player' refers to 'this'(player) inside function definition below
		let player = this;

		mouse.onload = ()=> player.ctx.drawImage(mouse, player.xCord,	mouse.yPos,	player.width,	mouse.height);
		mouse.src = "./images/mouse.svg";

		this.stepCount++;
	}
	

	move(data, gestureTarget) {
		let current = this.maze.grid[this.rowNum][this.colNum];
		let walls = current.walls;
		let changeOccurred = false;

		// run test for keyboard inputs
		if(gestureTarget == undefined) // if gestureTarget isn't passed in i.e. it's a keyboard move
			changeOccurred = this.testCases(data.keyCode, 37, 38, 39, 40, walls);
		// run test for gesture
		else
			changeOccurred = this.testCases(gestureTarget, data.left, data.top, data.right, data.bottom, walls);
		
		if(changeOccurred) {
			this.ctx.clearRect(current.xCord, current.yCord, current.width, current.height);
			current.drawCell();
			this.drawPlayer();
		}
	}

	
	testCases(test, case1, case2, case3, case4, walls) {
		switch(test) {
			case case1:
				if (!walls.leftWall) {
					this.colNum -= 1;		return true;
				}	break;

			case case2:
				if (!walls.topWall) {
					this.rowNum -= 1; 	return true;
				}	break;

			case case3:
				if (!walls.rightWall) {
					this.colNum += 1; 	return true;
				}	break;

			case case4:
				if (!walls.bottomWall) {
					this.rowNum += 1; 	return true;
				}	break;

			default: return undefined;
		}
	}

}