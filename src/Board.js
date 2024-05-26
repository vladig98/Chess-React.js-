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
     * Updates the reference to the isPossibleMove array whenever we set a new value to the array.
     */
    useEffect(() => {
        isPossibleMoveRef.current = isPossibleMove;
        setBoardSquares(HelperMethods.fenParser(fen, isPossibleMoveRef.current, getPossibleMoves, movePiece, resetPossibleMoves, false));
    }, [isPossibleMove]);

    /**
     * Called when the page loads.
     * Removes all circles from squares indicating that they can be clicked to move a piece there.
     * Parses the FEN to fill in the board.
     */
    useEffect(() => {
        resetPossibleMoves();
        setBoardSquares(HelperMethods.fenParser(fen, isPossibleMoveRef.current, getPossibleMoves, movePiece, resetPossibleMoves));
    }, []);

    /**
     * Parses the FEN and fills in the board with the new position when the FEN updates.
     */
    useEffect(() => {
        setBoardSquares(HelperMethods.fenParser(fen, isPossibleMoveRef.current, getPossibleMoves, movePiece, resetPossibleMoves));
    }, [fen]);

    /**
     * Updates the reference to the BoardSquares array whenever we set a new value to the array.
     */
    useEffect(() => {
        boardSquaresRef.current = boardSquares;
    }, [boardSquares]);

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
    * Resets possible moves highlighting.
    */
    function resetPossibleMoves() {
        const initialIsPossibleMove = [];
        for (let i = 0; i < GlobalVariables.DIM; i++) {
            for (let j = 0; j < GlobalVariables.DIM; j++) {
                initialIsPossibleMove.push({ key: `${i}${GlobalVariables.PIECE_DELIMITER}${j}`, value: false });
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
                    updateIsPossibleMove(`${GlobalVariables.PossibleMoves[i].moves[j].props.x}${GlobalVariables.PIECE_DELIMITER}${GlobalVariables.PossibleMoves[i].moves[j].props.y}`, true)
                }
            }
        }
    }

    /**
     * Disables castling rights if the king or a rook moves.
     * @param {object} square - The square containing the piece that moved.
     */
    function disableCastlingIfKingOrRookMoves(square) {
        const color = HelperMethods.getPieceColor(square);
        const piece = HelperMethods.getPiece(square);
        const isWhite = HelperMethods.isColorWhite(color);

        const updateCastlingRights = (color, type, value) => {
            GlobalVariables.CastlingRights[`${color}${type}Castle`] = value;
        };

        if (piece === GlobalVariables.PIECES.KING) {
            updateCastlingRights(isWhite ? GlobalVariables.COLORS.WHITE : GlobalVariables.COLORS.BLACK, 'Long', false);
            updateCastlingRights(isWhite ? GlobalVariables.COLORS.WHITE : GlobalVariables.COLORS.BLACK, 'Short', false);
        }

        if (piece === GlobalVariables.PIECES.ROOK) {
            const { x, y } = square.props;
            const rookPositions = [
                { row: GlobalVariables.CASTLE_ROW_WHITE, col: GlobalVariables.CASTLE_ROOK_INITIAL_COL_SHORT, type: 'Short', color: GlobalVariables.COLORS.WHITE },
                { row: GlobalVariables.CASTLE_ROW_BLACK, col: GlobalVariables.CASTLE_ROOK_INITIAL_COL_SHORT, type: 'Short', color: GlobalVariables.COLORS.BLACK },
                { row: GlobalVariables.CASTLE_ROW_WHITE, col: GlobalVariables.CASTLE_ROOK_INITIAL_COL_LONG, type: 'Long', color: GlobalVariables.COLORS.WHITE },
                { row: GlobalVariables.CASTLE_ROW_BLACK, col: GlobalVariables.CASTLE_ROOK_INITIAL_COL_LONG, type: 'Long', color: GlobalVariables.COLORS.BLACK }
            ];

            rookPositions.forEach(pos => {
                if (x === pos.row && y === pos.col) {
                    updateCastlingRights(pos.color, pos.type, false);
                }
            });
        }
    }

    /**
     * Enables or disables en passant based on the move.
     * @param {object} square - The square containing the piece that moved.
     * @param {object} targetSquare - The square to which the piece is moving.
     */
    function enableEnPassant(square, targetSquare) {
        const color = HelperMethods.getPieceColor(square);
        const piece = HelperMethods.getPiece(square);
        const isWhite = HelperMethods.isColorWhite(color);
        const offset = isWhite ? -1 : 1;
        const isPawn = HelperMethods.doesTheSquareHasThePiece(square, GlobalVariables.PIECES.PAWN);
        const isTwoSquareMove = Math.abs(square.props.x - targetSquare.props.x) === 2;

        const updateEnPassant = (isPossible, x, y) => {
            GlobalVariables.EnPassant.isPossible = isPossible;
            GlobalVariables.EnPassant.x = x;
            GlobalVariables.EnPassant.y = y;
        };

        if (isPawn && isTwoSquareMove) {
            updateEnPassant(true, square.props.x + offset, square.props.y);
        } else {
            updateEnPassant(false, -1, -1);
        }
    }

    /**
     * Handles en passant capture logic.
     * @param {object} square - The square containing the piece that moved.
     * @param {object} targetSquare - The square to which the piece is moving.
     * @returns {Array} - The updated board position after en passant capture.
     */
    function captureEnPassant(square, targetSquare) {
        const color = HelperMethods.getPieceColor(square);
        const isWhite = HelperMethods.isColorWhite(color);
        const offset = isWhite ? 1 : -1;
        const { isPossible, x, y } = GlobalVariables.EnPassant;

        const enPassantCapture = (square, targetSquare, enPassantTargetSquare) => {
            const emptySquare = <Square x={square.props.x} y={square.props.y} piece={""} />;
            return HelperMethods.updateBoardPosition(emptySquare, enPassantTargetSquare);
        };

        if (isPossible) {
            const enPassantTargetSquare = HelperMethods.getATargetSquareByLocation(targetSquare.props.x + offset, targetSquare.props.y);
            return enPassantCapture(square, targetSquare, enPassantTargetSquare);
        }

        return [];
    }

    /**
     * Moves a piece on the board.
     * @param {number} x - The x coordinate of the target square.
     * @param {number} y - The y coordinate of the target square.
     */
    function movePiece(x, y) {
        const squares = boardSquares;
        const position = GlobalVariables.BoardPosition;

        const targetSquare = HelperMethods.getATargetSquareByLocation(x, y, boardSquaresRef.current);
        const square = squares.find(s => HelperMethods.checkIfAMoveIsEqualToTheCurrentSelectedSquare(s));

        const color = HelperMethods.getPieceColor(square);
        const piece = HelperMethods.getPiece(square);

        disableCastlingIfKingOrRookMoves(square);

        let updatedPosition = HelperMethods.updateBoardPosition(square, targetSquare);
        updatedPosition = captureEnPassant(square, targetSquare);

        updateBoardState(updatedPosition);
        resetPossibleMovesAndToggleTurn();

        enableEnPassant(square, targetSquare);
        updateMoveCounters();

        HelperMethods.generateANewFen();
    }

    /**
     * Updates the global board state with the new position.
     * @param {Array} updatedPosition - The updated board position after the move.
     */
    function updateBoardState(updatedPosition) {
        const newPosition = updatedPosition.map(row => [...row]);
        GlobalVariables.BoardPosition.splice(0, GlobalVariables.BoardPosition.length, ...newPosition);
    }

    /**
     * Resets the possible moves array and toggles the player's turn.
     */
    function resetPossibleMovesAndToggleTurn() {
        GlobalVariables.PossibleMoves.splice(0, GlobalVariables.PossibleMoves.length);
        GlobalVariables.updateIsWhiteToMove(!GlobalVariables.IsWhiteToMove);
    }

    /**
     * Updates the move counters for the game.
     */
    function updateMoveCounters() {
        GlobalVariables.updateFullMoves(GlobalVariables.FullMoves + 1);
    }

    /**
     * Retrieves and updates the possible moves for all pieces on the board.
     */
    function getPossibleMoves() {
        const squares = boardSquares;
        let possiblePieceMoves = [];

        squares.forEach(square => {
            if (square.props.piece) {
                const color = HelperMethods.getPieceColor(square);

                if (isMoveAllowed(color)) {
                    possiblePieceMoves.push(...collectPossibleMoves(square, squares));
                }
            }
        });

        console.log("Possible Moves:", possiblePieceMoves);
        console.log('Moves count', possiblePieceMoves.reduce((sum, pieceMove) => sum + pieceMove.moves.length, 0));

        updatePossibleMoves(possiblePieceMoves);
        updatePossibleMovesVisually();
    }

    /**
     * Determines if a move is allowed based on the current player's turn.
     * @param {string} color - The color of the piece.
     * @returns {boolean} - True if the move is allowed, false otherwise.
     */
    function isMoveAllowed(color) {
        return (HelperMethods.isColorWhite(color) && GlobalVariables.IsWhiteToMove) ||
            (HelperMethods.isColorBlack(color) && !GlobalVariables.IsWhiteToMove);
    }

    /**
     * Collects possible moves for a given square.
     * @param {object} square - The square to collect moves for.
     * @param {Array} squares - The current board squares.
     * @returns {Array} - The possible moves for the piece on the square.
     */
    function collectPossibleMoves(square, squares) {
        let possiblePieceMoves = MoveHandling.getAllPossibleMoves(square, squares);
        possiblePieceMoves = MoveHandling.removeEmptyMoves(possiblePieceMoves);
        possiblePieceMoves = MoveHandling.filterMovesIfInCheck(possiblePieceMoves, boardSquaresRef.current);
        possiblePieceMoves = MoveHandling.filterMovesThatAllowIllegalCastling(possiblePieceMoves, boardSquaresRef.current);
        return possiblePieceMoves;
    }

    /**
     * Updates the global possible moves array.
     * @param {Array} possiblePieceMoves - The possible moves to update.
     */
    function updatePossibleMoves(possiblePieceMoves) {
        GlobalVariables.PossibleMoves.splice(0, GlobalVariables.PossibleMoves.length, ...possiblePieceMoves);
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