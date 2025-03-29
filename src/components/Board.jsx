import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import * as HelperMethods from "./HelperMethods";
import * as GlobalVariables from "./globalVariables"
import * as MoveHandling from './MoveHandler'

/**
 * FEN -> possibleMoves count (Italian game)
 * rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 -> 20
 * rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1 -> 20
 * rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2 -> 29
 * rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2 -> 29
 * r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3 -> 27
 * r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3 -> 31
 * r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4 -> 33
 * r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq - 0 4 -> 36
 * r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5 -> 34
 * r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/2P2N2/PP3PPP/RNBQK2R b KQkq d3 0 5 -> 35
 * r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/2P2N2/PP3PPP/RNBQK2R w KQkq - 0 6 -> 45
 * r1bqk2r/pppp1ppp/2n2n2/2b5/2BPP3/5N2/PP3PPP/RNBQK2R b KQkq - 0 6 -> 35
 * r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/5N2/PP3PPP/RNBQK2R w KQkq - 1 7 -> 7
 * r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/2N2N2/PP3PPP/R1BQK2R b KQkq - 2 7 -> 34
 * r1bqk2r/pppp1ppp/2n5/8/1bBPn3/2N2N2/PP3PPP/R1BQK2R w KQkq - 0 8 -> 39
 * r1bqk2r/pppp1ppp/2n5/8/1bBPn3/2N2N2/PP3PPP/R1BQ1RK1 b kq - 1 8 -> 42
 * r1bqk2r/pppp1ppp/2n5/8/1bBP4/2n2N2/PP3PPP/R1BQ1RK1 w kq - 0 9 -> 37
 * r1bqk2r/pppp1ppp/2n5/8/1bBP4/2P2N2/P4PPP/R1BQ1RK1 b kq - 0 9 -> 34
 * r1bqk2r/pppp1ppp/2n5/8/2BP4/2b2N2/P4PPP/R1BQ1RK1 w kq - 0 10 -> 37
 * r1bqk2r/pppp1ppp/2n5/8/2BP4/1Qb2N2/P4PPP/R1B2RK1 b kq - 1 10 -> 35
 * r1bqk2r/pppp1ppp/2n5/8/2BP4/1Q3N2/P4PPP/b1B2RK1 w kq - 0 11 -> 42
 * r1bqk2r/pppp1Bpp/2n5/8/3P4/1Q3N2/P4PPP/b1B2RK1 b kq - 0 11 -> 2
 * r1bq1k1r/pppp1Bpp/2n5/8/3P4/1Q3N2/P4PPP/b1B2RK1 w - - 1 12 -> 45
 * r1bq1k1r/pppp1Bpp/2n5/8/3P4/1Q3N2/P4PPP/b1B1R1K1 b - - 2 12 -> 26
 * r1bq1k1r/ppp2Bpp/2np4/8/3P4/1Q3N2/P4PPP/b1B1R1K1 w - - 0 13 -> 52
 * r1bq1k1r/ppp3pp/2np4/7B/3P4/1Q3N2/P4PPP/b1B1R1K1 b - - 1 13 -> 30
 * r1b2k1r/pppq2pp/2np4/7B/3P4/1Q3N2/P4PPP/b1B1R1K1 w - - 2 14 -> 51
 * r1b2k1r/pppq2pp/2np4/7B/3PR3/1Q3N2/P4PPP/b1B3K1 b - - 3 14 -> 28
 * r1b2k1r/pppq2p1/2np3p/7B/3PR3/1Q3N2/P4PPP/b1B3K1 w - - 0 15 -> 53
 * r1b2k1r/pppq2p1/2np3p/7B/3PR2N/1Q6/P4PPP/b1B3K1 b - - 1 15 -> 28
 * r1b2k1r/pppq4/2np3p/6pB/3PR2N/1Q6/P4PPP/b1B3K1 w - g6 0 16 -> 56
 * r1b2k1r/pppqR3/2np3p/6pB/3P3N/1Q6/P4PPP/b1B3K1 b - - 1 16 -> 28
 * r1b2k1r/ppp1q3/2np3p/6pB/3P3N/1Q6/P4PPP/b1B3K1 w - - 0 17 -> 47
 * r1b2k1r/ppp1q3/2np2Np/6pB/3P4/1Q6/P4PPP/b1B3K1 b - - 1 17 -> 2
 * r1b4r/ppp1q1k1/2np2Np/6pB/3P4/1Q6/P4PPP/b1B3K1 w - - 2 18 -> 48
 * r1b4r/ppp1N1k1/2np3p/6pB/3P4/1Q6/P4PPP/b1B3K1 b - - 0 18 -> 30
 * r1b2r2/ppp1N1k1/2np3p/6pB/3P4/1Q6/P4PPP/b1B3K1 w - - 1 19 -> 51
 * r1b2r2/ppp3k1/2Np3p/6pB/3P4/1Q6/P4PPP/b1B3K1 b - - 0 19 -> 29
 * r1b2r2/p1p3k1/2pp3p/6pB/3P4/1Q6/P4PPP/b1B3K1 w - - 0 20 -> 46
 * r1b2r2/p1p3k1/2pp3p/6pB/3P4/8/P4PPP/bQB3K1 b - - 1 20 -> 29
 * r1b5/p1p3k1/2pp1r1p/6pB/3P4/8/P4PPP/bQB3K1 w - - 2 21 -> 38
 * r1b5/p1p3k1/2pp1r1p/6pB/3P4/8/P4PPP/Q1B3K1 b - - 0 21 -> 25
 * 1rb5/p1p3k1/2pp1r1p/6pB/3P4/8/P4PPP/Q1B3K1 w - - 1 22 -> 27
 * 1rb5/p1p3k1/2pp1r1p/6pB/3P4/2Q5/P4PPP/2B3K1 b - - 2 22 -> 32
 */
