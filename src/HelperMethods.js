import React from 'react';
import Square from "./Square.js"
import * as GlobalVariables from './globalVariables';
import * as MoveHandling from './MoveHandler.js'

/**
 * Checks if a character is Uppercase using the ASCII table.
 * @param {string} value - The character to check.
 * @returns {boolean} - True if the character is uppercase, false otherwise.
 */
export function IsUpperCase(value) {
    return value.charCodeAt(0) >= 65 && value.charCodeAt(0) <= 90;
}

/**
 * Checks if a character is Lowercase using the ASCII table.
 * @param {string} value - The character to check.
 * @returns {boolean} - True if the character is lowercase, false otherwise.
 */
export function IsLowerCase(value) {
    return value.charCodeAt(0) >= 97 && value.charCodeAt(0) <= 122;
}

/**
 * Checks if a character is a Digit using the ASCII table.
 * @param {string} value - The character to check.
 * @returns {boolean} - True if the character is a digit, false otherwise.
 */
export function IsDigit(value) {
    return value.charCodeAt(0) >= 48 && value.charCodeAt(0) <= 57;
}

/**
 * Parses a FEN string and returns its components.
 * @param {string} fen - The FEN string to parse.
 * @returns {object} - An object containing the FEN components.
 */
export function ParseFEN(fen) {
    const fenParts = fen.split(' ');
    if (fenParts.length !== 6) {
        throw new Error('Invalid FEN');
    }
    const [fenBoard, fenTurn, fenCastling, fenEnPassant, fenHalfMoves, fenFullMoves] = fenParts;
    return {
        fenBoard,
        fenTurn,
        fenCastling,
        fenEnPassant,
        fenHalfMoves: Number(fenHalfMoves),
        fenFullMoves: Number(fenFullMoves)
    };
}

/**
 * Converts FEN piece notation to an actual piece.
 * @param {string} letter - The FEN notation of the piece.
 * @returns {string} - The actual piece.
 */
export function ConvertFENtoPiece(letter) {
    const FEN_PIECE_MAP = {
        [GlobalVariables.FEN_PIECES_BLACK.PAWN]: GlobalVariables.PIECES.PAWN,
        [GlobalVariables.FEN_PIECES_BLACK.KNIGHT]: GlobalVariables.PIECES.KNIGHT,
        [GlobalVariables.FEN_PIECES_BLACK.KING]: GlobalVariables.PIECES.KING,
        [GlobalVariables.FEN_PIECES_BLACK.QUEEN]: GlobalVariables.PIECES.QUEEN,
        [GlobalVariables.FEN_PIECES_BLACK.ROOK]: GlobalVariables.PIECES.ROOK,
        [GlobalVariables.FEN_PIECES_BLACK.BISHOP]: GlobalVariables.PIECES.BISHOP,
    };

    return FEN_PIECE_MAP[letter.toLowerCase()] || "";
}

/**
 * Converts the FEN piece notation to a piece that we can use in the square component.
 * @param {string} value - The FEN notation of the piece.
 * @returns {string} - The piece in {color-piece} format.
 */
export function ConvertFENPieceToPiece(value) {
    if (IsUpperCase(value)) {
        return `${GlobalVariables.COLORS.WHITE}-${ConvertFENtoPiece(value)}`;
    }

    if (IsLowerCase(value)) {
        return `${GlobalVariables.COLORS.BLACK}-${ConvertFENtoPiece(value)}`;
    }

    return "";
}

/**
 * Converts a string in FEN format to a normal string.
 * @param {string} value - The FEN string.
 * @returns {string} - The normal string.
 */
export function ConvertFenToString(value) {
    return value.split('').reduce((result, char) => {
        if (IsDigit(char)) {
            return result + GlobalVariables.EMPTY_SQUARE_PIECE.repeat(Number(char));
        }
        return result + char;
    }, '');
}

