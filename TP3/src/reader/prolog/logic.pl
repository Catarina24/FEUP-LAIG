:-use_module(library(lists)).
:-use_module(library(random)).
:-use_module(library(system)).


isBlack(b).
isWhite(w).
isFree(s).



/**----------------- PIECE -------------------**/

isFreeCell(X, Y, Board):-
        getPiece(X, Y, Board, Cell),
        isFree(Cell).

isBlackCell(X, Y, Board):-
        getPiece(X, Y, Board, Cell),
        isBlack(Cell).

isWhiteCell(X, Y, Board):-
        getPiece(X, Y, Board, Cell),
        isWhite(Cell).

getPiece(X, Y, Board, Piece):-
        nth0(Y, Board, ListY),
        nth0(X, ListY, Piece).

isSamePiece(X, Y, Board, Piece):- getPiece(X, Y, Board, Cell), Cell = Piece.


/**----------------- PLAYER -------------------**/


getPreviousPlayer(Piece, PieceOpposite):-
	Piece = 'b',
	PieceOpposite = 'w'.

getPreviousPlayer(Piece, PieceOpposite):-
	Piece = 'w',
	PieceOpposite = 'b'.


/**----------------- BOT -------------------**/
bestOption(Level, Board, Piece1, Piece2, X, Y):-
        ((Level = 2, 
                ((checkPossibleWinTest(0, 0, Board, Piece1, X, Y)) %verifica se pode ganhar
                ;
                (checkPossibleWinTest(0, 0, Board, Piece2, X, Y))) %verifica se o outro jogador pode ganhar
        )
        ;
        (Level = 1, checkPossibleWinTest(0, 0, Board, Piece2, X, Y)) %verifica se o outro jogador pode ganhar
        ;
        (generateRandomCoordinates(X, Y, Board, Level))).  %escolhe coordenadas aleatórias

%checkPossibleWinTest(_, 9, _, _, _, _).

checkPossibleWinTest(X, Y, Board, Piece, Xfinal, Yfinal) :-
        Y < 9,
        nth0(Y, Board, ListY), 
        length(ListY, Size),
        ((
                (isFreeCell(X, Y, Board), checkWonGame(X, Y, Board, Piece), Xfinal is X, Yfinal is Y)
                ;
                (
                        (
                                (X>=Size, X1 is 0, Y1 is Y+1)
                                ;
                                (X<Size, X1 is X+1, Y1 is Y)
                        ), !, 
                        checkPossibleWinTest(X1, Y1, Board, Name, Xfinal, Yfinal)
                )
        )).

generateRandomCoordinates(X, Y, Board, Level):-
        repeat,
        random(0, 9, Y),
        nth0(Y, Board, ListY),
        length(ListY, Size),
        random(0, Size, X),
        ((Level =:= 2, isFreeCell(X, Y, Board),
                ((lastFreeCell(0, 0, Board, 0)) %verifica se só há uma casa disponível
                ;
                (\+checkLostGame(X, Y, Board, _)) %verifica se não perde a jogar
                ))
        ;
        (Level =:= 1, isFreeCell(X, Y, Board))
        ; 
        fail), !.



/**----------------- GAME -------------------**/

endGame(X, Y, Board, Piece, End) :-
        checkWonGame(X, Y, Board, Piece),
		End is 4.

endGame(X, Y, Board, Piece, End) :-  
        checkLostGame(X, Y, Board, Piece),
		End is 3.
        
endGame(_, _, Board, _, End) :-  
        checkDraw(0, 0, Board),
		End is 2.


