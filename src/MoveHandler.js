import * as GlobalVariables from './globalVariables';
import * as HelperMethods from './HelperMethods';

/**
 * Gets all possible moves for a piece.
 * @param {object} square - The current square.
 * @param {Array} boardSquares - The current board squares.
 * @returns {Array} - The possible moves array.
 */
export function getAllPossibleMoves(square, boardSquares) {
    const piece = HelperMethods.getPiece(square);
    const pieceColor = HelperMethods.getPieceColor(square);

    switch (piece) {
        case GlobalVariables.PIECES.PAWN:
            return getPawnMoves(square, boardSquares, pieceColor);
        case GlobalVariables.PIECES.ROOK:
            return getRookMoves(square, boardSquares, pieceColor);
        case GlobalVariables.PIECES.KNIGHT:
            return getKnightMoves(square, boardSquares, pieceColor);
        case GlobalVariables.PIECES.BISHOP:
            return getBishopMoves(square, boardSquares, pieceColor);
        case GlobalVariables.PIECES.QUEEN:
            return getQueenMoves(square, boardSquares, pieceColor);
        case GlobalVariables.PIECES.KING:
            return getKingMoves(square, boardSquares, pieceColor);
        default:
            return [];
    }
}

/**
 * Gets possible moves for a piece based on specified offsets.
 * @param {object} square - The current square.
 * @param {Array} boardSquares - The current board squares.
 * @param {Array} offsets - An array of [dx, dy] offsets to check for possible moves.
 * @returns {Array} - The possible moves array.
 */
function getMovesForOffsets(square, boardSquares, offsets) {
    const moves = [];
    offsets.forEach(([dx, dy]) => {
        const targetX = square.props.x + dx;
        const targetY = square.props.y + dy;
        const target = HelperMethods.getATargetSquareByLocation(targetX, targetY, boardSquares);

        if (target) {
            if (HelperMethods.isSquareAvailable(target)) {
                moves.push(target);
            } else if (!HelperMethods.areSameColor(square, target)) {
                moves.push(target);
            }
        }
    });
    return moves;
}

/**
 * Gets all possible moves in a given direction for a piece.
 * @param {object} square - The current square.
 * @param {Array} boardSquares - The current board squares.
 * @param {Array} direction - The direction to move in [xIncrement, yIncrement].
 * @returns {Array} - The possible moves array in the given direction.
 */
function getMovesInDirection(square, boardSquares, [xIncrement, yIncrement]) {
    const moves = [];
    let x = square.props.x + xIncrement;
    let y = square.props.y + yIncrement;
    while (x >= 0 && x < GlobalVariables.DIM && y >= 0 && y < GlobalVariables.DIM) {
        const targetSquare = HelperMethods.getATargetSquareByLocation(x, y, boardSquares);
        if (HelperMethods.isSquareAvailable(targetSquare)) {
            moves.push(targetSquare);
        } else {
            if (!HelperMethods.areSameColor(square, targetSquare)) {
                moves.push(targetSquare);
            }
            break;
        }
        x += xIncrement;
        y += yIncrement;
    }
    return moves;
}

/**
 * Gets possible moves for a pawn.
 * @param {object} square - The current square.
 * @param {Array} boardSquares - The current board squares.
 * @param {string} pieceColor - The color of the piece.
 * @returns {Array} - The possible moves array.
 */
function getPawnMoves(square, boardSquares, pieceColor) {
    const moves = []
    const isWhite = HelperMethods.isColorWhite(pieceColor);
    const direction = isWhite ? -1 : 1;

    // Forward move offsets
    const forwardOne = direction;
    const forwardTwo = direction * 2;

    // Helper function to get target square
    const getTargetSquare = (x, y) => HelperMethods.getATargetSquareByLocation(x, y, boardSquares);

    // Calculate potential forward moves
    const addForwardMoves = () => {
        const target1X = square.props.x + forwardOne;
        const target2X = square.props.x + forwardTwo;

        const target1 = getTargetSquare(target1X, square.props.y);
        const target2 = getTargetSquare(target2X, square.props.y);

        if (HelperMethods.isSquareAvailable(target1)) {
            moves.push(target1);
            if (HelperMethods.isSquareAvailable(target2) && HelperMethods.isPawnOnStartingSquare(square)) {
                moves.push(target2);
            }
        }
    };

    // Calculate potential capture moves
    const addCaptureMoves = () => {
        const captureOffsets = [
            [forwardOne, 1],
            [forwardOne, -1]
        ];

        captureOffsets.forEach(([xOffset, yOffset]) => {
            const targetX = square.props.x + xOffset;
            const targetY = square.props.y + yOffset;
            const targetSquare = getTargetSquare(targetX, targetY);

            if (targetSquare && !HelperMethods.isSquareAvailable(targetSquare) && !HelperMethods.areSameColor(targetSquare, square)) {
                moves.push(targetSquare);
            }
        });
    };

    // Check for en passant capture
    const addEnPassantMove = () => {
        if (!GlobalVariables.EnPassant.isPossible) return;
        const enPassantSquare = getTargetSquare(GlobalVariables.EnPassant.x, GlobalVariables.EnPassant.y);
        const validEnPassantOffsets = [
            [square.props.x + forwardOne, square.props.y + 1],
            [square.props.x + forwardOne, square.props.y - 1]
        ];

        if (enPassantSquare && validEnPassantOffsets.some(([x, y]) => HelperMethods.compareIfTwoSquaresAreTheSame(enPassantSquare, getTargetSquare(x, y)))) {
            moves.push(enPassantSquare);
        }
    };

    // Add all possible moves
    addForwardMoves();
    addCaptureMoves();
    addEnPassantMove();

    return { piece: square, moves: moves }
}

