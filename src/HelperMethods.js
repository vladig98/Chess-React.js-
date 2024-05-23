//Checks if a character is Uppercase
export function IsUpperCase(value) {
    return value.charCodeAt(0) >= 65 && value.charCodeAt(0) <= 90
}

//Checks if a character is Lowercase
export function IsLowerCase(value) {
    return value.charCodeAt(0) >= 97 && value.charCodeAt(0) <= 122
}

//Checks if a character is a Digit
export function IsDigit(value) {
    return value.charCodeAt(0) >= 48 && value.charCodeAt(0) <= 57
}

export function ParseFEN(fen) {
    const fenParts = fen.split(' ');

    if (fenParts.length != 6) {
        console.log('Invalid FEN')
        return;
    }

    const fenBoard = fenParts[0];
    const fenTurn = fenParts[1];
    const fenCastling = fenParts[2];
    const fenEnPassant = fenParts[3];
    const fenHalfMoves = Number(fenParts[4])
    const fenFullMoves = Number(fenParts[5])

    return { fenBoard, fenTurn, fenCastling, fenEnPassant, fenHalfMoves, fenFullMoves }
}

export function ConvertFENtoPiece(letter) {
    switch (letter.toLowerCase()) {
        case "p":
            return 'pawn'
        case "n":
            return "knight"
        case "k":
            return "king";
        case "q":
            return "queen";
        case "r":
            return "rook";
        case "b":
            return "bishop";
        default:
            return "";
    }
}

export function ConvertFENPieceToPiece(value) {
    if (IsUpperCase(value)) {
        return `white-${ConvertFENtoPiece(value)}`;
    }

    if (IsLowerCase(value)) {
        return `black-${ConvertFENtoPiece(value)}`;
    }

    return "";
}

export function ConvertFenToString(value) {
    let result = [];

    for (let i = 0; i < value.length; i++) {
        if (IsDigit(value.charAt(i))) {
            for (let j = 0; j < Number(value.charAt(i)); j++) {
                result.push(" ")
            }
        } else {
            result.push(value.charAt(i))
        }
    }

    return result.join('');
}

export function UpdatePosition(square, targetSquare, position) {
    let pos = [];

    for (let i = 0; i < position.length; i++) {
        if (square.props.x == targetSquare.props.x && square.props.x == i) {
            let row = position[i]
            if (square.props.piece.split("-")[1] == "king") {
                if (Math.abs(square.props.y - targetSquare.props.y) == 2) {
                    //if (row.toLowerCase().indexOf("r k") == 0) {
                    if (row[0].toLowerCase() == 'r' && row[1].toLowerCase() == ' ' && row[2].toLowerCase() == ' ' && row[3].toLowerCase() == ' ' && row[4].toLowerCase() == 'k') {
                        // row = square.props.piece.split("-")[0] == "white" ? "  KR " + row.substring(5, row.length) : "  kr " + row.substring(5, row.length)
                        let index2 = square.props.piece.split("-")[0] == "white" ? 'K' : 'k'
                        let index3 = square.props.piece.split("-")[0] == "white" ? 'R' : 'r'

                        row[0] = ' '
                        row[1] = ' '
                        row[2] = index2
                        row[3] = index3
                        row[4] = ' '
                    }

                    if (row[4].toLowerCase() == 'k' && row[5].toLowerCase() == ' ' && row[6].toLowerCase() == ' ' && row[7].toLowerCase() == 'r') {
                        let index5 = square.props.piece.split("-")[0] == "white" ? 'R' : 'r'
                        let index6 = square.props.piece.split("-")[0] == "white" ? 'K' : 'k'

                        row[4] = ' '
                        row[5] = index5
                        row[6] = index6
                        row[7] = ' '
                    }
                }
            }
            row = SidewaysCapture(row, Number(square.props.y), Number(targetSquare.props.y), square.props.piece)
            pos.push(row)
        } else if (square.props.x == i) {
            let row = position[i]
            row[square.props.y] = ' '
            pos.push(row)
        } else if (targetSquare.props.x == i) {
            let row = position[i]
            row[targetSquare.props.y] = ConvertPieceToFENPiece(square.props.piece)
            pos.push(row)
        } else {
            pos.push(position[i])
        }
    }

    return pos;
}

function SidewaysCapture(row, y, targetY, value) {
    let result = []

    for (let i = 0; i < row.length; i++) {
        if (i == y) {
            result.push(" ")
        } else if (i == targetY) {
            result.push(ConvertPieceToFENPiece(value))
        } else {
            result.push(row[i])
        }
    }

    return result
}

function ConvertStringToFEN(value) {
    let result = [];

    let counter = 0;
    for (let i = 0; i < value.length; i++) {
        if (value.charAt(i) == ' ') {
            counter++;
        } else {
            if (counter != 0) {
                result.push(counter)
            }
            result.push(value.charAt(i))
            counter = 0;
        }
    }

    if (counter != 0) {
        result.push(counter)
    }

    return result.join('')
}

function replaceAt(value, replacement, index) {
    return value.substring(0, index) + replacement + value.substring(index + replacement.toString().length);
}

function ConvertPieceToFENPiece(value) {
    let color = value.split('-')[0]
    let piece = value.split('-')[1]

    let p = '';

    switch (piece) {
        case "pawn":
            p = 'p';
            break;
        case "knight":
            p = 'n';
            break;
        case "bishop":
            p = 'b';
            break;
        case "rook":
            p = 'r';
            break;
        case "queen":
            p = 'q';
            break;
        case "king":
            p = 'k';
            break;
        default:
            break;
    }

    return color == "white" ? p.toString().toUpperCase() : p.toString()
}