/**----------------- WIN GAME -------------------**/
checkWonGame(X, Y, Board, Piece):-

        /* Verify if there are four followed pieces in a row of the same type*/
        (
        (checkTwoRightPieces(X, Y, Board, Piece), checkBeforeAfterPieces(X, Y, Board, Piece))
        ;
        (checkTwoLeftPieces(X, Y, Board, Piece), checkBeforeAfterPieces(X, Y, Board, Piece))
        ;
        (checkBetweenPieces1(X, Y, Board, Piece), checkTwoDownPieces1(X, Y, Board, Piece))
        ;
        (checkBetweenPieces1(X, Y, Board, Piece), checkTwoUpPieces1(X, Y, Board, Piece))
        ;
        (checkBetweenPieces2(X, Y, Board, Piece), checkTwoDownPieces2(X, Y, Board, Piece))
        ;
        (checkBetweenPieces2(X, Y, Board, Piece), checkTwoUpPieces2(X, Y, Board, Piece))
        
        ).


/**----------------- LOST GAME -------------------**/
checkLostGame(X, Y, Board, Piece):-

        /* Verify if there are only three followed pieces in a row */

        ((checkTwoRightPieces(X, Y, Board, Piece))
        ;
        (checkTwoLeftPieces(X, Y, Board, Piece))
        ;
        (checkBeforeAfterPieces(X, Y, Board, Piece))
        ;
        (checkBetweenPieces1(X, Y, Board, Piece))
        ;
        (checkTwoDownPieces1(X, Y, Board, Piece))
        ;
        (checkTwoUpPieces1(X, Y, Board, Piece))
        ;
        (checkBetweenPieces2(X, Y, Board, Piece))
        ;
        (checkTwoDownPieces2(X, Y, Board, Piece))
        ;
        (checkTwoUpPieces2(X, Y, Board, Piece))
        ).
        

/**----------------- DRAW -------------------**/

checkDraw(_, 9, _).
checkDraw(X, Y, Board) :-

        ((isBlackCell(X, Y, Board))
        ;
        (isWhiteCell(X, Y, Board))),

        nth0(Y, Board, ListY), 
        length(ListY, Size),
        ((X >= Size-1, X1 is 0, Y1 is Y+1)
        ;
        (X < Size-1, X1 is X+1, Y1 is Y)),

        checkDraw(X1, Y1, Board).


/**----------------- LAST CELL -------------------**/

lastFreeCell(_, 9, _, _).

lastFreeCell(X, Y, Board, N) :-
        N<2,
        ((isFreeCell(X, Y, Board), N1 is N+1)
        ;
        ((\+ isFreeCell(X, Y, Board), N1 is N))),

        nth0(Y, Board, ListY), 
        length(ListY, Size),
        ((X >= Size-1, X1 is 0, Y1 is Y+1)
        ;
        (X < Size-1, X1 is X+1, Y1 is Y)),
        lastFreeCell(X1, Y1, Board, N1).


/**----------------- HORIZONTAL -------------------**/
checkTwoRightPieces(X, Y, Board, Piece) :- 
        X1 is X+1, isSamePiece(X1, Y, Board, Piece),
        X2 is X+2, isSamePiece(X2, Y, Board, Piece).

checkTwoLeftPieces(X, Y, Board, Piece) :- 
        X1 is X-1, isSamePiece(X1, Y, Board, Piece),
        X2 is X-2, isSamePiece(X2, Y, Board, Piece).

checkBeforeAfterPieces(X, Y, Board, Piece):-
        X1 is X+1, isSamePiece(X1, Y, Board, Piece),
        X2 is X-1, isSamePiece(X2, Y, Board, Piece).

checkFourthPieceRight(X, Y, Board, Piece):- 
        X1 is X+3, isSamePiece(X1, Y, Board, Piece).

checkFourthPieceLeft(X, Y, Board, Piece):- 
        X1 is X-3, isSamePiece(X1, Y, Board, Piece).


/**----------------- DIAGONAL 1 (Right Bottom)-------------------**/

checkBetweenPieces1(X, Y, Board, Piece):-
        ((Y < 4, X1 is X+1, Y1 is Y+1, isSamePiece(X1, Y1, Board, Piece),
        X2 is X-1, Y2 is Y-1, isSamePiece(X2, Y2, Board, Piece))
        ;
        (Y =:= 4, X1 is X-1, Y1 is Y-1, isSamePiece(X1, Y1, Board, Piece),
        Y2 is Y+1, isSamePiece(X, Y2, Board, Piece))
        ;
        (Y>4, Y1 is Y+1, isSamePiece(X, Y1, Board, Piece),
        Y2 is Y-1, isSamePiece(X, Y2, Board, Piece))).

