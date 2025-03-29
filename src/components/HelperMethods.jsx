import React from 'react';
import Square from "./Square"
import * as GlobalVariables from './globalVariables';

/**
 * Checks if a given square is valid based on its properties.
 *
 * This function verifies that the square object and its properties exist and are properly formatted. 
 * It ensures that the piece property contains a delimiter and two parts, and that the x and y properties are numbers.
 *
 * @param {object} square - The square to validate.
 * @returns {boolean} - True if the square is valid, false otherwise.
 */
export function isSquareValid(square) {
    if (!square || !square.props /**|| !square.props.piece ||
        square.props.piece.split(GlobalVariables.PIECE_DELIMITER).length !== 2 **/ ||
        isNaN(square.props.x) || isNaN(square.props.y) || square.props.x < 0 || square.props.x > 7 || square.props.y < 0 || square.props.y > 7) {
        return false
    }

    return true
}

/**
 * Gets the piece from a square.
 * @param {object} square - The square to get the piece from.
 * @returns {string} - The piece.
 */
export function getPiece(square) {
    if (!isSquareValid(square)) {
        return null
    }

    return square.props.piece.split(GlobalVariables.PIECE_DELIMITER)[GlobalVariables.PIECE_PIECE_INDEX];
}

/**
 * Checks if a square has a specific piece.
 * @param {object} square - The square to check.
 * @param {string} piece - The piece to check for.
 * @returns {boolean} - True if the square has the piece, false otherwise.
 */
export function doesTheSquareHasThePiece(square, piece) {
    if (!isSquareValid(square) || !piece) {
        return false
    }

    return getPiece(square) === piece;
}

/**
 * Checks if the piece on the square is a King.
 * @param {object} square - The square to check.
 * @returns {boolean} - True if the piece is a King, false otherwise.
 */
export function isKing(square) {
    return doesTheSquareHasThePiece(square, GlobalVariables.PIECES.KING);
}

/**
 * Checks if the piece on the square is a Bishop.
 * @param {object} square - The square to check.
 * @returns {boolean} - True if the piece is a Bishop, false otherwise.
 */
export function isBishop(square) {
    return doesTheSquareHasThePiece(square, GlobalVariables.PIECES.BISHOP);
}

/**
 * Checks if the piece on the square is a Queen.
 * @param {object} square - The square to check.
 * @returns {boolean} - True if the piece is a Queen, false otherwise.
 */
export function isQueen(square) {
    return doesTheSquareHasThePiece(square, GlobalVariables.PIECES.QUEEN);
}

/**
 * Checks if the piece on the square is a Rook.
 * @param {object} square - The square to check.
 * @returns {boolean} - True if the piece is a Rook, false otherwise.
 */
export function isRook(square) {
    return doesTheSquareHasThePiece(square, GlobalVariables.PIECES.ROOK);
}

/**
 * Checks if the piece on the square is a Pawn.
 * @param {object} square - The square to check.
 * @returns {boolean} - True if the piece is a Pawn, false otherwise.
 */
export function isPawn(square) {
    return doesTheSquareHasThePiece(square, GlobalVariables.PIECES.PAWN);
}

/**
 * Checks if the piece on the square is a Knight.
 * @param {object} square - The square to check.
 * @returns {boolean} - True if the piece is a Knight, false otherwise.
 */
export function isKnight(square) {
    return doesTheSquareHasThePiece(square, GlobalVariables.PIECES.KNIGHT);
}

/**
 * Checks if a character is Uppercase using the ASCII table.
 * @param {string} value - The character to check.
 * @returns {boolean} - True if the character is uppercase, false otherwise.
 */
export function IsUpperCase(value) {
    if (!value) return false
    const firstChar = getFirstCharacter(value)
    return firstChar >= GlobalVariables.ASCII_UPPERCASE_A && firstChar <= GlobalVariables.ASCII_UPPERCASE_Z;
}

/**
 * Returns the ASCII code of the first character of a string.
 * @param {string} value - The string from which to get the ASCII code.
 * @returns {number} - The ASCII code of the first character.
 */
export function getFirstCharacter(value) {
    if (!value) return -1
    return value.charCodeAt(0);
}

/**
 * Checks if a character is Lowercase using the ASCII table.
 * @param {string} value - The character to check.
 * @returns {boolean} - True if the character is lowercase, false otherwise.
 */
export function IsLowerCase(value) {
    if (!value) return false
    const firstChar = getFirstCharacter(value)
    return firstChar >= GlobalVariables.ASCII_LOWERCASE_A && firstChar <= GlobalVariables.ASCII_LOWERCASE_Z;
}

/**
 * Checks if a character is a Digit using the ASCII table.
 * @param {string} value - The character to check.
 * @returns {boolean} - True if the character is a digit, false otherwise.
 */
export function IsDigit(value) {
    // Convert the value to a string to handle numeric input correctly
    const strValue = String(value);

    // Get the ASCII code of the first character
    const firstChar = getFirstCharacter(strValue);

    // Check if the ASCII code corresponds to a digit (0-9)
    return firstChar >= GlobalVariables.ASCII_DIGIT_0 && firstChar <= GlobalVariables.ASCII_DIGIT_9;
}

/**
 * Parses a FEN string and returns its components.
 * @param {string} fen - The FEN string to parse.
 * @returns {object} - An object containing the FEN components.
 */
