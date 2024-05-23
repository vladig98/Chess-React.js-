export const DIM = 8; //8x8 Board
export const PIECE_DELIMITER = '-'; //a piece is stored in the format {color-piece}, e.g., {black-pawn}, the delimiter (-) is used to separate the color and the piece
//object that has all the color options (ENUM)
export const COLORS = {
    WHITE: 'white',
    BLACK: 'black'
}
//object that has the name of each individual piece (ENUM)
export const PIECES = {
    PAWN: "pawn",
    ROOK: "rook",
    KNIGHT: "knight",
    BISHOP: "bishop",
    KING: "king",
    QUEEN: "queen"
};
//object that has the kings for quicker access (ENUM)
export const KINGS = {
    BLACK_KING: `${COLORS.BLACK}${PIECE_DELIMITER}${PIECES.KING}`, //the piece for the black king; used to get the king from the squares array quicker
    WHITE_KING: `${COLORS.WHITE}${PIECE_DELIMITER}${PIECES.KING}` //the piece for the white king; used to get the king from the squares array quicker
}

//export let BoardSquares = [] //array that collects all square components
export let CastlingRights = {
    whiteShortCastle: false,
    whiteLongCastle: false,
    blackLongCastle: false,
    blackShortCastle: false
}
export let EnPassant = {
    isPossible: false,
    x: -1,
    y: -1
}
export let CurrentSquareSelection = {
    x: -1,
    y: -1
}
export let PossibleMoves = []
export let HalfMoves = 0
export let FullMoves = 0
export let IsWhiteToMove = false
export function updateIsWhiteToMove(value) {
    IsWhiteToMove = value
}
export function updateHalfMoves(value) {
    HalfMoves = value
}
export function updateFullMoves(value) {
    FullMoves = value
}
export let BoardPosition = [[]]