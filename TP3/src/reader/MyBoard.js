/**
 * MyBoard.js
 * @constructor
 */

function MyBoard(scene){
    this.scene = scene;

    // Board attributes
    this.minNumOfCols = 5;
    this.numOfRows = 9;

    // Cell attributes
    this.cellRadius = 0.5;
    this.cellHeight = 0.1;
    this.cell = new MyCylinder(scene, 6, 10, this.cellHeight, this.cellRadius, this.cellRadius);

    this.hexagonTriangleHeight = (this.cellRadius * Math.pow(3, 1/2)) / 2;
    this.gapBetweenHexagons = this.cellRadius - this.hexagonTriangleHeight;

    // Piece attributes
    this.piece = new MyCylinder(scene, 20, 20, this.cellHeight*2, this.cellRadius*2/3, this.cellRadius*2/3);
    this.calculateNumberOfPieces(); 
}

MyBoard.prototype.constructor = MyBoard;

MyBoard.prototype.calculateNumberOfPieces = function ()
{
    var currentRowNumOfCols = this.minNumOfCols;
    this.numberOfCells = 0;

    for(var i = 0; i < this.numOfRows; ++i)
    {
        for(var j = 0; j < currentRowNumOfCols; ++j)
        {
            this.numberOfCells++;
        }

        if(i < Math.floor(this.numOfRows / 2))
        {
            currentRowNumOfCols++;
        }
        else
        {
            currentRowNumOfCols--;
        }
    }
}

/**
 * Displays board with center in the origin and face torwards positive Z.
 */
MyBoard.prototype.display = function(){

    this.pickListener();

    var currentRowNumOfCols = this.minNumOfCols;
    var firstCellPosition = -1;

    var currentCellIndex = 0;

    this.scene.pushMatrix();

    //this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.scene.translate(-this.minNumOfCols * this.cellRadius, this.minNumOfCols * this.cellRadius * 1.71, 0);

    for(var i = 0; i < this.numOfRows; ++i)
    {
        this.scene.translate(this.hexagonTriangleHeight * firstCellPosition, -2 * this.hexagonTriangleHeight, 0);

        this.scene.pushMatrix();

        for(var j = 0; j < currentRowNumOfCols; ++j)
        {
            this.scene.registerForPick(currentCellIndex+1, this.cell);

            this.scene.translate(2*this.hexagonTriangleHeight + this.gapBetweenHexagons , 0, 0);
            //this.cellsLocation[currentCellIndex] = this.scene.getMatrix();
            this.displayCell();

            this.scene.translate(0, 0, this.cellHeight);
            this.piece.display();

            currentCellIndex++;
        }

        this.scene.popMatrix();

        if(i < Math.floor(this.numOfRows / 2))
        {
            currentRowNumOfCols++;
        }
        else
        {
            currentRowNumOfCols--;
            firstCellPosition = 1;
        }
    }

    this.scene.popMatrix();
}


/**
 * What to do when a cell with board coordinates 'Coords' is picked.
 */
MyBoard.prototype.pickHandler = function(Coords)
{
    console.log(Coords);
}

/**
 * If a cell is picked it activates the pickHandler giving the cell coordinates to it.
 */
MyBoard.prototype.pickListener = function()
{
    if (this.scene.pickMode == false) {
		if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
			for (var i=0; i< this.scene.pickResults.length; i++) {
				var obj = this.scene.pickResults[i][0];
				if (obj)
				{
					var customId = this.scene.pickResults[i][1];
                    this.pickHandler(this.getCoordFromIdofPickedCell(customId));		
				}
			}
			this.scene.pickResults.splice(0,this.scene.pickResults.length);
		}		
	}
}

/**
 * Translates an ID of a picked cell into its board coordinates, assuming ID of board cells start at 1.
 */
MyBoard.prototype.getCoordFromIdofPickedCell = function(id)
{
    var currentRowNumOfCols = this.minNumOfCols;
    var currentCellIndex = 0;

    for(var i = 0; i < this.numOfRows; ++i)
    {
        
        for(var j = 0; j < currentRowNumOfCols; ++j)
        {
            if(currentCellIndex + 1 == id)  // if it has matched the given ID
            {
                var coord = {line:i+1, column: j+1};
                return coord;
            }
            currentCellIndex++;
        }

        if(i < Math.floor(this.numOfRows / 2))
        {
            currentRowNumOfCols++;
        }
        else
        {
            currentRowNumOfCols--;
        }

    }
}

/**
 * Necessary to rotate the hexagon.
 */
MyBoard.prototype.displayCell = function()
{
    this.scene.pushMatrix();

    this.scene.rotate(Math.PI/2, 0, 0, 1);
    this.cell.display();

    this.scene.popMatrix();
}