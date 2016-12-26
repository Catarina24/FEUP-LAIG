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

    // Cell materials
    this.defaultCellAppearance = new CGFappearance(this.scene);
    this.defaultCellAppearance.setAmbient(0.5, 0.5, 0.5, 1);
    this.defaultCellAppearance.setDiffuse(0.5, 0.5, 0.5, 1);
    this.defaultCellAppearance.setSpecular(0.5, 0.5, 0.5, 1);
    this.defaultCellAppearance.setShininess(1);

    this.selectedCellAppearance = new CGFappearance(this.scene);
    this.selectedCellAppearance.setAmbient(0.8, 0, 0, 1);
    this.selectedCellAppearance.setDiffuse(0.8, 0, 0, 1);
    this.selectedCellAppearance.setSpecular(0.8, 0, 0, 1);
    this.selectedCellAppearance.setShininess(1);

    // Piece attributes
    this.piece = new MyCylinder(scene, 20, 20, this.cellHeight*1.5, this.cellRadius*2/3, this.cellRadius*2/3);
    this.selectedCoords = {line: -1, column: -1};

}

MyBoard.prototype.constructor = MyBoard;

/**
 * What to do when a cell with board coordinates 'Coords' is picked.
 */
MyBoard.prototype.pickHandler = function(Coords)
{
    this.selectedCoords = Coords;
    console.log(this.selectedCoords);
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
MyBoard.prototype.displayCell = function(Coord)
{
    if(Coord.line == this.selectedCoords.line && Coord.column == this.selectedCoords.column)
    {
        this.selectedCellAppearance.apply();
    }
    else
    {
        this.defaultCellAppearance.apply();
    }
        
    this.scene.pushMatrix();

    this.scene.rotate(Math.PI/2, 0, 0, 1);
    this.cell.display();

    this.scene.popMatrix();
}

/**
 * Display piece
 */
MyBoard.prototype.displayPieces = function(Coords)
{
    if(Coords.line == -1 && Coords.column == -1)
    {
       
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
    this.scene.translate(-this.minNumOfCols * this.cellRadius, this.minNumOfCols * this.cellRadius * 1.71, 0);  // magic numbers

    for(var i = 0; i < this.numOfRows; ++i)
    {
        this.scene.translate(this.hexagonTriangleHeight * firstCellPosition, -2 * this.hexagonTriangleHeight, 0);

        this.scene.pushMatrix();

        for(var j = 0; j < currentRowNumOfCols; ++j)
        {
            this.scene.registerForPick(currentCellIndex+1, this.cell);

            this.scene.translate(2*this.hexagonTriangleHeight + this.gapBetweenHexagons , 0, 0);
            //this.cellsLocation[currentCellIndex] = this.scene.getMatrix();
            this.displayCell({line:i+1, column: j+1});

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