/**
 * Checks if two squares are on the same row.
 * @param {object} square1 - The first square.
 * @param {object} square2 - The second square.
 * @returns {boolean} - True if the squares are on the same row, false otherwise.
 */
export function checkIfTwoSquaresAreOnTheSameRow(square1, square2) {
    return square1.props.x === square2.props.x;
}

/**
 * Checks if the square is on the given row number.
 * @param {object} square - The square to check.
 * @param {number} rowNumber - The row number.
 * @returns {boolean} - True if the square is on the given row, false otherwise.
 */
export function isSquareOnRow(square, rowNumber) {
    return square.props.x === rowNumber;
}

/**
 * Gets the piece from a square.
 * @param {object} square - The square to get the piece from.
 * @returns {string} - The piece.
 */
export function getPiece(square) {
    return square.props.piece.split(GlobalVariables.PIECE_DELIMITER)[GlobalVariables.PIECE_PIECE_INDEX];
}

/**
 * Checks if a square has a specific piece.
 * @param {object} square - The square to check.
 * @param {string} piece - The piece to check for.
 * @returns {boolean} - True if the square has the piece, false otherwise.
 */
export function doesTheSquareHasThePiece(square, piece) {
    return getPiece(square) === piece;
}

/**
 * Gets the piece color from a square.
 * @param {object} square - The square to get the piece color from.
 * @returns {string} - The piece color.
 */
export function getPieceColor(square) {
    return square.props.piece.split(GlobalVariables.PIECE_DELIMITER)[GlobalVariables.PIECE_COLOR_INDEX];
}

/**
 * Checks if a color is white.
 * @param {string} color - The color to check.
 * @returns {boolean} - True if the color is white, false otherwise.
 */
export function isColorWhite(color) {
    return color === GlobalVariables.COLORS.WHITE;
}

/**
 * Checks if a color is black.
 * @param {string} color - The color to check.
 * @returns {boolean} - True if the color is black, false otherwise.
 */
export function isColorBlack(color) {
    return color === GlobalVariables.COLORS.BLACK;
}

/**
 * Checks if two pieces are of the same color.
 * @param {string} piece1 - The first piece.
 * @param {string} piece2 - The second piece.
 * @returns {boolean} - True if the pieces are of the same color, false otherwise.
 */
export function areSameColor(piece1, piece2) {
    const color1 = piece1.split(GlobalVariables.PIECE_DELIMITER)[GlobalVariables.PIECE_COLOR_INDEX];
    const color2 = piece2.split(GlobalVariables.PIECE_DELIMITER)[GlobalVariables.PIECE_COLOR_INDEX];
    return color1 === color2;
}

/**
 * Checks if a move is equal to the current selected square.
 * @param {object} move - The move to check.
 * @returns {boolean} - True if the move is equal to the current selected square, false otherwise.
 */
export function checkIfAMoveIsEqualToTheCurrentSelectedSquare(move) {
    return move.props.x === GlobalVariables.CurrentSquareSelection.x && move.props.y === GlobalVariables.CurrentSquareSelection.y;
}

/**
 * Compares if two squares are the same.
 * @param {object} square1 - The first square.
 * @param {object} square2 - The second square.
 * @returns {boolean} - True if the squares are the same, false otherwise.
 */
export function compareIfTwoSquaresAreTheSame(square1, square2) {
    return square1.props.x === square2.props.x && square1.props.y === square2.props.y;
}

/**
 * Gets a target square by its location.
 * @param {number} x - The x coordinate of the target square.
 * @param {number} y - The y coordinate of the target square.
 * @returns {object} - The target square.
 */
export function getATargetSquareByLocation(x, y) {
    return GlobalVariables.BoardPosition[x][y];
}

/**
 * Gets a target square by its piece.
 * @param {string} piece - The piece to search for.
 * @returns {object} - The target square.
 */
export function getATargetSquareByPiece(piece) {
    for (let row of GlobalVariables.BoardPosition) {
        for (let square of row) {
            if (square.props.piece === piece) {
                return square;
            }
        }
    }
    return null;
}