/**
 * Gets possible moves for a rook.
 * @param {object} square - The current square.
 * @param {Array} boardSquares - The current board squares.
 * @param {string} _pieceColor - The color of the piece.
 * @returns {Array} - The possible moves array.
 */
function getRookMoves(square, boardSquares, _pieceColor) {
    const directions = [
        [1, 0],  // Right
        [-1, 0], // Left
        [0, 1],  // Up
        [0, -1]  // Down
    ];

    const moves = directions.flatMap(direction => getMovesInDirection(square, boardSquares, direction));

    return { piece: square, moves };
}

/**
 * Gets possible moves for a knight.
 * @param {object} square - The current square.
 * @param {Array} boardSquares - The current board squares.
 * @param {string} _pieceColor - The color of the piece.
 * @returns {Array} - The possible moves array.
 */
function getKnightMoves(square, boardSquares, _pieceColor) {
    const knightMoves = [
        [2, 1], [1, 2], [-1, 2], [-2, 1],
        [-2, -1], [-1, -2], [1, -2], [2, -1]
    ];

    const moves = getMovesForOffsets(square, boardSquares, knightMoves);
    return { piece: square, moves };
}

/**
 * Gets possible moves for a bishop.
 * @param {object} square - The current square.
 * @param {Array} boardSquares - The current board squares.
 * @param {string} _pieceColor - The color of the piece.
 * @returns {Array} - The possible moves array.
 */
function getBishopMoves(square, boardSquares, _pieceColor) {
    const directions = [
        [-1, -1], // Top-left diagonal
        [-1, 1],  // Bottom-left diagonal
        [1, 1],   // Bottom-right diagonal
        [1, -1]   // Top-right diagonal
    ];

    const moves = directions.flatMap(direction => getMovesInDirection(square, boardSquares, direction));

    return { piece: square, moves };
}

/**
 * Gets possible moves for a queen.
 * @param {object} square - The current square.
 * @param {Array} boardSquares - The current board squares.
 * @param {string} _pieceColor - The color of the piece.
 * @returns {Array} - The possible moves array.
 */
function getQueenMoves(square, boardSquares, _pieceColor) {
    const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1], // Rook directions
        [1, 1], [1, -1], [-1, 1], [-1, -1] // Bishop directions
    ];

    const moves = directions.flatMap(direction => getMovesInDirection(square, boardSquares, direction));

    return { piece: square, moves };
}

/**
 * Gets possible moves for a king.
 * @param {object} square - The current square.
 * @param {Array} boardSquares - The current board squares.
 * @param {string} _pieceColor - The color of the piece.
 * @returns {Array} - The possible moves array.
 */
function getKingMoves(square, boardSquares, _pieceColor) {
    const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    const moves = getMovesForOffsets(square, boardSquares, directions);

    const color = _pieceColor(square);

    // Castling logic
    const castlingMoves = getCastlingMoves(square, color, boardSquares);
    moves.push(...castlingMoves);

    return { piece: square, moves };
}

/**
 * Gets castling moves for a king.
 * @param {object} square - The current square.
 * @param {string} color - The color of the piece.
 * @param {Array} boardSquares - The current board squares.
 * @returns {Array} - The possible castling moves array.
 */
function getCastlingMoves(square, color, boardSquares) {
    const moves = [];

    const longCastleSquare = HelperMethods.getATargetSquareByLocation(square.props.x, square.props.y - 2, boardSquares);
    const shortCastleSquare = HelperMethods.getATargetSquareByLocation(square.props.x, square.props.y + 2, boardSquares);

    const castlingChecks = {
        [color.WHITE]: {
            long: checkIfCanWhiteLongCastle,
            short: checkIfCanWhiteShortCastle,
        },
        [color.BLACK]: {
            long: checkIfCanBlackLongCastle,
            short: checkIfCanBlackShortCastle,
        }
    };

    const checkFunctions = castlingChecks[color];

    if (checkFunctions.long()) {
        moves.push(longCastleSquare);
    }
    if (checkFunctions.short()) {
        moves.push(shortCastleSquare);
    }

    return moves;
}

