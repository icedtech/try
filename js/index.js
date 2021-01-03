import Maze from "./mazeContainer.js";

const Canvas = document.querySelector("Canvas");
const Ctx = Canvas.getContext("2d");
let Width, Height;
// user-defined rowNum & colNum
let CustomGrid = document.querySelectorAll("#rows, #columns");

let CheesyMaze;
let MazeRows = CustomGrid[0].value;
let MazeColumns = CustomGrid[1].value;

defineCanvasSize();
initiate();

/********************* CHANGING NUMBER OF ROWS & COLUMNS ****************/
let ChangeBtn = document.querySelector("#change");

ChangeBtn.addEventListener("click", _ => {
	// if either of #rows and #columns has changed
	if(CustomGrid[0].value !== MazeRows || CustomGrid[1].value !== MazeColumns) {

		resetRowCol();
		Ctx.clearRect(0, 0, Width, Width);
		unListenMoves();

		// restart
		initiate();
	}
});



/***************************************** GLOBAL FUNCTIONS ********************************************/

function defineCanvasSize() {
	if (window.innerWidth >= 650) {
		Width = 600; Height = 600;
	}
	else if (450 <= window.innerWidth && window.innerWidth < 650) {
		Width = window.innerWidth - 10; Height = 500;
	}
	else {
		Width = window.innerWidth - 10;
		Height = 460;
	}
}

// Create CheesyMaze
function initiate() {
	CheesyMaze = new Maze(Ctx, Width, Height, MazeRows, MazeColumns);
	CheesyMaze.setup();
	listenMoves();
}

// Reset MazeRows & MazeColumns
function resetRowCol() {
	MazeRows = CustomGrid[0].value;
	MazeColumns = CustomGrid[1].value;
}




/******************************************** MOVE EVENTS ***************************************************************/

let GestureStartX, GestureStartY;
let GestureEndX, GestureEndY;

function listenMoves() {
	window.addEventListener("keydown", handleKeyDown);
	Canvas.addEventListener("touchstart", handleGestureStart);
	Canvas.addEventListener("mousedown", handleGestureStart);
	
}

function unListenMoves() {
	window.removeEventListener("keydown", handleKeyDown);
	Canvas.removeEventListener("touchstart", handleGestureStart);
	Canvas.removeEventListener("mousedown", handleGestureStart);
}


// EVENT HANDLERS
function handleKeyDown(evt) {
	let Player = CheesyMaze.player;
	Player.move({ keyCode: evt.keyCode });

	checkCompletion();
}

function handleGestureStart(evt) {
	evt.preventDefault();

	/* 	Handle TouchStart */
	if (evt.type === "touchstart") {
		if (evt.touches && evt.touches.length > 1) return;	// exit function if multi-touch occurred

		GestureStartX = evt.targetTouches[0].pageX - Canvas.offsetLeft;
		GestureStartY = evt.targetTouches[0].pageY - Canvas.offsetTop;

		Canvas.addEventListener("touchend", handleGestureEnd);
	}

	/* Handle MouseDown */
	else {
		GestureStartX = evt.pageX - Canvas.offsetLeft;
		GestureStartY = evt.pageY - Canvas.offsetTop;

		Canvas.addEventListener("mouseup", handleGestureEnd);
	}
}

function handleGestureEnd(evt) {

	/* Handle TouchEnd */
	if (evt.type === "touchend") {
		GestureEndX = evt.changedTouches[0].pageX - Canvas.offsetLeft;
		GestureEndY = evt.changedTouches[0].pageY - Canvas.offsetTop;
	}

	/* Handle MouseUp */
	else {
		GestureEndX = evt.pageX - Canvas.offsetLeft;
		GestureEndY = evt.pageY - Canvas.offsetTop;
	}

	let Player = CheesyMaze.player;
	// Cell Range
	let PlayerRangeX = Player.xCord + Player.width;
	let PlayerRangeY = Player.yCord + Player.height;

	// Check gesture occurred on Player cell
	let isPlayerCol = (GestureStartX >= Player.xCord) && (GestureStartX <= PlayerRangeX);
	let isPlayerRow = (GestureStartY >= Player.yCord) && (GestureStartY <= PlayerRangeY);
	let gestureOnPlayer = isPlayerCol && isPlayerRow;

	if (gestureOnPlayer) {
		// Check if target is either of Player's neighbor
		let targetColumn = Math.floor(GestureEndX / CheesyMaze.cellWidth);
		let targetRow = Math.floor(GestureEndY / CheesyMaze.cellHeight);

		let possibleTargets = {
			left: Player.colNum !== 0 ? (CheesyMaze.grid[Player.rowNum][Player.colNum - 1]) : undefined,

			top: Player.rowNum !== 0 ? (CheesyMaze.grid[Player.rowNum - 1][Player.colNum]) : undefined,

			right: Player.colNum !== CheesyMaze.gridLastColumn ? (CheesyMaze.grid[Player.rowNum][Player.colNum + 1]) : undefined,

			bottom: Player.rowNum !== CheesyMaze.gridLastRow ? (CheesyMaze.grid[Player.rowNum + 1][Player.colNum]) : undefined
		}

		Player.move(possibleTargets, CheesyMaze.grid[targetRow][targetColumn]);
	}

	checkCompletion();
}



/***************************************** GAME COMPLETION *****************************************************/

let CompletionBox = document.querySelector(".game-complete");
let RestartBtn = document.querySelector("#restart");


function checkCompletion() {
	let Player = CheesyMaze.player;
	let reachedCol = Player.colNum === CheesyMaze.goal.colNum;
	let reachedRow = Player.rowNum === CheesyMaze.goal.rowNum;

	if (reachedRow && reachedCol) {
		unListenMoves();
		gameComplete();
	}
}
function gameComplete() {
	let Player = CheesyMaze.player;
	// Subtracted 1 from Player.stepCount because first step counts when Player was drawn up
	document.querySelector(".game-complete h2").innerText =
		`You've moved ${Player.stepCount - 1} steps to get the Cheese`;

	CompletionBox.classList.add("show");
	RestartBtn.addEventListener("click", restart);
}

// Restart Game
function restart() {
	CompletionBox.classList.remove("show");
	initiate();
	document.querySelector(".game-complete h2").innerText = "";

	RestartBtn.removeEventListener("click", restart);
}