import React, { useState, useEffect, useRef } from "react";
import * as HelperMethods from "./HelperMethods.js";
import * as GlobalVariables from "./globalVariables.js"
import * as MoveHandling from './MoveHandler.js'

function Board() {
    /// <summary>
    /// FEN - Forsyth-Edwards Notation
    /// small letters - black pieces
    /// capital letters - white pieces
    /// numbers - empty board squares
    /// (/) - separates each board row
    /// first letter after the board indicates whose turn it is to move (w - white, b - black)
    /// next letters indicate castling rights, k - king-side, q - queen-side, (-) - no castling allowed for any side
    /// en passant square - when a pawn moves two squares, the square behind it is put in this place or (-) if no en passant square
    /// the number of half turns (white moves, then black moves = 2 half moves) that were made without a pawn move or a capture of a piece (50-move rule when reaches 100)
    /// the number of full moves (white moves, then black moves = 1 full move); increase after every black half move
    /// </summary>
    /// <example>
    /// Starting position:
    /// 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0'
    /// Examples of FEN positions:
    /// 'r1bqk2r/pppp1ppp/2n5/8/1bBPn3/2N2N2/PP3PPP/R1BQK2R w KQkq - 0 8'
    /// 'r1bqk2r/pppp1ppp/2n2n2/2b5/2BPP3/5N2/PP3PPP/RNBQK2R b KQkq - 0 6'
    /// 'r1b5/p1p3k1/2pp1r1p/6pB/3P4/8/P4PPP/Q1B3K1 b - - 0 21'
    /// </example>
    const [fen, setFen] = useState('r1b5/p1p3k1/2pp1r1p/6pB/3P4/8/P4PPP/Q1B3K1 b - - 0 21');

    /// <summary>
    /// State to manage possible moves for a piece.
    /// </summary>
    const [isPossibleMove, setIsPossibleMove] = useState([]);

    /// <summary>
    /// State to manage the squares on the board.
    /// </summary>
    const [boardSquares, setBoardSquares] = useState([]);

    /// <summary>
    /// Reference to the isPossibleMove state to avoid stale closures.
    /// </summary>
    const isPossibleMoveRef = useRef(isPossibleMove);

    /// <summary>
    /// Reference to the boardSquares state to avoid stale closures.
    /// </summary>
    const boardSquaresRef = useRef(boardSquares);

    /**
     * Updates the possible move array.
     * If a square is a possible move, it will receive a circle indicating you can move there.
     * 
     * @param {string} key - The key of the item to update.
     * @param {boolean} value - The new value to set for the item.
     */
    const updateIsPossibleMove = (key, value) => {
        // We are updating the state based on the previous state to resolve the issue with pending state and queue in React
        setIsPossibleMove(prevState =>
            prevState.map(item =>
                // If the current item's key matches the key we're looking for,
                // copy all properties of the object in a new object using the spread syntax (...),
                // modify the value property to whatever value we're using,
                // copy the original item if no modifications are needed
                item.key === key ? { ...item, value: value } : item
            )
        );
    };

    /**
     * Updates the reference to the isPossibleMove array whenever we set a new value to the array.
     */
    useEffect(() => {
        isPossibleMoveRef.current = isPossibleMove;
        setBoardSquares(HelperMethods.fenParser(fen, isPossibleMoveRef.current, movePiece, resetPossibleMoves, false));
    }, [isPossibleMove]);

    /**
     * Called when the page loads.
     * Removes all circles from squares indicating that they can be clicked to move a piece there.
     * Parses the FEN to fill in the board.
     */
    useEffect(() => {
        resetPossibleMoves();
        setBoardSquares(HelperMethods.fenParser(fen, isPossibleMoveRef.current, movePiece, resetPossibleMoves));
    }, []);

    /**
     * Parses the FEN and fills in the board with the new position when the FEN updates.
     */
    useEffect(() => {
        setBoardSquares(HelperMethods.fenParser(fen, isPossibleMoveRef.current, movePiece, resetPossibleMoves));
    }, [fen]);

    /**
     * Updates the reference to the BoardSquares array whenever we set a new value to the array.
     */
    useEffect(() => {
        boardSquaresRef.current = boardSquares;
    }, [boardSquares]);

    /**
    * Resets possible moves highlighting.
    */
    function resetPossibleMoves() {
        const initialIsPossibleMove = [];
        for (let i = 0; i < GlobalVariables.DIM; i++) {
            for (let j = 0; j < GlobalVariables.DIM; j++) {
                initialIsPossibleMove.push({ key: `${i}-${j}`, value: false });
            }
        }
        setIsPossibleMove(initialIsPossibleMove);
    }

    /**
     * Updates the `isPossibleMove` array based on the `PossibleMoves` array and forces a component update 
     * of the square to visually indicate the circles showing a move is possible.
     * 
     * This function iterates through the `PossibleMoves` array to find moves that match the currently 
     * selected square. For each matching move, it updates the `isPossibleMove` array to true, indicating 
     * that a move is possible, which will trigger the visual indication on the chessboard.
     */
    function updatePossibleMovesVisually() {
        for (let i = 0; i < GlobalVariables.PossibleMoves.length; i++) {
            if (HelperMethods.checkIfAMoveIsEqualToTheCurrentSelectedSquare(GlobalVariables.PossibleMoves[i].piece)) {
                for (let j = 0; j < GlobalVariables.PossibleMoves[i].moves.length; j++) {
                    updateIsPossibleMove(`${GlobalVariables.PossibleMoves[i].moves[j].props.x}-${GlobalVariables.PossibleMoves[i].moves[j].props.y}`, true)
                }
            }
        }
    }

    /**
     * Handles moving a piece to a new location.
     * @param {number} x - The X coordinate.
     * @param {number} y - The Y coordinate.
     */
    function movePiece(x, y) {
        let squares = boardSquares
        let position = GlobalVariables.BoardPosition

        let targetSquare = HelperMethods.getATargetSquareByLocation(x, y, boardSquaresRef.current)
        let square = squares.find(s => s.props.x == GlobalVariables.CurrentSquareSelection.x && s.props.y == GlobalVariables.CurrentSquareSelection.y)

        let color = HelperMethods.getPieceColor(square)
        let piece = HelperMethods.getPiece(square)

        //disable castling if the king moves
        if (piece == GlobalVariables.PIECES.KING) {
            if (HelperMethods.isColorWhite(color)) {
                GlobalVariables.CastlingRights.whiteLongCastle = false
                GlobalVariables.CastlingRights.whiteShortCastle = false
            } else {
                GlobalVariables.CastlingRights.blackLongCastle = false
                GlobalVariables.CastlingRights.blackShortCastle = false
            }
        }

        //disable castling if the rook moves
        if (piece == GlobalVariables.PIECES.ROOK) {
            if (square.props.x == 7 && square.props.y == 7) {
                GlobalVariables.CastlingRights.whiteShortCastle = false
            }

            if (square.props.x == 0 && square.props.y == 7) {
                GlobalVariables.CastlingRights.blackShortCastle = false
            }

            if (square.props.x == 7 && square.props.y == 0) {
                GlobalVariables.CastlingRights.whiteLongCastle = false
            }

            if (square.props.x == 0 && square.props.y == 0) {
                GlobalVariables.CastlingRights.blackLongCastle = false
            }
        }

        let p = HelperMethods.UpdatePosition(square, targetSquare, position)

        //capturing enPassant
        // if (EnPassant.isPossible) {
        //     let enPassantTargetSquare = color == COLORS.WHITE ? squares.find(s => s.props.x == x + 1 && s.props.y == y) : squares.find(s => s.props.x == x - 1 && s.props.y == y)
        //     let enPassantSquare = <Square x={square.props.x} y={square.props.y} piece={""} />

        //     p = UpdatePosition(enPassantSquare, enPassantTargetSquare, p)
        // }

        //TODO: ensure p matches the new board Position format
        //setBoardPosition(p)
        const updatedBoardPosition = p.map(row => [...row]);
        GlobalVariables.BoardPosition.splice(0, GlobalVariables.BoardPosition.length, ...updatedBoardPosition);

        GlobalVariables.PossibleMoves.splice(0, GlobalVariables.PossibleMoves.length);
        GlobalVariables.updateIsWhiteToMove(!GlobalVariables.IsWhiteToMove)

        //enabling en passant
        if (piece == GlobalVariables.PIECES.PAWN) {
            if (Math.abs(square.props.x - targetSquare.props.x) == 2) {
                if (square.props.piece.split(GlobalVariables.PIECE_DELIMITER)[0] == GlobalVariables.COLORS.WHITE) {
                    GlobalVariables.EnPassant.isPossible = true
                    GlobalVariables.EnPassant.x = square.props.x - 1
                    GlobalVariables.EnPassant.y = square.props.y
                } else {
                    GlobalVariables.EnPassant.isPossible = true
                    GlobalVariables.EnPassant.x = square.props.x + 1
                    GlobalVariables.EnPassant.y = square.props.y
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
                GlobalVariables.EnPassant.isPossible = false
                GlobalVariables.EnPassant.x = -1
                GlobalVariables.EnPassant.y = -1
            }
        } else {
            GlobalVariables.EnPassant.isPossible = false
            GlobalVariables.EnPassant.x = -1
            GlobalVariables.EnPassant.y = -1
        }

        GlobalVariables.updateFullMoves(GlobalVariables.FullMoves + 1)

        HelperMethods.generateANewFen()
    }

    /**
     * Gets possible moves for a piece.
     * @param {object} square - The square object.
     */
    function getPossibleMoves() {
        //let square = getATargetSquareByLocation(x, y)
        let possiblePieceMoves = [];
        let squares = boardSquares

        for (let i = 0; i < squares.length; i++) {
            let square = squares[i]

            //if the square has a piece
            if (square.props.piece) {
                let color = HelperMethods.getPieceColor(square); //get the piece color

                //don't collect possible moves if it's black to move and you're trying to move a white piece
                if (HelperMethods.isColorWhite(color) && !GlobalVariables.IsWhiteToMove) {
                    //console.log(`Skipping because it's black to move and you're moving a white piece, x: ${square.props.x}, y: ${square.props.y}`)
                    continue
                }

                //don't collect possible moves if it's white to move and you're trying to move a black piece
                if (HelperMethods.isColorBlack(color) && GlobalVariables.IsWhiteToMove) {
                    //console.log(`Skipping because it's white to move and you're moving a black piece, x: ${square.props.x}, y: ${square.props.y}`)
                    continue
                }

                //console.log(`Getting possible moves, x: ${square.props.x}, y: ${square.props.y}`)
                //get all possible moves for each piece
                console.log(square, squares)
                possiblePieceMoves = MoveHandling.getAllPossibleMoves(square, squares)

                //filter empty moves
                possiblePieceMoves = removeEmptyMoves(possiblePieceMoves);

                //filter possible moves
                possiblePieceMoves = filterMovesIfInCheck(possiblePieceMoves)
                possiblePieceMoves = filterMovesThatAllowIllegalCastling(possiblePieceMoves)
            }
        }

        console.log("Possible Moves:", possiblePieceMoves);
        console.log('Moves count', possiblePieceMoves.reduce((sum, pieceMove) => sum + pieceMove.moves.length, 0))
        GlobalVariables.PossibleMoves.splice(0, GlobalVariables.PossibleMoves.length, ...possiblePieceMoves);
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