checkTwoDownPieces1(X, Y, Board, Piece):-
        ((Y < 3, X1 is X+1, Y1 is Y+1, isSamePiece(X1, Y1, Board, Piece),
        X2 is X+2, Y2 is Y+2, isSamePiece(X2, Y2, Board, Piece))
        ;
        (Y =:= 3, X1 is X+1, Y1 is Y+1, isSamePiece(X1, Y1, Board, Piece),
        X2 is X+1, Y2 is Y+2, isSamePiece(X2, Y2, Board, Piece))
        ;
        (Y>3, Y1 is Y+1, isSamePiece(X, Y1, Board, Piece),
        Y2 is Y+2, isSamePiece(X, Y2, Board, Piece))).

checkTwoUpPieces1(X, Y, Board, Piece):-
        ((Y < 5, X1 is X-1, Y1 is Y-1, isSamePiece(X1, Y1, Board, Piece),
        X2 is X-2, Y2 is Y-2, isSamePiece(X2, Y2, Board, Piece))
        ;
        (Y =:= 5, Y1 is Y-1, isSamePiece(X, Y1, Board, Piece),
        X2 is X-1, Y2 is Y-2, isSamePiece(X2, Y2, Board, Piece))
        ;
        (Y>5, Y1 is Y-1, isSamePiece(X, Y1, Board, Piece),
        Y2 is Y-2, isSamePiece(X, Y2, Board, Piece))).


/**----------------- DIAGONAL 2 (Right Up)-------------------**/

checkBetweenPieces2(X, Y, Board, Piece):-
        ((Y < 4, Y1 is Y+1, isSamePiece(X, Y1, Board, Piece),
        Y2 is Y-1, isSamePiece(X, Y2, Board, Piece))
        ;
        (Y =:= 4, Y1 is Y-1, isSamePiece(X, Y1, Board, Piece),
        X2 is X-1, Y2 is Y+1, isSamePiece(X2, Y2, Board, Piece))
        ;
        (Y > 4, X1 is X+1, Y1 is Y-1, isSamePiece(X1, Y1, Board, Piece),
        X2 is X-1, Y2 is Y+1, isSamePiece(X2, Y2, Board, Piece))).

checkTwoDownPieces2(X, Y, Board, Piece):-
        ((Y < 3, Y1 is Y+1, isSamePiece(X, Y1, Board, Piece),
        Y2 is Y+2, isSamePiece(X, Y2, Board, Piece))
        ;
        (Y =:= 3, Y1 is Y+1, isSamePiece(X, Y1, Board, Piece),
        X2 is X-1, Y2 is Y+2, isSamePiece(X2, Y2, Board, Piece))
        ;
        (Y > 3, X1 is X-1, Y1 is Y+1, isSamePiece(X1, Y1, Board, Piece),
        X2 is X-2, Y2 is Y+2, isSamePiece(X2, Y2, Board, Piece))).

checkTwoUpPieces2(X, Y, Board, Piece):-
        ((Y < 5, Y1 is Y-1, isSamePiece(X, Y1, Board, Piece),
        Y2 is Y-2, isSamePiece(X, Y2, Board, Piece))
        ;
        (Y =:= 5, X1 is X+1, Y1 is Y-1, isSamePiece(X1, Y1, Board, Piece),
        X2 is X+1, Y2 is Y-2, isSamePiece(X2, Y2, Board, Piece))
        ;
        (Y > 5, X1 is X+1, Y1 is Y-1, isSamePiece(X1, Y1, Board, Piece),
        X2 is X+2, Y2 is Y-2, isSamePiece(X2, Y2, Board, Piece))).