// Board related constants
export const DIM = 8; // 8x8 Board
export const PIECE_DELIMITER = '-'; // Format: {color-piece}, e.g., {black-pawn}
export const DARK_SQUARES_COLOR = 'dark'
export const EMPTY_SPACE = " "
export const EMPTY_STRING = ""

// Color options (ENUM)
export const COLORS = Object.freeze({
    WHITE: 'white',
    BLACK: 'black'
});

// Piece names (ENUM)
export const PIECES = Object.freeze({
    PAWN: "pawn",
    ROOK: "rook",
    KNIGHT: "knight",
    BISHOP: "bishop",
    KING: "king",
    QUEEN: "queen"
});

// Quick access to kings (ENUM)
export const KINGS = Object.freeze({
    BLACK_KING: `${COLORS.BLACK}${PIECE_DELIMITER}${PIECES.KING}`,
    WHITE_KING: `${COLORS.WHITE}${PIECE_DELIMITER}${PIECES.KING}`
});

// Castling rights
export let CastlingRights = {
    whiteShortCastle: false,
    whiteLongCastle: false,
    blackShortCastle: false,
    blackLongCastle: false
};

// En Passant information
export let EnPassant = {
    isPossible: false,
    x: -1,
    y: -1
};

// Current square selection
export let CurrentSquareSelection = {
    x: -1,
    y: -1
};

// Game state
export let PossibleMoves = [];
export let HalfMoves = 0;
export let FullMoves = 0;
export let IsWhiteToMove = false;

export function updateIsWhiteToMove(value) {
    IsWhiteToMove = value;
}

export function updateHalfMoves(value) {
    HalfMoves = value;
}

export function updateFullMoves(value) {
    FullMoves = value;
}

// Empty square representation
export const EMPTY_SQUARE_PIECE = ' ';

// Board position
export let BoardPosition = Array.from({ length: DIM }, () => Array(DIM).fill(EMPTY_SQUARE_PIECE));

// Starting positions and squares
export const WHITE_PAWN_STARTING_SQUARE = 6;
export const BLACK_PAWN_STARTING_SQUARE = 1;
export const WHITE_EN_PASSANT_SQUARE = 3;
export const BLACK_EN_PASSANT_SQUARE = 4;

// FEN piece notations
export const FEN_PIECES_WHITE = Object.freeze({
    PAWN: "P",
    ROOK: "R",
    KNIGHT: "N",
    BISHOP: "B",
    KING: "K",
    QUEEN: "Q"
});
export const FEN_PIECES_BLACK = Object.freeze({
    PAWN: "p",
    ROOK: "r",
    KNIGHT: "n",
    BISHOP: "b",
    KING: "k",
    QUEEN: "q"
});
export const FEN_BOARD_DELIMITER = '/'
export const FEN_COLOR = {
    WHITE: "w",
    BLACK: "b"
}
export const FEN_VALID_PARTS_NUMBER = 6
export const INVALID_FEN_ERROR = "Invalid FEN"

// Castling constants
export const CASTLE_ROW_WHITE = 7;
export const CASTLE_ROW_BLACK = 0;
export const CASTLE_KING_INITIAL_COL = 4;
export const CASTLE_KING_FINAL_COL_LONG = 2;
export const CASTLE_KING_FINAL_COL_SHORT = 6;
export const CASTLE_ROOK_INITIAL_COL_LONG = 0;
export const CASTLE_ROOK_INITIAL_COL_SHORT = 7;
export const CASTLE_ROOK_FINAL_COL_LONG = 3;
export const CASTLE_ROOK_FINAL_COL_SHORT = 5;
export const CASTLE_PATH_COLS_LONG = [1, 2, 3];
export const CASTLE_PATH_COLS_SHORT = [5, 6];
export const EMPTY_SQUARES_AFTER_LONG_CASTLE = [0, 1, 4];
export const EMPTY_SQUARES_AFTER_SHORT_CASTLE = [4, 7];

// Indices for piece color and type
export const PIECE_COLOR_INDEX = 0;
export const PIECE_PIECE_INDEX = 1;

// Castling types
export const CASTLING_TYPES = Object.freeze({
    LONG: "long",
    SHORT: "short"
});

//ASCII Values
export const ASCII_UPPERCASE_A = 65;
export const ASCII_UPPERCASE_Z = 90;
export const ASCII_LOWERCASE_A = 97;
export const ASCII_LOWERCASE_Z = 122;
export const ASCII_DIGIT_0 = 48
export const ASCII_DIGIT_9 = 57