function Board() {
    /**
     * State to manage the FEN (Forsyth-Edwards Notation) string representing the board position.
     * This state is used to parse and set the initial board configuration.
     *
     * FEN - Forsyth-Edwards Notation:
     * - Small letters represent black pieces.
     * - Capital letters represent white pieces.
     * - Numbers represent empty board squares.
     * - (/) separates each board row.
     * - The first letter after the board indicates whose turn it is to move (w - white, b - black).
     * - Next letters indicate castling rights:
     *   - k - king-side
     *   - q - queen-side
     *   - (-) - no castling allowed for any side.
     * - En passant square:
     *   - When a pawn moves two squares, the square behind it is put in this place or (-) if no en passant square.
     * - The number of half turns:
     *   - White moves, then black moves = 2 half moves
     *   - Half turns are made without a pawn move or a capture of a piece (50-move rule when reaches 100).
     * - The number of full moves:
     *   - White moves, then black moves = 1 full move
     *   - Increases after every black half move.
     * 
     * Starting position:
     * 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0'
     *
     * Examples of FEN positions:
     * 'r1bqk2r/pppp1ppp/2n5/8/1bBPn3/2N2N2/PP3PPP/R1BQK2R w KQkq - 0 8'
     * 'r1bqk2r/pppp1ppp/2n2n2/2b5/2BPP3/5N2/PP3PPP/RNBQK2R b KQkq - 0 6'
     * 'r1b5/p1p3k1/2pp1r1p/6pB/3P4/8/P4PPP/Q1B3K1 b - - 0 21'
     */
    const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    /**
     * State to manage possible moves for a piece. 
     * This state holds an array of objects indicating which squares are possible moves for the selected piece.
     */
    const [isPossibleMove, setIsPossibleMove] = useState([]);

    /**
     * State to manage the squares on the board.
     * This state holds an array of square components representing the current board configuration.
     */
    const [boardSquares, setBoardSquares] = useState([]);

    /**
     * Reference to the `isPossibleMove` state to avoid stale closures.
     * This reference ensures that the latest state is used in functions that rely on it.
     */
    const isPossibleMoveRef = useRef(isPossibleMove);

    /**
     * Reference to the `boardSquares` state to avoid stale closures.
     * This reference ensures that the latest state is used in functions that rely on it.
     */
    const boardSquaresRef = useRef(boardSquares);

    const fenRef = useRef(fen)

    /**
     * Updates the reference to the `isPossibleMove` array whenever the state changes.
     * Additionally, updates the `boardSquares` state by parsing the FEN string.
     */
    useEffect(() => {
        isPossibleMoveRef.current = isPossibleMove;
        setBoardSquares(HelperMethods.fenParser(fen, isPossibleMoveRef.current, getPossibleMoves, movePiece, resetPossibleMoves, false));
    }, [isPossibleMove]);

    /**
     * Initializes the board state when the component mounts.
     * Parses the FEN string to set up the initial board configuration.
     */
    useEffect(() => {
        resetPossibleMoves();
        setBoardSquares(HelperMethods.fenParser(fen, isPossibleMoveRef.current, getPossibleMoves, movePiece, resetPossibleMoves));
    }, []);

    /**
     * Updates the `boardSquares` state whenever the FEN string changes.
     * Parses the FEN string to update the board configuration.
     */
    useEffect(() => {
        fenRef.current = fen
        setBoardSquares(HelperMethods.fenParser(fen, isPossibleMoveRef.current, getPossibleMoves, movePiece, resetPossibleMoves));
    }, [fen]);

    /**
     * Updates the reference to the `boardSquares` array whenever the state changes.
     * This ensures that functions relying on `boardSquaresRef` have the latest state.
     */
    useEffect(() => {
        boardSquaresRef.current = boardSquares;
    }, [boardSquares]);

    const fenList = [
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 -> 20",
        "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1 -> 20",
        "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2 -> 29",
        "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2 -> 29",
        "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3 -> 27",
        "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3 -> 31",
        "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4 -> 33",
        "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R b KQkq - 0 4 -> 36",
        "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/2P2N2/PP1P1PPP/RNBQK2R w KQkq - 1 5 -> 34",
        "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2BPP3/2P2N2/PP3PPP/RNBQK2R b KQkq d3 0 5 -> 35",
        "r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/2P2N2/PP3PPP/RNBQK2R w KQkq - 0 6 -> 45",
        "r1bqk2r/pppp1ppp/2n2n2/2b5/2BPP3/5N2/PP3PPP/RNBQK2R b KQkq - 0 6 -> 35",
        "r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/5N2/PP3PPP/RNBQK2R w KQkq - 1 7 -> 7",
        "r1bqk2r/pppp1ppp/2n2n2/8/1bBPP3/2N2N2/PP3PPP/R1BQK2R b KQkq - 2 7 -> 34",
        "r1bqk2r/pppp1ppp/2n5/8/1bBPn3/2N2N2/PP3PPP/R1BQK2R w KQkq - 0 8 -> 39",
        "r1bqk2r/pppp1ppp/2n5/8/1bBPn3/2N2N2/PP3PPP/R1BQ1RK1 b kq - 1 8 -> 42",
        "r1bqk2r/pppp1ppp/2n5/8/1bBP4/2n2N2/PP3PPP/R1BQ1RK1 w kq - 0 9 -> 37",
        "r1bqk2r/pppp1ppp/2n5/8/1bBP4/2P2N2/P4PPP/R1BQ1RK1 b kq - 0 9 -> 34",
        "r1bqk2r/pppp1ppp/2n5/8/2BP4/2b2N2/P4PPP/R1BQ1RK1 w kq - 0 10 -> 37",
        "r1bqk2r/pppp1ppp/2n5/8/2BP4/1Qb2N2/P4PPP/R1B2RK1 b kq - 1 10 -> 35",
        "r1bqk2r/pppp1ppp/2n5/8/2BP4/1Q3N2/P4PPP/b1B2RK1 w kq - 0 11 -> 42",
        "r1bqk2r/pppp1Bpp/2n5/8/3P4/1Q3N2/P4PPP/b1B2RK1 b kq - 0 11 -> 2",
        "r1bq1k1r/pppp1Bpp/2n5/8/3P4/1Q3N2/P4PPP/b1B2RK1 w - - 1 12 -> 45",
        "r1bq1k1r/pppp1Bpp/2n5/8/3P4/1Q3N2/P4PPP/b1B1R1K1 b - - 2 12 -> 26",
        "r1bq1k1r/ppp2Bpp/2np4/8/3P4/1Q3N2/P4PPP/b1B1R1K1 w - - 0 13 -> 52",
        "r1bq1k1r/ppp3pp/2np4/7B/3P4/1Q3N2/P4PPP/b1B1R1K1 b - - 1 13 -> 30",
        "r1b2k1r/pppq2pp/2np4/7B/3P4/1Q3N2/P4PPP/b1B1R1K1 w - - 2 14 -> 51",
        "r1b2k1r/pppq2pp/2np4/7B/3PR3/1Q3N2/P4PPP/b1B3K1 b - - 3 14 -> 28",
        "r1b2k1r/pppq2p1/2np3p/7B/3PR3/1Q3N2/P4PPP/b1B3K1 w - - 0 15 -> 53",
        "r1b2k1r/pppq2p1/2np3p/7B/3PR2N/1Q6/P4PPP/b1B3K1 b - - 1 15 -> 28",
        "r1b2k1r/pppq4/2np3p/6pB/3PR2N/1Q6/P4PPP/b1B3K1 w - g6 0 16 -> 56",
        "r1b2k1r/pppqR3/2np3p/6pB/3P3N/1Q6/P4PPP/b1B3K1 b - - 1 16 -> 28",
        "r1b2k1r/ppp1q3/2np3p/6pB/3P3N/1Q6/P4PPP/b1B3K1 w - - 0 17 -> 47",
        "r1b2k1r/ppp1q3/2np2Np/6pB/3P4/1Q6/P4PPP/b1B3K1 b - - 1 17 -> 2",
        "r1b4r/ppp1q1k1/2np2Np/6pB/3P4/1Q6/P4PPP/b1B3K1 w - - 2 18 -> 48",
        "r1b4r/ppp1N1k1/2np3p/6pB/3P4/1Q6/P4PPP/b1B3K1 b - - 0 18 -> 30",
        "r1b2r2/ppp1N1k1/2np3p/6pB/3P4/1Q6/P4PPP/b1B3K1 w - - 1 19 -> 51",
        "r1b2r2/ppp3k1/2Np3p/6pB/3P4/1Q6/P4PPP/b1B3K1 b - - 0 19 -> 29",
        "r1b2r2/p1p3k1/2pp3p/6pB/3P4/1Q6/P4PPP/b1B3K1 w - - 0 20 -> 46",
        "r1b2r2/p1p3k1/2pp3p/6pB/3P4/8/P4PPP/bQB3K1 b - - 1 20 -> 29",
        "r1b5/p1p3k1/2pp1r1p/6pB/3P4/8/P4PPP/bQB3K1 w - - 2 21 -> 38",
        "r1b5/p1p3k1/2pp1r1p/6pB/3P4/8/P4PPP/Q1B3K1 b - - 0 21 -> 25",
        "1rb5/p1p3k1/2pp1r1p/6pB/3P4/8/P4PPP/Q1B3K1 w - - 1 22 -> 27",
        "1rb5/p1p3k1/2pp1r1p/6pB/3P4/2Q5/P4PPP/2B3K1 b - - 2 22 -> 32"
    ]

    function compareFens(currentFen, possibleMoves) {
        for (let f of fenList) {
            const tokens = f.split('->');
            const movesCount = Number(tokens[1].trim());
            const pos = tokens[0].split(' ')[0];
            const currentPos = currentFen.split(' ')[0];

            if (pos === currentPos) {
                const count = possibleMoves.reduce((sum, value) => sum + value.moves.length, 0);

                if (count === movesCount) {
                    console.log(`Match for FEN: ${pos}`);
                } else {
                    console.log(`Doesn't match for FEN: ${pos}. Expected: ${movesCount}, got: ${count}`);
                }
            }
        }
    }

    /**
     * Updates the possible move state for a specific square.
     * This function modifies the `isPossibleMove` array to indicate which squares can be moved to.
     *
     * @param {string} key - The key of the square to update.
     * @param {boolean} value - The new value indicating whether the move is possible.
     */
    const updateIsPossibleMove = useCallback((key, value) => {
        setIsPossibleMove(prevState =>
            prevState.map(item =>
                item.key === key ? { ...item, value: value } : item
            )
        );
    }, []);

    /**
    * Resets possible moves highlighting.
    * This function initializes the `isPossibleMove` array to indicate no possible moves.
    */
    const resetPossibleMoves = useCallback(() => {
        const initialIsPossibleMove = [];
        for (let i = 0; i < GlobalVariables.DIM; i++) {
            for (let j = 0; j < GlobalVariables.DIM; j++) {
                initialIsPossibleMove.push({ key: `${i}${GlobalVariables.PIECE_DELIMITER}${j}`, value: false });
            }
        }
        setIsPossibleMove(initialIsPossibleMove);
    }, []);

    /**
     * Updates the `isPossibleMove` array based on the `PossibleMoves` array.
     * Forces a component update to visually indicate the possible moves on the board.
     */
    const updatePossibleMovesVisually = useCallback(() => {
        for (let i = 0; i < GlobalVariables.PossibleMoves.length; i++) {
            if (HelperMethods.checkIfAMoveIsEqualToTheCurrentSelectedSquare(GlobalVariables.PossibleMoves[i].piece)) {
                for (let j = 0; j < GlobalVariables.PossibleMoves[i].moves.length; j++) {
                    updateIsPossibleMove(`${GlobalVariables.PossibleMoves[i].moves[j].props.x}${GlobalVariables.PIECE_DELIMITER}${GlobalVariables.PossibleMoves[i].moves[j].props.y}`, true);
                }
            }
        }
    }, [updateIsPossibleMove]);

    /**
     * Moves a piece on the board.
     * This function handles all aspects of moving a piece, including updating the board state, 
     * handling special moves like en passant and castling, and updating move counters.
     *
     * @param {number} x - The x coordinate of the target square.
     * @param {number} y - The y coordinate of the target square.
     */
    const movePiece = useCallback((x, y) => {
        const squares = boardSquaresRef.current;

        const targetSquare = HelperMethods.getATargetSquareByLocation(x, y, squares);
        const square = squares.find(s => HelperMethods.checkIfAMoveIsEqualToTheCurrentSelectedSquare(s));

        let updatedPosition = HelperMethods.updateBoardPosition(square, targetSquare);
        HelperMethods.disableCastlingIfKingOrRookMoves(square);
        updatedPosition = HelperMethods.captureEnPassant(square, targetSquare, updatedPosition, squares);

        HelperMethods.updateBoardState(updatedPosition);
        HelperMethods.resetPossibleMovesAndToggleTurn();

        HelperMethods.enableEnPassant(square, targetSquare);
        HelperMethods.updateMoveCounters();

        const newFen = HelperMethods.generateANewFen();
        setFen(newFen)
    }, [boardSquaresRef]);

    /**
     * Retrieves and updates the possible moves for all pieces on the board.
     * This function collects all possible moves for the current player's pieces
     * and updates the global possible moves state.
     */
    const getPossibleMoves = useCallback(() => {
        const squares = boardSquaresRef.current;
        let possiblePieceMoves = [];

        squares.forEach(square => {
            if (square.props.piece) {
                const color = HelperMethods.getPieceColor(square);

                if (MoveHandling.isMoveAllowed(color)) {
                    possiblePieceMoves.push(...MoveHandling.collectPossibleMoves(square, squares));
                }
            }
        });

        //console.log("Possible Moves:", possiblePieceMoves);
        //console.log('Moves count', possiblePieceMoves.reduce((sum, pieceMove) => sum + pieceMove.moves.length, 0));
        compareFens(fenRef.current, possiblePieceMoves)

        MoveHandling.updatePossibleMoves(possiblePieceMoves);
        updatePossibleMovesVisually();
    }, [updatePossibleMovesVisually]);

    /**
     * Memoizes the rendered board squares to prevent unnecessary re-renders.
     * This useMemo hook ensures that the `renderedBoardSquares` array is only recalculated
     * when the `boardSquares` state changes. This optimization helps to improve performance
     * by avoiding redundant rendering of the board squares when there are no changes to the
     * `boardSquares` array.
     *
     * @returns {Array} - The memoized array of board squares.
     */
    const renderedBoardSquares = useMemo(() => {
        return boardSquares.map((sqr) => sqr);
    }, [boardSquares]);

    //renders the board
    return (
        <div className="chessGrid">
            {renderedBoardSquares}
        </div>
    )
}

export default Board