/**
 * Checks if castling is possible.
 * @param {string} castlingType - The type of castling (long or short).
 * @param {boolean} [withWhite=true] - True if checking for white's castling, false otherwise.
 * @returns {boolean} - True if castling is possible, false otherwise.
 */
export function isCastlingPossible(castlingType, withWhite = true) {
    const row = withWhite ? GlobalVariables.CASTLE_ROW_WHITE : GlobalVariables.CASTLE_ROW_BLACK;
    const pieces = withWhite ? GlobalVariables.FEN_PIECES_WHITE : GlobalVariables.FEN_PIECES_BLACK;
    const [rookCol, kingCol, pathCols] = castlingType === GlobalVariables.CASTLING_TYPES.LONG ?
        [GlobalVariables.CASTLE_ROOK_INITIAL_COL_LONG, GlobalVariables.CASTLE_KING_INITIAL_COL, GlobalVariables.CASTLE_PATH_COLS_LONG] :
        [GlobalVariables.CASTLE_ROOK_INITIAL_COL_SHORT, GlobalVariables.CASTLE_KING_INITIAL_COL, GlobalVariables.CASTLE_PATH_COLS_SHORT];

    return GlobalVariables.BoardPosition[row][rookCol] === pieces.ROOK &&
        GlobalVariables.BoardPosition[row][kingCol] === pieces.KING &&
        pathCols.every(col => GlobalVariables.BoardPosition[row][col] === GlobalVariables.EMPTY_SQUARE_PIECE);
}

/**
 * Checks if a pawn is on its starting square.
 * @param {object} pawn - The pawn to check.
 * @returns {boolean} - True if the pawn is on its starting square, false otherwise.
 */
export function isPawnOnStartingSquare(pawn) {
    const isWhite = isColorWhite(getPieceColor(pawn));
    return isWhite ? pawn.props.x === GlobalVariables.WHITE_PAWN_STARTING_SQUARE : pawn.props.x === GlobalVariables.BLACK_PAWN_STARTING_SQUARE;
}

/**
 * Checks if a pawn is on an en passant square.
 * @param {object} pawn - The pawn to check.
 * @returns {boolean} - True if the pawn is on an en passant square, false otherwise.
 */
export function isPawnOnEnPassantSquare(pawn) {
    const isWhite = isColorWhite(getPieceColor(pawn));
    return isWhite ? pawn.props.x === GlobalVariables.WHITE_EN_PASSANT_SQUARE : pawn.props.x === GlobalVariables.BLACK_EN_PASSANT_SQUARE;
}

/**
 * Checks if a square is available for a move.
 * @param {object} square - The square to check.
 * @returns {boolean} - True if the square is available, false otherwise.
 */
export function isSquareAvailable(square) {
    return !square.props.piece;
}

/**
 * Updates a column on a row with a new value.
 * @param {Array} row - The row to update.
 * @param {number} colIndex - The column index.
 * @param {string} newValue - The new value.
 * @returns {Array} - The updated row.
 */
export function updateColumnOnARow(row, colIndex, newValue) {
    row[colIndex] = newValue;
    return row;
}

/**
 * Removes the current square's piece.
 * @param {object} currentSquare - The current square.
 * @param {object} targetSquare - The target square.
 * @param {Array} row - The row to update.
 * @returns {Array} - The updated row.
 */
export function handleSquareOnCurrentRow(currentSquare, targetSquare, row) {
    return checkIfTwoSquaresAreOnTheSameRow(currentSquare, targetSquare) ?
        handleSquareAndTargetSquareOnTheSameRow(currentSquare, targetSquare, row) :
        updateColumnOnARow(row, currentSquare.props.y, GlobalVariables.EMPTY_SQUARE_PIECE);
}

/**
 * Updates the target square with the current square's piece.
 * @param {object} currentSquare - The current square.
 * @param {object} targetSquare - The target square.
 * @param {Array} row - The row to update.
 * @returns {Array} - The updated row.
 */
