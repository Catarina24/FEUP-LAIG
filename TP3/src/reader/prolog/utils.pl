

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