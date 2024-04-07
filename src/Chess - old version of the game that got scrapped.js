import { useState } from "react";

function Square({ dark, piece, x, y, move }) {
    let c = "chessSquare piece";
    c = dark ? c + ' dark' : c;

    let p, cl;

    if (piece != undefined) {
        c = c + ' ' + piece;
        p = piece.split('-')[1][0];
        p = p == 'k' ? (piece.split('-')[1][1] == 'n' ? 'n' : p) : p;
        cl = piece.split('-')[0][0] == 'w' ? true : false;
    }

    return <div className={c} x={x} y={y} onClick={() => move(p, cl, x, y)}></div>
}

function Board({ position, move }) {

    let color;
    let piece;
    let rows = [];
    let key = 1;
    let white = true;
    let x = 0;
    let y = 0;

    for (let i = 0; i < position.length; i++) {
        y = 0;
        for (let j = 0; j < position[i].length; j++) {
            if (position[i].charCodeAt(j) >= 97 && position[i].charCodeAt(j) <= 122) {
                color = 'black';
            } else if (position[i].charCodeAt(j) >= 65 && position[i].charCodeAt(j) <= 90) {
                color = 'white';
            } else {
                color = undefined;
            }

            switch (position[i][j].toLowerCase()) {
                case "p":
                    piece = 'pawn';
                    break;
                case 'n':
                    piece = 'knight';
                    break;
                case 'k':
                    piece = 'king';
                    break;
                case 'q':
                    piece = 'queen';
                    break;
                case 'b':
                    piece = 'bishop';
                    break;
                case 'r':
                    piece = 'rook';
                    break;
                default:
                    piece = undefined;
                    break;
            }

            if (piece != undefined && color != undefined) {
                rows.push(<Square dark={white ? false : true} key={key} piece={color + '-' + piece} x={x} y={y} move={move}></Square>)
                if (key % 8 != 0) {
                    white = !white;
                }
                key++
                y++;
            } else {
                for (let k = 0; k < Number(position[i][j]); k++) {
                    rows.push(<Square dark={white ? false : true} key={key} x={x} y={y} move={move}></Square>)
                    if (key % 8 != 0) {
                        white = !white;
                    }
                    key++;
                    y++
                }
            }
        }
        x++;
    }

    return rows;
}