export function handleTargetSquareOnCurrentRow(currentSquare, targetSquare, row) {
    return updateColumnOnARow(row, targetSquare.props.y, ConvertPieceToFENPiece(currentSquare.props.piece));
}

/**
 * Checks if we're making a move on the same row and performs castling if we want to castle.
 * @param {object} currentSquare - The current square.
 * @param {object} targetSquare - The target square.
 * @param {Array} row - The row to update.
 * @returns {Array} - The updated row.
 */
export function handleSquareAndTargetSquareOnTheSameRow(currentSquare, targetSquare, row) {
    if (doesTheSquareHasThePiece(currentSquare, GlobalVariables.PIECES.KING) && isCastlingPossible(currentSquare, targetSquare)) {
        return handleCastling(currentSquare, row);
    }
    return SidewaysCapture(row, Number(currentSquare.props.y), Number(targetSquare.props.y), currentSquare.props.piece);
}

/**
 * Performs castling by swapping the rook and the king.
 * @param {object} square - The square to update.
 * @param {Array} row - The row to update.
 * @returns {Array} - The updated row.
 */
export function handleCastling(square, row) {
    const color = getPieceColor(square);
    const isWhite = isColorWhite(color);
    const kingPiece = isWhite ? GlobalVariables.FEN_PIECES_WHITE.KING : GlobalVariables.FEN_PIECES_BLACK.KING;
    const rookPiece = isWhite ? GlobalVariables.FEN_PIECES_WHITE.ROOK : GlobalVariables.FEN_PIECES_BLACK.ROOK;

    Object.values(GlobalVariables.CASTLING_TYPES).forEach(type => {
        if (isCastlingPossible(type, isWhite)) {
            const [emptySquares, kingFinalCol, rookFinalCol] = type === GlobalVariables.CASTLING_TYPES.LONG ?
                [GlobalVariables.EMPTY_SQUARES_AFTER_LONG_CASTLE, GlobalVariables.CASTLE_KING_FINAL_COL_LONG, GlobalVariables.CASTLE_ROOK_FINAL_COL_LONG] :
                [GlobalVariables.EMPTY_SQUARES_AFTER_SHORT_CASTLE, GlobalVariables.CASTLE_KING_FINAL_COL_SHORT, GlobalVariables.CASTLE_ROOK_FINAL_COL_SHORT];
            emptySquares.forEach(col => row[col] = GlobalVariables.EMPTY_SQUARE_PIECE);
            row[kingFinalCol] = kingPiece;
            row[rookFinalCol] = rookPiece;
        }
    });

    return row;
}

/**
 * Converts a row of squares to its FEN representation.
 * @param {Array} row - The row to convert.
 * @returns {string} - The FEN representation of the row.
 */
export function convertRowToFEN(row) {
    return row.reduce((acc, column) => {
        if (column === EMPTY_SQUARE_PIECE) {
            const lastChar = acc.slice(-1);
            if (IsDigit(lastChar)) {
                return acc.slice(0, -1) + (Number(lastChar) + 1);
            } else {
                return acc + '1';
            }
        } else {
            return acc + column;
        }
    }, '');
}

/**
 * Gets the castling rules as a string.
 * @returns {string} - The castling rules.
 */
export function getCastlingRules() {
    return Object.values(GlobalVariables.CastlingRights)
        .map(right => (right ? right : ""))
        .join("") || "-";
}

/**
 * Generates a new FEN string based on the current board state.
 * @returns {string} - The new FEN string.
 */
export function generateANewFen() {
    const fenRows = GlobalVariables.BoardPosition.map(row => convertRowToFEN(row)).join('/');
    const turn = GlobalVariables.IsWhiteToMove ? 'w' : 'b';
    const castling = getCastlingRules();
    const enPassant = GlobalVariables.EnPassant.isPossible
        ? convertLocationToCoordinates(GlobalVariables.EnPassant.x, GlobalVariables.EnPassant.y)
        : '-';
    const halfMoves = GlobalVariables.HalfMoves;
    const fullMoves = GlobalVariables.FullMoves;

    return `${fenRows} ${turn} ${castling} ${enPassant} ${halfMoves} ${fullMoves}`;
}

