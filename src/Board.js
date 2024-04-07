import { Component } from "react";
import React from 'react';
import { Square } from "./Square.js"
import { ConvertFENPieceToPiece, ConvertFenToString, UpdatePosition } from "./HelperMethods.js";


/*
TODO:
Code Reusability: refactor some of the repeated code and generate new functions if needed
Consistency and Naming: Have better and more consistent names for variables and functions
Documentation: add more comments to understand what is going on
Testing: add unit tests
Implementations: add promotions, implement endgames (mate, stalemate, draws repeation, 50 moves rule)
Bugs: Fix bugs (if any)
*/

const DIM = 8; //8x8 Board

export class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            position: [
                'rnbqkbnr',
                'pppppppp',
                '8',
                '8',
                '8',
                '8',
                'PPPPPPPP',
                'RNBQKBNR'
            ],
            possibleMoves: [],
            selectedSquareX: "",
            selectedSquareY: "",
            canWhiteShortCastle: true,
            canWhiteLongCastle: true,
            canBlackShortCastle: true,
            canBlackLongCastle: true,
            enPassantPossible: false,
            enPassantX: "",
            enPassantY: "",
            isWhiteToMove: true
        };
    }

    isWhiteInCheck(square, pseudo) {
        let squares = this.renderSquares()

        if (pseudo) {
            const updatedSquares = squares.map(s => {
                if (s.props.x === pseudo.props.x && s.props.y === pseudo.props.y) {
                    // Return a new Square component with the updated piece
                    return React.cloneElement(s, { piece: pseudo.props.piece });
                } else {
                    // For other squares, return the original Square component
                    return s;
                }
            });

            squares = updatedSquares;
        }

        //check for attackers in front of the white king
        for (let i = square.props.x - 1; i >= 0; i--) {
            let piece = squares.find(s => s.props.x == i && s.props.y == square.props.y)
            if (piece.props.piece.split("-")[0] != "white") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from behind")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers behind the white king
        for (let i = square.props.x + 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == i && s.props.y == square.props.y)
            if (piece.props.piece.split("-")[0] != "white") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from the front")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers to the left of the white king
        for (let i = square.props.y - 1; i >= 0; i--) {
            let piece = squares.find(s => s.props.x == square.props.x && s.props.y == i)
            if (piece.props.piece.split("-")[0] != "white") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from the left")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers to the right of the white king
        for (let i = square.props.y + 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x && s.props.y == i)
            if (piece.props.piece.split("-")[0] != "white") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from the right")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers on a half of one of the diagonals (tlted counterclockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x - i && s.props.y == square.props.y - i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "white") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop" || piece.props.piece.split("-")[1] == "pawn") {
                        if (piece.props.piece.split("-")[1] == "pawn") {
                            if (piece.props.x - square.props.x == -1 && piece.props.y - square.props.y == -1) {
                                //console.log("in check from top half of counterclockwise diagonal by a pawn")
                                return true
                            } else {
                                break
                            }
                        } else {
                            //console.log("in check from top half of counterclockwise diagonal")
                            return true
                        }
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for attackers on the other half of one of the diagonals (tlted counterclockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x + i && s.props.y == square.props.y + i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "white") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop") {
                        return true
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for attackers on a half of one of the diagonals (tlted clockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x - i && s.props.y == square.props.y + i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "white") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop" || piece.props.piece.split("-")[1] == "pawn") {
                        if (piece.props.piece.split("-")[1] == "pawn") {
                            if (piece.props.x - square.props.x == -1 && piece.props.y - square.props.y == 1) {
                                //console.log("in check from top half of clockwise diagonal by a pawn")
                                return true
                            } else {
                                break
                            }
                        } else {
                            //console.log("in check from top half of clockwise diagonal")
                            return true
                        }
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for attackers on the other half of one of the diagonals (tlted clockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x + i && s.props.y == square.props.y - i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "white") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop") {
                        return true;
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for knights check
        let knight1 = squares.find(s => s.props.x == square.props.x - 2 && s.props.y == square.props.y - 1)
        let knight2 = squares.find(s => s.props.x == square.props.x - 2 && s.props.y == square.props.y + 1)
        let knight3 = squares.find(s => s.props.x == square.props.x + 2 && s.props.y == square.props.y - 1)
        let knight4 = squares.find(s => s.props.x == square.props.x + 2 && s.props.y == square.props.y + 1)
        let knight5 = squares.find(s => s.props.x == square.props.x - 1 && s.props.y == square.props.y + 2)
        let knight6 = squares.find(s => s.props.x == square.props.x - 1 && s.props.y == square.props.y - 2)
        let knight7 = squares.find(s => s.props.x == square.props.x + 1 && s.props.y == square.props.y + 2)
        let knight8 = squares.find(s => s.props.x == square.props.x + 1 && s.props.y == square.props.y - 2)

        if (knight1) {
            if (knight1.props.piece.split("-")[1] == "knight") {
                if (knight1.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 1")
                    return true
                }
            }
        }

        if (knight2) {
            if (knight2.props.piece.split("-")[1] == "knight") {
                if (knight2.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 2")
                    return true
                }
            }
        }

        if (knight3) {
            if (knight3.props.piece.split("-")[1] == "knight") {
                if (knight3.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 3")
                    return true
                }
            }
        }

        if (knight4) {
            if (knight4.props.piece.split("-")[1] == "knight") {
                if (knight4.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 4")
                    return true
                }
            }
        }

        if (knight5) {
            if (knight5.props.piece.split("-")[1] == "knight") {
                if (knight5.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 5")
                    return true
                }
            }
        }

        if (knight6) {
            if (knight6.props.piece.split("-")[1] == "knight") {
                if (knight6.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 6")
                    return true
                }
            }
        }

        if (knight7) {
            if (knight7.props.piece.split("-")[1] == "knight") {
                if (knight7.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 7")
                    return true
                }
            }
        }

        if (knight8) {
            if (knight8.props.piece.split("-")[1] == "knight") {
                if (knight8.props.piece.split("-")[0] != "white") {
                    //console.log("in check by knight 8")
                    return true
                }
            }
        }

        return false;
    }

    isBlackInCheck(square, pseudo) {
        let squares = this.renderSquares()

        if (pseudo) {
            const updatedSquares = squares.map(s => {
                if (s.props.x === pseudo.props.x && s.props.y === pseudo.props.y) {
                    // Return a new Square component with the updated piece
                    return React.cloneElement(s, { piece: pseudo.props.piece });
                } else {
                    // For other squares, return the original Square component
                    return s;
                }
            });

            squares = updatedSquares;
        }

        //check for attackers behind the black king
        for (let i = square.props.x - 1; i >= 0; i--) {
            let piece = squares.find(s => s.props.x == i && s.props.y == square.props.y)
            if (piece.props.piece.split("-")[0] != "black") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from behind")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers in front of the black king
        for (let i = square.props.x + 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == i && s.props.y == square.props.y)
            if (piece.props.piece.split("-")[0] != "black") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from the front")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers to the left of the black king
        for (let i = square.props.y - 1; i >= 0; i--) {
            let piece = squares.find(s => s.props.x == square.props.x && s.props.y == i)
            if (piece.props.piece.split("-")[0] != "black") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from the left")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers to the right of the black king
        for (let i = square.props.y + 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x && s.props.y == i)
            if (piece.props.piece.split("-")[0] != "black") {
                if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "rook") {
                    //console.log("in check from the right")
                    return true
                } else {
                    if (piece.props.piece) {
                        break
                    }
                }
            } else {
                break
            }
        }

        //check for attackers on a half of one of the diagonals (tlted counterclockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x - i && s.props.y == square.props.y - i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "black") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop") {
                        //console.log("in check from top half of counterclockwise diagonal")
                        return true
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for attackers on the other half of one of the diagonals (tlted counterclockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x + i && s.props.y == square.props.y + i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "black") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop" || piece.props.piece.split("-")[1] == "pawn") {
                        if (piece.props.piece.split("-")[1] == "pawn") {
                            if (piece.props.x - square.props.x == 1 && piece.props.y - square.props.y == 1) {
                                //console.log("in check from bottom half of counterclockwise diagonal by a pawn")
                                return true
                            } else {
                                break
                            }
                        } else {
                            //console.log("in check from bottom half of counterclockwise diagonal")
                            return true
                        }
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for attackers on a half of one of the diagonals (tlted clockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x - i && s.props.y == square.props.y + i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "black") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop") {
                        //console.log("in check from top half of clockwise diagonal")
                        return true
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for attackers on the other half of one of the diagonals (tlted clockwise)
        for (let i = 1; i < DIM; i++) {
            let piece = squares.find(s => s.props.x == square.props.x + i && s.props.y == square.props.y - i)

            if (piece) {
                if (piece.props.piece.split("-")[0] != "black") {
                    if (piece.props.piece.split("-")[1] == "queen" || piece.props.piece.split("-")[1] == "bishop" || piece.props.piece.split("-")[1] == "pawn") {
                        if (piece.props.piece.split("-")[1] == "pawn") {
                            if (piece.props.x - square.props.x == 1 && piece.props.y - square.props.y == -1) {
                                //console.log("in check from bottom half of clockwise diagonal by a pawn")
                                return true
                            } else {
                                break
                            }
                        } else {
                            //console.log("in check from bottom half of clockwise diagonal")
                            return true
                        }
                    } else {
                        if (piece.props.piece) {
                            break
                        }
                    }
                } else {
                    break
                }
            }
        }

        //check for knights check
        let knight1 = squares.find(s => s.props.x == square.props.x - 2 && s.props.y == square.props.y - 1)
        let knight2 = squares.find(s => s.props.x == square.props.x - 2 && s.props.y == square.props.y + 1)
        let knight3 = squares.find(s => s.props.x == square.props.x + 2 && s.props.y == square.props.y - 1)
        let knight4 = squares.find(s => s.props.x == square.props.x + 2 && s.props.y == square.props.y + 1)
        let knight5 = squares.find(s => s.props.x == square.props.x - 1 && s.props.y == square.props.y + 2)
        let knight6 = squares.find(s => s.props.x == square.props.x - 1 && s.props.y == square.props.y - 2)
        let knight7 = squares.find(s => s.props.x == square.props.x + 1 && s.props.y == square.props.y + 2)
        let knight8 = squares.find(s => s.props.x == square.props.x + 1 && s.props.y == square.props.y - 2)

        if (knight1) {
            if (knight1.props.piece.split("-")[1] == "knight") {
                if (knight1.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 1")
                    return true
                }
            }
        }

        if (knight2) {
            if (knight2.props.piece.split("-")[1] == "knight") {
                if (knight2.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 2")
                    return true
                }
            }
        }

        if (knight3) {
            if (knight3.props.piece.split("-")[1] == "knight") {
                if (knight3.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 3")
                    return true
                }
            }
        }

        if (knight4) {
            if (knight4.props.piece.split("-")[1] == "knight") {
                if (knight4.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 4")
                    return true
                }
            }
        }

        if (knight5) {
            if (knight5.props.piece.split("-")[1] == "knight") {
                if (knight5.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 5")
                    return true
                }
            }
        }

        if (knight6) {
            if (knight6.props.piece.split("-")[1] == "knight") {
                if (knight6.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 6")
                    return true
                }
            }
        }

        if (knight7) {
            if (knight7.props.piece.split("-")[1] == "knight") {
                if (knight7.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 7")
                    return true
                }
            }
        }

        if (knight8) {
            if (knight8.props.piece.split("-")[1] == "knight") {
                if (knight8.props.piece.split("-")[0] != "black") {
                    //console.log("in check by knight 8")
                    return true
                }
            }
        }

        return false;
    }

    movePiece = (x, y) => {
        let squares = this.renderSquares();

        let targetSquare = squares.find(s => s.props.x == x && s.props.y == y)
        let square = squares.find(s => s.props.x == this.state.selectedSquareX && s.props.y == this.state.selectedSquareY)

        let color = square.props.piece.split("-")[0]
        let piece = square.props.piece.split("-")[1]

        //disable castling if the king moves
        if (piece == "king") {
            if (color == "white") {
                this.setState({ canWhiteLongCastle: false, canWhiteShortCastle: false })
            } else {
                this.setState({ canBlackLongCastle: false, canBlackShortCastle: false })
            }
        }

        //disable castling if the rook moves
        if (piece == "rook") {
            if (square.props.x == 7 && square.props.y == 7) {
                this.setState({ canWhiteShortCastle: false })
            }

            if (square.props.x == 0 && square.props.y == 7) {
                this.setState({ canBlackShortCastle: false })
            }

            if (square.props.x == 7 && square.props.y == 0) {
                this.setState({ canWhiteLongCastle: false })
            }

            if (square.props.x == 0 && square.props.y == 0) {
                this.setState({ canBlackLongCastle: false })
            }
        }

        let p = UpdatePosition(square, targetSquare, this.state.position)

        //capturing enPassant
        if (this.state.enPassantX && this.state.enPassantY && this.state.enPassantPossible) {
            let enPassantTargetSquare = color == "white" ? squares.find(s => s.props.x == x + 1 && s.props.y == y) : squares.find(s => s.props.x == x - 1 && s.props.y == y)
            let enPassantSquare = <Square x={square.props.x} y={square.props.y} piece={""} />

            p = UpdatePosition(enPassantSquare, enPassantTargetSquare, p)
        }

        this.setState({ position: p, possibleMoves: [], isWhiteToMove: !this.state.isWhiteToMove })

        //enabling en passant
        if (piece == "pawn") {
            if (Math.abs(square.props.x - targetSquare.props.x) == 2) {
                let enPassant1 = squares.find(s => s.props.x == targetSquare.props.x && s.props.y == targetSquare.props.y - 1)
                let enPassant2 = squares.find(s => s.props.x == targetSquare.props.x && s.props.y == targetSquare.props.y + 1)

                if (enPassant1) {
                    if (enPassant1.props.piece.split("-")[1] == "pawn") {
                        if (enPassant1.props.piece.split("-")[0] != color) {
                            this.setState({ enPassantPossible: true, enPassantX: targetSquare.props.x, enPassantY: targetSquare.props.y })
                            return
                        }
                    }
                }

                if (enPassant2) {
                    if (enPassant2.props.piece.split("-")[1] == "pawn") {
                        if (enPassant2.props.piece.split("-")[0] != color) {
                            this.setState({ enPassantPossible: true, enPassantX: targetSquare.props.x, enPassantY: targetSquare.props.y })
                            return
                        }
                    }
                }
            }
        }

        this.setState({ enPassantPossible: false, enPassantX: "", enPassantY: "" })
    }

    updatePossibleMoves = (moves) => {
        this.setState({ possibleMoves: moves });
    };

    updateSelectedSquareX = (x) => {
        this.setState({ selectedSquareX: x })
    }

    updateSelectedSquareY = (y) => {
        this.setState({ selectedSquareY: y })
    }

    getPossibleMoves(square) {
        const squares = this.renderSquares();
        let possibleMoves = [];

        let blackKing = squares.find(s => s.props.piece == "black-king")
        let whiteKing = squares.find(s => s.props.piece == "white-king")

        if (square.props.piece) {
            let color = square.props.piece.split('-')[0];
            let piece = square.props.piece.split('-')[1];

            //handle turns
            if (color == "white") {
                if (!this.state.isWhiteToMove) {
                    return
                }
            } else {
                if (this.state.isWhiteToMove) {
                    return
                }
            }

            switch (piece) {
                case "pawn":
                    if (color === "white") {
                        //move one square ahead
                        const targetSquare1 = squares.find(s => s.props.x === square.props.x - 1 && s.props.y === square.props.y);
                        if (targetSquare1 && !targetSquare1.props.piece) {
                            possibleMoves.push({ x: square.props.x - 1, y: square.props.y });
                        }

                        //move two squares on the very first move
                        const targetSquare2 = squares.find(s => s.props.x === square.props.x - 2 && s.props.y === square.props.y);
                        if (square.props.x === 6 && targetSquare2 && !targetSquare2.props.piece && !targetSquare1.props.piece) {
                            possibleMoves.push({ x: square.props.x - 2, y: square.props.y });
                        }

                        //capture to the left diagonal
                        const leftNeigborToPotentuallyCapture1 = squares.find(s => s.props.x === square.props.x - 1 && s.props.y === square.props.y - 1);
                        if (leftNeigborToPotentuallyCapture1 && leftNeigborToPotentuallyCapture1.props.piece &&
                            leftNeigborToPotentuallyCapture1.props.piece.split('-')[0] != square.props.piece.split("-")[0]) {
                            possibleMoves.push({ x: square.props.x - 1, y: square.props.y - 1 });
                        }

                        //capture to the right diagonal
                        const leftNeigborToPotentuallyCapture2 = squares.find(s => s.props.x === square.props.x - 1 && s.props.y === square.props.y + 1);
                        if (leftNeigborToPotentuallyCapture2 && leftNeigborToPotentuallyCapture2.props.piece &&
                            leftNeigborToPotentuallyCapture2.props.piece.split('-')[0] != square.props.piece.split("-")[0]) {
                            possibleMoves.push({ x: square.props.x - 1, y: square.props.y + 1 });
                        }

                        //En Passant
                        const enPassant1 = squares.find(s => s.props.x == square.props.x && s.props.y == square.props.y - 1)
                        const enPassant2 = squares.find(s => s.props.x == square.props.x && s.props.y == square.props.y + 1)

                        if (square.props.x == 3) {
                            if (enPassant1) {
                                if (enPassant1.props.piece.split("-")[1] == "pawn" && this.state.enPassantPossible) {
                                    if (enPassant1.props.piece.split("-")[0] != color) {
                                        if (enPassant1.props.x == this.state.enPassantX && enPassant1.props.y == this.state.enPassantY) {
                                            possibleMoves.push({ x: square.props.x - 1, y: square.props.y - 1 })
                                        }
                                    }
                                }
                            }

                            if (enPassant2) {
                                if (enPassant2.props.piece.split("-")[1] == "pawn" && this.state.enPassantPossible) {
                                    if (enPassant2.props.piece.split("-")[0] != color) {
                                        if (enPassant2.props.x == this.state.enPassantX && enPassant2.props.y == this.state.enPassantY) {
                                            possibleMoves.push({ x: square.props.x - 1, y: square.props.y + 1 })
                                        }
                                    }
                                }
                            }
                        }

                        //TODO: Implement promotion
                    } else {
                        const targetSquare1 = squares.find(s => s.props.x === square.props.x + 1 && s.props.y === square.props.y);
                        if (targetSquare1 && !targetSquare1.props.piece) {
                            possibleMoves.push({ x: square.props.x + 1, y: square.props.y });
                        }

                        //move two squares on the very first move
                        const targetSquare2 = squares.find(s => s.props.x === square.props.x + 2 && s.props.y === square.props.y);
                        if (square.props.x === 1 && targetSquare2 && !targetSquare2.props.piece && !targetSquare1.props.piece) {
                            possibleMoves.push({ x: square.props.x + 2, y: square.props.y });
                        }

                        //capture to the left diagonal
                        const leftNeigborToPotentuallyCapture1 = squares.find(s => s.props.x === square.props.x + 1 && s.props.y === square.props.y - 1);
                        if (leftNeigborToPotentuallyCapture1 && leftNeigborToPotentuallyCapture1.props.piece &&
                            leftNeigborToPotentuallyCapture1.props.piece.split('-')[0] != square.props.piece.split("-")[0]) {
                            possibleMoves.push({ x: square.props.x + 1, y: square.props.y - 1 });
                        }

                        //capture to the right diagonal
                        const leftNeigborToPotentuallyCapture2 = squares.find(s => s.props.x === square.props.x + 1 && s.props.y === square.props.y + 1);
                        if (leftNeigborToPotentuallyCapture2 && leftNeigborToPotentuallyCapture2.props.piece &&
                            leftNeigborToPotentuallyCapture2.props.piece.split('-')[0] != square.props.piece.split("-")[0]) {
                            possibleMoves.push({ x: square.props.x + 1, y: square.props.y + 1 });
                        }

                        //En Passant
                        const enPassant1 = squares.find(s => s.props.x == square.props.x && s.props.y == square.props.y - 1)
                        const enPassant2 = squares.find(s => s.props.x == square.props.x && s.props.y == square.props.y + 1)

                        if (square.props.x == 4) {
                            if (enPassant1) {
                                if (enPassant1.props.piece.split("-")[1] == "pawn" && this.state.enPassantPossible) {
                                    if (enPassant1.props.piece.split("-")[0] != color) {
                                        if (enPassant1.props.x == this.state.enPassantX && enPassant1.props.y == this.state.enPassantY) {
                                            possibleMoves.push({ x: square.props.x + 1, y: square.props.y - 1 })
                                        }
                                    }
                                }
                            }

                            if (enPassant2) {
                                if (enPassant2.props.piece.split("-")[1] == "pawn" && this.state.enPassantPossible) {
                                    if (enPassant2.props.piece.split("-")[0] != color) {
                                        if (enPassant2.props.x == this.state.enPassantX && enPassant2.props.y == this.state.enPassantY) {
                                            possibleMoves.push({ x: square.props.x + 1, y: square.props.y + 1 })
                                        }
                                    }
                                }
                            }
                        }

                        //TODO: Implement promotion
                    }
                    break;
                case "rook":
                    for (let i = square.props.x - 1; i >= 0; i--) {
                        let targetSquare = squares.find(s => s.props.x === i && s.props.y === square.props.y);

                        if (!targetSquare.props.piece) {
                            possibleMoves.push({ x: i, y: square.props.y })
                        } else {
                            if (targetSquare.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: i, y: square.props.y })
                            }
                            break;
                        }
                    }
                    for (let i = square.props.y - 1; i >= 0; i--) {
                        let targetSquare = squares.find(s => s.props.x === square.props.x && s.props.y === i);

                        if (!targetSquare.props.piece) {
                            possibleMoves.push({ x: square.props.x, y: i })
                        } else {
                            if (targetSquare.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: square.props.x, y: i })
                            }
                            break;
                        }
                    }
                    for (let i = square.props.x + 1; i < DIM; i++) {
                        let targetSquare = squares.find(s => s.props.x === i && s.props.y === square.props.y);

                        if (!targetSquare.props.piece) {
                            possibleMoves.push({ x: i, y: square.props.y })
                        } else {
                            if (targetSquare.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: i, y: square.props.y })
                            }
                            break;
                        }
                    }
                    for (let i = square.props.y + 1; i < DIM; i++) {
                        let targetSquare = squares.find(s => s.props.x === square.props.x && s.props.y === i);

                        if (!targetSquare.props.piece) {
                            possibleMoves.push({ x: square.props.x, y: i })
                        } else {
                            if (targetSquare.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: square.props.x, y: i })
                            }
                            break;
                        }
                    }
                    break;
                case "bishop":
                    for (let i = 1; i <= DIM; i++) {
                        if (square.props.x - i >= 0 && square.props.y - i >= 0) {
                            let targetPiece = squares.find(s => s.props.x == square.props.x - i && s.props.y == square.props.y - i)

                            if (!targetPiece.props.piece) {
                                possibleMoves.push({ x: square.props.x - i, y: square.props.y - i })
                            } else {
                                if (targetPiece.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                    possibleMoves.push({ x: square.props.x - i, y: square.props.y - i })
                                }
                                break;
                            }
                        }
                    }

                    for (let i = 1; i <= DIM; i++) {
                        if (square.props.x + i < DIM && square.props.y + i < DIM) {
                            let targetPiece = squares.find(s => s.props.x == square.props.x + i && s.props.y == square.props.y + i)

                            if (!targetPiece.props.piece) {
                                possibleMoves.push({ x: square.props.x + i, y: square.props.y + i })
                            } else {
                                if (targetPiece.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                    possibleMoves.push({ x: square.props.x + i, y: square.props.y + i })
                                }
                                break;
                            }
                        }
                    }

                    for (let i = 1; i <= DIM; i++) {
                        if (square.props.x - i >= 0 && square.props.y + i < DIM) {
                            let targetPiece = squares.find(s => s.props.x == square.props.x - i && s.props.y == square.props.y + i)

                            if (!targetPiece.props.piece) {
                                possibleMoves.push({ x: square.props.x - i, y: square.props.y + i })
                            } else {
                                if (targetPiece.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                    possibleMoves.push({ x: square.props.x - i, y: square.props.y + i })
                                }
                                break;
                            }
                        }
                    }

                    for (let i = 1; i <= DIM; i++) {
                        if (square.props.x + i < DIM && square.props.y - i >= 0) {
                            let targetPiece = squares.find(s => s.props.x == square.props.x + i && s.props.y == square.props.y - i)

                            if (!targetPiece.props.piece) {
                                possibleMoves.push({ x: square.props.x + i, y: square.props.y - i })
                            } else {
                                if (targetPiece.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                    possibleMoves.push({ x: square.props.x + i, y: square.props.y - i })
                                }
                                break;
                            }
                        }
                    }
                    break;
                case "knight":
                    let targetPiece1 = squares.find(s => s.props.x == square.props.x - 2 && s.props.y == square.props.y - 1)
                    let targetPiece2 = squares.find(s => s.props.x == square.props.x - 2 && s.props.y == square.props.y + 1)
                    let targetPiece3 = squares.find(s => s.props.x == square.props.x + 2 && s.props.y == square.props.y - 1)
                    let targetPiece4 = squares.find(s => s.props.x == square.props.x + 2 && s.props.y == square.props.y + 1)
                    let targetPiece5 = squares.find(s => s.props.x == square.props.x - 1 && s.props.y == square.props.y - 2)
                    let targetPiece6 = squares.find(s => s.props.x == square.props.x + 1 && s.props.y == square.props.y - 2)
                    let targetPiece7 = squares.find(s => s.props.x == square.props.x - 1 && s.props.y == square.props.y + 2)
                    let targetPiece8 = squares.find(s => s.props.x == square.props.x + 1 && s.props.y == square.props.y + 2)

                    if (targetPiece1) {
                        if (!targetPiece1.props.piece) {
                            possibleMoves.push({ x: targetPiece1.props.x, y: targetPiece1.props.y })
                        } else {
                            if (targetPiece1.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: targetPiece1.props.x, y: targetPiece1.props.y })
                            }
                        }
                    }

                    if (targetPiece2) {
                        if (!targetPiece2.props.piece) {
                            possibleMoves.push({ x: targetPiece2.props.x, y: targetPiece2.props.y })
                        } else {
                            if (targetPiece2.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: targetPiece2.props.x, y: targetPiece2.props.y })
                            }
                        }
                    }

                    if (targetPiece3) {
                        if (!targetPiece3.props.piece) {
                            possibleMoves.push({ x: targetPiece3.props.x, y: targetPiece3.props.y })
                        } else {
                            if (targetPiece3.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: targetPiece3.props.x, y: targetPiece3.props.y })
                            }
                        }
                    }

                    if (targetPiece4) {
                        if (!targetPiece4.props.piece) {
                            possibleMoves.push({ x: targetPiece4.props.x, y: targetPiece4.props.y })
                        } else {
                            if (targetPiece4.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: targetPiece4.props.x, y: targetPiece4.props.y })
                            }
                        }
                    }

                    if (targetPiece5) {
                        if (!targetPiece5.props.piece) {
                            possibleMoves.push({ x: targetPiece5.props.x, y: targetPiece5.props.y })
                        } else {
                            if (targetPiece5.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: targetPiece5.props.x, y: targetPiece5.props.y })
                            }
                        }
                    }

                    if (targetPiece6) {
                        if (!targetPiece6.props.piece) {
                            possibleMoves.push({ x: targetPiece6.props.x, y: targetPiece6.props.y })
                        } else {
                            if (targetPiece6.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: targetPiece6.props.x, y: targetPiece6.props.y })
                            }
                        }
                    }

                    if (targetPiece7) {
                        if (!targetPiece7.props.piece) {
                            possibleMoves.push({ x: targetPiece7.props.x, y: targetPiece7.props.y })
                        } else {
                            if (targetPiece7.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: targetPiece7.props.x, y: targetPiece7.props.y })
                            }
                        }
                    }

                    if (targetPiece8) {
                        if (!targetPiece8.props.piece) {
                            possibleMoves.push({ x: targetPiece8.props.x, y: targetPiece8.props.y })
                        } else {
                            if (targetPiece8.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: targetPiece8.props.x, y: targetPiece8.props.y })
                            }
                        }
                    }

                    break;
                case "king":
                    for (let i = -1; i < 2; i++) {
                        for (let j = -1; j < 2; j++) {
                            let targetPiece = squares.find(s => s.props.x == square.props.x + i && s.props.y == square.props.y + j)

                            if (targetPiece) {
                                if (!targetPiece.props.piece) {
                                    possibleMoves.push({ x: targetPiece.props.x, y: targetPiece.props.y })
                                } else {
                                    if (targetPiece.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                        possibleMoves.push({ x: targetPiece.props.x, y: targetPiece.props.y })
                                    }
                                }
                            }
                        }
                    }

                    //Castling logic
                    if (color == "white") {
                        if (this.state.canWhiteLongCastle) {
                            if (this.state.position[7].charAt(1) == 3 && this.state.position[7].charAt(0) == 'R') {
                                possibleMoves.push({ x: square.props.x, y: square.props.y - 2 })
                            }
                        }

                        if (this.state.canWhiteShortCastle) {
                            if (this.state.position[7].split("").reverse().join("").charAt(1) == 2 && this.state.position[7].split("").reverse().join("").charAt(0) == 'R') {
                                possibleMoves.push({ x: square.props.x, y: square.props.y + 2 })
                            }
                        }
                    } else {
                        if (this.state.canBlackLongCastle) {
                            if (this.state.position[0].charAt(1) == 3 && this.state.position[0].charAt(0) == 'r') {
                                possibleMoves.push({ x: square.props.x, y: square.props.y - 2 })
                            }
                        }

                        if (this.state.canBlackShortCastle) {
                            if (this.state.position[0].split("").reverse().join("").charAt(1) == 2 && this.state.position[0].split("").reverse().join("").charAt(0) == 'r') {
                                possibleMoves.push({ x: square.props.x, y: square.props.y + 2 })
                            }
                        }
                    }

                    break;
                case "queen":
                    for (let i = square.props.x - 1; i >= 0; i--) {
                        let targetSquare = squares.find(s => s.props.x === i && s.props.y === square.props.y);

                        if (!targetSquare.props.piece) {
                            possibleMoves.push({ x: i, y: square.props.y })
                        } else {
                            if (targetSquare.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: i, y: square.props.y })
                            }
                            break;
                        }
                    }
                    for (let i = square.props.y - 1; i >= 0; i--) {
                        let targetSquare = squares.find(s => s.props.x === square.props.x && s.props.y === i);

                        if (!targetSquare.props.piece) {
                            possibleMoves.push({ x: square.props.x, y: i })
                        } else {
                            if (targetSquare.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: square.props.x, y: i })
                            }
                            break;
                        }
                    }
                    for (let i = square.props.x + 1; i < DIM; i++) {
                        let targetSquare = squares.find(s => s.props.x === i && s.props.y === square.props.y);

                        if (!targetSquare.props.piece) {
                            possibleMoves.push({ x: i, y: square.props.y })
                        } else {
                            if (targetSquare.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: i, y: square.props.y })
                            }
                            break;
                        }
                    }
                    for (let i = square.props.y + 1; i < DIM; i++) {
                        let targetSquare = squares.find(s => s.props.x === square.props.x && s.props.y === i);

                        if (!targetSquare.props.piece) {
                            possibleMoves.push({ x: square.props.x, y: i })
                        } else {
                            if (targetSquare.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                possibleMoves.push({ x: square.props.x, y: i })
                            }
                            break;
                        }
                    }

                    for (let i = 1; i <= DIM; i++) {
                        if (square.props.x - i >= 0 && square.props.y - i >= 0) {
                            let targetPiece = squares.find(s => s.props.x == square.props.x - i && s.props.y == square.props.y - i)

                            if (!targetPiece.props.piece) {
                                possibleMoves.push({ x: square.props.x - i, y: square.props.y - i })
                            } else {
                                if (targetPiece.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                    possibleMoves.push({ x: square.props.x - i, y: square.props.y - i })
                                }
                                break;
                            }
                        }
                    }

                    for (let i = 1; i <= DIM; i++) {
                        if (square.props.x + i < DIM && square.props.y + i < DIM) {
                            let targetPiece = squares.find(s => s.props.x == square.props.x + i && s.props.y == square.props.y + i)

                            if (!targetPiece.props.piece) {
                                possibleMoves.push({ x: square.props.x + i, y: square.props.y + i })
                            } else {
                                if (targetPiece.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                    possibleMoves.push({ x: square.props.x + i, y: square.props.y + i })
                                }
                                break;
                            }
                        }
                    }

                    for (let i = 1; i <= DIM; i++) {
                        if (square.props.x - i >= 0 && square.props.y + i < DIM) {
                            let targetPiece = squares.find(s => s.props.x == square.props.x - i && s.props.y == square.props.y + i)

                            if (!targetPiece.props.piece) {
                                possibleMoves.push({ x: square.props.x - i, y: square.props.y + i })
                            } else {
                                if (targetPiece.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                    possibleMoves.push({ x: square.props.x - i, y: square.props.y + i })
                                }
                                break;
                            }
                        }
                    }

                    for (let i = 1; i <= DIM; i++) {
                        if (square.props.x + i < DIM && square.props.y - i >= 0) {
                            let targetPiece = squares.find(s => s.props.x == square.props.x + i && s.props.y == square.props.y - i)

                            if (!targetPiece.props.piece) {
                                possibleMoves.push({ x: square.props.x + i, y: square.props.y - i })
                            } else {
                                if (targetPiece.props.piece.split("-")[0] != square.props.piece.split("-")[0]) {
                                    possibleMoves.push({ x: square.props.x + i, y: square.props.y - i })
                                }
                                break;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        //check if black is in check
        if (square.props.piece.split("-")[0] == "black") {
            if (square.props.piece.split("-")[1] == "king") {
                for (let i = 0; i < possibleMoves.length; i++) {
                    let move = <Square x={possibleMoves[i].x} y={possibleMoves[i].y} piece={"black-king"} />
                    let pseudo = <Square x={blackKing.props.x} y={blackKing.props.y} piece={""} />
                    let isInCheck = this.isBlackInCheck(move, pseudo)

                    if (isInCheck) {
                        possibleMoves.splice(i, 1);
                        i--;
                    }
                }
            } else {
                for (let i = 0; i < possibleMoves.length; i++) {
                    let move = <Square x={possibleMoves[i].x} y={possibleMoves[i].y} piece={square.props.piece} />
                    let isInCheck = this.isBlackInCheck(blackKing, move)

                    if (isInCheck) {
                        possibleMoves.splice(i, 1);
                        i--;
                    }
                }
            }
        }

        //check if white is in check
        if (square.props.piece.split("-")[0] == "white") {
            if (square.props.piece.split("-")[1] == "king") {
                for (let i = 0; i < possibleMoves.length; i++) {
                    let move = <Square x={possibleMoves[i].x} y={possibleMoves[i].y} piece={"white-king"} />
                    let pseudo = <Square x={whiteKing.props.x} y={whiteKing.props.y} piece={""} />
                    let isInCheck = this.isWhiteInCheck(move, pseudo)

                    if (isInCheck) {
                        possibleMoves.splice(i, 1);
                        i--;
                    }
                }
            } else {
                for (let i = 0; i < possibleMoves.length; i++) {
                    let move = <Square x={possibleMoves[i].x} y={possibleMoves[i].y} piece={square.props.piece} />
                    let isInCheck = this.isWhiteInCheck(whiteKing, move)

                    if (isInCheck) {
                        possibleMoves.splice(i, 1);
                        i--;
                    }
                }
            }
        }

        //removes the right to castle if any of the castle squares is under attack
        if (square.props.piece.split("-")[1] == "king") {
            let whiteCastle1 = possibleMoves.find(m => m.x == 7 && m.y == 6)
            let whiteCastle2 = possibleMoves.find(m => m.x == 7 && m.y == 2)
            let blackCastle1 = possibleMoves.find(m => m.x == 0 && m.y == 6)
            let blackCastle2 = possibleMoves.find(m => m.x == 0 && m.y == 2)

            if (whiteCastle1) {
                let pieceAcross = possibleMoves.find(m => m.x == 7 && m.y == 5)
                if (!pieceAcross) {
                    possibleMoves.splice(possibleMoves.indexOf(pieceAcross), 1)
                }
            }

            if (whiteCastle2) {
                let pieceAcross = possibleMoves.find(m => m.x == 7 && m.y == 3)
                if (!pieceAcross) {
                    possibleMoves.splice(possibleMoves.indexOf(pieceAcross), 1)
                }
            }

            if (blackCastle1) {
                let pieceAcross = possibleMoves.find(m => m.x == 0 && m.y == 5)
                if (!pieceAcross) {
                    possibleMoves.splice(possibleMoves.indexOf(pieceAcross), 1)
                }
            }

            if (blackCastle2) {
                let pieceAcross = possibleMoves.find(m => m.x == 0 && m.y == 3)
                if (!pieceAcross) {
                    possibleMoves.splice(possibleMoves.indexOf(pieceAcross), 1)
                }
            }
        }

        //prevents black to castle if in check
        if (this.isBlackInCheck(blackKing)) {
            let castleMove = possibleMoves.find(m => m.x == 0 && m.y == 2)
            let castleMove2 = possibleMoves.find(m => m.x == 0 && m.y == 6)

            if (castleMove) {
                possibleMoves.splice(possibleMoves.indexOf(castleMove), 1)
            }

            if (castleMove2) {
                possibleMoves.splice(possibleMoves.indexOf(castleMove2), 1)
            }
        }

        //prevents white to castle if in check
        if (this.isWhiteInCheck(whiteKing)) {
            let castleMove = possibleMoves.find(m => m.x == 7 && m.y == 2)
            let castleMove2 = possibleMoves.find(m => m.x == 7 && m.y == 6)

            if (castleMove) {
                possibleMoves.splice(possibleMoves.indexOf(castleMove), 1)
            }

            if (castleMove2) {
                possibleMoves.splice(possibleMoves.indexOf(castleMove2), 1)
            }
        }

        //console.log("Possible Moves:", possibleMoves);
        this.updatePossibleMoves(possibleMoves);
    }

    renderSquares() {
        let squareColorIsWhite = true;
        const squares = [];
        for (let i = 0; i < DIM; i++) {
            let row = ConvertFenToString(this.state.position[i]);
            for (let j = 0; j < DIM; j++) {
                const piece = row.charAt(j);
                let color = squareColorIsWhite ? "" : "dark";
                squares.push(
                    <Square
                        getPossibleMoves={this.getPossibleMoves.bind(this)}
                        key={`${i}-${j}`}
                        x={i}
                        y={j}
                        piece={ConvertFENPieceToPiece(piece.trim())}
                        color={color}
                        selectedSquareX={this.state.selectedSquareX}
                        setSelectedSquareX={this.updateSelectedSquareX}
                        selectedSquareY={this.state.selectedSquareY}
                        setSelectedSquareY={this.updateSelectedSquareY}
                        possibleMoves={this.state.possibleMoves}
                        updatePossibleMoves={this.updatePossibleMoves}
                        movePiece={this.movePiece}
                    />
                );
                squareColorIsWhite = !squareColorIsWhite;
            }
            squareColorIsWhite = !squareColorIsWhite;
        }
        return squares;
    }

    render() {
        //const squares = this.renderSquares();
        return (
            <div className="chessGrid">
                {this.renderSquares()}
            </div>
        );
    }
}