export default function Chess() {

    const [boardPosition, setBoardPosition] = useState(
        [
            'rnbqkbnr',
            'pppppppp',
            '8',
            '8',
            '8',
            '8',
            'PPPPPPPP',
            'RNBQKBNR'
        ]);

    const [selectedPiece, setSelectedPiece] = useState('');
    const [oldX, setOldX] = useState('');
    const [oldY, setOldY] = useState('');
    const [allowedMoves, setAllowedMoves] = useState([])
    const [whiteToMove, setWhiteToMove] = useState(true);
    const [canWhiteShortCastle, setCanWhiteShortCastle] = useState(true);
    const [canWhiteLongCastle, setCanWhiteLongCastle] = useState(true);
    const [canBlackShortCastle, setCanBlackShortCastle] = useState(true);
    const [canBlackLongCastle, setCanBlackLongCastle] = useState(true);
    const [isWhiteInCheck, setIsWhiteInCheck] = useState(false);
    const [isBlackInCheck, setIsBlackInCheck] = useState(false);

    function handleCapture(x, y, pieceToCapture) {
        if (selectedPiece.charCodeAt(0) >= 65 && selectedPiece.charCodeAt(0) <= 90) {
            if (pieceToCapture.charCodeAt(0) >= 65 && pieceToCapture.charCodeAt(0) <= 90) {
                return
            }
        }

        if (selectedPiece.charCodeAt(0) >= 97 && selectedPiece.charCodeAt(0) <= 122) {
            if (pieceToCapture.charCodeAt(0) >= 97 && pieceToCapture.charCodeAt(0) <= 122) {
                return
            }
        }

        let oldRow = boardPosition[oldX];
        let newRow = boardPosition[x];

        oldRow = convertFenToString(oldRow);
        newRow = convertFenToString(newRow);

        oldRow = oldRow.substring(0, oldY) + ' ' + oldRow.substring(oldY + 1, oldRow.length)
        newRow = newRow.substring(0, y) + selectedPiece + newRow.substring(y + 1, newRow.length)

        oldRow = convertStringToFen(oldRow)
        newRow = convertStringToFen(newRow)

        let newBoard = [];

        for (let i = 0; i < boardPosition.length; i++) {
            if (i == x || i == oldX) {
                if (x == oldX) {
                    //TO DO: Implement capturing on the same row
                    console.warn("Implement capturing on the same row")
                }
                else if (i == x) {
                    newBoard.push(newRow);
                } else if (i == oldX) {
                    newBoard.push(oldRow);
                }
            } else {
                newBoard.push(boardPosition[i]);
            }
        }

        setBoardPosition(newBoard)
        setWhiteToMove(!whiteToMove)
    }

    function convertFenToString(fen) {
        let result = '';

        for (let i = 0; i < fen.length; i++) {
            if (fen.charCodeAt(i) >= 48 && fen.charCodeAt(i) <= 57) {
                result += ' '.repeat(Number(fen[i]))
            } else {
                result += fen[i];
            }
        }

        return result;
    }

    function convertStringToFen(str) {
        for (let i = str.length - 1; i >= 0; i--) {
            if (str[i] == ' ') {
                if (i < str.length - 1) {
                    if (str.charCodeAt(i + 1) >= 48 && str.charCodeAt(i + 1) <= 57) {
                        str = str.substring(0, i) + (Number(str[i + 1]) + 1).toString() + str.substring(i + 1, str.length);
                        str = str.slice(0, i + 1) + str.slice(i + 2);
                    } else {
                        str = str.substring(0, i) + '1' + str.substring(i + 1, str.length);
                    }
                } else {
                    str = str.substring(0, i) + '1' + str.substring(i + 1, str.length);
                }
            }
        }

        return str;
    }

    const Move = (p, c, x, y) => {
        if (selectedPiece) {

            //allows to deselect a piece
            if (x == oldX) {
                if (y == oldY) {
                    setSelectedPiece('')
                    setOldX('')
                    setOldY('')
                    return
                }
            }

            //allow only king moves if in check
            //TO DO: Allow check blocks and attacking pieces captures
            if (whiteToMove) {
                if (isWhiteInCheck) {
                    if (p != 'k') {
                        setSelectedPiece('')
                        setOldX('')
                        setOldY('')
                        return
                    }
                }
            } else {
                if (isBlackInCheck) {
                    if (p != 'k') {
                        setSelectedPiece('')
                        setOldX('')
                        setOldY('')
                        return
                    }
                }
            }

            let row = boardPosition[x];
            let newRow = '';
            let oldRow = '';
            let allowed = false;

            //check if the move you're making is legal
            for (let i = 0; i < allowedMoves.length; i++) {
                let move = allowedMoves[i];

                if (x == move[0]) {
                    if (y == move[1]) {
                        allowed = true;
                    }
                }
            }

            //stop if illegal move is used
            if (!allowed) {
                setOldX('')
                setOldY('')
                setSelectedPiece('')
                return
            }

            //convert FEN to string, update the position and convert back to FEN
            newRow = convertFenToString(row);

            if (newRow[y] != ' ') {
                handleCapture(x, y, newRow[y]);
                setOldX('')
                setOldY('')
                setSelectedPiece('')
                return;
            }

            newRow = newRow.substring(0, y) + selectedPiece + newRow.substring(y + 1, newRow.length);
            newRow = convertStringToFen(newRow);

            //get the old position; if same row, get the current new position
            row = x == oldX ? newRow : boardPosition[oldX];

            //convert FEN to string, update the old position and convert back to FEN
            oldRow = convertFenToString(row);
            oldRow = oldRow.substring(0, oldY) + ' ' + oldRow.substring(oldY + 1, oldRow.length);
            oldRow = convertStringToFen(oldRow);

            //create a new board position and update the board
            let newBoard = [];

            for (let i = 0; i < boardPosition.length; i++) {
                if (i == x || i == oldX) {
                    //use the old position if it's the same row as the old position will be updating the current newPosition and will have the most up-to-date values
                    if (x == oldX) {
                        newBoard.push(oldRow);
                    }
                    else if (i == x) {
                        newBoard.push(newRow);
                    } else if (i == oldX) {
                        newBoard.push(oldRow);
                    }
                } else {
                    newBoard.push(boardPosition[i]);
                }
            }

            //removes the right to castle if the rook has moved for white
            if (selectedPiece == 'R') {
                if (oldX == 7 && oldY == 0) {
                    setCanWhiteLongCastle(false)
                }
                if (oldX == 7 && oldY == 7) {
                    setCanWhiteShortCastle(false)
                }
            }

            //removes the right to castle if the rook has moved for black
            if (selectedPiece == 'r') {
                if (oldX == 0 && oldY == 0) {
                    setCanBlackLongCastle(false)
                }
                if (oldX == 0 && oldY == 7) {
                    setCanBlackShortCastle(false)
                }
            }

            //block castling when king moves for black
            if (selectedPiece == 'k') {
                setCanBlackLongCastle(false)
                setCanBlackShortCastle(false)
            }

            //block castling when king moves for white
            if (selectedPiece == 'K') {
                setCanWhiteLongCastle(false)
                setCanWhiteShortCastle(false)
            }

            //handle castling for white
            if (selectedPiece == 'K') {
                if (y - oldY == 2) {
                    let castleRow = newBoard[7];
                    castleRow = convertFenToString(castleRow)
                    castleRow = castleRow.substring(0, 5) + "RK "
                    castleRow = convertStringToFen(castleRow)
                    newBoard[7] = castleRow
                }

                if (oldY - y == 2) {
                    let castleRow = newBoard[7];
                    castleRow = convertFenToString(castleRow)
                    castleRow = "  KR " + castleRow.substring(5, 8)
                    castleRow = convertStringToFen(castleRow)
                    newBoard[7] = castleRow
                }
            }

            //handle castling for black
            if (selectedPiece == 'k') {
                if (y - oldY == 2) {
                    let castleRow = newBoard[0];
                    castleRow = convertFenToString(castleRow)
                    castleRow = castleRow.substring(0, 5) + "rk "
                    castleRow = convertStringToFen(castleRow)
                    newBoard[0] = castleRow
                }

                if (oldY - y == 2) {
                    let castleRow = newBoard[0];
                    castleRow = convertFenToString(castleRow)
                    castleRow = "  kr " + castleRow.substring(5, 8)
                    castleRow = convertStringToFen(castleRow)
                    newBoard[0] = castleRow
                }
            }

            //update the board and reset the variables
            setBoardPosition(newBoard);
            setOldX('')
            setOldY('')
            setSelectedPiece('')

            setWhiteToMove(!whiteToMove)
        } else {
            if (c != whiteToMove) {
                return
            }

            switch (p) {
                case "p":
                    let pawnMoves = [];
                    if (c) {
                        if (x == 6) {
                            pawnMoves.push([x - 1, y])
                            pawnMoves.push([x - 2, y])
                        } else {
                            pawnMoves.push([x - 1, y])
                        }

                        if (x > 0) {
                            if (y > 0) {
                                let currentRowPosition = boardPosition[x - 1];
                                currentRowPosition = convertFenToString(currentRowPosition);
                                if (currentRowPosition[y - 1] != ' ') {
                                    pawnMoves.push([x - 1, y - 1])
                                }
                            }

                            if (y < 8) {
                                let currentRowPosition = boardPosition[x - 1];
                                currentRowPosition = convertFenToString(currentRowPosition);
                                if (currentRowPosition[y + 1] != ' ') {
                                    pawnMoves.push([x - 1, y + 1])
                                }
                            }
                        }
                    } else {
                        if (x == 1) {
                            pawnMoves.push([x + 1, y])
                            pawnMoves.push([x + 2, y])
                        } else {
                            pawnMoves.push([x + 1, y])
                        }

                        if (x < 8) {
                            if (y > 0) {
                                let currentRowPosition = boardPosition[x + 1];
                                currentRowPosition = convertFenToString(currentRowPosition);
                                if (currentRowPosition[y - 1] != ' ') {
                                    pawnMoves.push([x + 1, y - 1])
                                }
                            }

                            if (y < 8) {
                                let currentRowPosition = boardPosition[x + 1];
                                currentRowPosition = convertFenToString(currentRowPosition);
                                if (currentRowPosition[y + 1] != ' ') {
                                    pawnMoves.push([x + 1, y + 1])
                                }
                            }
                        }
                    }

                    setAllowedMoves(pawnMoves)
                    break;
                case "r":
                    let rookMoves = [];
                    for (let i = 0; i < 8; i++) {
                        rookMoves.push([i, y]);
                        rookMoves.push([x, i]);
                    }
                    setAllowedMoves(rookMoves)
                    break;
                case "n":
                    let knightMoves = [];

                    if (x - 2 >= 0 && y - 1 >= 0) {
                        knightMoves.push([x - 2, y - 1]);
                    }

                    if (x - 2 >= 0 && y + 1 < 8) {
                        knightMoves.push([x - 2, y + 1]);
                    }

                    if (x + 2 < 8 && y - 1 >= 0) {
                        knightMoves.push([x + 2, y - 1]);
                    }

                    if (x + 2 < 8 && y + 1 < 8) {
                        knightMoves.push([x + 2, y + 1]);
                    }

                    if (x - 1 >= 0 && y - 2 >= 0) {
                        knightMoves.push([x - 1, y - 2]);
                    }

                    if (x + 1 < 8 && y - 2 >= 0) {
                        knightMoves.push([x + 1, y - 2]);
                    }

                    if (x - 1 >= 0 && y + 2 < 8) {
                        knightMoves.push([x - 1, y + 2]);
                    }

                    if (x + 1 < 8 && y + 2 < 8) {
                        knightMoves.push([x + 1, y + 2]);
                    }

                    setAllowedMoves(knightMoves)
                    break;
                case "b":
                    let bishopMoves = [];
                    for (let i = 1; i <= 8; i++) {
                        if (x - i >= 0 && y - 1 >= 0) {
                            bishopMoves.push([x - i, y - i]);
                        }

                        if (x + 1 < 8 && y + i < 8) {
                            bishopMoves.push([x + i, y + i]);
                        }

                        if (x + 1 < 8 && y - 1 >= 0) {
                            bishopMoves.push([x + i, y - i]);
                        }

                        if (x - i >= 0 && y + 1 < 8) {
                            bishopMoves.push([x - i, y + i]);
                        }
                    }
                    setAllowedMoves(bishopMoves);
                    break;
                case "q":
                    let queenMoves = [];
                    for (let i = 1; i <= 8; i++) {
                        if (x - i >= 0 && y - 1 >= 0) {
                            queenMoves.push([x - i, y - i]);
                        }

                        if (x + 1 < 8 && y + i < 8) {
                            queenMoves.push([x + i, y + i]);
                        }

                        if (x + 1 < 8 && y - 1 >= 0) {
                            queenMoves.push([x + i, y - i]);
                        }

                        if (x - i >= 0 && y + 1 < 8) {
                            queenMoves.push([x - i, y + i]);
                        }
                    }
                    for (let i = 0; i < 8; i++) {
                        queenMoves.push([i, y]);
                        queenMoves.push([x, i]);
                    }
                    setAllowedMoves(queenMoves)
                    break;
                case "k":
                    let kingMoves = [];
                    for (let i = x - 1; i <= x + 1; i++) {
                        for (let j = y - 1; j <= y + 1; j++) {
                            //handle edges
                            if (i >= 0 && i < 8) {
                                if (j >= 0 && j < 8) {
                                    kingMoves.push([i, j]);
                                }
                            }
                        }
                    }

                    //handle castling
                    if (c) {
                        let lastRow = boardPosition[7]
                        lastRow = convertFenToString(lastRow)
                        if (canWhiteShortCastle) {
                            if (lastRow[5] == ' ' && lastRow[6] == ' ') {
                                kingMoves.push([x, y + 2])
                            }
                        }

                        if (canWhiteLongCastle) {
                            if (lastRow[1] == ' ' && lastRow[2] == ' ' && lastRow[3] == ' ') {
                                kingMoves.push([x, y - 2]);
                            }
                        }
                    } else {
                        let firstRow = boardPosition[0]
                        firstRow = convertFenToString(firstRow)

                        if (canBlackShortCastle) {
                            if (firstRow[5] == ' ' && firstRow[6] == ' ') {
                                kingMoves.push([x, y + 2])
                            }
                        }

                        if (canBlackLongCastle) {
                            if (firstRow[1] == ' ' && firstRow[2] == ' ' && firstRow[3] == ' ') {
                                kingMoves.push([x, y - 2]);
                            }
                        }
                    }

                    setAllowedMoves(kingMoves);
                    break;
                default:
                    break;
            }

            if (p != undefined && c != undefined) {
                p = c ? p.toUpperCase() : p;

                setSelectedPiece(p);
                setOldX(x);
                setOldY(y);
            }
        }
    }

    return (<>
        <div className="chessContainer">
            <div id="grid" className="chessGrid">
                <Board position={boardPosition} move={Move}></Board>
            </div>
        </div>
    </>)
}