/**
 * Updates castling rights based on the given castling string.
 * @param {string} castling - The castling rights string (e.g., 'KQkq').
 */
export function updateCastlingRights(castling) {
    const castlingMap = {
        'K': 'whiteShortCastle',
        'Q': 'whiteLongCastle',
        'k': 'blackShortCastle',
        'q': 'blackLongCastle'
    };

    Object.keys(castlingMap).forEach(key => {
        GlobalVariables.CastlingRights[castlingMap[key]] = castling.includes(key);
    });
}

/**
 * Updates en passant status based on the given en passant string.
 * @param {string} enPassant - The en passant target square (e.g., 'e3') or '-' if not available.
 */
export function updateEnPassant(enPassant) {
    if (enPassant !== GlobalVariables.PIECE_DELIMITER) {
        const { x, y } = convertCoordinatesToLocation(enPassant);
        Object.assign(GlobalVariables.EnPassant, {
            isPossible: true,
            x: x,
            y: y
        });
    }
}

/**
 * Parses the FEN string to update the board state.
 * @param {string} fen - The FEN string representing the board state.
 * @param {Array} isPossibleMove - Array indicating possible moves.
 * @param {function} getPossibleMoves - Function to get possible moves.
 * @param {function} movePiece - Function to move a piece.
 * @param {function} resetPossibleMoves - Function to reset possible moves.
 * @param {boolean} [updateBoardPosition=true] - Whether to update the board position.
 * @returns {Array} - The generated square components.
 */
export function fenParser(fen, isPossibleMove, getPossibleMoves, movePiece, resetPossibleMoves, updateBoardPosition = true) {
    const {
        fenBoard,
        fenTurn,
        fenCastling,
        fenEnPassant,
        fenHalfMoves,
        fenFullMoves
    } = ParseFEN(fen);

    const fenRows = fenBoard.split('/');
    const boardArray = fenRows.map(row => ConvertFenToString(row).split(''));

    const squares = generateSquareComponents(boardArray, isPossibleMove, getPossibleMoves, movePiece, resetPossibleMoves);

    updateCastlingRights(fenCastling);

    GlobalVariables.updateIsWhiteToMove(fenTurn === 'w');
    GlobalVariables.updateHalfMoves(fenHalfMoves);
    GlobalVariables.updateFullMoves(fenFullMoves);

    if (updateBoardPosition) {
        GlobalVariables.BoardPosition.splice(0, GlobalVariables.BoardPosition.length, ...boardArray);
    }

    updateEnPassant(fenEnPassant);

    return squares;
}

/**
 * Updates the board position after making a move.
 * @param {object} currentSquare - The current square.
 * @param {object} targetSquare - The target square.
 * @returns {Array} - The updated board position.
 */
export function updateBoardPosition(currentSquare, targetSquare) {
    return GlobalVariables.BoardPosition.map((row, rowIndex) => {
        if (isSquareOnRow(currentSquare, rowIndex)) {
            row = handleSquareOnCurrentRow(currentSquare, targetSquare, row);
        }
        if (isSquareOnRow(targetSquare, rowIndex)) {
            row = handleTargetSquareOnCurrentRow(currentSquare, targetSquare, row);
        }
        return row;
    });
}

/**
 * Modifies the row to capture pieces sideways.
 * @param {Array} row - The row to update.
 * @param {number} colIndex - The column index of the current square.
 * @param {number} targetColIndex - The column index of the target square.
 * @param {string} value - The piece value.
 * @returns {Array} - The updated row.
 */
