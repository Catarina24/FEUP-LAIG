/**
* Yavalath
* @constructor
*/


var submenu={
    MAIN:1,
    MODE:2,
    LEVEL:3,
    ABOUT:4,
    GAMEOVER:5,
};

var mode={
    HUMAN_VS_HUMAN: 1,
    HUMAN_VS_BOT:2,
    BOT_VS_BOT:3,
};

var level={
    EASY:1,
    NORMAL:2,
};

var state={
    MENU:1,
    INIT: 2,
    PLAYING:3,
    END:4,
    GAMEOVER_MENU:5,
};

function Yavalath(scene){
    
    this.scene = scene;

    this.board = new MyBoard(scene);
    this.menu = new Menu(scene);
    this.client = new Client();

    this.state = state.MENU;
    this.level = null;
    this.mode = null;

    this.winner = null;

    
    this.lastMoves = [];

    this.audioPiece = new Audio('resources/sounds/piece.mp3');
   
    this.audioEnabled = false;

    // Players
    this.player1 = new Player('player1', 'black');
    this.player2 = new Player('player2', 'white');
    this.currentPlayer = this.player1;

}


Yavalath.prototype.constructor=Yavalath;


Yavalath.prototype.init = function(){
    
    this.client.getPrologRequest("init", function(data){

        var result = data.target.responseText;

    });
}

Yavalath.prototype.undo = function(){
    
    var length = this.lastMoves.length;

    if (length == 0){
        console.log("nothing to undo");
        return;
    }

    var x = this.lastMoves[length-1].x;
    var y = this.lastMoves[length-1].y;
    var requestString = "undo(" + x + "," + y + ")";
    this.client.getPrologRequest(requestString, function(data){

        var result = data.target.responseText;

    });

    this.lastMoves.pop();
    this.board.pieces.pop();
    this.changePlayer();
    
    if (this.lastMoves.length != 0){
        var selectedCoords = this.lastMoves[length-2];
        this.board.selectedCoords = new Coord2(selectedCoords.y+1, selectedCoords.x+1);
    }
    else{
        this.board.selectedCoords = new Coord2(-1, -1);
    }
    
}



Yavalath.prototype.placePiecePlayer = function(x, y, piece){

    var game = this;
    var requestString = "movePlayer(" + x + "," + y + "," + piece + ")";

    var end = this.client.getPrologRequest(requestString, function(data){
        
        var result = data.target.responseText;
        game.handleDataReceived(result);

    });

};

Yavalath.prototype.placePieceBot = function(piece){

    var game = this;
    var requestString = "moveBot(" + this.level + "," + piece + ")";

    this.client.getPrologRequest(requestString, function(data){

        var parsed = JSON.parse(data.target.responseText);
        var x = parsed[0];
        var y = parsed[1];
        var result = parsed[2];

        game.handleDataReceived(result);
       
    });
};

Yavalath.prototype.handleDataReceived = function(result){
        switch(result){
            case '0':
                console.log("Invalid Move");
                break;
            case '1':
                console.log("Valid Move");
                //example
                if (this.audioEnabled)
                    this.audioPiece.play();
                this.changePlayer();
                break;
            case '2':
                this.state = state.END;
                console.log("Draw");
                break;
            case '3':
                this.state = state.END;
                console.log("Lost");
                break;
            case '4':
                this.state = state.END;
                console.log("Win");
                break;
        }
};


Yavalath.prototype.changePlayer = function(){
    
    if (this.currentPlayer == this.player1)
        this.currentPlayer = this.player2;
    else if (this.currentPlayer == this.player2)
        this.currentPlayer = this.player1;

}

/**
 * If a cell is picked it activates the pickHandler giving the cell coordinates to it.
 */
Yavalath.prototype.pickListenerGame = function()
{
    if (this.scene.pickMode == false) {
		if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
			for (var i=0; i< this.scene.pickResults.length; i++) {
				var obj = this.scene.pickResults[i][0];
				if (obj)
				{
					var customId = this.scene.pickResults[i][1];
                    this.pickHandlerGame(this.board.getCoordFromIdofPickedCell(customId), customId);		
				}
			}
			this.scene.pickResults.splice(0,this.scene.pickResults.length);
		}	
	}
}

/**
 * What to do when a cell with board coordinates 'Coords' is picked.
 */
Yavalath.prototype.pickHandlerGame = function(Coords, customId)
{
    this.board.selectedCoords = Coords;
    this.board.startAnimationTime = this.scene.elapsedTime;

    this.placePiecePlayer(this.board.selectedCoords.y-1, this.board.selectedCoords.x-1, this.currentPlayer.piece);

    var lastMove = new Coord2(this.board.selectedCoords.y-1, this.board.selectedCoords.x-1);
    this.lastMoves.push(lastMove);

    if (this.currentPlayer.piece == 'black')
        this.board.movePlayerPiece(0);
    else if(this.currentPlayer.piece == 'white')
        this.board.movePlayerPiece(1);  
    
}



Yavalath.prototype.handleGameState = function(){

    
    switch(this.state){
        case state.MENU:
            this.menuHandler();
            
            break;
        case state.INIT:
            this.init();
            this.state = state.PLAYING;
            break;
        case state.PLAYING:
            this.board.display();
            this.pickListenerGame();
            break;
        case state.END:
            this.state = state.GAMEOVER_MENU;
            break;
        case state.GAMEOVER_MENU:
            break;
    }
}


Yavalath.prototype.menuHandler = function(){
    this.menu.display();

    switch(this.menu.menuSelected){
        case submenu.MAIN:

            if(this.menu.optionSelected == 1){
                this.menu.menuSelected = submenu.MODE;
            }
            else if (this.menu.optionSelected == 2){
                this.menu.menuSelected = submenu.ABOUT;
            }
            else if (this.menu.optionSelected == 3){
                this.handleAudio(); 
            }
            break;

        case submenu.MODE:

            if(this.menu.optionSelected == 4){
                this.menu.menuSelected = submenu.LEVEL;
                this.mode = mode.HUMAN_VS_HUMAN;
            }
            else if (this.menu.optionSelected == 5){
                this.menu.menuSelected = submenu.LEVEL;
                this.mode = mode.HUMAN_VS_BOT;
            }
            else if (this.menu.optionSelected == 6){
                this.menu.menuSelected = submenu.LEVEL;
                this.mode = mode.BOT_VS_BOT;
            }
            else if (this.menu.optionSelected == 7){
                this.menu.menuSelected = submenu.MAIN;
            }
            break;

            case submenu.LEVEL:

                if(this.menu.optionSelected == 8){
                    this.level = 1;
                    this.state = state.PLAYING;
                }
                else if (this.menu.optionSelected == 9){
                    this.level = 2;
                    this.state = state.PLAYING;
                }
                else if (this.menu.optionSelected == 10){
                    this.menu.menuSelected = submenu.MODE;
                }
                break;

            case submenu.ABOUT:
                if(this.menu.optionSelected == 11){
                    this.menu.menuSelected = submenu.MAIN;
                }
                break;
    }
}

Yavalath.prototype.handleAudio = function(){

        if (this.audioEnabled)
            this.audioEnabled = false;
        else if(!this.audioEnabled)
            this.audioEnabled = true;

}