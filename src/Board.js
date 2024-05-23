import { useState, useEffect, useRef, createContext } from "react";
import React from 'react';
import Square from "./Square.js"
import { ConvertFENPieceToPiece, ConvertFenToString, UpdatePosition, ParseFEN, IsDigit } from "./HelperMethods.js";
import {
    DIM, PIECE_DELIMITER, KINGS, COLORS, PIECES,
    CastlingRights, EnPassant, CurrentSquareSelection, PossibleMoves,
    HalfMoves, FullMoves, IsWhiteToMove, updateIsWhiteToMove, updateHalfMoves,
    updateFullMoves, BoardPosition
} from "./globalVariables.js"


/*
TODO:
Code Reusability: refactor some of the repeated code and generate new functions if needed
Consistency and Naming: Have better and more consistent names for variables and functions
Documentation: add more comments to understand what is going on
Testing: add unit tests
Implementations: add promotions, implement endgames (mate, stalemate, draws repeation, 50 moves rule)
Bugs: Fix bugs (if any)
*/

function Board() {
    //<summary>
    //FEN - Forsyth-Edwards Notation
    //small letters - black pieces
    //capital letters - white pieces
    //numbers - empty board squares
    //(/) - separates each board row
    //first letter after the board indicates whose turn it is to move (w - white, b - black)
    //next letters indicate castling rights, k - kingside, q - queenside, (-) - no castling allowed for any side
    //en passant square - when a pawn moves two squares, the square behind it is put in this place or (-) if no en passant square
    //the number of half turns (white moves, then black moves = 2 half moves) that were made without a pawn move or a capture of a piece (50-move rule when reaches 100)
    //the number of full moves (white moves, then black moves = 1 full move); increase after every black half move
    //</summary>
    //starting position
    //'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0'
    //r1bqk2r/pppp1ppp/2n5/8/1bBPn3/2N2N2/PP3PPP/R1BQK2R w KQkq - 0 8
    //r1bqk2r/pppp1ppp/2n2n2/2b5/2BPP3/5N2/PP3PPP/RNBQK2R b KQkq - 0 6
    const [fen, setFen] = useState('r1bqk2r/pppp1ppp/2n2n2/2b5/2BPP3/5N2/PP3PPP/RNBQK2R b KQkq - 0 6')
    const [isPossibleMove, setIsPossibleMove] = useState([])
    const [boardSquares, setBoardSquares] = useState([])

    const isPossibleMoveRef = useRef(isPossibleMove)
    const boardSquaresRef = useRef(boardSquares)

    const updateIsPossibleMove = (key, value) => {
        setIsPossibleMove(prevState =>
            prevState.map(item =>
                item.key === key ? { ...item, value: value } : item
            )
        );
    };

    useEffect(() => {
        isPossibleMoveRef.current = isPossibleMove;
        fenParser(false);
    }, [isPossibleMove])

    //called when the page loads.we need to parse the FEN to fill in the board
    useEffect(() => {
        resetPossibleMoves()
        fenParser()
    }, [])

    useEffect(() => {
        fenParser()
    }, [fen])

    useEffect(() => {
        boardSquaresRef.current = boardSquares
    }, [boardSquares])

    function resetPossibleMoves() {
        const initialIsPossibleMove = [];
        for (let i = 0; i < DIM; i++) {
            for (let j = 0; j < DIM; j++) {
                initialIsPossibleMove.push({ key: `${i}-${j}`, value: false });
            }
        }
        setIsPossibleMove(initialIsPossibleMove);
    }

    function generateANewFen() {
        let fenString = ''

        for (let i = 0; i < BoardPosition.length; i++) {
            let row = BoardPosition[i]
            for (let j = 0; j < row.length; j++) {
                let column = row[j]

                if (column == ' ') {
                    if (IsDigit(fenString[fenString.length - 1])) {
                        let lastChar = fenString.slice(-1)
                        fenString = fenString.substring(0, fenString.length - 1)
                        fenString += Number(lastChar) + 1
                    } else {
                        fenString += '1'
                    }
                } else {
                    fenString += column
                }
            }
            fenString += '/'
        }

        fenString = fenString.substring(0, fenString.length - 1) //removes the last slash

        fenString += IsWhiteToMove ? ' w' : ' b'

        let castlingRules = ''

        castlingRules += CastlingRights.whiteShortCastle ? 'K' : ''
        castlingRules += CastlingRights.whiteLongCastle ? 'Q' : ''
        castlingRules += CastlingRights.blackShortCastle ? 'k' : ''
        castlingRules += CastlingRights.blackLongCastle ? 'q' : ''

        fenString += castlingRules.length == 0 ? ' -' : ' ' + castlingRules

        fenString += EnPassant.isPossible ? ' ' + convertLocationToCoordinates(EnPassant.x, EnPassant.y) : ' -'

        fenString += ' ' + HalfMoves
        fenString += ' ' + FullMoves

        setFen(fenString)
    }

    //parses the FEN for the initial board state
    function fenParser(updateBoardPosition = true) {
        //parses the FEN string to variables
        const { fenBoard, fenTurn, fenCastling, fenEnPassant, fenHalfMoves, fenFullMoves } = ParseFEN(fen)

        const fenRows = fenBoard.split('/')

        let arr = [];

        //splits all rows and creates a matrix for the board
        for (let row of fenRows) {
            const tokens = row.split('')

            let r = []

            for (let i = 0; i < tokens.length; i++) {
                if (Number(tokens[i])) {
                    for (let j = 0; j < Number(tokens[i]); j++) {
                        r.push(' ')
                    }
                } else {
                    r.push(tokens[i])
                }
            }

            arr.push(r)
        }

        //generates a Square component for each element in the matrix created above
        let squareColorIsWhite = true;
        let squares = []

        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                let color = squareColorIsWhite ? "" : "dark";
                const possibleMoveStatus = isPossibleMoveRef.current.find(item => item.key === `${i}-${j}`);

                //boardSquares.push(
                squares.push(
                    <Square
                        getPossibleMoves={getPossibleMoves}
                        key={`${i}-${j}`}
                        x={i}
                        y={j}
                        piece={ConvertFENPieceToPiece(arr[i][j])}
                        color={color}
                        movePiece={movePiece}
                        isPossibleMove={possibleMoveStatus ? possibleMoveStatus.value : false}
                        resetPossibleMoves={resetPossibleMoves}
                    />
                )
                squareColorIsWhite = !squareColorIsWhite;
            }
            squareColorIsWhite = !squareColorIsWhite;
        }

        setBoardSquares(squares)

        // BoardSquares.splice(0, BoardSquares.length);
        // BoardSquares.push(...squares)
        // console.log(BoardSquares)

        if (fenCastling.includes('K')) {
            CastlingRights.whiteShortCastle = true;
        }
        if (fenCastling.includes('Q')) {
            CastlingRights.whiteLongCastle = true;
        }
        if (fenCastling.includes('k')) {
            CastlingRights.blackShortCastle = true;
        }
        if (fenCastling.includes('q')) {
            CastlingRights.blackLongCastle = true;
        }

        fenTurn == 'w' ? updateIsWhiteToMove(true) : updateIsWhiteToMove(false)
        updateHalfMoves(fenHalfMoves)
        updateFullMoves(fenFullMoves)

        if (updateBoardPosition) {
            BoardPosition.splice(0, BoardPosition.length, ...arr)
        }

        if (!fenEnPassant.includes(PIECE_DELIMITER)) {
            let location = convertCoordinatesToLocation(fenEnPassant)

            EnPassant.isPossible = true
            EnPassant.x = location.x
            EnPassant.y = location.y
        }
    }

    function isWhiteInCheck(square, pseudo, currentSquare = null) {
        let squares = boardSquaresRef.current

        if (pseudo) {
            const updatedSquares = squares.map(s => {
                if (s.props.x === pseudo.props.x && s.props.y === pseudo.props.y) {
                    // Return a new Square component with the updated piece
                    return React.cloneElement(s, { piece: pseudo.props.piece });
                } else if (currentSquare && s.props.x === currentSquare.props.x && s.props.y === currentSquare.props.y) {
                    return React.cloneElement(s, { piece: '' });
                }
                else {
                    // For other squares, return the original Square component
                    return s;
                }
            });

            // if (pseudo && currentSquare) {
            //     if (pseudo.props.x == 4 && pseudo.props.y == 4 && currentSquare.props.x == 5 && currentSquare.props.y == 2) {
            //         console.log(`Squares: ${JSON.stringify(squares)}, UpdatedSquares: ${JSON.stringify(updatedSquares)}`)
            //     }
            // }

            squares = updatedSquares;
        }

        //check for attackers in front of the white king
        for (let i = square.props.x - 1; i >= 0; i--) {
            let piece = squares.find(s => s.props.x == i && s.props.y == square.props.y)
            if (piece.props.piece.split("-")[0] != "white") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from behind")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers behind the white king
        for (let i = square.props.x + 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == i && s.props.y == square.props.y)
            if (piece.props.piece.split("-")[0] != "white") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from the front")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers to the left of the white king
        for (let i = square.props.y - 1; i >= 0; i--) {
            let piece = squares.find(s => s.props.x == square.props.x && s.props.y == i)
            if (piece.props.piece.split("-")[0] != "white") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from the left")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers to the right of the white king
        for (let i = square.props.y + 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x && s.props.y == i)
            if (piece.props.piece.split("-")[0] != "white") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from the right")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers on a half of one of the diagonals (tlted counterclockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x - i && s.props.y == square.props.y - i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "white") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop" || piece.props.piece.split("-")[1] == "pawn") {
                        if (piece.props.piece.split("-")[1] == "pawn") {
                            if (piece.props.x - square.props.x == -1 && piece.props.y - square.props.y == -1) {
                                //console.log("in check from top half of counterclockwise diagonal by a pawn")
                                return true
                            } else {
                                break
                            }
                        } else {
                            //console.log("in check from top half of counterclockwise diagonal")
                            return true
                        }
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for attackers on the other half of one of the diagonals (tlted counterclockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x + i && s.props.y == square.props.y + i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "white") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop") {
                        return true
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for attackers on a half of one of the diagonals (tlted clockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x - i && s.props.y == square.props.y + i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "white") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop" || piece.props.piece.split("-")[1] == "pawn") {
                        if (piece.props.piece.split("-")[1] == "pawn") {
                            if (piece.props.x - square.props.x == -1 && piece.props.y - square.props.y == 1) {
                                //console.log("in check from top half of clockwise diagonal by a pawn")
                                return true
                            } else {
                                break
                            }
                        } else {
                            //console.log("in check from top half of clockwise diagonal")
                            return true
                        }
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for attackers on the other half of one of the diagonals (tlted clockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x + i && s.props.y == square.props.y - i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "white") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop") {
                        return true;
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for knights check
        let knight1 = squares.find(s => s.props.x == square.props.x - 2 && s.props.y == square.props.y - 1)
        let knight2 = squares.find(s => s.props.x == square.props.x - 2 && s.props.y == square.props.y + 1)
        let knight3 = squares.find(s => s.props.x == square.props.x + 2 && s.props.y == square.props.y - 1)
        let knight4 = squares.find(s => s.props.x == square.props.x + 2 && s.props.y == square.props.y + 1)
        let knight5 = squares.find(s => s.props.x == square.props.x - 1 && s.props.y == square.props.y + 2)
        let knight6 = squares.find(s => s.props.x == square.props.x - 1 && s.props.y == square.props.y - 2)
        let knight7 = squares.find(s => s.props.x == square.props.x + 1 && s.props.y == square.props.y + 2)
        let knight8 = squares.find(s => s.props.x == square.props.x + 1 && s.props.y == square.props.y - 2)

        if (knight1) {
            if (knight1.props.piece.split("-")[1] == "knight") {
                if (knight1.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 1")
                    return true
                }
            }
        }

        if (knight2) {
            if (knight2.props.piece.split("-")[1] == "knight") {
                if (knight2.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 2")
                    return true
                }
            }
        }

        if (knight3) {
            if (knight3.props.piece.split("-")[1] == "knight") {
                if (knight3.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 3")
                    return true
                }
            }
        }

        if (knight4) {
            if (knight4.props.piece.split("-")[1] == "knight") {
                if (knight4.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 4")
                    return true
                }
            }
        }

        if (knight5) {
            if (knight5.props.piece.split("-")[1] == "knight") {
                if (knight5.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 5")
                    return true
                }
            }
        }

        if (knight6) {
            if (knight6.props.piece.split("-")[1] == "knight") {
                if (knight6.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 6")
                    return true
                }
            }
        }

        if (knight7) {
            if (knight7.props.piece.split("-")[1] == "knight") {
                if (knight7.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 7")
                    return true
                }
            }
        }

        if (knight8) {
            if (knight8.props.piece.split("-")[1] == "knight") {
                if (knight8.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 8")
                    return true
                }
            }
        }

        return false;
    }

    function isBlackInCheck(square, pseudo, currentSquare = null) {
        let squares = boardSquaresRef.current

        if (pseudo) {
            const updatedSquares = squares.map(s => {
                if (s.props.x === pseudo.props.x && s.props.y === pseudo.props.y) {
                    // Return a new Square component with the updated piece
                    return React.cloneElement(s, { piece: pseudo.props.piece });
                } else if (currentSquare && s.props.x === currentSquare.props.x && s.props.y === currentSquare.props.y) {
                    return React.cloneElement(s, { piece: '' });
                }
                else {
                    // For other squares, return the original Square component
                    return s;
                }
            });

            squares = updatedSquares;
        }

        //check for attackers behind the black king
        for (let i = square.props.x - 1; i >= 0; i--) {
            let piece = squares.find(s => s.props.x == i && s.props.y == square.props.y)
            if (piece.props.piece.split("-")[0] != "black") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from behind")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers in front of the black king
        for (let i = square.props.x + 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == i && s.props.y == square.props.y)
            if (piece.props.piece.split("-")[0] != "black") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from the front")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers to the left of the black king
        for (let i = square.props.y - 1; i >= 0; i--) {
            let piece = squares.find(s => s.props.x == square.props.x && s.props.y == i)
            if (piece.props.piece.split("-")[0] != "black") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from the left")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers to the right of the black king
        for (let i = square.props.y + 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x && s.props.y == i)
            if (piece.props.piece.split("-")[0] != "black") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from the right")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers on a half of one of the diagonals (tlted counterclockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x - i && s.props.y == square.props.y - i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "black") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop") {
                        //console.log("in check from top half of counterclockwise diagonal")
                        return true
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for attackers on the other half of one of the diagonals (tlted counterclockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x + i && s.props.y == square.props.y + i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "black") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop" || piece.props.piece.split("-")[1] == "pawn") {
                        if (piece.props.piece.split("-")[1] == "pawn") {
                            if (piece.props.x - square.props.x == 1 && piece.props.y - square.props.y == 1) {
                                //console.log("in check from bottom half of counterclockwise diagonal by a pawn")
                                return true
                            } else {
                                break
                            }
                        } else {
                            //console.log("in check from bottom half of counterclockwise diagonal")
                            return true
                        }
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for attackers on a half of one of the diagonals (tlted clockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x - i && s.props.y == square.props.y + i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "black") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop") {
                        //console.log("in check from top half of clockwise diagonal")
                        return true
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for attackers on the other half of one of the diagonals (tlted clockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x + i && s.props.y == square.props.y - i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "black") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop" || piece.props.piece.split("-")[1] == "pawn") {
                        if (piece.props.piece.split("-")[1] == "pawn") {
                            if (piece.props.x - square.props.x == 1 && piece.props.y - square.props.y == -1) {
                                //console.log("in check from bottom half of clockwise diagonal by a pawn")
                                return true
                            } else {
                                break
                            }
                        } else {
                            //console.log("in check from bottom half of clockwise diagonal")
                            return true
                        }
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for knights check
        let knight1 = squares.find(s => s.props.x == square.props.x - 2 && s.props.y == square.props.y - 1)
        let knight2 = squares.find(s => s.props.x == square.props.x - 2 && s.props.y == square.props.y + 1)
        let knight3 = squares.find(s => s.props.x == square.props.x + 2 && s.props.y == square.props.y - 1)
        let knight4 = squares.find(s => s.props.x == square.props.x + 2 && s.props.y == square.props.y + 1)
        let knight5 = squares.find(s => s.props.x == square.props.x - 1 && s.props.y == square.props.y + 2)
        let knight6 = squares.find(s => s.props.x == square.props.x - 1 && s.props.y == square.props.y - 2)
        let knight7 = squares.find(s => s.props.x == square.props.x + 1 && s.props.y == square.props.y + 2)
        let knight8 = squares.find(s => s.props.x == square.props.x + 1 && s.props.y == square.props.y - 2)

        if (knight1) {
            if (knight1.props.piece.split("-")[1] == "knight") {
                if (knight1.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 1")
                    return true
                }
            }
        }

        if (knight2) {
            if (knight2.props.piece.split("-")[1] == "knight") {
                if (knight2.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 2")
                    return true
                }
            }
        }

        if (knight3) {
            if (knight3.props.piece.split("-")[1] == "knight") {
                if (knight3.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 3")
                    return true
                }
            }
        }

        if (knight4) {
            if (knight4.props.piece.split("-")[1] == "knight") {
                if (knight4.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 4")
                    return true
                }
            }
        }

        if (knight5) {
            if (knight5.props.piece.split("-")[1] == "knight") {
                if (knight5.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 5")
                    return true
                }
            }
        }

        if (knight6) {
            if (knight6.props.piece.split("-")[1] == "knight") {
                if (knight6.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 6")
                    return true
                }
            }
        }

        if (knight7) {
            if (knight7.props.piece.split("-")[1] == "knight") {
                if (knight7.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 7")
                    return true
                }
            }
        }

        if (knight8) {
            if (knight8.props.piece.split("-")[1] == "knight") {
                if (knight8.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 8")
                    return true
                }
            }
        }

        return false;
    }

    function movePiece(x, y) {
        let squares = boardSquares
        let position = BoardPosition

        let targetSquare = getATargetSquareByLocation(x, y)
        let square = squares.find(s => s.props.x == CurrentSquareSelection.x && s.props.y == CurrentSquareSelection.y)

        let color = getPieceColor(square)
        let piece = getPiece(square)

        //disable castling if the king moves
        if (piece == PIECES.KING) {
            if (isColorWhite(color)) {
                CastlingRights.whiteLongCastle = false
                CastlingRights.whiteShortCastle = false
            } else {
                CastlingRights.blackLongCastle = false
                CastlingRights.blackShortCastle = false
            }
        }

        //disable castling if the rook moves
        if (piece == PIECES.ROOK) {
            if (square.props.x == 7 && square.props.y == 7) {
                CastlingRights.whiteShortCastle = false
            }

            if (square.props.x == 0 && square.props.y == 7) {
                CastlingRights.blackShortCastle = false
            }

            if (square.props.x == 7 && square.props.y == 0) {
                CastlingRights.whiteLongCastle = false
            }

            if (square.props.x == 0 && square.props.y == 0) {
                CastlingRights.blackLongCastle = false
            }
        }

        let p = UpdatePosition(square, targetSquare, position)

        //capturing enPassant
        // if (EnPassant.isPossible) {
        //     let enPassantTargetSquare = color == COLORS.WHITE ? squares.find(s => s.props.x == x + 1 && s.props.y == y) : squares.find(s => s.props.x == x - 1 && s.props.y == y)
        //     let enPassantSquare = <Square x={square.props.x} y={square.props.y} piece={""} />

        //     p = UpdatePosition(enPassantSquare, enPassantTargetSquare, p)
        // }

        //TODO: ensure p matches the new board Position format
        //setBoardPosition(p)
        const updatedBoardPosition = p.map(row => [...row]);
        BoardPosition.splice(0, BoardPosition.length, ...updatedBoardPosition);

        PossibleMoves.splice(0, PossibleMoves.length);
        updateIsWhiteToMove(!IsWhiteToMove)

        //enabling en passant
        if (piece == PIECES.PAWN) {
            if (Math.abs(square.props.x - targetSquare.props.x) == 2) {
                if (square.props.piece.split(PIECE_DELIMITER)[0] == COLORS.WHITE) {
                    EnPassant.isPossible = true
                    EnPassant.x = square.props.x - 1
                    EnPassant.y = square.props.y
                } else {
                    EnPassant.isPossible = true
                    EnPassant.x = square.props.x + 1
                    EnPassant.y = square.props.y
                }

                // let enPassant1 = squares.find(s => s.props.x == targetSquare.props.x && s.props.y == targetSquare.props.y - 1)
                // let enPassant2 = squares.find(s => s.props.x == targetSquare.props.x && s.props.y == targetSquare.props.y + 1)

                // if (enPassant1) {
                //     if (enPassant1.props.piece.split(PIECE_DELIMITER)[1] == PIECES.PAWN) {
                //         if (enPassant1.props.piece.split(PIECE_DELIMITER)[0] != color) {
                //             EnPassant.isPossible = true
                //             EnPassant.x = targetSquare.props.x
                //             EnPassant.y = targetSquare.props.y
                //             return
                //         }
                //     }
                // }

                // if (enPassant2) {
                //     if (enPassant2.props.piece.split(PIECE_DELIMITER)[1] == PIECES.PAWN) {
                //         if (enPassant2.props.piece.split(PIECE_DELIMITER)[0] != color) {
                //             EnPassant.isPossible = true
                //             EnPassant.x = targetSquare.props.x
                //             EnPassant.y = targetSquare.props.y
                //             return
                //         }
                //     }
                // }
            } else {
                EnPassant.isPossible = false
                EnPassant.x = -1
                EnPassant.y = -1
            }
        } else {
            EnPassant.isPossible = false
            EnPassant.x = -1
            EnPassant.y = -1
        }

        updateFullMoves(FullMoves + 1)

        generateANewFen()
    }

    //updates the state with the selectedSquare X coordinates
    function updateSelectedSquareX(x) {
        setSelectedSquareX(x)
    }

    //updates the state with the selectedSquare Y coordinates
    function updateSelectedSquareY(y) {
        setSelectedSquareY(y)
    }

    //retrieves a speecific square from the board using x and y coordinates (location)
    function getATargetSquareByLocation(x, y) {
        return boardSquaresRef.current.find(s => s.props.x === x && s.props.y === y);
    }

    //retrieves a speecific square from the board that has a certain piece
    function getATargetSquareByPiece(piece) {
        return boardSquaresRef.current.find(s => s.props.piece == piece);
    }

    //check if a specific square has a piece assigned to it
    function isSquareAvailable(square) {
        return square && !square.props.piece
    }

    //checks if a pawn is on its starting square and allows a 2-squares move
    function isPawnOnStartingSquare(pawn) {
        return isColorWhite(pawn.props.piece.split(PIECE_DELIMITER)[0]) ? pawn.props.x == 6 : pawn.props.x == 1
    }

    //checks if two pieces have the same color
    function areSameColor(square1, square2) {
        if (!square1 || !square2) {
            return
        }

        let color1 = square1.props.piece.split(PIECE_DELIMITER)[0];
        let color2 = square2.props.piece.split(PIECE_DELIMITER)[0];

        return color1 == color2
    }

    //checks if a square contains a certain piece
    function doesTheSquareHasThePiece(square, piece) {
        let p = getPiece(square)

        return p == piece
    }

    //cheks if a pawn is on En Passant square
    function isPawnOnEnPassantSquare(pawn) {
        return isColorWhite(pawn.props.piece.split(PIECE_DELIMITER)[0]) ? pawn.props.x == 3 : pawn.props.x == 4
    }

    //checks if a color is white
    function isColorWhite(color) {
        return color == COLORS.WHITE
    }

    //checks if a color is black
    function isColorBlack(color) {
        return color == COLORS.BLACK
    }

    //checks if white is allowed to long castle
    function checkIfCanWhiteLongCastle() {
        return CastlingRights.whiteLongCastle &&
            BoardPosition[7][0] == 'R' &&
            BoardPosition[7][1] == ' ' &&
            BoardPosition[7][2] == ' ' &&
            BoardPosition[7][3] == ' ';
    }

    //checks if white is allowed to short castle
    function checkIfCanWhiteShortCastle() {
        return CastlingRights.whiteShortCastle &&
            BoardPosition[7][7] == 'R' &&
            BoardPosition[7][6] == ' ' &&
            BoardPosition[7][5] == ' ';
    }

    //checks if black is allowed to long castle
    function checkIfCanBlackLongCastle() {
        return CastlingRights.blackLongCastle &&
            BoardPosition[0][0] == 'r' &&
            BoardPosition[0][1] == ' ' &&
            BoardPosition[0][2] == ' ' &&
            BoardPosition[0][3] == ' ';
    }

    //checks if black is allowed to short castle
    function checkIfCanBlackShortCastle() {
        return CastlingRights.blackShortCastle &&
            BoardPosition[7][7] == 'r' &&
            BoardPosition[7][6] == ' ' &&
            BoardPosition[7][5] == ' ';
    }

    //converts board coordinates to X and Y position on the board, e.g., a8 = 0, 0
    function convertCoordinatesToLocation(coordinates) {
        let tokens = coordinates.split('')

        //skip invalid coordinates
        if (tokens.length != 2) {
            return
        }

        let letter = tokens[0].toString().toUpperCase()
        let number = tokens[1]

        //65 is the ASCII code for capital A which will give us 0 if we have A as a coordinate; A-F will give us 0-7 for x
        //reverse the numbers since we draw the board top down
        return { x: DIM - Number(number), y: letter.charCodeAt(0) - 65 }
    }

    function convertLocationToCoordinates(x, y) {
        return `${String.fromCharCode(y + 65)}${DIM - x}`.toLowerCase()
    }

    function compareIfTwoSquaresAreTheSame(square1, square2) {
        if (!square1 || !square2) {
            return false
        }

        return square1.props.x == square2.props.x && square1.props.y == square2.props.y
    }

    //gets all possible moves for a pawn
    function getPawnsPossibleMoves(square) {
        if (!doesTheSquareHasThePiece(square, PIECES.PAWN)) {
            return
        }

        let color = getPieceColor(square) //get the piece color

        let moves = []

        let position1Offset = 1
        let position2Offset = 2

        //flips the direction if the color is white
        if (isColorWhite(color)) {
            position1Offset *= -1
            position2Offset *= -1
        }

        //get all forwards moves + the double move at the start
        let targetPiece1 = getATargetSquareByLocation(square.props.x + position1Offset, square.props.y) //move pawn 1 square ahead
        let targetPiece2 = getATargetSquareByLocation(square.props.x + position2Offset, square.props.y) //move pawn 2 squares ahead

        //get potential neighbors to capture
        let neighbor1 = getATargetSquareByLocation(square.props.x + position1Offset, square.props.y + position1Offset)
        let neighbor2 = getATargetSquareByLocation(square.props.x + position1Offset, square.props.y + (position1Offset * -1))

        //get the En Passant coordinates
        let enPassantSquare = EnPassant.isPossible ? getATargetSquareByLocation(EnPassant.x, EnPassant.y) : ''

        let isTheSquareInFrontAvailable = isSquareAvailable(targetPiece1)

        //push the one move forward for a pawn
        if (isTheSquareInFrontAvailable) {
            moves.push(targetPiece1)
        }

        //two moves are allowed only if the two squares above are free/empty
        //allowed if pawn hasn't moved before
        if (isTheSquareInFrontAvailable && isSquareAvailable(targetPiece2) && isPawnOnStartingSquare(square)) {
            moves.push(targetPiece2)
        }

        //push neighbour if there is a piece to capture and it's a different color than the pawn
        if (!isSquareAvailable(neighbor1) && !areSameColor(neighbor1, square)) {
            moves.push(neighbor1)
        }

        //push neighbour if there is a piece to capture and it's a different color than the pawn
        if (!isSquareAvailable(neighbor2) && !areSameColor(neighbor2, square)) {
            moves.push(neighbor2)
        }

        //add En Passant
        if (enPassantSquare && (compareIfTwoSquaresAreTheSame(enPassantSquare, neighbor1) || compareIfTwoSquaresAreTheSame(enPassantSquare, neighbor2))) {
            moves.push(enPassantSquare)
        }

        return { piece: square, moves: moves }
    }

    //gets all possible moves for a rook
    function getRooksPossibleMoves(square, skip = true) {
        if (!doesTheSquareHasThePiece(square, PIECES.ROOK) && skip) {
            return
        }

        let moves = []

        for (let i = square.props.x + 1; i < DIM; i++) {
            let targetSquare = getATargetSquareByLocation(i, square.props.y)

            if (isSquareAvailable(targetSquare)) {
                moves.push(targetSquare)
            } else {
                if (!areSameColor(square, targetSquare)) {
                    moves.push(targetSquare)
                }
                break
            }
        }

        for (let i = square.props.x - 1; i >= 0; i--) {
            let targetSquare = getATargetSquareByLocation(i, square.props.y)

            if (isSquareAvailable(targetSquare)) {
                moves.push(targetSquare)
            } else {
                if (!areSameColor(square, targetSquare)) {
                    moves.push(targetSquare)
                }
                break;
            }
        }

        for (let i = square.props.y + 1; i < DIM; i++) {
            let targetSquare = getATargetSquareByLocation(square.props.x, i)

            if (isSquareAvailable(targetSquare)) {
                moves.push(targetSquare)
            } else {
                if (!areSameColor(square, targetSquare)) {
                    moves.push(targetSquare)
                }
                break
            }
        }

        for (let i = square.props.y - 1; i >= 0; i--) {
            let targetSquare = getATargetSquareByLocation(square.props.x, i)

            if (isSquareAvailable(targetSquare)) {
                moves.push(targetSquare)
            } else {
                if (!areSameColor(square, targetSquare)) {
                    moves.push(targetSquare)
                }
                break
            }
        }

        return { piece: square, moves: moves }
    }

    //gets all possible moves for a bishop
    function getBishopPossibleMoves(square, skip = true) {
        if (!doesTheSquareHasThePiece(square, PIECES.BISHOP) && skip) {
            return
        }

        let moves = []

        let counter = 0;

        let conside1 = true;
        let conside2 = true;
        let conside3 = true;
        let conside4 = true;

        for (let i = 1; i <= DIM; i++) {
            if (!conside1 && !conside2 && !conside3 && !conside4) {
                break;
            }

            let target1 = conside1 ? getATargetSquareByLocation(square.props.x - i, square.props.y - i) : null
            let target2 = conside2 ? getATargetSquareByLocation(square.props.x - i, square.props.y + i) : null
            let target3 = conside3 ? getATargetSquareByLocation(square.props.x + i, square.props.y + i) : null
            let target4 = conside4 ? getATargetSquareByLocation(square.props.x + i, square.props.y - i) : null

            if (target1 && isSquareAvailable(target1)) {
                moves.push(target1)
            } else {
                if (!areSameColor(square, target1)) {
                    moves.push(target1)
                }
                conside1 = false
            }

            if (target2 && isSquareAvailable(target2)) {
                moves.push(target2)
            } else {
                if (!areSameColor(square, target2)) {
                    moves.push(target2)
                }
                conside2 = false
            }

            if (target3 && isSquareAvailable(target3)) {
                moves.push(target3)
            } else {
                if (!areSameColor(square, target3)) {
                    moves.push(target3)
                }
                conside3 = false
            }

            if (target4 && isSquareAvailable(target4)) {
                moves.push(target4)
            } else {
                if (!areSameColor(square, target4)) {
                    moves.push(target4)
                }
                conside4 = false
            }
        }

        return { piece: square, moves: moves }
    }

    //gets all possible moves for a knight
    function getKnightPossibleMoves(square) {
        if (!doesTheSquareHasThePiece(square, PIECES.KNIGHT)) {
            return
        }

        let offset = 1;
        let doubleOffset = 2 * offset;

        let moves = []

        for (let i = 0; i < 8; i++) {
            if (i != 0 && i % 2 == 0) {
                offset *= -1;
            }

            let targetX = square.props.x + offset;
            let targetY = square.props.y + doubleOffset;

            let target = getATargetSquareByLocation(targetX, targetY)

            if (target && isSquareAvailable(target)) {
                moves.push(target)
            } else {
                if (!areSameColor(square, target)) {
                    moves.push(target)
                }
            }

            doubleOffset *= -1

            if (i == 3) {
                offset *= 2
                doubleOffset /= 2
            }
        }

        return { piece: square, moves: moves }
    }

    //gets all possible moves for a king
    function getKingPossibleMoves(square) {
        if (!doesTheSquareHasThePiece(square, PIECES.KING)) {
            return
        }

        let moves = []

        let color = getPieceColor(square)

        //gets all possible 1-square moves for the king
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let targetPiece = getATargetSquareByLocation(square.props.x + i, square.props.y + j)

                if (targetPiece && isSquareAvailable(targetPiece)) {
                    moves.push(targetPiece)
                } else {
                    if (!areSameColor(square, targetPiece)) {
                        moves.push(targetPiece)
                    }
                }
            }
        }

        //Castling logic
        const longCastleSquare = getATargetSquareByLocation(square.props.x, square.props.y - 2)
        const shortCastleSquare = getATargetSquareByLocation(square.props.x, square.props.y + 2)

        if (isColorWhite(color) && checkIfCanWhiteLongCastle()) {
            moves.push(longCastleSquare)
        }

        if (isColorWhite(color) && checkIfCanWhiteShortCastle()) {
            moves.push(shortCastleSquare)
        }

        if (isColorBlack(color) && checkIfCanBlackLongCastle()) {
            moves.push(longCastleSquare)
        }

        if (isColorBlack(color) && checkIfCanBlackShortCastle()) {
            moves.push(shortCastleSquare)
        }

        return { piece: square, moves: moves }
    }

    //gets all possible moves for a queen
    function getQueenPossibleMoves(square) {
        if (!doesTheSquareHasThePiece(square, PIECES.QUEEN)) {
            return
        }

        let moves = []

        //a queen has the same moves as a bishop and a rook
        const rookMoves = getRooksPossibleMoves(square, false).moves;
        const bishopMoves = getBishopPossibleMoves(square, false).moves;

        // Concatenate the arrays of moves
        moves.push(...rookMoves, ...bishopMoves);

        return { piece: square, moves: moves }
    }

    //gets the piece color
    function getPieceColor(square) {
        return square.props.piece.split(PIECE_DELIMITER)[0]
    }

    //gets the piece
    function getPiece(square) {
        return square.props.piece.split(PIECE_DELIMITER)[1]
    }

    //removes moves that do not deal with a check
    function filterMovesIfInCheck(possibleMoves) {
        let blackKing = getATargetSquareByPiece(KINGS.BLACK_KING) //get the black king
        let whiteKing = getATargetSquareByPiece(KINGS.WHITE_KING) //get the white king

        for (let i = 0; i < possibleMoves.length; i++) {
            for (let j = 0; j < possibleMoves[i].moves.length; j++) {
                if (possibleMoves[i].piece.props.piece == KINGS.BLACK_KING) {
                    let move = <Square x={possibleMoves[i].moves[j].props.x} y={possibleMoves[i].moves[j].props.y} piece={"black-king"} />
                    let pseudo = <Square x={blackKing.props.x} y={blackKing.props.y} piece={""} />
                    let isInCheck = isBlackInCheck(move, pseudo)

                    if (isInCheck) {
                        possibleMoves[i].moves.splice(j, 1);
                        j--;
                    }
                } else if (possibleMoves[i].piece.props.piece == KINGS.WHITE_KING) {
                    let move = <Square x={possibleMoves[i].moves[j].props.x} y={possibleMoves[i].moves[j].props.y} piece={"white-king"} />
                    let pseudo = <Square x={whiteKing.props.x} y={whiteKing.props.y} piece={""} />
                    let isInCheck = isWhiteInCheck(move, pseudo)

                    if (isInCheck) {
                        possibleMoves[i].moves.splice(j, 1);
                        j--;
                    }
                } else {
                    let move = <Square x={possibleMoves[i].moves[j].props.x} y={possibleMoves[i].moves[j].props.y} piece={possibleMoves[i].piece.props.piece} />
                    let isBlackKingInCheck = isBlackInCheck(blackKing, move, possibleMoves[i].piece)
                    let isWhiteKingInCheck = isWhiteInCheck(whiteKing, move, possibleMoves[i].piece)

                    if (isBlackKingInCheck && !IsWhiteToMove) {
                        possibleMoves[i].moves.splice(j, 1);
                        j--;
                    }

                    if (isWhiteKingInCheck && IsWhiteToMove) {
                        possibleMoves[i].moves.splice(j, 1);
                        j--;
                    }
                }
            }
        }

        return possibleMoves
    }

    //removes moves that allow illigal castling (castles through check for example)
    function filterMovesThatAllowIllegalCastling(possibleMoves) {
        let blackKing = getATargetSquareByPiece(KINGS.BLACK_KING) //get the black king
        let whiteKing = getATargetSquareByPiece(KINGS.WHITE_KING) //get the white king

        for (let i = 0; i < possibleMoves.length; i++) {
            let whiteCastle1 = possibleMoves[i].moves.find(m => m.props.x == 7 && m.props.y == 6) //sqaure where king will be after short castle (white)
            let whiteCastle2 = possibleMoves[i].moves.find(m => m.props.x == 7 && m.props.y == 2) //sqaure where king will be after long castle (white)
            let blackCastle1 = possibleMoves[i].moves.find(m => m.props.x == 0 && m.props.y == 6) //square where king will be after shot castle (black)
            let blackCastle2 = possibleMoves[i].moves.find(m => m.props.x == 0 && m.props.y == 2) //square where king will be after long castle (black)

            if (possibleMoves[i].piece == blackKing || possibleMoves[i].piece == whiteKing) {
                if (whiteCastle1) {
                    let pieceAcross = possibleMoves[i].moves.find(m => m.props.x == 7 && m.props.y == 5)
                    if (!pieceAcross) {
                        possibleMoves[i].moves.splice(possibleMoves[i].moves.indexOf(pieceAcross), 1)
                    }
                }

                if (whiteCastle2) {
                    let pieceAcross = possibleMoves[i].moves.find(m => m.props.x == 7 && m.props.y == 3)
                    if (!pieceAcross) {
                        possibleMoves[i].moves.splice(possibleMoves[i].moves.indexOf(pieceAcross), 1)
                    }
                }

                if (blackCastle1) {
                    let pieceAcross = possibleMoves[i].moves.find(m => m.props.x == 0 && m.props.y == 5)
                    if (!pieceAcross) {
                        possibleMoves[i].moves.splice(possibleMoves[i].moves.indexOf(pieceAcross), 1)
                    }
                }

                if (blackCastle2) {
                    let pieceAcross = possibleMoves[i].moves.find(m => m.props.x == 0 && m.props.y == 3)
                    if (!pieceAcross) {
                        possibleMoves[i].moves.splice(possibleMoves[i].moves.indexOf(pieceAcross), 1)
                    }
                }
            }

            //prevents black to castle if in check
            if (isBlackInCheck(blackKing)) {
                if (blackCastle1) {
                    possibleMoves[i].moves.splice(possibleMoves[i].moves.indexOf(blackCastle1), 1)
                }

                if (blackCastle2) {
                    possibleMoves[i].moves.splice(possibleMoves[i].moves.indexOf(blackCastle2), 1)
                }
            }

            //prevents white to castle if in check
            if (isWhiteInCheck(whiteKing)) {
                if (whiteCastle1) {
                    possibleMoves[i].moves.splice(possibleMoves[i].moves.indexOf(whiteCastle1), 1)
                }

                if (whiteCastle2) {
                    possibleMoves[i].moves.splice(possibleMoves[i].moves.indexOf(whiteCastle2), 1)
                }
            }
        }

        return possibleMoves
    }

    //removes empty/undefined values for generated moves
    function removeEmptyMoves(possibleMoves) {
        for (let i = 0; i < possibleMoves.length; i++) {
            if (!possibleMoves[i]) {
                possibleMoves.splice(i, 1)
                i--;
                continue;
            }

            if (possibleMoves[i].moves.length == 0) {
                possibleMoves.splice(i, 1)
                i--;
                continue;
            }

            for (let j = 0; j < possibleMoves[i].moves.length; j++) {
                if (!possibleMoves[i].moves[j]) {
                    possibleMoves[i].moves.splice(j, 1);
                    j--;
                }
            }
        }

        return possibleMoves
    }

    function updatePossibleMovesVisually() {
        for (let i = 0; i < PossibleMoves.length; i++) {
            if (PossibleMoves[i].piece.props.x == CurrentSquareSelection.x && PossibleMoves[i].piece.props.y == CurrentSquareSelection.y) {
                for (let j = 0; j < PossibleMoves[i].moves.length; j++) {
                    updateIsPossibleMove(`${PossibleMoves[i].moves[j].props.x}-${PossibleMoves[i].moves[j].props.y}`, true)
                }
            }
        }
    }

    //gets all possible/legal moves
    function getPossibleMoves() {
        //let square = getATargetSquareByLocation(x, y)
        let possiblePieceMoves = [];
        let squares = boardSquares

        for (let i = 0; i < squares.length; i++) {
            let square = squares[i]

            //if the square has a piece
            if (square.props.piece) {
                let color = getPieceColor(square); //get the piece color

                //don't collect possible moves if it's black to move and you're trying to move a white piece
                if (isColorWhite(color) && !IsWhiteToMove) {
                    //console.log(`Skipping because it's black to move and you're moving a white piece, x: ${square.props.x}, y: ${square.props.y}`)
                    continue
                }

                //don't collect possible moves if it's white to move and you're trying to move a black piece
                if (isColorBlack(color) && IsWhiteToMove) {
                    //console.log(`Skipping because it's white to move and you're moving a black piece, x: ${square.props.x}, y: ${square.props.y}`)
                    continue
                }

                //console.log(`Getting possible moves, x: ${square.props.x}, y: ${square.props.y}`)
                //get all possible moves for each piece
                possiblePieceMoves.push(getPawnsPossibleMoves(square))
                possiblePieceMoves.push(getRooksPossibleMoves(square))
                possiblePieceMoves.push(getBishopPossibleMoves(square))
                possiblePieceMoves.push(getKnightPossibleMoves(square))
                possiblePieceMoves.push(getKingPossibleMoves(square))
                possiblePieceMoves.push(getQueenPossibleMoves(square))

                //filter empty moves
                possiblePieceMoves = removeEmptyMoves(possiblePieceMoves);

                //filter possible moves
                possiblePieceMoves = filterMovesIfInCheck(possiblePieceMoves)
                possiblePieceMoves = filterMovesThatAllowIllegalCastling(possiblePieceMoves)
            }
        }

        console.log("Possible Moves:", possiblePieceMoves);
        console.log('Moves count', possiblePieceMoves.reduce((sum, pieceMove) => sum + pieceMove.moves.length, 0))
        PossibleMoves.splice(0, PossibleMoves.length, ...possiblePieceMoves);
        updatePossibleMovesVisually()
    }

    //renders the board
    return (
        <>
            <div className="chessGrid">
                {boardSquares.map((sqr) => sqr)}
            </div>
        </>
    );
}

export default Board