/**
 * Filters out moves that do not deal with a check.
 * @param {Array} possibleMoves - The array of possible moves.
 * @returns {Array} - The filtered array of possible moves.
 */
export function filterMovesIfInCheck(possibleMoves) {
    const blackKing = HelperMethods.getATargetSquareByPiece(GlobalVariables.KINGS.BLACK_KING, boardSquaresRef.current);
    const whiteKing = HelperMethods.getATargetSquareByPiece(GlobalVariables.KINGS.WHITE_KING, boardSquaresRef.current);

    const isKingInCheck = (king, move, piece) => {
        const pseudoMove = { x: king.props.x, y: king.props.y, piece: "" };
        if (piece === GlobalVariables.KINGS.BLACK_KING) {
            return HelperMethods.isBlackInCheck(move, pseudoMove);
        } else if (piece === GlobalVariables.KINGS.WHITE_KING) {
            return HelperMethods.isWhiteInCheck(move, pseudoMove);
        } else {
            return (GlobalVariables.IsWhiteToMove && HelperMethods.isWhiteInCheck(whiteKing, move, piece)) ||
                (!GlobalVariables.IsWhiteToMove && HelperMethods.isBlackInCheck(blackKing, move, piece));
        }
    };

    const filterMoves = (moves, piece) => {
        return moves.filter(move => {
            const moveSquare = <Square x={move.props.x} y={move.props.y} piece={piece} />;
            return !isKingInCheck(piece, moveSquare, piece);
        });
    };

    return possibleMoves.map(moveSet => {
        const filteredMoves = filterMoves(moveSet.moves, moveSet.piece.props.piece);
        return { ...moveSet, moves: filteredMoves };
    });
}

/**
 * Filters out moves that allow illegal castling (castling through check).
 * @param {Array} possibleMoves - The array of possible moves.
 * @returns {Array} - The filtered array of possible moves.
 */
export function filterMovesThatAllowIllegalCastling(possibleMoves) {
    const blackKing = HelperMethods.getATargetSquareByPiece(GlobalVariables.KINGS.BLACK_KING, boardSquaresRef.current);
    const whiteKing = HelperMethods.getATargetSquareByPiece(GlobalVariables.KINGS.WHITE_KING, boardSquaresRef.current);

    const removeCastlingMove = (moves, x, y) => {
        const index = moves.findIndex(m => m.props.x === x && m.props.y === y);
        if (index !== -1) {
            moves.splice(index, 1);
        }
    };

    const isIllegalCastling = (king, castle1, castle2, across1, across2) => {
        if (king && (castle1 || castle2)) {
            if (castle1 && !across1) {
                removeCastlingMove(king.moves, castle1.props.x, castle1.props.y);
            }
            if (castle2 && !across2) {
                removeCastlingMove(king.moves, castle2.props.x, castle2.props.y);
            }
        }
    };

    return possibleMoves.map(moveSet => {
        const piece = moveSet.piece;
        const moves = moveSet.moves;

        const whiteCastle1 = moves.find(m => m.props.x === 7 && m.props.y === 6);
        const whiteCastle2 = moves.find(m => m.props.x === 7 && m.props.y === 2);
        const blackCastle1 = moves.find(m => m.props.x === 0 && m.props.y === 6);
        const blackCastle2 = moves.find(m => m.props.x === 0 && m.props.y === 2);

        if (piece === blackKing || piece === whiteKing) {
            isIllegalCastling(moveSet, whiteCastle1, whiteCastle2,
                moves.find(m => m.props.x === 7 && m.props.y === 5),
                moves.find(m => m.props.x === 7 && m.props.y === 3));

            isIllegalCastling(moveSet, blackCastle1, blackCastle2,
                moves.find(m => m.props.x === 0 && m.props.y === 5),
                moves.find(m => m.props.x === 0 && m.props.y === 3));
        }

        if (piece === blackKing && HelperMethods.isBlackInCheck(blackKing)) {
            removeCastlingMove(moves, 0, 6);
            removeCastlingMove(moves, 0, 2);
        }

        if (piece === whiteKing && HelperMethods.isWhiteInCheck(whiteKing)) {
            removeCastlingMove(moves, 7, 6);
            removeCastlingMove(moves, 7, 2);
        }

        return moveSet;
    });
}

/**
 * Removes empty or undefined moves from the possible moves array.
 * @param {Array} possibleMoves - The array of possible moves.
 * @returns {Array} - The cleaned array of possible moves.
 */
export function removeEmptyMoves(possibleMoves) {
    return possibleMoves.filter(moveSet =>
        moveSet && moveSet.moves && moveSet.moves.length > 0
    ).map(moveSet => ({
        ...moveSet,
        moves: moveSet.moves.filter(move => move)
    }));
}