export function SidewaysCapture(row, colIndex, targetColIndex, value) {
    return row.map((col, index) => {
        if (index === colIndex) return GlobalVariables.EMPTY_SQUARE_PIECE;
        if (index === targetColIndex) return ConvertPieceToFENPiece(value);
        return col;
    });
}

/**
 * Converts the piece from {color-piece} format to FEN format (a single letter).
 * @param {string} value - The piece value.
 * @returns {string} - The FEN notation of the piece.
 */
export function ConvertPieceToFENPiece(value) {
    const [color, piece] = value.split(GlobalVariables.PIECE_DELIMITER);
    const pieceMapping = {
        [GlobalVariables.PIECES.PAWN]: GlobalVariables.FEN_PIECES_BLACK.PAWN,
        [GlobalVariables.PIECES.KNIGHT]: GlobalVariables.FEN_PIECES_BLACK.KNIGHT,
        [GlobalVariables.PIECES.BISHOP]: GlobalVariables.FEN_PIECES_BLACK.BISHOP,
        [GlobalVariables.PIECES.ROOK]: GlobalVariables.FEN_PIECES_BLACK.ROOK,
        [GlobalVariables.PIECES.QUEEN]: GlobalVariables.FEN_PIECES_BLACK.QUEEN,
        [GlobalVariables.PIECES.KING]: GlobalVariables.FEN_PIECES_BLACK.KING,
    };

    const fenPiece = pieceMapping[piece];
    return isColorWhite(color) ? fenPiece.toUpperCase() : fenPiece;
}

/**
 * Generates Square components for the given board state.
 * @param {Array} boardSquares - The 2D array representing the board squares.
 * @param {Array} isPossibleMove - The array of possible move states.
 * @param {Function} getPossibleMoves - The function to get possible moves.
 * @param {Function} movePiece - The function to move a piece.
 * @param {Function} resetPossibleMoves - The function to reset possible moves.
 * @returns {Array} - The array of Square components.
 */
export function generateSquareComponents(boardSquares, isPossibleMove, getPossibleMoves, movePiece, resetPossibleMoves) {
    let squareColorIsWhite = true;

    const squares = boardSquares.flatMap((row, rowIndex) => {
        const rowSquares = row.map((square, colIndex) => {
            const color = squareColorIsWhite ? "" : "dark";
            const possibleMoveStatus = isPossibleMove.find(item => item.key === `${rowIndex}-${colIndex}`);
            const squareComponent = (
                <Square
                    key={`${rowIndex}-${colIndex}`}
                    x={rowIndex}
                    y={colIndex}
                    piece={ConvertFENPieceToPiece(square)}
                    color={color}
                    getPossibleMoves={getPossibleMoves}
                    movePiece={movePiece}
                    isPossibleMove={possibleMoveStatus ? possibleMoveStatus.value : false}
                    resetPossibleMoves={resetPossibleMoves}
                />
            );
            squareColorIsWhite = !squareColorIsWhite;
            return squareComponent;
        });
        squareColorIsWhite = !squareColorIsWhite; // Reset color for the next row
        return rowSquares;
    });

    return squares;
}

/**
 * Converts board coordinates to X and Y position on the board, e.g., a8 = 0, 0
 * @param {string} coordinates - The board coordinates to convert.
 * @returns {object} - Returns an object with x and y properties.
 */
export function convertCoordinatesToLocation(coordinates) {
    let tokens = coordinates.split('')

    //skip invalid coordinates
    if (tokens.length != 2) {
        return
    }

    let letter = tokens[0].toString().toUpperCase()
    let number = tokens[1]

    //65 is the ASCII code for capital A which will give us 0 if we have A as a coordinate; A-F will give us 0-7 for y (columns)
    //reverse the numbers since we draw the board top down for x (rows)
    return { x: GlobalVariables.DIM - Number(number), y: letter.charCodeAt(0) - 65 }
}

/**
 * Converts a piece location to board coordinate, e.g., 0, 0 to a8
 * @param {string} x - The X position.
 * @param {string} y - The Y position.
 * @returns {string} - Returns a string containing the board coordinates.
 */
