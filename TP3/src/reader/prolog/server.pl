:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

:- dynamic board/1.
:- dynamic currentPlayer/1.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here

parse_input(init(Name1, Name2), Board):-
	retract(board(_)),
	boardDefault(Board),
	assert(board(Board)),
	assert(player1(Name1)),
	assert(player2(Name2)),
	assert(piece(player1, b)),
	assert(piece(player2, w)),
	assert(currentPlayer(player1)).

/*----- PLAYER -----*/

%caso jogada seja valida
parse_input(movePlayer(X, Y), End):-
	board(Board),
	isFreeCell(X, Y, Board),
	currentPlayer(Player),
	piece(Player, Piece),
	replace(Board, X, Y, Piece, UpdateBoard),
	retract(board(Board)),
	assert(board(UpdateBoard)),
	(
		(endGame(X, Y, Board, Piece, End))
		;
		(End is 1)
	),	
	changePlayer(Player).

%caso jogada nao seja valida
parse_input(movePlayer(_, _), End):-
	End is 0.

/*----- BOT -----*/

%caso jogada seja valida
parse_input(moveBot(Level), [X, Y, End]):-
	board(Board),
        currentPlayer(Player),
        piece(Player, Piece),
        getPreviousPlayer(OppositePlayer),
        bestOption(Level, Board, Player, OppositePlayer, X, Y),
	replace(Board, X, Y, Piece, UpdateBoard),
	retract(board(Board)),
	assert(board(UpdateBoard)),
	(
		(endGame(X, Y, Board, Piece, End))
		;
		(End is 1)
	),	
	changePlayer(Player).

%caso jogada nao seja valida
parse_input(moveBot(_), End):-
	End is 0.



%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       	  Game                                               %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

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

changePlayer(Player):-
	Player = 'player1',
	retract(currentPlayer(Player)),
	assert(currentPlayer(player2)).

changePlayer(Player):-
	Player = 'player2',
	retract(currentPlayer(Player)),
	assert(currentPlayer(player1)).

getPreviousPlayer(PlayerBefore):-
	currentPlayer(Player),
	Player = 'player1',
	PlayerBefore = 'player2'.

getPreviousPlayer(PlayerBefore):-
	currentPlayer(Player),
	Player = 'player2',
	PlayerBefore = 'player1'.


/**----------------- BOT -------------------**/
bestOption(Level, Board, Name1, Name2, X, Y):-
        ((Level =:= 2, 
                ((checkPossibleWinTest(0, 0, Board, Name1, X, Y)) %verifica se pode ganhar
                ;
                (checkPossibleWinTest(0, 0, Board, Name2, X, Y))) %verifica se o outro jogador pode ganhar
        )
        ;
        (Level =:= 1, checkPossibleWinTest(0, 0, Board, Name2, X, Y)) %verifica se o outro jogador pode ganhar
        ;
        (generateRandomCoordinates(X, Y, Board, Level))).  %escolhe coordenadas aleatórias

%checkPossibleWinTest(_, 9, _, _, _, _).

checkPossibleWinTest(X, Y, Board, Name, Xfinal, Yfinal) :-
        piece(Name, Piece),
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

endGame(X, Y, Board, Piece, End) :-
        checkWonGame(X, Y, Board, Piece),
		End is 4.

endGame(X, Y, Board, Piece, End) :-  
        checkLostGame(X, Y, Board, Piece),
		End is 3.
        
endGame(_, _, Board, _, End) :-  
        checkDraw(0, 0, Board),
		End is 2.

/**----------------- BOARD -------------------**/

boardDefault(	[[s, s, s, s, s ],
       [s, s, s, s, s, s ],
      [s, s, s, s, s, s, s ],
    [s, s, s, s, s, s, s, s ],
   [s, s, s, s, s, s, s, s, s ],
    [s, s, s, s, s, s, s, s ],
      [s, s, s, s, s, s, s ],
        [s, s, s, s, s, s ],
          [s, s, s, s, s ]]).

board(	[[s, s, s, s, s ],
       [s, s, s, s, s, s ],
      [s, s, s, s, s, s, s ],
    [s, s, s, s, s, s, s, s ],
   [s, s, s, s, s, s, s, s, s ],
    [s, s, s, s, s, s, s, s ],
      [s, s, s, s, s, s, s ],
        [s, s, s, s, s, s ],
          [s, s, s, s, s ]]).


/**----------------- UTILS -------------------**/

replace([L|Ls] , X , 0 , Z , [R|Ls] ) :-  % once we find the desired row,
  replace_row(L,X,Z,R).                % - we replace specified column, and we are done.
                                   
replace( [L|Ls] , X , Y , Z , [L|Rs] ) :- %  if we have not found the desired row yet
  Y > 0 ,                                 % - and the row offset is positive,
  Y1 is Y-1 ,                             % - we decrement the row offset
  replace( Ls , X , Y1 , Z , Rs ).        % - and recurse down

replace_row( [_|Cs] , 0 , Z , [Z|Cs] ) .  % once we find the specified offset, just make the substitution and finish up.
replace_row( [C|Cs] , X , Z , [C|Rs] ) :- % otherwise,
  X > 0 ,                                    % - assuming that the column offset is positive,
  X1 is X-1 ,                                % - we decrement it
  replace_row( Cs , X1 , Z , Rs ).        % - and recurse down.        