export function ParseFEN(fen) {
    if (!fen) throw new Error(GlobalVariables.INVALID_FEN_ERROR);

    const fenParts = fen.split(GlobalVariables.EMPTY_SPACE);
    if (fenParts.length !== GlobalVariables.FEN_VALID_PARTS_NUMBER) {
        throw new Error(GlobalVariables.INVALID_FEN_ERROR);
    }
    const [fenBoard, fenTurn, fenCastling, fenEnPassant, fenHalfMoves, fenFullMoves] = fenParts;

    if (!isBoardValid(fenBoard) || !isTurnValid(fenTurn) || !isCastlingValid(fenCastling) ||
        !isEnPassantValid(fenEnPassant) || !isHalfMovesValid(fenHalfMoves) || !isFullMovesValid(fenFullMoves)) {
        throw new Error(GlobalVariables.INVALID_FEN_ERROR);
    }

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
 * Validates a chessboard represented as a FEN board string.
 * 
 * @param {string} board - The FEN board string to validate.
 * @returns {boolean} - True if the board is valid, otherwise false.
 * 
 * Validations:
 * - Board must contain 8 rows.
 * - Each row must have exactly 8 elements (pieces or empty spaces represented by digits).
 * - The board must contain exactly two kings (one white and one black).
 * - There must be other pieces that makes the game valid.
 * - The kings must not be positioned next to each other.
 */
export function isBoardValid(board) {
    if (!board) return false;

    const rows = board.split(GlobalVariables.FEN_BOARD_DELIMITER);
    const validPieces = new Set([...Object.values(GlobalVariables.FEN_PIECES_WHITE), ...Object.values(GlobalVariables.FEN_PIECES_BLACK)]);

    // Check if board has 8 rows
    if (rows.length !== 8) {
        return false;
    }

    // Initialize counters
    let kingCount = { k: 0, K: 0 };
    let pieceCount = { q: 0, Q: 0, r: 0, R: 0, p: 0, P: 0, n: 0, N: 0, b: 0, B: 0 };

    // Check each row
    for (const row of rows) {
        let elements = 0;

        for (const char of row) {
            if (validPieces.has(char)) {
                elements++;
                if (char === GlobalVariables.FEN_PIECES_BLACK.KING || char === GlobalVariables.FEN_PIECES_WHITE.KING) {
                    kingCount[char]++;
                } else {
                    pieceCount[char]++;
                }
            } else if (IsDigit(char)) {
                elements += parseInt(char, 10);
            } else {
                return false;
            }
        }

        // Check if row has exactly 8 elements
        if (elements !== 8) {
            return false;
        }
    }

    // Ensure there are exactly 2 kings
    if (kingCount.k !== 1 || kingCount.K !== 1) {
        return false;
    }

    // Ensure there is at least one other piece that makes the game valid
    const whiteKnightBishop = pieceCount.N > 0 && pieceCount.B > 0;
    const blackKnightBishop = pieceCount.n > 0 && pieceCount.b > 0;

    const isValidGame =
        pieceCount.q + pieceCount.Q > 0 ||
        pieceCount.r + pieceCount.R > 0 ||
        pieceCount.p + pieceCount.P > 0 ||
        whiteKnightBishop || blackKnightBishop ||
        pieceCount.N > 1 || pieceCount.n > 1;

    if (!isValidGame) {
        return false;
    }

    // Ensure the kings are not next to one another
    const directions = [
        [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    const getKingPosition = (char) => {
        for (let i = 0; i < rows.length; i++) {
            for (let j = 0; j < rows[i].length; j++) {
                if (rows[i][j] === char) {
                    return { x: i, y: j };
                }
            }
        }
        return null;
    };

    const whiteKingPos = getKingPosition(GlobalVariables.FEN_PIECES_WHITE.KING);
    const blackKingPos = getKingPosition(GlobalVariables.FEN_PIECES_BLACK.KING);

    for (const [dx, dy] of directions) {
        if (whiteKingPos.x + dx === blackKingPos.x && whiteKingPos.y + dy === blackKingPos.y) {
            return false;
        }
    }

    return true;
}

/**
 * Validates the castling rights string in a FEN notation.
 * 
 * @param {string} castling - The castling rights string to validate.
 * @returns {boolean} - True if the castling rights string is valid, otherwise false.
 * 
 * Validations:
 * - Castling can be '-' or a string containing 'K', 'Q', 'k', 'q'.
 * - The string length must be between 1 and 4.
 * - If 4 characters, it must have 2 capital and 2 lowercase letters.
 * - If 3 characters, it must have either 2 capital and 1 lowercase or 1 capital and 2 lowercase.
 * - If 2 characters, it can have any combination of 2 valid characters.
 * - If 1 character, it must be one of the valid characters.
 */
export function isCastlingValid(castling) {
    if (!castling) return false
    if (castling === '-') {
        return true;
    }
    if (typeof castling !== 'string' || castling.length < 1 || castling.length > 4) {
        return false;
    }
    const validChars = new Set(['K', 'Q', 'k', 'q']);

    const seenChars = new Set();

    for (const char of castling) {
        if (!validChars.has(char)) {
            return false;
        }
        if (seenChars.has(char)) {
            return false; // Duplicate character found
        }
        seenChars.add(char);
    }

    const uppercaseCount = [...castling].filter(char => char === 'K' || char === 'Q').length;
    const lowercaseCount = [...castling].filter(char => char === 'k' || char === 'q').length;

    if (castling.length === 4 && uppercaseCount === 2 && lowercaseCount === 2) {
        return true;
    }

    if (castling.length === 3 && ((uppercaseCount === 2 && lowercaseCount === 1) || (uppercaseCount === 1 && lowercaseCount === 2))) {
        return true;
    }

    if (castling.length === 2 && (uppercaseCount <= 2 && lowercaseCount <= 2)) {
        return true;
    }

    if (castling.length === 1 && (uppercaseCount === 1 || lowercaseCount === 1)) {
        return true;
    }

    return false;
}

/**
 * Validates the turn indicator in a FEN notation.
 * 
 * @param {string} turn - The turn indicator to validate.
 * @returns {boolean} - True if the turn indicator is valid, otherwise false.
 * 
 * Validations:
 * - Turn must be 'w' for white or 'b' for black.
 */
export function isTurnValid(turn) {
    if (!turn) return false
    return turn === GlobalVariables.FEN_COLOR.WHITE || turn === GlobalVariables.FEN_COLOR.BLACK
}

/**
 * Validates the en passant target square in a FEN notation.
 * 
 * @param {string} enPassant - The en passant target square to validate.
 * @returns {boolean} - True if the en passant target square is valid, otherwise false.
 * 
 * Validations:
 * - En passant can be '-' indicating no en passant target square.
 * - If not '-', it must be a string of length 2 with the first character being an uppercase letter and the second a digit.
 */
export function isEnPassantValid(enPassant) {
    enPassant = enPassant.toUpperCase();

    if (enPassant === GlobalVariables.PIECE_DELIMITER) {
        return true;
    }
    if (typeof enPassant === 'string' && enPassant.length === 2) {
        const [firstChar, secondChar] = enPassant.split(GlobalVariables.EMPTY_STRING);
        return IsUpperCase(firstChar) && IsDigit(secondChar) && (secondChar === '3' || secondChar === '6') && (firstChar >= 'A' && firstChar <= 'H');
    }
    return false;
}

/**
 * Validates the half-move clock in a FEN notation.
 * 
 * @param {number} halfMoves - The half-move clock value to validate.
 * @returns {boolean} - True if the half-move clock is valid, otherwise false.
 * 
 * Validations:
 * - Must be a number.
 * - Must be between 0 and 50 inclusive.
 */
export function isHalfMovesValid(halfMoves) {
    // Check if halfMoves is a number or a numeric string
    if (typeof halfMoves !== 'number' && typeof halfMoves !== 'string') {
        return false;
    }

    if (typeof halfMoves === 'string' && !halfMoves) return false

    // Check if halfMoves can be converted to a valid number
    const halfMovesNumber = Number(halfMoves);
    if (isNaN(halfMovesNumber)) {
        return false;
    }

    // Check if halfMoves is within the valid range
    return halfMovesNumber >= 0 && halfMovesNumber <= 50;
}

/**
 * Validates the full-move number in a FEN notation.
 * 
 * @param {number} fullMoves - The full-move number to validate.
 * @returns {boolean} - True if the full-move number is valid, otherwise false.
 * 
 * Validations:
 * - Must be a number.
 * - Must be non-negative.
 */
export function isFullMovesValid(fullMoves) {
    // Check if fullMoves is a number or a numeric string
    if (typeof fullMoves !== 'number' && typeof fullMoves !== 'string') {
        return false;
    }

    if (typeof fullMoves === 'string' && !fullMoves) return false

    // Check if fullMoves can be converted to a valid number
    const fullMovesNumber = Number(fullMoves);
    if (isNaN(fullMovesNumber)) {
        return false;
    }

    // Check if fullMoves is a non-negative number
    return fullMovesNumber >= 0;
}

/**
 * Converts FEN piece notation to an actual piece.
 * @param {string} letter - The FEN notation of the piece.
 * @returns {string} - The actual piece.
 */
export function ConvertFENtoPiece(letter) {
    if (!letter) return GlobalVariables.EMPTY_STRING

    const FEN_PIECE_MAP = {
        [GlobalVariables.FEN_PIECES_BLACK.PAWN]: GlobalVariables.PIECES.PAWN,
        [GlobalVariables.FEN_PIECES_BLACK.KNIGHT]: GlobalVariables.PIECES.KNIGHT,
        [GlobalVariables.FEN_PIECES_BLACK.KING]: GlobalVariables.PIECES.KING,
        [GlobalVariables.FEN_PIECES_BLACK.QUEEN]: GlobalVariables.PIECES.QUEEN,
        [GlobalVariables.FEN_PIECES_BLACK.ROOK]: GlobalVariables.PIECES.ROOK,
        [GlobalVariables.FEN_PIECES_BLACK.BISHOP]: GlobalVariables.PIECES.BISHOP,
    };

    return FEN_PIECE_MAP[letter.toLowerCase()] || GlobalVariables.EMPTY_STRING;
}

/**
 * Converts the FEN piece notation to a piece that we can use in the square component.
 * @param {string} value - The FEN notation of the piece.
 * @returns {string} - The piece in {color-piece} format.
 */
export function ConvertFENPieceToPiece(value) {
    if (!value || value.length !== 1) return GlobalVariables.EMPTY_STRING

    if (IsUpperCase(value)) {
        return `${GlobalVariables.COLORS.WHITE}${GlobalVariables.PIECE_DELIMITER}${ConvertFENtoPiece(value)}`;
    }

    if (IsLowerCase(value)) {
        return `${GlobalVariables.COLORS.BLACK}${GlobalVariables.PIECE_DELIMITER}${ConvertFENtoPiece(value)}`;
    }

    return GlobalVariables.EMPTY_STRING;
}

/**
 * Converts a string in FEN format to a normal string.
 * @param {string} value - The FEN string.
 * @returns {string} - The normal string.
 */
export function ConvertFenToString(value) {
    if (!value || (value.length !== 8 && [...value].reduce((length, char) => length + (IsDigit(char) ? parseInt(char, 10) : 1), 0) !== 8)) return GlobalVariables.EMPTY_STRING

    return value.split(GlobalVariables.EMPTY_STRING).reduce((result, char) => {
        if (IsDigit(char)) {
            return result + GlobalVariables.EMPTY_SQUARE_PIECE.repeat(Number(char));
        }
        return result + char;
    }, GlobalVariables.EMPTY_STRING);
}

/**
 * Checks if two squares are on the same row.
 * @param {object} square1 - The first square.
 * @param {object} square2 - The second square.
 * @returns {boolean} - True if the squares are on the same row, false otherwise.
 */
export function checkIfTwoSquaresAreOnTheSameRow(square1, square2) {
    if (!isSquareValid(square1) || !isSquareValid(square2)) return false

    return square1.props.x === square2.props.x;
}

/**
 * Checks if two squares are on the same column.
 * @param {object} square1 - The first square to check.
 * @param {object} square2 - The second square to check.
 * @returns {boolean} - True if both squares are on the same column, false otherwise.
 */
export function checkIfTwoSquaresAreOnTheSameColumn(square1, square2) {
    if (!isSquareValid(square1) || !isSquareValid(square2)) return false

    return square1.props.y === square2.props.y;
}

/**
 * Checks if the square is on the given row number.
 * @param {object} square - The square to check.
 * @param {number} rowNumber - The row number.
 * @returns {boolean} - True if the square is on the given row, false otherwise.
 */
export function isSquareOnRow(square, rowNumber) {
    if (!isSquareValid(square)) return false
    return square.props.x === rowNumber;
}

/**
 * Checks if the square is on the given column number.
 * @param {object} square - The square to check.
 * @param {number} columnNumber - The column number.
 * @returns {boolean} - True if the square is on the given column, false otherwise.
 */
export function isSquareOnColumn(square, columnNumber) {
    if (!isSquareValid(square)) return false
    return square.props.y === columnNumber;
}

/**
 * Gets the piece color from a square.
 * @param {object} square - The square to get the piece color from.
 * @returns {string} - The piece color.
 */
export function getPieceColor(square) {
    if (!isSquareValid(square)) return GlobalVariables.EMPTY_STRING
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
    if (!isSquareValid(piece1) || !isSquareValid(piece2)) return false
    return getPieceColor(piece1) === getPieceColor(piece2);
}

/**
 * Checks if a move is equal to the current selected square.
 * @param {object} move - The move to check.
 * @returns {boolean} - True if the move is equal to the current selected square, false otherwise.
 */
export function checkIfAMoveIsEqualToTheCurrentSelectedSquare(move) {
    return isSquareOnRow(move, GlobalVariables.CurrentSquareSelection.x) && isSquareOnColumn(move, GlobalVariables.CurrentSquareSelection.y)
}

/**
 * Compares if two squares are the same.
 * @param {object} square1 - The first square.
 * @param {object} square2 - The second square.
 * @returns {boolean} - True if the squares are the same, false otherwise.
 */
export function compareIfTwoSquaresAreTheSame(square1, square2) {
    if (!square1 || !square2) return false
    return checkIfTwoSquaresAreOnTheSameRow(square1, square2) && checkIfTwoSquaresAreOnTheSameColumn(square1, square2);
}

/**
 * Gets a target square by its location.
 * @param {number} x - The x coordinate of the target square.
 * @param {number} y - The y coordinate of the target square.
 * @param {array} squares - The board squares array.
 * @returns {object} - The target square.
 */
export function getATargetSquareByLocation(x, y, squares) {
    if (!squares) return
    return squares.find(s => isSquareOnRow(s, x) && isSquareOnColumn(s, y))
}

/**
 * Gets a target square by its piece.
 * @param {string} piece - The piece to search for.
 * @param {array} squares - The board squares array.
 * @returns {object} - The target square.
 */
export function getATargetSquareByPiece(piece, squares) {
    if (!squares) return
    return squares.find(s => s.props.piece == piece)
}

/**
 * Checks if castling is possible.
 * @param {string} castlingType - The type of castling (long or short).
 * @param {boolean} [withWhite=true] - True if checking for white's castling, false otherwise.
 * @returns {boolean} - True if castling is possible, false otherwise.
 */
export function isCastlingPossible(castlingType, withWhite = true) {
    if (!castlingType || (castlingType !== GlobalVariables.CASTLING_TYPES.LONG && castlingType !== GlobalVariables.CASTLING_TYPES.SHORT)) return false

    const row = withWhite ? GlobalVariables.CASTLE_ROW_WHITE : GlobalVariables.CASTLE_ROW_BLACK;
    const pieces = withWhite ? GlobalVariables.FEN_PIECES_WHITE : GlobalVariables.FEN_PIECES_BLACK;
    const [rookCol, kingCol, pathCols] = castlingType === GlobalVariables.CASTLING_TYPES.LONG ?
        [GlobalVariables.CASTLE_ROOK_INITIAL_COL_LONG, GlobalVariables.CASTLE_KING_INITIAL_COL, GlobalVariables.CASTLE_PATH_COLS_LONG] :
        [GlobalVariables.CASTLE_ROOK_INITIAL_COL_SHORT, GlobalVariables.CASTLE_KING_INITIAL_COL, GlobalVariables.CASTLE_PATH_COLS_SHORT];

    const color = withWhite ? GlobalVariables.COLORS.WHITE : GlobalVariables.COLORS.BLACK;
    const normalizedType = turnSentenceCase(castlingType)
    const castlingRightProp = `${color}${normalizedType}Castle`

    return GlobalVariables.BoardPosition[row][rookCol] === pieces.ROOK &&
        GlobalVariables.BoardPosition[row][kingCol] === pieces.KING &&
        pathCols.every(col => GlobalVariables.BoardPosition[row][col] === GlobalVariables.EMPTY_SQUARE_PIECE) &&
        GlobalVariables.CastlingRights[castlingRightProp];
}

/**
 * Checks if a pawn is on its starting square.
 * @param {object} pawn - The pawn to check.
 * @returns {boolean} - True if the pawn is on its starting square, false otherwise.
 */
export function isPawnOnStartingSquare(pawn) {
    const isWhite = isColorWhite(getPieceColor(pawn));
    return isWhite ? isSquareOnRow(pawn, GlobalVariables.WHITE_PAWN_STARTING_SQUARE) : isSquareOnRow(pawn, GlobalVariables.BLACK_PAWN_STARTING_SQUARE);
}

/**
 * Checks if a pawn is on an en passant square.
 * @param {object} pawn - The pawn to check.
 * @returns {boolean} - True if the pawn is on an en passant square, false otherwise.
 */
export function isPawnOnEnPassantSquare(pawn) {
    const isWhite = isColorWhite(getPieceColor(pawn));
    return isWhite ? isSquareOnRow(pawn, GlobalVariables.WHITE_EN_PASSANT_SQUARE) : isSquareOnRow(pawn, GlobalVariables.BLACK_EN_PASSANT_SQUARE);
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
 * Checks if castling is possible for either side.
 * @returns {boolean} - True if castling is possible for either side, false otherwise.
 */
export function canWeCastle() {
    return Object.values(GlobalVariables.CastlingRights).some(s => s);
}

/**
 * Checks if we're making a move on the same row and performs castling if we want to castle.
 * @param {object} currentSquare - The current square.
 * @param {object} targetSquare - The target square.
 * @param {Array} row - The row to update.
 * @returns {Array} - The updated row.
 */
export function handleSquareAndTargetSquareOnTheSameRow(currentSquare, targetSquare, row) {
    if (isKing(currentSquare) && canWeCastle() && Math.abs(currentSquare.props.y - targetSquare.props.y) == 2) {
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
        if (column === GlobalVariables.EMPTY_SQUARE_PIECE) {
            const lastChar = acc.slice(-1);
            if (IsDigit(lastChar)) {
                return acc.slice(0, -1) + (Number(lastChar) + 1); //add 1 to the previous number if an empty space
            } else {
                return acc + '1'; //set the next piece as 1 (1 empty space)
            }
        } else {
            return acc + column; //return the piece if no empty spaces
        }
    }, GlobalVariables.EMPTY_STRING);
}

/**
 * Gets the castling rules as a string.
 * @returns {string} - The castling rules.
 */
export function getCastlingRules() {
    const sortedKeys = getSortedCastlingKeys();

    const castlingMap = {
        [sortedKeys[0]]: GlobalVariables.FEN_PIECES_BLACK.QUEEN, // 'blackLongCastle'
        [sortedKeys[1]]: GlobalVariables.FEN_PIECES_BLACK.KING, // 'blackShortCastle'
        [sortedKeys[2]]: GlobalVariables.FEN_PIECES_WHITE.QUEEN, // 'whiteLongCastle'
        [sortedKeys[3]]: GlobalVariables.FEN_PIECES_WHITE.KING  // 'whiteShortCastle'
    };

    return sortedKeys.map(key => GlobalVariables.CastlingRights[key] ? castlingMap[key] :
        GlobalVariables.EMPTY_STRING).join(GlobalVariables.EMPTY_STRING) || GlobalVariables.PIECE_DELIMITER
}

/**
 * Generates a new FEN string based on the current board state.
 * @returns {string} - The new FEN string.
 */
export function generateANewFen() {
    const fenRows = GlobalVariables.BoardPosition.map(row => convertRowToFEN(row)).join(GlobalVariables.FEN_BOARD_DELIMITER);
    const turn = GlobalVariables.IsWhiteToMove ? GlobalVariables.FEN_COLOR.WHITE : GlobalVariables.FEN_COLOR.BLACK;
    const castling = getCastlingRules();
    const enPassant = GlobalVariables.EnPassant.isPossible
        ? convertLocationToCoordinates(GlobalVariables.EnPassant.x, GlobalVariables.EnPassant.y)
        : GlobalVariables.PIECE_DELIMITER;
    const halfMoves = GlobalVariables.HalfMoves;
    const fullMoves = GlobalVariables.FullMoves;

    return `${fenRows} ${turn} ${castling} ${enPassant} ${halfMoves} ${fullMoves}`;
}

/**
 * Returns the keys of the CastlingRights object in alphabetical order.
 * @returns {Array<string>} - The sorted keys of CastlingRights.
 */
export function getSortedCastlingKeys() {
    return Object.keys(GlobalVariables.CastlingRights).sort();
}

/**
 * Updates castling rights based on the given castling string.
 * @param {string} castling - The castling rights string (e.g., 'KQkq').
 */
export function updateCastlingRights(castling) {
    const sortedKeys = getSortedCastlingKeys();

    // Create a map based on the sorted keys to ensure consistency
    const castlingMap = {
        [GlobalVariables.FEN_PIECES_BLACK.QUEEN]: sortedKeys[0], // 'blackLongCastle'
        [GlobalVariables.FEN_PIECES_BLACK.KING]: sortedKeys[1], // 'blackShortCastle'
        [GlobalVariables.FEN_PIECES_WHITE.QUEEN]: sortedKeys[2], // 'whiteLongCastle'
        [GlobalVariables.FEN_PIECES_WHITE.KING]: sortedKeys[3]  // 'whiteShortCastle'
    };

    // Update castling rights using the castling map
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
 * Checks if the given coordinates are within the bounds of the chessboard.
 *
 * This function ensures that the coordinates (x, y) fall within the valid range
 * of the chessboard dimensions. It returns true if both x and y are greater than
 * or equal to 0 and less than the board dimension (DIM). This is useful for 
 * validating moves and ensuring that they do not exceed the boundaries of the board.
 *
 * @param {number} x - The x-coordinate to check.
 * @param {number} y - The y-coordinate to check.
 * @returns {boolean} - True if the coordinates are within the bounds of the board, false otherwise.
 */
export function areCoordinatesInBounds(x, y) {
    return x >= 0 && y >= 0 && x < GlobalVariables.DIM && y < GlobalVariables.DIM
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

    const fenRows = fenBoard.split(GlobalVariables.FEN_BOARD_DELIMITER);
    const boardArray = fenRows.map(row => ConvertFenToString(row).split(GlobalVariables.EMPTY_STRING));

    const squares = generateSquareComponents(boardArray, isPossibleMove, getPossibleMoves, movePiece, resetPossibleMoves);

    updateCastlingRights(fenCastling);

    GlobalVariables.updateIsWhiteToMove(fenTurn === GlobalVariables.FEN_COLOR.WHITE);
    GlobalVariables.updateHalfMoves(fenHalfMoves);
    GlobalVariables.updateFullMoves(fenFullMoves);

    // if (updateBoardPosition) {
    GlobalVariables.BoardPosition.splice(0, GlobalVariables.BoardPosition.length, ...boardArray);
    //}

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
            const color = squareColorIsWhite ? GlobalVariables.EMPTY_STRING : GlobalVariables.DARK_SQUARES_COLOR;
            const possibleMoveStatus = isPossibleMove.find(item => item.key === `${rowIndex}${GlobalVariables.PIECE_DELIMITER}${colIndex}`);
            const squareComponent = (
                <Square
                    key={`${rowIndex}${GlobalVariables.PIECE_DELIMITER}${colIndex}`}
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
    let tokens = coordinates.split(GlobalVariables.EMPTY_STRING)

    //skip invalid coordinates
    if (tokens.length != 2) {
        return
    }

    let letter = tokens[0].toString().toUpperCase()
    let number = tokens[1]

    //65 is the ASCII code for capital A which will give us 0 if we have A as a coordinate; A-F will give us 0-7 for y (columns)
    //reverse the numbers since we draw the board top down for x (rows)
    return { x: GlobalVariables.DIM - Number(number), y: getFirstCharacter(letter) - GlobalVariables.ASCII_UPPERCASE_A }
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
    return `${String.fromCharCode(y + GlobalVariables.ASCII_UPPERCASE_A)}${GlobalVariables.DIM - x}`.toLowerCase()
}

/**
 * Determines if the king is in check.
 * @param {object} kingSquare - The square where the king is located.
 * @param {array} boardSquares - The board squares array.
 * @returns {boolean} - True if the king is in check, false otherwise.
 */
export function isKingInCheck(kingSquare, boardSquares) {
    const squares = boardSquares
    const color = getPieceColor(kingSquare)

    const knightMoves = [
        [-2, -1], [-2, 1], [2, -1], [2, 1],
        [-1, 2], [1, 2], [-1, -2], [1, -2]
    ];

    const linearDirections = [
        [1, 0], [-1, 0], [0, 1], [0, -1]  // Right, Left, Up, Down
    ];

    const diagonalDirections = [
        [1, 1], [-1, -1], [1, -1], [-1, 1]  // Diagonals
    ];

    const checkDirections = (directions) => {
        let isInCheck = false;
        for (const [dx, dy] of directions) {
            //only a queen and a bishop can check diagonally (+ a pawn)
            //only a queen and a rook can check linearly
            const piecesTypes = Math.abs(dx) == Math.abs(dy) ?
                [GlobalVariables.PIECES.QUEEN, GlobalVariables.PIECES.BISHOP] :
                [GlobalVariables.PIECES.QUEEN, GlobalVariables.PIECES.ROOK]

            for (let i = 1; i < GlobalVariables.DIM; i++) {
                // Get the king and the square that is offset by the given distance
                const piece = getATargetSquareByLocation(kingSquare?.props.x + dx * i, kingSquare?.props.y + dy * i, squares)

                // Don't check anything if we go out of bounds
                if (!piece) {
                    break;
                }

                // Get the square data (color and piece type)
                const pieceColor = getPieceColor(piece);
                const pieceType = getPiece(piece);

                // Move to the next square if this one is empty
                if (!pieceType) {
                    continue;
                }

                // If the piece is the same color, it can't give us a check, so break
                if (pieceColor === color) {
                    break;
                }

                // Check if the piece is a queen, rook, or bishop,
                // or if it's a pawn and we are exactly 1 square away (pawns can't check from more than 1 square away)
                if (piecesTypes.includes(pieceType) || (pieceType == GlobalVariables.PIECES.PAWN && i === 1 && Math.abs(dx) == Math.abs(dy))) {
                    return true;
                }

                isInCheck = false;
                break;
            }
        }
        return isInCheck;
    };

    if (checkDirections(linearDirections) || checkDirections(diagonalDirections)) {
        return true;
    }

    for (const [dx, dy] of knightMoves) {
        const piece = squares.find(s => isSquareOnRow(s, kingSquare.props.x + dx) && isSquareOnColumn(s, kingSquare.props.y + dy));

        // If we're not out of bounds
        // If the the piece is a different color than the king
        // If the piece is a knight
        if (piece && getPieceColor(piece) !== color && getPiece(piece) === GlobalVariables.PIECES.KNIGHT) {
            return true;
        }
    }

    return false;
}

/**
 * Determines if a move is legal by checking if the king would be in check after the move.
 * 
 * @param {object} kingSquare - The square where the king is currently located.
 * @param {Array} boardSquares - The current state of the board as an array of squares.
 * @param {object} currentPiece - The piece that is being moved.
 * @param {object} targetLocation - The square where the piece is being moved to.
 * 
 * @returns {boolean} - True if the move is legal (i.e., does not put the king in check), false otherwise.
 */
export function isMoveLegal(kingSquare, boardSquares, currentPiece, targetLocation) {
    const squares = boardSquares;

    const updatedSquares = squares.map(s => {
        if (currentPiece && compareIfTwoSquaresAreTheSame(s, currentPiece)) {
            return React.cloneElement(s, { piece: GlobalVariables.EMPTY_STRING });
        } else if (targetLocation && compareIfTwoSquaresAreTheSame(s, targetLocation)) {
            return React.cloneElement(s, { piece: currentPiece.props.piece });
        } else {
            return s;
        }
    });

    // Handles legal moves for the king
    const king = compareIfTwoSquaresAreTheSame(kingSquare, currentPiece) ? getATargetSquareByLocation(targetLocation.props.x, targetLocation.props.y, updatedSquares) : kingSquare

    return !isKingInCheck(king, updatedSquares)
}

/**
 * Converts the first character of a string to uppercase and the rest to lowercase.
 * @param {string} value - The string to convert.
 * @returns {string} - The converted string with the first character in uppercase and the rest in lowercase.
 */
export function turnSentenceCase(value) {
    if (typeof value !== 'string' || value.trim().length === 0) {
        return GlobalVariables.EMPTY_STRING;
    }
    const trimmedValue = value.trim();
    return trimmedValue.charAt(0).toUpperCase() + trimmedValue.slice(1).toLowerCase();
}

/**
 * Disables castling rights if the king or a rook moves.
 * @param {object} square - The square containing the piece that moved.
 */
export function disableCastlingIfKingOrRookMoves(square) {
    const color = getPieceColor(square);
    const isWhite = isColorWhite(color);

    const updateCastlingRights = (color, type, value) => {
        const castle = 'Castle';
        const normalizedType = turnSentenceCase(type)
        GlobalVariables.CastlingRights[`${color}${normalizedType}${castle}`] = value;
    };

    if (isKing(square)) {
        const castleColor = isWhite ? GlobalVariables.COLORS.WHITE : GlobalVariables.COLORS.BLACK;
        updateCastlingRights(castleColor, GlobalVariables.CASTLING_TYPES.LONG, false);
        updateCastlingRights(castleColor, GlobalVariables.CASTLING_TYPES.SHORT, false);
    }

    if (isRook(square)) {
        const { x, y } = square.props;

        const isRookInStartingPosition = (row, col, type, color) => {
            return x === row && y === col && updateCastlingRights(color, type, false);
        };

        isRookInStartingPosition(GlobalVariables.CASTLE_ROW_WHITE, GlobalVariables.CASTLE_ROOK_INITIAL_COL_SHORT, GlobalVariables.CASTLING_TYPES.SHORT, GlobalVariables.COLORS.WHITE);
        isRookInStartingPosition(GlobalVariables.CASTLE_ROW_BLACK, GlobalVariables.CASTLE_ROOK_INITIAL_COL_SHORT, GlobalVariables.CASTLING_TYPES.SHORT, GlobalVariables.COLORS.BLACK);
        isRookInStartingPosition(GlobalVariables.CASTLE_ROW_WHITE, GlobalVariables.CASTLE_ROOK_INITIAL_COL_LONG, GlobalVariables.CASTLING_TYPES.LONG, GlobalVariables.COLORS.WHITE);
        isRookInStartingPosition(GlobalVariables.CASTLE_ROW_BLACK, GlobalVariables.CASTLE_ROOK_INITIAL_COL_LONG, GlobalVariables.CASTLING_TYPES.LONG, GlobalVariables.COLORS.BLACK);
    }
}

/**
 * Enables or disables en passant based on the move.
 * @param {object} square - The square containing the piece that moved.
 * @param {object} targetSquare - The square to which the piece is moving.
 */
export function enableEnPassant(square, targetSquare) {
    const color = getPieceColor(square);
    const isWhite = isColorWhite(color);
    const offset = isWhite ? -1 : 1;
    const isThePieceAPawn = isPawn(square);
    const isTwoSquareMove = Math.abs(square.props.x - targetSquare.props.x) === 2;

    const updateEnPassant = (isPossible, x, y) => {
        GlobalVariables.EnPassant.isPossible = isPossible;
        GlobalVariables.EnPassant.x = x;
        GlobalVariables.EnPassant.y = y;
    };

    if (isThePieceAPawn && isTwoSquareMove) {
        updateEnPassant(true, square.props.x + offset, square.props.y);
    } else {
        updateEnPassant(false, -1, -1);
    }
}

/**
 * Checks if there are any pawns that can capture en passant from the given square.
 *
 * This function checks the neighboring squares to the left and right of the given square
 * to see if they contain pawns of the opposite color that can potentially capture en passant.
 *
 * @param {object} square - The square to check from.
 * @param {array} squares - The array representing the board squares.
 * @returns {boolean} - True if there is at least one pawn that can capture en passant, false otherwise.
 */
export function areTherePawnsThatCanCaptureEnPassant(square, squares) {
    const neighborsOffset = [1, -1];

    const checkNeighbor = (n) => {
        const x = square.props.x;
        const y = square.props.y + n;

        // Check if the coordinates are within bounds
        if (!areCoordinatesInBounds(x, y)) {
            return false;
        }

        const piece = getATargetSquareByLocation(x, y, squares);

        // Check if the neighboring piece is a pawn and of the opposite color
        const isThePieceAPawn = isPawn(piece);
        const areTheyDifferentColor = !areSameColor(square, piece);

        return isThePieceAPawn && areTheyDifferentColor;
    };

    // Return true if any neighboring square contains a pawn that can capture en passant
    return neighborsOffset.some(n => checkNeighbor(n));
}

/**
 * Handles the en passant capture logic.
 * 
 * This function updates the board position if an en passant capture is possible. 
 * It checks if there are pawns that can perform an en passant capture, updates the 
 * board position accordingly, and inverts the piece color for the en passant capture.
 * 
 * @param {object} square - The square containing the piece that moved.
 * @param {object} targetSquare - The square to which the piece is moving.
 * @param {array} position - The current board position.
 * @param {array} squares - The array representing the board squares.
 * @returns {array} - The updated board position after en passant capture.
 */
export function captureEnPassant(square, targetSquare, position, squares) {
    const color = getPieceColor(square);
    const isWhite = isColorWhite(color);
    const offset = isWhite ? 1 : -1;
    const { isPossible, x, y } = GlobalVariables.EnPassant;
    const enPassantSquare = getATargetSquareByLocation(x, y, squares)
    const enPassantTargetSquare = getATargetSquareByLocation(targetSquare.props.x + offset, targetSquare.props.y, squares);

    if (!compareIfTwoSquaresAreTheSame(targetSquare, enPassantSquare)) {
        return position;
    }

    if (isPossible && areTherePawnsThatCanCaptureEnPassant(square, squares)) {
        if (enPassantTargetSquare) {
            // Perform en passant capture
            position = updateBoardPosition(square, enPassantTargetSquare);
            // Invert the color of the piece being captured
            const pseudoSquare = <Square x={enPassantTargetSquare.props.x} y={enPassantTargetSquare.props.y} piece={invertPieceColor(enPassantTargetSquare.props.piece)} />;
            // Update the board position again after inverting the piece color
            position = updateBoardPosition(pseudoSquare, targetSquare);
        }
    }

    return position;
}

/**
 * Inverts the color of a piece.
 * 
 * @param {string} pseudo - The pseudo representation of the piece in {color-piece} format.
 * @returns {string} - The piece with inverted color.
 */
function invertPieceColor(pseudo) {
    const [color, piece] = pseudo.split(GlobalVariables.PIECE_DELIMITER);
    const newColor = isColorWhite(color) ? GlobalVariables.COLORS.BLACK : GlobalVariables.COLORS.WHITE;
    return `${newColor}${GlobalVariables.PIECE_DELIMITER}${piece}`;
}

/**
 * Updates the global board state with the new position.
 * @param {Array} updatedPosition - The updated board position after the move.
 */
export function updateBoardState(updatedPosition) {
    const newPosition = updatedPosition.map(row => [...row]);
    GlobalVariables.BoardPosition.splice(0, GlobalVariables.BoardPosition.length, ...newPosition);
}

/**
 * Updates the move counters for the game.
 */
export function updateMoveCounters() {
    GlobalVariables.updateFullMoves(GlobalVariables.FullMoves + 1);
}

/**
 * Resets the possible moves array and toggles the player's turn.
 */
export function resetPossibleMovesAndToggleTurn() {
    GlobalVariables.PossibleMoves.splice(0, GlobalVariables.PossibleMoves.length);
    GlobalVariables.updateIsWhiteToMove(!GlobalVariables.IsWhiteToMove);
}