import * as GlobalVariables from './globalVariables';
import * as HelperMethods from './HelperMethods';

/**
 * Returns all possible moves for a given square based on the piece type.
 * @param {object} square - The square containing the piece.
 * @param {Array} boardSquares - The current state of the board.
 * @returns {Array} - The possible moves for the piece on the given square.
 */
export function getAllPossibleMoves(square, boardSquares) {
    const pieceColor = HelperMethods.getPieceColor(square);
    const pieceType = HelperMethods.getPiece(square);
    const moveHandlers = {
        [GlobalVariables.PIECES.PAWN]: getPawnMoves,
        [GlobalVariables.PIECES.ROOK]: getRookMoves,
        [GlobalVariables.PIECES.KNIGHT]: getKnightMoves,
        [GlobalVariables.PIECES.BISHOP]: getBishopMoves,
        [GlobalVariables.PIECES.QUEEN]: getQueenMoves,
        [GlobalVariables.PIECES.KING]: getKingMoves,
    };

    const moveHandler = moveHandlers[pieceType];
    return moveHandler ? [moveHandler(square, boardSquares, pieceColor)] : [];
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
    const color = HelperMethods.getPieceColor(square)
    offsets.forEach(([dx, dy]) => {
        const targetX = square.props.x + dx;
        const targetY = square.props.y + dy;
        const target = HelperMethods.getATargetSquareByLocation(targetX, targetY, boardSquares);

        if (target) {
            if (HelperMethods.isKing(square) && checkIfTargetHasKingAsNeighbor(target, boardSquares, color)) {
                return
            }
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
 * Checks if the target square has a neighboring square occupied by an opponent's king.
 *
 * @param {object} target - The target square to check.
 * @param {Array} boardSquares - The array representing the current state of the board.
 * @param {string} color - The color of square's piece that's moving.
 * @returns {boolean} - Returns true if there is a neighboring square occupied by an opponent's king, otherwise false.
 */
function checkIfTargetHasKingAsNeighbor(target, boardSquares, color) {
    const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    for (const [dx, dy] of directions) {
        const neighborX = target.props.x + dx;
        const neighborY = target.props.y + dy;
        const neighbor = HelperMethods.getATargetSquareByLocation(neighborX, neighborY, boardSquares);

        if (neighbor && HelperMethods.isKing(neighbor) && HelperMethods.getPieceColor(neighbor) !== color) {
            return true;
        }
    }
    return false;
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
    while (HelperMethods.areCoordinatesInBounds(x, y)) {
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
 * @returns {Array} - The possible moves array.
 */
function getPawnMoves(square, boardSquares) {
    const moves = []
    const pieceColor = HelperMethods.getPieceColor(square)
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

        if (enPassantSquare && validEnPassantOffsets.some(([x, y]) => HelperMethods.areCoordinatesInBounds(x, y) &&
            HelperMethods.compareIfTwoSquaresAreTheSame(enPassantSquare, getTargetSquare(x, y)))) {
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
 * @returns {Array} - The possible moves array.
 */
function getRookMoves(square, boardSquares) {
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
 * @returns {Array} - The possible moves array.
 */
function getKnightMoves(square, boardSquares) {
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
 * @returns {Array} - The possible moves array.
 */
function getBishopMoves(square, boardSquares) {
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
 * @returns {Array} - The possible moves array.
 */
function getQueenMoves(square, boardSquares) {
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
 * @returns {Array} - The possible moves array.
 */
function getKingMoves(square, boardSquares) {
    const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    const moves = getMovesForOffsets(square, boardSquares, directions);

    const color = HelperMethods.getPieceColor(square);

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

    const isWhite = HelperMethods.isColorWhite(color);

    // Check and add long castling move
    if (HelperMethods.isCastlingPossible(GlobalVariables.CASTLING_TYPES.LONG, isWhite)) {
        moves.push(longCastleSquare);
    }

    // Check and add short castling move
    if (HelperMethods.isCastlingPossible(GlobalVariables.CASTLING_TYPES.SHORT, isWhite)) {
        moves.push(shortCastleSquare);
    }

    return moves;
}

/**
 * Filters out moves that do not deal with a check.
 * @param {Array} possibleMoves - The array of possible moves.
 * @param {Array} boardSquares - The board squares array.
 * @returns {Array} - The filtered array of possible moves.
 */
export function filterMovesIfInCheck(possibleMoves, boardSquares) {
    const blackKing = HelperMethods.getATargetSquareByPiece(GlobalVariables.KINGS.BLACK_KING, boardSquares);
    const whiteKing = HelperMethods.getATargetSquareByPiece(GlobalVariables.KINGS.WHITE_KING, boardSquares);
    const king = GlobalVariables.IsWhiteToMove ? whiteKing : blackKing

    const filterMoves = (moves, piece) => {
        return moves.filter(move => {
            return HelperMethods.isMoveLegal(king, boardSquares, piece, move)
        });
    };

    return possibleMoves.map(moveSet => {
        const filteredMoves = filterMoves(moveSet.moves, moveSet.piece);
        return { ...moveSet, moves: filteredMoves };
    });
}

/**
 * Filters out moves that allow illegal castling (castling through check).
 * @param {Array} possibleMoves - The array of possible moves.
 * @param {Array} boardSquares - The board squares array.
 * @returns {Array} - The filtered array of possible moves.
 */
export function filterMovesThatAllowIllegalCastling(possibleMoves, boardSquares) {
    const blackKing = HelperMethods.getATargetSquareByPiece(GlobalVariables.KINGS.BLACK_KING, boardSquares);
    const whiteKing = HelperMethods.getATargetSquareByPiece(GlobalVariables.KINGS.WHITE_KING, boardSquares);
    const king = GlobalVariables.IsWhiteToMove ? whiteKing : blackKing
    const castleRow = GlobalVariables.IsWhiteToMove ? GlobalVariables.CASTLE_ROW_WHITE : GlobalVariables.CASTLE_ROW_BLACK

    const removeCastlingMove = (moves, x, y) => {
        //get the index of the move
        const index = moves.findIndex(m => HelperMethods.isSquareOnRow(m, x) && HelperMethods.isSquareOnColumn(m, y));

        //remove the move if it exists
        if (index !== -1) {
            moves.splice(index, 1);
        }
    };

    const isIllegalCastling = (king, shortCastle, longCastle, acrossShort, acrossLong) => {
        if (king && (shortCastle || longCastle)) {
            if (shortCastle && acrossShort && acrossShort.props.piece) {
                removeCastlingMove(king.moves, shortCastle.props.x, shortCastle.props.y);
            }
            if (longCastle && acrossLong && acrossLong.props.piece) {
                removeCastlingMove(king.moves, longCastle.props.x, longCastle.props.y);
            }
        }
    };

    return possibleMoves.map(moveSet => {
        const piece = moveSet.piece;
        const moves = moveSet.moves;

        //get the squares where the king will end up after castling
        const shortCastle = HelperMethods.getATargetSquareByLocation(castleRow, GlobalVariables.CASTLE_KING_FINAL_COL_SHORT, moves)
        const longCastle = HelperMethods.getATargetSquareByLocation(castleRow, GlobalVariables.CASTLE_KING_FINAL_COL_LONG, moves)

        if (HelperMethods.compareIfTwoSquaresAreTheSame(piece, king)) {
            if (HelperMethods.isKingInCheck(king, boardSquares)) {
                removeCastlingMove(moves, castleRow, GlobalVariables.CASTLE_KING_FINAL_COL_SHORT);
                removeCastlingMove(moves, castleRow, GlobalVariables.CASTLE_KING_FINAL_COL_LONG);
            }

            const acrossShort = HelperMethods.getATargetSquareByLocation(castleRow, GlobalVariables.CASTLE_ROOK_FINAL_COL_SHORT, moves)
            const acrossLong = HelperMethods.getATargetSquareByLocation(castleRow, GlobalVariables.CASTLE_ROOK_FINAL_COL_LONG, moves)

            isIllegalCastling(moveSet, shortCastle, longCastle, acrossShort, acrossLong);
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

/**
 * Determines if a move is allowed based on the current player's turn.
 * @param {string} color - The color of the piece.
 * @returns {boolean} - True if the move is allowed, false otherwise.
 */
export function isMoveAllowed(color) {
    return (HelperMethods.isColorWhite(color) && GlobalVariables.IsWhiteToMove) ||
        (HelperMethods.isColorBlack(color) && !GlobalVariables.IsWhiteToMove);
}

/**
 * Collects possible moves for a given square.
 * @param {object} square - The square to collect moves for.
 * @param {Array} squares - The current board squares.
 * @returns {Array} - The possible moves for the piece on the square.
 */
export function collectPossibleMoves(square, squares) {
    let possiblePieceMoves = getAllPossibleMoves(square, squares);
    possiblePieceMoves = removeEmptyMoves(possiblePieceMoves);
    possiblePieceMoves = filterMovesIfInCheck(possiblePieceMoves, squares);
    possiblePieceMoves = filterMovesThatAllowIllegalCastling(possiblePieceMoves, squares);
    return possiblePieceMoves;
}

/**
 * Updates the global possible moves array.
 * @param {Array} possiblePieceMoves - The possible moves to update.
 */
export function updatePossibleMoves(possiblePieceMoves) {
    GlobalVariables.PossibleMoves.splice(0, GlobalVariables.PossibleMoves.length, ...possiblePieceMoves);
}