export function convertLocationToCoordinates(x, y) {
    //maps y (column) to the letter coordinate; add 65 (capital A code) to the ASCII code for the location we have and we get a letter between A and F
    //reverses the x (rows) coordinate because we drop the board top down, while coordinates go down up
    return `${String.fromCharCode(y + 65)}${GlobalVariables.DIM - x}`.toLowerCase()
}

/**
 * Determines if the king is in check.
 * @param {object} kingSquare - The square where the king is located.
 * @param {object} [pseudo] - The square where a piece is hypothetically moved.
 * @param {object} [currentSquare=null] - The square of the piece being moved.
 * @param {string} color - The color of the king ('white' or 'black').
 * @returns {boolean} - True if the king is in check, false otherwise.
 */
export function isKingInCheck(kingSquare, pseudo, currentSquare = null, color) {
    const squares = boardSquaresRef.current;

    const updatedSquares = squares.map(s => {
        if (pseudo && s.props.x === pseudo.props.x && s.props.y === pseudo.props.y) {
            return React.cloneElement(s, { piece: pseudo.props.piece });
        } else if (currentSquare && s.props.x === currentSquare.props.x && s.props.y === currentSquare.props.y) {
            return React.cloneElement(s, { piece: '' });
        } else {
            return s;
        }
    });

    const checkDirections = (directions) => {
        for (const [dx, dy] of directions) {
            for (let i = 1; i < GlobalVariables.DIM; i++) {
                const piece = updatedSquares.find(s => s.props.x === kingSquare.props.x + dx * i && s.props.y === kingSquare.props.y + dy * i);
                if (!piece) break;
                const [pieceColor, pieceType] = piece.props.piece.split("-");
                if (pieceColor !== color) {
                    if (pieceType === "queen" || pieceType === "rook" || pieceType === "bishop" || (i === 1 && pieceType === "pawn" && (dx === -1 || dx === 1))) {
                        return true;
                    }
                    if (piece.props.piece) break;
                } else {
                    break;
                }
            }
        }
        return false;
    };

    const linearDirections = [
        [1, 0], [-1, 0], [0, 1], [0, -1]  // Right, Left, Up, Down
    ];

    const diagonalDirections = [
        [1, 1], [-1, -1], [1, -1], [-1, 1]  // Diagonals
    ];

    if (checkDirections(linearDirections) || checkDirections(diagonalDirections)) {
        return true;
    }

    const knightMoves = [
        [-2, -1], [-2, 1], [2, -1], [2, 1],
        [-1, 2], [1, 2], [-1, -2], [1, -2]
    ];

    for (const [dx, dy] of knightMoves) {
        const piece = updatedSquares.find(s => s.props.x === kingSquare.props.x + dx && s.props.y === kingSquare.props.y + dy);
        if (piece && piece.props.piece.split("-")[0] !== color && piece.props.piece.split("-")[1] === "knight") {
            return true;
        }
    }

    return false;
}

/**
 * Determines if the white king is in check.
 * @param {object} kingSquare - The square where the king is located.
 * @param {object} [pseudo] - The square where a piece is hypothetically moved.
 * @param {object} [currentSquare=null] - The square of the piece being moved.
 * @returns {boolean} - True if the white king is in check, false otherwise.
 */
export function isWhiteInCheck(kingSquare, pseudo, currentSquare = null) {
    return isKingInCheck(kingSquare, pseudo, currentSquare, 'white');
}

/**
 * Determines if the black king is in check.
 * @param {object} kingSquare - The square where the king is located.
 * @param {object} [pseudo] - The square where a piece is hypothetically moved.
 * @param {object} [currentSquare=null] - The square of the piece being moved.
 * @returns {boolean} - True if the black king is in check, false otherwise.
 */
export function isBlackInCheck(kingSquare, pseudo, currentSquare = null) {
    return isKingInCheck(kingSquare, pseudo, currentSquare, 'black');
}