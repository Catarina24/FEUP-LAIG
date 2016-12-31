/**
 * MyBoard.js
 * @constructor
 */

function MyBoard(scene){
    this.scene = scene;

    // Board attributes
    this.minNumOfCols = 5;
    this.numOfRows = 9;
    this.selectedCoords = new Coord2(-1, -1);   // default value

    // Cell attributes
    this.cellRadius = 0.5;
    this.cellHeight = 0.1;
    this.cell = new MyCylinder(scene, 6, 10, this.cellHeight, this.cellRadius, this.cellRadius);

    this.hexagonTriangleHeight = (this.cellRadius * Math.pow(3, 1/2)) / 2;
    this.gapBetweenHexagons = this.cellRadius - this.hexagonTriangleHeight;

    // Cell materials
    this.defaultCellAppearance = new CGFappearance(this.scene);
    this.defaultCellAppearance.setAmbient(1, 0.9, 0, 1);
    this.defaultCellAppearance.setDiffuse(1, 0.9, 0, 1);
    this.defaultCellAppearance.setSpecular(1, 0.9, 0, 1);
    this.defaultCellAppearance.setShininess(1);

    this.selectedCellAppearance = new CGFappearance(this.scene);
    this.selectedCellAppearance.setAmbient(0.8, 0, 0, 1);
    this.selectedCellAppearance.setDiffuse(0.8, 0, 0, 1);
    this.selectedCellAppearance.setSpecular(0.8, 0, 0, 1);
    this.selectedCellAppearance.setShininess(1);

    this.materialWhite = new CGFappearance(this.scene);
    this.materialWhite.setAmbient(1, 0.9, 1, 1);
    this.materialWhite.setDiffuse(1, 0.9, 1, 1);
    this.materialWhite.setSpecular(1, 0.9, 1, 1);
    this.materialWhite.setShininess(1);

    // Cells transformation matrices (key:id, value:matrix) (2D array)
    this.cellsMatrix = new Array(20)
    for (var i=0; i < 20; i++)
    {
        this.cellsMatrix[i]=new Array(20)
    }

    this.ConvertCoordinates();

    // Pieces of the board
    this.whitePiece = new MyPiece(this.scene, 1, this.cellHeight*1.5, this.cellRadius*3/4);
    this.blackPiece = new MyPiece(this.scene, 0, this.cellHeight*1.5, this.cellRadius*3/4);

    this.pieces = [this.whitePiece, this.blackPiece]; // initial pieces: one for each player

    // Playable means if the user is able to pick something
    this.playable = true;

    // Number textures
    this.number0 = new CGFtexture(this.scene, "scenes/resources/0.png");
    this.number1 = new CGFtexture(this.scene, "scenes/resources/1.png");
    this.number2 = new CGFtexture(this.scene, "scenes/resources/2.png");
    this.number3 = new CGFtexture(this.scene, "scenes/resources/3.png");
    this.number4 = new CGFtexture(this.scene, "scenes/resources/4.png");
    this.number5 = new CGFtexture(this.scene, "scenes/resources/5.png");
    this.number6 = new CGFtexture(this.scene, "scenes/resources/6.png");
    this.number7 = new CGFtexture(this.scene, "scenes/resources/7.png");
    this.number8 = new CGFtexture(this.scene, "scenes/resources/8.png");
    this.number9 = new CGFtexture(this.scene, "scenes/resources/9.png");

    // Timer
    this.playTime;
    this.timer = new MyPlane(this.scene, 1, 1, 20, 20);
}

MyBoard.prototype.constructor = MyBoard;

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
                var coord = new Coord2(i+1, j+1);
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
    if(Coord.line == this.selectedCoords.x && Coord.column == this.selectedCoords.y)
    {
        this.selectedCellAppearance.apply();
        //this.generateAnimation().apply(this.scene.elapsedTime - this.startAnimationTime);
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

MyBoard.prototype.displayBoardCells = function()
{
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
            this.cellsMatrix[j+1][i+1] = this.scene.getMatrix();
            var matrix = this.scene.getMatrix();

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

    this.scene.clearPickRegistration();

    this.scene.popMatrix();
}

MyBoard.prototype.displayTimer = function () {

    this.scene.pushMatrix();

    this.scene.translate(5, 0, 5);

    this.materialWhite.apply();
    this.materialWhite.setTexture(this.numberToImage(this.playTime));

    this.timer.display();

    this.scene.popMatrix();

}

/**
 * Display piece
 */
MyBoard.prototype.displayPieces = function()
{
    for(var i = 0; i < this.pieces.length; i++) {

        var piece = this.pieces[i];

        if(piece.boardCoord.x == -1 && piece.boardCoord.y == -1)
        {
            if(piece.color == 0)
            {
                this.scene.pushMatrix();

                this.scene.translate(6, 0, 0);

                piece.initialPositionMatrix = this.scene.getMatrix();

                piece.display();

                this.scene.popMatrix(); 
            }

            if(piece.color == 1)
            {
                this.scene.pushMatrix();

                this.scene.translate(-6, 0, 0);

                piece.initialPositionMatrix = this.scene.getMatrix();

                piece.display();

                this.scene.popMatrix(); 
            }
        }
        else
        {
            this.scene.pushMatrix();

            if(piece.boardCoord.x == this.selectedCoords.y && piece.boardCoord.x == this.selectedCoords.y)
            {
                this.animation.apply(this.scene.elapsedTime);
                if(this.animation.end)
                {
                    piece.played = true;
                    this.setPlayable(true);
                }
            }

            if(piece.played == true)
            {
                this.scene.setMatrix(this.cellsMatrix[piece.boardCoord.x][piece.boardCoord.y]);
                this.scene.translate(0, 0, this.cellHeight);
            }

            piece.display();

            this.scene.popMatrix();
        }
    }
}


/**
 * Displays board with center in the origin and face torwards positive Z.
 */
MyBoard.prototype.display = function(){
   
    this.scene.pushMatrix();

    this.scene.translate(5, 0, 5);
    this.scene.rotate(-Math.PI/2, 1, 0, 0);

    this.displayBoardCells();

    this.displayPieces();

    this.displayTimer();

    this.scene.popMatrix();
}

/**
 * Animation creator for a selected position
 */

MyBoard.prototype.generateAnimation = function (piece) {
    
    var initialFrame;

    if(piece.color == 1)
    {
        initialFrame = new KeyFrame([-6, 0, 0], [0, 0, -1, 0]);
    }
    else
    {
        initialFrame = new KeyFrame([6, 0, 0], [0, 0, 1, 0]);
    }
    var controlFrame1 = new KeyFrame([this.convert[piece.boardCoord.y-1][piece.boardCoord.x-1][0], 0, 8], [-Math.PI/2, 0, 1, 0]);
    var controlFrame2 = new KeyFrame([this.convert[piece.boardCoord.y-1][piece.boardCoord.x-1][0], 0, 8], [-Math.PI/2, 0, 1, 0]);

    var finalFrame = new KeyFrame(  [this.convert[piece.boardCoord.y-1][piece.boardCoord.x-1][0], 
                                    this.convert[piece.boardCoord.y-1][piece.boardCoord.x-1][1] * 2 - this.convert[piece.boardCoord.y-1][piece.boardCoord.x-1][1] * 0.25,
                                    this.cellHeight], 
                                    [-Math.PI, 0, 1, 0]);

    var kfq = new KeyFrameQuadruple(initialFrame, controlFrame1, controlFrame2, finalFrame);

    var animation = new MyKeyAnimation(this.scene, 10, 2, kfq);

    return animation;
}

/**
 * 0 for player with black pieces. 1 for player with white.
 */
MyBoard.prototype.movePlayerPiece = function (player){
    var piece;

    if(player == 0)
    {
        piece = new MyPiece(this.scene, 0, this.cellHeight*1.5, this.cellRadius*3/4);   // black piece
    }
    else
    {
        piece = new MyPiece(this.scene, 1, this.cellHeight*1.5, this.cellRadius*3/4);   // white piece
    }

    piece.boardCoord.set(this.selectedCoords.y, this.selectedCoords.x);

    piece.finalPositionMatrix = this.cellsMatrix[this.selectedCoords.y][this.selectedCoords.x];
    piece.extractTranslationVector();

    this.animation = this.generateAnimation(piece);
    this.animation.start(this.scene.elapsedTime);

    this.setPlayable(false); // until the animation ends

    this.pieces.push(piece);
}

/**
 * Auxiliary key-map to use in animations. It translates board-coords in space coordinates. The center is the middle board piece.
 */
MyBoard.prototype.ConvertCoordinates = function (x, y) {
    this.convert = 
    [
        [[-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2]],
        [[-2.5, 1.5], [-1.5, 1.5], [-0.5, 1.5], [0.5, 1.5], [1.5,1.5], [2.5, 1.5]],
        [[-3, 1], [-2, 1], [-1, 1], [0, 1], [1, 1], [2, 1], [3, 1]],
        [[-3.5,0.5], [-2.5,0.5], [-1.5, 0.5], [-0.5, 0.5], [0.5,0.5], [1.5, 0.5], [2.5, 0.5], [3.5, 0.5]],
        [[-4,0], [-3,0], [-2, 0], [-1, 0], [0,0], [1,0], [2, 0], [3,0], [4,0]],
        [[-3.5,-0.5], [-2.5, -0.5], [-1.5, -0.5], [-0.5, -0.5], [0.5,-0.5], [1.5, -0.5], [2.5, -0.5], [3.5, -0.5]],
        [[-3, -1], [-2, -1], [-1, -1], [0, -1], [1, -1], [2, -1], [3, -1]],
        [[-2.5,-1.5], [-1.5, -1.5], [-0.5, -1.5], [0.5, -1.5], [1.5,-1.5], [2.5, -1.5]],
        [[-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2]]
    ]
}

MyBoard.prototype.setPlayable = function (playable) {
    this.playable = playable;

    if(this.playable)
    {
        this.scene.setPickEnabled(true);
    }
    else
    {
        this.scene.setPickEnabled(false);
    }
}

MyBoard.prototype.movePieceAutomatically = function (coords, player)
{
    this.selectedCoords = coords;

    movePlayerPiece(player);
}

MyBoard.prototype.numberToImage = function(number)
{
    console.log(number);
    switch(number)
    {
        case 0:
            return this.number0;
            break;
        case 1:
            return this.number1;
            break;
        case 2:
            return this.number2;
            break;
        case 3:
            return this.number3;
            break;
        case 4:
            return this.number4;
            break;
        case 5:
            return this.number5;
            break;
        case 6:
            return this.number6;
            break;
        case 7:
            return this.number7;
            break;
        case 8:
            return this.number8;
            break;
        case 9:
            return this.number9;
            break;
        default:
            console.error("Bad number on numberToImage");
            return;
    }
}

MyBoard.prototype.startTimer = function (duration) {
    var board = this;
    this.playTime = duration;
    var minutes, seconds;
    var id = setInterval(function () {
        minutes = parseInt(board.playTime / 60, 10);
        seconds = parseInt(board.playTime % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        console.log(seconds);

        if (--board.playTime < 0) {
            clearInterval(id);
        }
    }, 1000);
}
