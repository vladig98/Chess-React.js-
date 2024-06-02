import React from 'react';
import * as HelperMethods from '../HelperMethods'
import Square from '../Square'

let whitePieces = []
let blackPieces = []
const pieces = {
    pawn: "pawn",
    rook: "rook",
    king: "king",
    queen: "queen",
    knight: "knight",
    bishop: "bishop"
}
const colors = {
    white: "white",
    black: "black"
}
const emptyPropsPiece = { props: {} }
const nullPropsPiece = { props: null }
const emptyPiece = {}
const invalidPiece = <Square x={1} y={1} piece={'white_king'} />
const nonExistentPiece = <Square x={1} y={1} piece={'white-horse'} />
const emptyPiecePiece = <Square x={1} y={1} piece={''} />
const nullPiecePiece = <Square x={1} y={1} piece={null} />
const fakeSquare = <Square />
const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
const boardFromFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
const turnFromFen = 'w'
const castlingRightsFromFen = 'KQkq'
const enPassantFromFen = '-'
const halfMovesFromFen = 0
const fullMovesFromFen = 1

beforeAll(() => {
    const pieceNames = Object.keys(pieces);

    // Initialize the global variable with default props before each test
    for (let i = 0; i < 6; i++) {
        const piece = pieceNames[i];
        whitePieces.push({ [piece]: <Square x={7} y={i} piece={`${colors.white}-${pieces[piece]}`} /> })
        blackPieces.push({ [piece]: <Square x={0} y={i} piece={`${colors.black}-${pieces[piece]}`} /> })
    }
});

describe('Testing the getPiece() function', () => {
    test('check if we can get the piece - king', () => {
        const pieceObj = whitePieces.find(p => p.king);
        const piece = pieceObj.king;

        expect(HelperMethods.getPiece(piece)).toBe('king');
    });

    test('check if we can get the piece - rook', () => {
        const pieceObj = whitePieces.find(p => p.rook);
        const piece = pieceObj.rook;

        expect(HelperMethods.getPiece(piece)).toBe('rook');
    });

    test('check if we can get the piece - queen', () => {
        const pieceObj = whitePieces.find(p => p.queen);
        const piece = pieceObj.queen;

        expect(HelperMethods.getPiece(piece)).toBe('queen');
    });

    test('check if we can get the piece - pawn', () => {
        const pieceObj = whitePieces.find(p => p.pawn);
        const piece = pieceObj.pawn;

        expect(HelperMethods.getPiece(piece)).toBe('pawn');
    });

    test('check if we can get the piece - knight', () => {
        const pieceObj = whitePieces.find(p => p.knight);
        const piece = pieceObj.knight;

        expect(HelperMethods.getPiece(piece)).toBe('knight');
    });

    test('check if we can get the piece - bishop', () => {
        const pieceObj = whitePieces.find(p => p.bishop);
        const piece = pieceObj.bishop;

        expect(HelperMethods.getPiece(piece)).toBe('bishop');
    });

    test('check if we can get the piece - square props empty', () => {
        expect(HelperMethods.getPiece(emptyPropsPiece)).toBe(null);
    });

    test('check if we can get the piece - square props null', () => {
        expect(HelperMethods.getPiece(nullPropsPiece)).toBe(null);
    });

    test('check if we can get the piece - piece empty object', () => {
        expect(HelperMethods.getPiece(emptyPiece)).toBe(null);
    });

    test('check if we can get the piece - invalid piece', () => {
        expect(HelperMethods.getPiece(invalidPiece)).toBe(null);
    });

    test('check if we can get the piece - non-existent piece', () => {
        expect(HelperMethods.getPiece(nonExistentPiece)).toBe('horse');
    });

    test('check if we can get the piece - piece empty', () => {
        expect(HelperMethods.getPiece(emptyPiecePiece)).toBe(null);
    });

    test('check if we can get the piece - square props piece null', () => {
        expect(HelperMethods.getPiece(nullPiecePiece)).toBe(null);
    });

    test('check if we can get the piece - no props', () => {
        expect(HelperMethods.getPiece(fakeSquare)).toBe(null);
    });
});

describe('Testing the doesTheSquareHasThePiece() function', () => {
    test('check if the square has the piece - pawn', () => {
        const pieceObj = whitePieces.find(p => p.pawn);
        const piece = pieceObj.pawn;

        expect(HelperMethods.doesTheSquareHasThePiece(piece, pieces.pawn)).toBe(true);
    });

    test('check if the square has the piece - rook', () => {
        const pieceObj = whitePieces.find(p => p.rook);
        const piece = pieceObj.rook;

        expect(HelperMethods.doesTheSquareHasThePiece(piece, pieces.rook)).toBe(true);
    });

    test('check if the square has the piece - bishop', () => {
        const pieceObj = whitePieces.find(p => p.bishop);
        const piece = pieceObj.bishop;

        expect(HelperMethods.doesTheSquareHasThePiece(piece, pieces.bishop)).toBe(true);
    });

    test('check if the square has the piece - knight', () => {
        const pieceObj = whitePieces.find(p => p.knight);
        const piece = pieceObj.knight;

        expect(HelperMethods.doesTheSquareHasThePiece(piece, pieces.knight)).toBe(true);
    });

    test('check if the square has the piece - king', () => {
        const pieceObj = whitePieces.find(p => p.king);
        const piece = pieceObj.king;

        expect(HelperMethods.doesTheSquareHasThePiece(piece, pieces.king)).toBe(true);
    });

    test('check if the square has the piece - queen', () => {
        const pieceObj = whitePieces.find(p => p.queen);
        const piece = pieceObj.queen;

        expect(HelperMethods.doesTheSquareHasThePiece(piece, pieces.queen)).toBe(true);
    });

    test('check if the square has the piece - piece undefined', () => {
        const pieceObj = whitePieces.find(p => p.queen);
        const piece = pieceObj.queen;

        expect(HelperMethods.doesTheSquareHasThePiece(piece, null)).toBe(false);
    });

    test('check if the square has the piece - square null', () => {
        expect(HelperMethods.doesTheSquareHasThePiece(null, pieces.queen)).toBe(false);
    });

    test('check if the square has the piece - square and piece null', () => {
        expect(HelperMethods.doesTheSquareHasThePiece(null, null)).toBe(false);
    });

    test('check if the square has the piece - square props empty', () => {
        expect(HelperMethods.doesTheSquareHasThePiece(emptyPropsPiece, pieces.queen)).toBe(false);
    });

    test('check if the square has the piece - square props null', () => {
        expect(HelperMethods.doesTheSquareHasThePiece(nullPropsPiece, pieces.queen)).toBe(false);
    });

    test('check if the square has the piece - piece empty object', () => {
        expect(HelperMethods.doesTheSquareHasThePiece(emptyPiece, pieces.queen)).toBe(false);
    });

    test('check if the square has the piece - invalid piece', () => {
        expect(HelperMethods.doesTheSquareHasThePiece(invalidPiece, pieces.queen)).toBe(false);
    });

    test('check if the square has the piece - non-existent piece', () => {
        expect(HelperMethods.doesTheSquareHasThePiece(nonExistentPiece, pieces.queen)).toBe(false);
    });

    test('check if the square has the piece - piece empty', () => {
        expect(HelperMethods.doesTheSquareHasThePiece(emptyPiecePiece, pieces.queen)).toBe(false);
    });

    test('check if the square has the piece - square props piece null', () => {
        expect(HelperMethods.doesTheSquareHasThePiece(nullPiecePiece, pieces.queen)).toBe(false);
    });

    test('check if the square has the piece - no props', () => {
        expect(HelperMethods.doesTheSquareHasThePiece(fakeSquare, pieces.queen)).toBe(false);
    });
});

describe('Testing the isSquareValid() function', () => {
    test('check if the square is valid - emptyPropsPiece', () => {
        expect(HelperMethods.isSquareValid(emptyPropsPiece)).toBe(false);
    });

    test('check if the square is valid - nullPropsPiece', () => {
        expect(HelperMethods.isSquareValid(nullPropsPiece)).toBe(false);
    });

    test('check if the square is valid - emptyPiece', () => {
        expect(HelperMethods.isSquareValid(emptyPiece)).toBe(false);
    });

    test('check if the square is valid - invalidPiece', () => {
        expect(HelperMethods.isSquareValid(invalidPiece)).toBe(false);
    });

    test('check if the square is valid - nonExistentPiece', () => {
        expect(HelperMethods.isSquareValid(nonExistentPiece)).toBe(true);
    });

    test('check if the square is valid - nullPiecePiece', () => {
        expect(HelperMethods.isSquareValid(nullPiecePiece)).toBe(false);
    });

    test('check if the square is valid - emptyPiecePiece', () => {
        expect(HelperMethods.isSquareValid(emptyPiecePiece)).toBe(false);
    });

    test('check if the square is valid - fakeSquare', () => {
        expect(HelperMethods.isSquareValid(fakeSquare)).toBe(false);
    });

    test('check if the square is valid - whitePieces', () => {
        for (let i = 0; i < whitePieces.length; i++) {
            const pieceObj = whitePieces[i];
            const pieceName = Object.keys(pieceObj)[0]; // Get the name of the piece (e.g., 'king')
            const piece = pieceObj[pieceName]; // Get the piece component
            expect(HelperMethods.isSquareValid(piece)).toBe(true);
        }
    });

    test('check if the square is valid - blackPieces', () => {
        for (let i = 0; i < blackPieces.length; i++) {
            const pieceObj = blackPieces[i];
            const pieceName = Object.keys(pieceObj)[0]; // Get the name of the piece (e.g., 'king')
            const piece = pieceObj[pieceName]; // Get the piece component
            expect(HelperMethods.isSquareValid(piece)).toBe(true);
        }
    });
});

describe('Testing the isKing() function', () => {
    test('check if the piece is a king - king', () => {
        const pieceObj = whitePieces.find(p => p.king);
        const piece = pieceObj.king;

        expect(HelperMethods.isKing(piece)).toBe(true);
    });

    test('check if the piece is a king - pawn', () => {
        const pieceObj = whitePieces.find(p => p.pawn);
        const piece = pieceObj.pawn;

        expect(HelperMethods.isKing(piece)).toBe(false);
    });

    test('check if the piece is a king - rook', () => {
        const pieceObj = whitePieces.find(p => p.rook);
        const piece = pieceObj.rook;

        expect(HelperMethods.isKing(piece)).toBe(false);
    });

    test('check if the piece is a king - bishop', () => {
        const pieceObj = whitePieces.find(p => p.bishop);
        const piece = pieceObj.bishop;

        expect(HelperMethods.isKing(piece)).toBe(false);
    });

    test('check if the piece is a king - queen', () => {
        const pieceObj = whitePieces.find(p => p.queen);
        const piece = pieceObj.queen;

        expect(HelperMethods.isKing(piece)).toBe(false);
    });

    test('check if the piece is a king - knight', () => {
        const pieceObj = whitePieces.find(p => p.knight);
        const piece = pieceObj.knight;

        expect(HelperMethods.isKing(piece)).toBe(false);
    });

    test('check if the piece is a king - emptyPropsPiece', () => {
        expect(HelperMethods.isKing(emptyPropsPiece)).toBe(false);
    });

    test('check if the piece is a king - nullPropsPiece', () => {
        expect(HelperMethods.isKing(nullPropsPiece)).toBe(false);
    });

    test('check if the piece is a king - emptyPiece', () => {
        expect(HelperMethods.isKing(emptyPiece)).toBe(false);
    });

    test('check if the piece is a king - invalidPiece', () => {
        expect(HelperMethods.isKing(invalidPiece)).toBe(false);
    });

    test('check if the piece is a king - nonExistentPiece', () => {
        expect(HelperMethods.isKing(nonExistentPiece)).toBe(false);
    });

    test('check if the piece is a king - emptyPiecePiece', () => {
        expect(HelperMethods.isKing(emptyPiecePiece)).toBe(false);
    });

    test('check if the piece is a king - nullPiecePiece', () => {
        expect(HelperMethods.isKing(nullPiecePiece)).toBe(false);
    });

    test('check if the piece is a king - fakeSquare', () => {
        expect(HelperMethods.isKing(fakeSquare)).toBe(false);
    });
});

describe('Testing the isQueen() function', () => {
    test('check if the piece is a queen - king', () => {
        const pieceObj = whitePieces.find(p => p.king);
        const piece = pieceObj.king;

        expect(HelperMethods.isQueen(piece)).toBe(false);
    });

    test('check if the piece is a queen - pawn', () => {
        const pieceObj = whitePieces.find(p => p.pawn);
        const piece = pieceObj.pawn;

        expect(HelperMethods.isQueen(piece)).toBe(false);
    });

    test('check if the piece is a queen - rook', () => {
        const pieceObj = whitePieces.find(p => p.rook);
        const piece = pieceObj.rook;

        expect(HelperMethods.isQueen(piece)).toBe(false);
    });

    test('check if the piece is a queen - bishop', () => {
        const pieceObj = whitePieces.find(p => p.bishop);
        const piece = pieceObj.bishop;

        expect(HelperMethods.isQueen(piece)).toBe(false);
    });

    test('check if the piece is a queen - queen', () => {
        const pieceObj = whitePieces.find(p => p.queen);
        const piece = pieceObj.queen;

        expect(HelperMethods.isQueen(piece)).toBe(true);
    });

    test('check if the piece is a queen - knight', () => {
        const pieceObj = whitePieces.find(p => p.knight);
        const piece = pieceObj.knight;

        expect(HelperMethods.isQueen(piece)).toBe(false);
    });

    test('check if the piece is a queen - emptyPropsPiece', () => {
        expect(HelperMethods.isQueen(emptyPropsPiece)).toBe(false);
    });

    test('check if the piece is a queen - nullPropsPiece', () => {
        expect(HelperMethods.isQueen(nullPropsPiece)).toBe(false);
    });

    test('check if the piece is a queen - emptyPiece', () => {
        expect(HelperMethods.isQueen(emptyPiece)).toBe(false);
    });

    test('check if the piece is a queen - invalidPiece', () => {
        expect(HelperMethods.isQueen(invalidPiece)).toBe(false);
    });

    test('check if the piece is a queen - nonExistentPiece', () => {
        expect(HelperMethods.isQueen(nonExistentPiece)).toBe(false);
    });

    test('check if the piece is a queen - emptyPiecePiece', () => {
        expect(HelperMethods.isQueen(emptyPiecePiece)).toBe(false);
    });

    test('check if the piece is a queen - nullPiecePiece', () => {
        expect(HelperMethods.isQueen(nullPiecePiece)).toBe(false);
    });

    test('check if the piece is a queen - fakeSquare', () => {
        expect(HelperMethods.isQueen(fakeSquare)).toBe(false);
    });
});

describe('Testing the isRook() function', () => {
    test('check if the piece is a rook - king', () => {
        const pieceObj = whitePieces.find(p => p.king);
        const piece = pieceObj.king;

        expect(HelperMethods.isRook(piece)).toBe(false);
    });

    test('check if the piece is a rook - pawn', () => {
        const pieceObj = whitePieces.find(p => p.pawn);
        const piece = pieceObj.pawn;

        expect(HelperMethods.isRook(piece)).toBe(false);
    });

    test('check if the piece is a rook - rook', () => {
        const pieceObj = whitePieces.find(p => p.rook);
        const piece = pieceObj.rook;

        expect(HelperMethods.isRook(piece)).toBe(true);
    });

    test('check if the piece is a rook - bishop', () => {
        const pieceObj = whitePieces.find(p => p.bishop);
        const piece = pieceObj.bishop;

        expect(HelperMethods.isRook(piece)).toBe(false);
    });

    test('check if the piece is a rook - queen', () => {
        const pieceObj = whitePieces.find(p => p.queen);
        const piece = pieceObj.queen;

        expect(HelperMethods.isRook(piece)).toBe(false);
    });

    test('check if the piece is a rook - knight', () => {
        const pieceObj = whitePieces.find(p => p.knight);
        const piece = pieceObj.knight;

        expect(HelperMethods.isRook(piece)).toBe(false);
    });

    test('check if the piece is a rook - emptyPropsPiece', () => {
        expect(HelperMethods.isRook(emptyPropsPiece)).toBe(false);
    });

    test('check if the piece is a rook - nullPropsPiece', () => {
        expect(HelperMethods.isRook(nullPropsPiece)).toBe(false);
    });

    test('check if the piece is a rook - emptyPiece', () => {
        expect(HelperMethods.isRook(emptyPiece)).toBe(false);
    });

    test('check if the piece is a rook - invalidPiece', () => {
        expect(HelperMethods.isRook(invalidPiece)).toBe(false);
    });

    test('check if the piece is a rook - nonExistentPiece', () => {
        expect(HelperMethods.isRook(nonExistentPiece)).toBe(false);
    });

    test('check if the piece is a rook - emptyPiecePiece', () => {
        expect(HelperMethods.isRook(emptyPiecePiece)).toBe(false);
    });

    test('check if the piece is a rook - nullPiecePiece', () => {
        expect(HelperMethods.isRook(nullPiecePiece)).toBe(false);
    });

    test('check if the piece is a rook - fakeSquare', () => {
        expect(HelperMethods.isRook(fakeSquare)).toBe(false);
    });
});

describe('Testing the isKnight() function', () => {
    test('check if the piece is a knight - king', () => {
        const pieceObj = whitePieces.find(p => p.king);
        const piece = pieceObj.king;

        expect(HelperMethods.isKnight(piece)).toBe(false);
    });

    test('check if the piece is a knight - pawn', () => {
        const pieceObj = whitePieces.find(p => p.pawn);
        const piece = pieceObj.pawn;

        expect(HelperMethods.isKnight(piece)).toBe(false);
    });

    test('check if the piece is a knight - rook', () => {
        const pieceObj = whitePieces.find(p => p.rook);
        const piece = pieceObj.rook;

        expect(HelperMethods.isKnight(piece)).toBe(false);
    });

    test('check if the piece is a knight - bishop', () => {
        const pieceObj = whitePieces.find(p => p.bishop);
        const piece = pieceObj.bishop;

        expect(HelperMethods.isKnight(piece)).toBe(false);
    });

    test('check if the piece is a knight - queen', () => {
        const pieceObj = whitePieces.find(p => p.queen);
        const piece = pieceObj.queen;

        expect(HelperMethods.isKnight(piece)).toBe(false);
    });

    test('check if the piece is a knight - knight', () => {
        const pieceObj = whitePieces.find(p => p.knight);
        const piece = pieceObj.knight;

        expect(HelperMethods.isKnight(piece)).toBe(true);
    });

    test('check if the piece is a knight - emptyPropsPiece', () => {
        expect(HelperMethods.isKnight(emptyPropsPiece)).toBe(false);
    });

    test('check if the piece is a knight - nullPropsPiece', () => {
        expect(HelperMethods.isKnight(nullPropsPiece)).toBe(false);
    });

    test('check if the piece is a knight - emptyPiece', () => {
        expect(HelperMethods.isKnight(emptyPiece)).toBe(false);
    });

    test('check if the piece is a knight - invalidPiece', () => {
        expect(HelperMethods.isKnight(invalidPiece)).toBe(false);
    });

    test('check if the piece is a knight - nonExistentPiece', () => {
        expect(HelperMethods.isKnight(nonExistentPiece)).toBe(false);
    });

    test('check if the piece is a knight - emptyPiecePiece', () => {
        expect(HelperMethods.isKnight(emptyPiecePiece)).toBe(false);
    });

    test('check if the piece is a knight - nullPiecePiece', () => {
        expect(HelperMethods.isKnight(nullPiecePiece)).toBe(false);
    });

    test('check if the piece is a knight - fakeSquare', () => {
        expect(HelperMethods.isKnight(fakeSquare)).toBe(false);
    });
});

describe('Testing the isBishop() function', () => {
    test('check if the piece is a bishop - king', () => {
        const pieceObj = whitePieces.find(p => p.king);
        const piece = pieceObj.king;

        expect(HelperMethods.isBishop(piece)).toBe(false);
    });

    test('check if the piece is a bishop - pawn', () => {
        const pieceObj = whitePieces.find(p => p.pawn);
        const piece = pieceObj.pawn;

        expect(HelperMethods.isBishop(piece)).toBe(false);
    });

    test('check if the piece is a bishop - rook', () => {
        const pieceObj = whitePieces.find(p => p.rook);
        const piece = pieceObj.rook;

        expect(HelperMethods.isBishop(piece)).toBe(false);
    });

    test('check if the piece is a bishop - bishop', () => {
        const pieceObj = whitePieces.find(p => p.bishop);
        const piece = pieceObj.bishop;

        expect(HelperMethods.isBishop(piece)).toBe(true);
    });

    test('check if the piece is a bishop - queen', () => {
        const pieceObj = whitePieces.find(p => p.queen);
        const piece = pieceObj.queen;

        expect(HelperMethods.isBishop(piece)).toBe(false);
    });

    test('check if the piece is a bishop - knight', () => {
        const pieceObj = whitePieces.find(p => p.knight);
        const piece = pieceObj.knight;

        expect(HelperMethods.isBishop(piece)).toBe(false);
    });

    test('check if the piece is a bishop - emptyPropsPiece', () => {
        expect(HelperMethods.isBishop(emptyPropsPiece)).toBe(false);
    });

    test('check if the piece is a bishop - nullPropsPiece', () => {
        expect(HelperMethods.isBishop(nullPropsPiece)).toBe(false);
    });

    test('check if the piece is a bishop - emptyPiece', () => {
        expect(HelperMethods.isBishop(emptyPiece)).toBe(false);
    });

    test('check if the piece is a bishop - invalidPiece', () => {
        expect(HelperMethods.isBishop(invalidPiece)).toBe(false);
    });

    test('check if the piece is a bishop - nonExistentPiece', () => {
        expect(HelperMethods.isBishop(nonExistentPiece)).toBe(false);
    });

    test('check if the piece is a bishop - emptyPiecePiece', () => {
        expect(HelperMethods.isBishop(emptyPiecePiece)).toBe(false);
    });

    test('check if the piece is a bishop - nullPiecePiece', () => {
        expect(HelperMethods.isBishop(nullPiecePiece)).toBe(false);
    });

    test('check if the piece is a bishop - fakeSquare', () => {
        expect(HelperMethods.isBishop(fakeSquare)).toBe(false);
    });
});

describe('Testing the isPawn() function', () => {
    test('check if the piece is a pawn - king', () => {
        const pieceObj = whitePieces.find(p => p.king);
        const piece = pieceObj.king;

        expect(HelperMethods.isPawn(piece)).toBe(false);
    });

    test('check if the piece is a pawn - pawn', () => {
        const pieceObj = whitePieces.find(p => p.pawn);
        const piece = pieceObj.pawn;

        expect(HelperMethods.isPawn(piece)).toBe(true);
    });

    test('check if the piece is a pawn - rook', () => {
        const pieceObj = whitePieces.find(p => p.rook);
        const piece = pieceObj.rook;

        expect(HelperMethods.isPawn(piece)).toBe(false);
    });

    test('check if the piece is a pawn - bishop', () => {
        const pieceObj = whitePieces.find(p => p.bishop);
        const piece = pieceObj.bishop;

        expect(HelperMethods.isPawn(piece)).toBe(false);
    });

    test('check if the piece is a pawn - queen', () => {
        const pieceObj = whitePieces.find(p => p.queen);
        const piece = pieceObj.queen;

        expect(HelperMethods.isPawn(piece)).toBe(false);
    });

    test('check if the piece is a pawn - knight', () => {
        const pieceObj = whitePieces.find(p => p.knight);
        const piece = pieceObj.knight;

        expect(HelperMethods.isPawn(piece)).toBe(false);
    });

    test('check if the piece is a pawn - emptyPropsPiece', () => {
        expect(HelperMethods.isPawn(emptyPropsPiece)).toBe(false);
    });

    test('check if the piece is a pawn - nullPropsPiece', () => {
        expect(HelperMethods.isPawn(nullPropsPiece)).toBe(false);
    });

    test('check if the piece is a pawn - emptyPiece', () => {
        expect(HelperMethods.isPawn(emptyPiece)).toBe(false);
    });

    test('check if the piece is a pawn - invalidPiece', () => {
        expect(HelperMethods.isPawn(invalidPiece)).toBe(false);
    });

    test('check if the piece is a pawn - nonExistentPiece', () => {
        expect(HelperMethods.isPawn(nonExistentPiece)).toBe(false);
    });

    test('check if the piece is a pawn - emptyPiecePiece', () => {
        expect(HelperMethods.isPawn(emptyPiecePiece)).toBe(false);
    });

    test('check if the piece is a pawn - nullPiecePiece', () => {
        expect(HelperMethods.isPawn(nullPiecePiece)).toBe(false);
    });

    test('check if the piece is a pawn - fakeSquare', () => {
        expect(HelperMethods.isPawn(fakeSquare)).toBe(false);
    });
});

describe('Testing the isUpperCase() function', () => {
    test('check if the letter is uppercase - uppercase', () => {
        expect(HelperMethods.IsUpperCase('U')).toBe(true);
    });

    test('check if the letter is uppercase - digit', () => {
        expect(HelperMethods.IsUpperCase('3')).toBe(false);
    });

    test('check if the letter is uppercase - lowercase', () => {
        expect(HelperMethods.IsUpperCase('a')).toBe(false);
    });

    test('check if the letter is uppercase - undefined', () => {
        expect(HelperMethods.IsUpperCase()).toBe(false);
    });

    test('check if the letter is uppercase - empty', () => {
        expect(HelperMethods.IsUpperCase('')).toBe(false);
    });

    test('check if the letter is uppercase - special character', () => {
        expect(HelperMethods.IsUpperCase('*')).toBe(false);
    });

    test('check if the letter is uppercase - string first letter lowercase', () => {
        expect(HelperMethods.IsUpperCase('testing')).toBe(false);
    });

    test('check if the letter is uppercase - string first letter uppercase', () => {
        expect(HelperMethods.IsUpperCase('Testing')).toBe(true);
    });

    test('check if the letter is uppercase - string first letter digit', () => {
        expect(HelperMethods.IsUpperCase('33testing')).toBe(false);
    });
});

describe('Testing the isLowerCase() function', () => {
    test('check if the letter is lowercase - uppercase', () => {
        expect(HelperMethods.IsLowerCase('U')).toBe(false);
    });

    test('check if the letter is lowercase - digit', () => {
        expect(HelperMethods.IsLowerCase('3')).toBe(false);
    });

    test('check if the letter is lowercase - lowercase', () => {
        expect(HelperMethods.IsLowerCase('a')).toBe(true);
    });

    test('check if the letter is lowercase - undefined', () => {
        expect(HelperMethods.IsLowerCase()).toBe(false);
    });

    test('check if the letter is lowercase - empty', () => {
        expect(HelperMethods.IsLowerCase('')).toBe(false);
    });

    test('check if the letter is lowercase - special character', () => {
        expect(HelperMethods.IsLowerCase('*')).toBe(false);
    });

    test('check if the letter is lowercase - string first letter lowercase', () => {
        expect(HelperMethods.IsLowerCase('testing')).toBe(true);
    });

    test('check if the letter is lowercase - string first letter uppercase', () => {
        expect(HelperMethods.IsLowerCase('Testing')).toBe(false);
    });

    test('check if the letter is lowercase - string first letter digit', () => {
        expect(HelperMethods.IsLowerCase('33testing')).toBe(false);
    });
});

describe('Testing the isDigit() function', () => {
    test('check if the letter is digit - uppercase', () => {
        expect(HelperMethods.IsDigit('U')).toBe(false);
    });

    test('check if the letter is digit - number', () => {
        expect(HelperMethods.IsDigit(3)).toBe(true);
    });

    test('check if the letter is digit - double digits number', () => {
        expect(HelperMethods.IsDigit(33)).toBe(true);
    });

    test('check if the letter is digit - negative number', () => {
        expect(HelperMethods.IsDigit(-33)).toBe(false);
    });

    test('check if the letter is digit - digit', () => {
        expect(HelperMethods.IsDigit('3')).toBe(true);
    });

    test('check if the letter is digit - lowercase', () => {
        expect(HelperMethods.IsDigit('a')).toBe(false);
    });

    test('check if the letter is digit - undefined', () => {
        expect(HelperMethods.IsDigit()).toBe(false);
    });

    test('check if the letter is digit - empty', () => {
        expect(HelperMethods.IsDigit('')).toBe(false);
    });

    test('check if the letter is digit - special character', () => {
        expect(HelperMethods.IsDigit('*')).toBe(false);
    });

    test('check if the letter is digit - string first letter lowercase', () => {
        expect(HelperMethods.IsDigit('testing')).toBe(false);
    });

    test('check if the letter is digit - string first letter uppercase', () => {
        expect(HelperMethods.IsDigit('Testing')).toBe(false);
    });

    test('check if the letter is digit - string first letter digit', () => {
        expect(HelperMethods.IsDigit('33testing')).toBe(true);
    });
});

describe('Testing the getFirstCharacter() function', () => {
    test('check if we can get the first character code - valid string', () => {
        expect(HelperMethods.getFirstCharacter('Aloha')).toBe(65);
    });

    test('check if we can get the first character code - invalid string', () => {
        expect(HelperMethods.getFirstCharacter('')).toBe(-1);
    });

    test('check if we can get the first character code - null', () => {
        expect(HelperMethods.getFirstCharacter()).toBe(-1);
    });

    test('check if we can get the first character code - char', () => {
        expect(HelperMethods.getFirstCharacter('A')).toBe(65);
    });
});

describe('Testing the parseFen() function', () => {
    test('check if we can parse a fen - valid FEN', () => {
        const { fenBoard, fenTurn, fenCastling, fenEnPassant, fenHalfMoves, fenFullMoves } = HelperMethods.ParseFEN(fen)

        expect(fenBoard).toBe(boardFromFen);
        expect(fenTurn).toBe(turnFromFen);
        expect(fenCastling).toBe(castlingRightsFromFen);
        expect(fenEnPassant).toBe(enPassantFromFen);
        expect(fenHalfMoves).toBe(halfMovesFromFen);
        expect(fenFullMoves).toBe(fullMovesFromFen);
    });

    test('check if we can parse a fen - null', () => {
        expect(() => HelperMethods.fenParser()).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - empty', () => {
        expect(() => HelperMethods.fenParser('')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid FEN less elements', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid FEN more elements', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 0')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid FEN more space', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR     w    KQkq -    0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid board less elements on a row', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/ppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid board less rows', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid board empty row', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr//8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid board more elements on a row', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/9/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid board more rows', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR/8 w KQkq - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid board empty', () => {
        expect(() => HelperMethods.fenParser('w KQkq - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid turn empty', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR KQkq - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid turn other', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR x KQkq - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid turn more than 1 character', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR wW KQkq - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid castling empty', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid castling three for white', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQKk - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid castling three for black', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w kqk - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid castling four the same', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KKKK - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid castling four the same for color', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQKQ - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid castling more options', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkqx - 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid enPassant empty', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid enPassant invalid', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq a3 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid enPassant invalid two letters', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq AA 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid enPassant invalid two digits', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq 33 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid enPassant invalid more chars', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq A33 0 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid halfMoves empty', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq A3 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid halfMoves letter', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq A3 a 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid halfMoves string', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq A3 aaaaa 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid halfMoves negative', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq A3 -3 1')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid fullMoves empty', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq A3 0')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid fullMoves letter', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq A3 0 a')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid fullMoves string', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq A3 0 aaaa')).toThrow('Invalid FEN');
    });

    test('check if we can parse a fen - invalid fullMoves negative', () => {
        expect(() => HelperMethods.fenParser('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq A3 0 -3')).toThrow('Invalid FEN');
    });
});

describe('Testing the isBoardValid() function', () => {
    test('check if the board is valid - valid board', () => {
        expect(HelperMethods.isBoardValid('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR')).toBe(true);
    });

    test('check if the board is valid - invalid board empty', () => {
        expect(HelperMethods.isBoardValid('')).toBe(false);
    });

    test('check if the board is valid - invalid board null', () => {
        expect(HelperMethods.isBoardValid()).toBe(false);
    });

    test('check if the board is valid - invalid board less rows', () => {
        expect(HelperMethods.isBoardValid('rnbqkbnr/pppppppp/8/8/8/PPPPPPPP/RNBQKBNR')).toBe(false);
    });

    test('check if the board is valid - invalid board more rows', () => {
        expect(HelperMethods.isBoardValid('rnbqkbnr/pppppppp/8/8/8/8/8/PPPPPPPP/RNBQKBNR')).toBe(false);
    });

    test('check if the board is valid - invalid board more columns', () => {
        expect(HelperMethods.isBoardValid('rnbqkbnr/pppppppp/8/9/8/8/PPPPPPPP/RNBQKBNR')).toBe(false);
    });

    test('check if the board is valid - invalid board less columns', () => {
        expect(HelperMethods.isBoardValid('rnbqkbnr/pppppppp/8/7/8/8/PPPPPPPP/RNBQKBNR')).toBe(false);
    });

    test('check if the board is valid - invalid board empty row', () => {
        expect(HelperMethods.isBoardValid('rnbqkbnr/pppppppp/8//8/8/PPPPPPPP/RNBQKBNR')).toBe(false);
    });

    test('check if the board is valid - invalid board empty column', () => {
        expect(HelperMethods.isBoardValid('rnbqkbnr/pppppp p/8/8/8/8/PPPPPPPP/RNBQKBNR')).toBe(false);
    });

    test('check if the board is valid - invalid board kings next to each other', () => {
        expect(HelperMethods.isBoardValid('8/8/8/8/8/8/8/6kK')).toBe(false);
    });

    test('check if the board is valid - invalid board more than two kings', () => {
        expect(HelperMethods.isBoardValid('8/8/8/k7/8/8/8/k6K')).toBe(false);
    });

    test('check if the board is valid - invalid board not a valid game (insufficient pieces) - two kings only', () => {
        expect(HelperMethods.isBoardValid('8/8/8/8/8/8/8/k6K')).toBe(false);
    });

    test('check if the board is valid - invalid board not a valid game (insufficient pieces) - two bishops opposite colors', () => {
        expect(HelperMethods.isBoardValid('8/8/8/8/8/8/b6B/k6K')).toBe(false);
    });

    test('check if the board is valid - invalid board not a valid game (insufficient pieces) - two bishops same colors', () => {
        expect(HelperMethods.isBoardValid('8/8/8/8/8/8/b6b/k6K')).toBe(false);
    });

    test('check if the board is valid - invalid board not a valid game (insufficient pieces) - one bishop', () => {
        expect(HelperMethods.isBoardValid('8/8/8/8/8/8/7B/k6K')).toBe(false);
    });

    test('check if the board is valid - invalid board not a valid game (insufficient pieces) - one knight', () => {
        expect(HelperMethods.isBoardValid('8/8/8/8/8/8/7N/k6K')).toBe(false);
    });

    test('check if the board is valid - invalid board not a valid game (insufficient pieces) - two knights opposite colors', () => {
        expect(HelperMethods.isBoardValid('8/8/8/8/8/8/n6N/k6K')).toBe(false);
    });

    test('check if the board is valid - invalid board not a valid game (insufficient pieces) - a knight and a bishop opposite colors', () => {
        expect(HelperMethods.isBoardValid('8/8/8/8/8/8/n6B/k6K')).toBe(false);
    });

    test('check if the board is valid - valid board - two knights same colors', () => {
        expect(HelperMethods.isBoardValid('8/8/8/8/8/8/N6N/k6K')).toBe(true);
    });

    test('check if the board is valid - valid board - a knight and a bishop same color', () => {
        expect(HelperMethods.isBoardValid('8/8/8/8/8/8/N6B/k6K')).toBe(true);
    });

    test('check if the board is valid - valid board - a rook', () => {
        expect(HelperMethods.isBoardValid('8/8/8/8/8/8/r7/k6K')).toBe(true);
    });

    test('check if the board is valid - valid board - a pawn', () => {
        expect(HelperMethods.isBoardValid('8/8/8/8/8/8/p7/k6K')).toBe(true);
    });

    test('check if the board is valid - valid board - a queen', () => {
        expect(HelperMethods.isBoardValid('8/8/8/8/8/8/q7/k6K')).toBe(true);
    });
});

describe('Testing the isCastlingValid() function', () => {
    test('check if the castling string is valid - valid short and long both sides', () => {
        expect(HelperMethods.isCastlingValid('KQkq')).toBe(true);
    });

    test('check if the castling string is valid - valid short both sides', () => {
        expect(HelperMethods.isCastlingValid('Kk')).toBe(true);
    });

    test('check if the castling string is valid - valid long both sides', () => {
        expect(HelperMethods.isCastlingValid('Qq')).toBe(true);
    });

    test('check if the castling string is valid - valid short white', () => {
        expect(HelperMethods.isCastlingValid('K')).toBe(true);
    });

    test('check if the castling string is valid - valid long white', () => {
        expect(HelperMethods.isCastlingValid('Q')).toBe(true);
    });

    test('check if the castling string is valid - valid short black', () => {
        expect(HelperMethods.isCastlingValid('k')).toBe(true);
    });

    test('check if the castling string is valid - valid long black', () => {
        expect(HelperMethods.isCastlingValid('q')).toBe(true);
    });

    test('check if the castling string is valid - valid white', () => {
        expect(HelperMethods.isCastlingValid('KQ')).toBe(true);
    });

    test('check if the castling string is valid - valid black', () => {
        expect(HelperMethods.isCastlingValid('kq')).toBe(true);
    });

    test('check if the castling string is valid - valid no castling', () => {
        expect(HelperMethods.isCastlingValid('-')).toBe(true);
    });

    test('check if the castling string is valid - invalid empty', () => {
        expect(HelperMethods.isCastlingValid('')).toBe(false);
    });

    test('check if the castling string is valid - invalid null', () => {
        expect(HelperMethods.isCastlingValid()).toBe(false);
    });

    test('check if the castling string is valid - invalid 3 for white', () => {
        expect(HelperMethods.isCastlingValid('KKQ')).toBe(false);
    });

    test('check if the castling string is valid - invalid 3 for black', () => {
        expect(HelperMethods.isCastlingValid('kkq')).toBe(false);
    });

    test('check if the castling string is valid - invalid more than 4', () => {
        expect(HelperMethods.isCastlingValid('KQkqx')).toBe(false);
    });

    test('check if the castling string is valid - invalid castling', () => {
        expect(HelperMethods.isCastlingValid('Xx')).toBe(false);
    });

    test('check if the castling string is valid - invalid more than once per side', () => {
        expect(HelperMethods.isCastlingValid('KKkk')).toBe(false);
    });
});

describe('Testing the isTurnValid() function', () => {
    test('check if the turn is valid - valid white', () => {
        expect(HelperMethods.isTurnValid('w')).toBe(true);
    });

    test('check if the turn is valid - valid black', () => {
        expect(HelperMethods.isTurnValid('w')).toBe(true);
    });

    test('check if the turn is valid - invalid empty', () => {
        expect(HelperMethods.isTurnValid('')).toBe(false);
    });

    test('check if the turn is valid - invalid null', () => {
        expect(HelperMethods.isTurnValid()).toBe(false);
    });

    test('check if the turn is valid - invalid other character', () => {
        expect(HelperMethods.isTurnValid('x')).toBe(false);
    });

    test('check if the turn is valid - invalid more characters', () => {
        expect(HelperMethods.isTurnValid('wsasadsadas')).toBe(false);
    });
});

describe('Testing the isEnPassantValid() function', () => {
    test('check if en Passant is valid - valid white', () => {
        expect(HelperMethods.isEnPassantValid('A3')).toBe(true);
    });

    test('check if en Passant is valid - valid black', () => {
        expect(HelperMethods.isEnPassantValid('A6')).toBe(true);
    });

    test('check if en Passant is valid - valid no enPassant', () => {
        expect(HelperMethods.isEnPassantValid('-')).toBe(true);
    });

    test('check if en Passant is valid - invalid empty', () => {
        expect(HelperMethods.isEnPassantValid('')).toBe(false);
    });

    test('check if en Passant is valid - invalid null', () => {
        expect(HelperMethods.isEnPassantValid()).toBe(false);
    });

    test('check if en Passant is valid - invalid letter coordinate', () => {
        expect(HelperMethods.isEnPassantValid('X3')).toBe(false);
    });

    test('check if en Passant is valid - invalid number coordinate', () => {
        expect(HelperMethods.isEnPassantValid('A2')).toBe(false);
    });

    test('check if en Passant is valid - invalid more than 2 chars', () => {
        expect(HelperMethods.isEnPassantValid('Aaa2')).toBe(false);
    });

    test('check if en Passant is valid - invalid lowercase', () => {
        expect(HelperMethods.isEnPassantValid('a2')).toBe(false);
    });
});

describe('Testing the isHalfMovesValid() function', () => {
    test('check if the half moves are valid - valid number', () => {
        expect(HelperMethods.isHalfMovesValid(0)).toBe(true);
    });

    test('check if the half moves are valid - invalid negative number', () => {
        expect(HelperMethods.isHalfMovesValid(-2)).toBe(false);
    });

    test('check if the half moves are valid - invalid more than 50 moves', () => {
        expect(HelperMethods.isHalfMovesValid(51)).toBe(false);
    });

    test('check if the half moves are valid - invalid empty', () => {
        expect(HelperMethods.isHalfMovesValid('')).toBe(false);
    });

    test('check if the half moves are valid - invalid null', () => {
        expect(HelperMethods.isHalfMovesValid()).toBe(false);
    });

    test('check if the half moves are valid - invalid char', () => {
        expect(HelperMethods.isHalfMovesValid('a')).toBe(false);
    });

    test('check if the half moves are valid - valid number as string', () => {
        expect(HelperMethods.isHalfMovesValid('3')).toBe(true);
    });

    test('check if the half moves are valid - invalid negative number as string', () => {
        expect(HelperMethods.isHalfMovesValid('-3')).toBe(false);
    });

    test('check if the half moves are valid - invalid string', () => {
        expect(HelperMethods.isHalfMovesValid('aa')).toBe(false);
    });
});

describe('Testing the isFullMovesValid() function', () => {
    test('check if the full moves are valid - valid number', () => {
        expect(HelperMethods.isFullMovesValid(0)).toBe(true);
    });

    test('check if the full moves are valid - invalid negative number', () => {
        expect(HelperMethods.isFullMovesValid(-2)).toBe(false);
    });

    test('check if the full moves are valid - invalid empty', () => {
        expect(HelperMethods.isFullMovesValid('')).toBe(false);
    });

    test('check if the full moves are valid - invalid null', () => {
        expect(HelperMethods.isFullMovesValid()).toBe(false);
    });

    test('check if the full moves are valid - invalid char', () => {
        expect(HelperMethods.isFullMovesValid('a')).toBe(false);
    });

    test('check if the full moves are valid - valid number as string', () => {
        expect(HelperMethods.isFullMovesValid('3')).toBe(true);
    });

    test('check if the full moves are valid - invalid negative number as string', () => {
        expect(HelperMethods.isFullMovesValid('-3')).toBe(false);
    });

    test('check if the full moves are valid - invalid string', () => {
        expect(HelperMethods.isFullMovesValid('aa')).toBe(false);
    });
});

describe('Testing the ConvertFENtoPiece() function', () => {
    test('check if we can convert FEN to piece - valid white king', () => {
        expect(HelperMethods.ConvertFENtoPiece('K')).toBe('king');
    });

    test('check if we can convert FEN to piece - valid white queen', () => {
        expect(HelperMethods.ConvertFENtoPiece('Q')).toBe('queen');
    });

    test('check if we can convert FEN to piece - valid white knight', () => {
        expect(HelperMethods.ConvertFENtoPiece('N')).toBe('knight');
    });

    test('check if we can convert FEN to piece - valid white bishop', () => {
        expect(HelperMethods.ConvertFENtoPiece('B')).toBe('bishop');
    });

    test('check if we can convert FEN to piece - valid white rook', () => {
        expect(HelperMethods.ConvertFENtoPiece('R')).toBe('rook');
    });

    test('check if we can convert FEN to piece - valid white pawn', () => {
        expect(HelperMethods.ConvertFENtoPiece('P')).toBe('pawn');
    });

    test('check if we can convert FEN to piece - valid black king', () => {
        expect(HelperMethods.ConvertFENtoPiece('k')).toBe('king');
    });

    test('check if we can convert FEN to piece - valid black queen', () => {
        expect(HelperMethods.ConvertFENtoPiece('q')).toBe('queen');
    });

    test('check if we can convert FEN to piece - valid black knight', () => {
        expect(HelperMethods.ConvertFENtoPiece('n')).toBe('knight');
    });

    test('check if we can convert FEN to piece - valid black bishop', () => {
        expect(HelperMethods.ConvertFENtoPiece('b')).toBe('bishop');
    });

    test('check if we can convert FEN to piece - valid black rook', () => {
        expect(HelperMethods.ConvertFENtoPiece('r')).toBe('rook');
    });

    test('check if we can convert FEN to piece - valid black pawn', () => {
        expect(HelperMethods.ConvertFENtoPiece('p')).toBe('pawn');
    });

    test('check if we can convert FEN to piece - invalid empty', () => {
        expect(HelperMethods.ConvertFENtoPiece('')).toBe('');
    });

    test('check if we can convert FEN to piece - invalid null', () => {
        expect(HelperMethods.ConvertFENtoPiece()).toBe('');
    });

    test('check if we can convert FEN to piece - invalid string', () => {
        expect(HelperMethods.ConvertFENtoPiece('KK')).toBe('');
    });
});

describe('Testing the ConvertFENPieceToPiece() function', () => {
    test('check if we can convert FEN piece to piece - valid white king', () => {
        expect(HelperMethods.ConvertFENPieceToPiece('K')).toBe('white-king');
    });

    test('check if we can convert FEN piece to piece - valid white queen', () => {
        expect(HelperMethods.ConvertFENPieceToPiece('Q')).toBe('white-queen');
    });

    test('check if we can convert FEN piece to piece - valid white knight', () => {
        expect(HelperMethods.ConvertFENPieceToPiece('N')).toBe('white-knight');
    });

    test('check if we can convert FEN piece to piece - valid white bishop', () => {
        expect(HelperMethods.ConvertFENPieceToPiece('B')).toBe('white-bishop');
    });

    test('check if we can convert FEN piece to piece - valid white rook', () => {
        expect(HelperMethods.ConvertFENPieceToPiece('R')).toBe('white-rook');
    });

    test('check if we can convert FEN piece to piece - valid white pawn', () => {
        expect(HelperMethods.ConvertFENPieceToPiece('P')).toBe('white-pawn');
    });

    test('check if we can convert FEN piece to piece - valid black king', () => {
        expect(HelperMethods.ConvertFENPieceToPiece('k')).toBe('black-king');
    });

    test('check if we can convert FEN piece to piece - valid black queen', () => {
        expect(HelperMethods.ConvertFENPieceToPiece('q')).toBe('black-queen');
    });

    test('check if we can convert FEN piece to piece - valid black knight', () => {
        expect(HelperMethods.ConvertFENPieceToPiece('n')).toBe('black-knight');
    });

    test('check if we can convert FEN piece to piece - valid black bishop', () => {
        expect(HelperMethods.ConvertFENPieceToPiece('b')).toBe('black-bishop');
    });

    test('check if we can convert FEN piece to piece - valid black rook', () => {
        expect(HelperMethods.ConvertFENPieceToPiece('r')).toBe('black-rook');
    });

    test('check if we can convert FEN piece to piece - valid black pawn', () => {
        expect(HelperMethods.ConvertFENPieceToPiece('p')).toBe('black-pawn');
    });

    test('check if we can convert FEN piece to piece - invalid empty', () => {
        expect(HelperMethods.ConvertFENPieceToPiece('')).toBe('');
    });

    test('check if we can convert FEN piece to piece - invalid null', () => {
        expect(HelperMethods.ConvertFENPieceToPiece()).toBe('');
    });

    test('check if we can convert FEN piece to piece - invalid string', () => {
        expect(HelperMethods.ConvertFENPieceToPiece('KK')).toBe('');
    });
});

describe('Testing the ConvertFenToString() function', () => {
    test('check if we can convert a FEN to string - valid string', () => {
        expect(HelperMethods.ConvertFenToString('8')).toBe(" ".repeat(8));
    });

    test('check if we can convert a FEN to string - valid string with pieces', () => {
        expect(HelperMethods.ConvertFenToString('5pp1')).toBe(`${" ".repeat(5)}pp `);
    });

    test('check if we can convert a FEN to string - invalid empty', () => {
        expect(HelperMethods.ConvertFenToString('')).toBe('');
    });

    test('check if we can convert a FEN to string - invalid null', () => {
        expect(HelperMethods.ConvertFenToString()).toBe('');
    });

    test('check if we can convert a FEN to string - invalid shorter string', () => {
        expect(HelperMethods.ConvertFenToString('7')).toBe('');
    });

    test('check if we can convert a FEN to string - invalid longer string', () => {
        expect(HelperMethods.ConvertFenToString('9')).toBe('');
    });
});

describe('Testing the checkIfTwoSquaresAreOnTheSameRow() function', () => {
    const square1 = <Square x={0} y={1} piece='white-king' />
    const square2 = <Square x={0} y={2} piece='black-king' />
    const square3 = <Square x={1} y={2} piece='black-pawn' />

    test('check if two squares are on the same row - valid squares on the same row', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameRow(square1, square2)).toBe(true);
    });

    test('check if two squares are on the same row - invalid squares on different rows', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameRow(square1, square3)).toBe(false);
    });

    test('check if two squares are on the same row - invalid square1 null', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameRow(null, square3)).toBe(false);
    });

    test('check if two squares are on the same row - invalid square2 null', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameRow(square1, null)).toBe(false);
    });

    test('check if two squares are on the same row - invalid both squares null', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameRow(null, null)).toBe(false);
    });

    test('check if two squares are on the same row - invalid square1 props null', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameRow({ props: null }, square3)).toBe(false);
    });

    test('check if two squares are on the same row - invalid square2 props null', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameRow(square1, { props: null })).toBe(false);
    });

    test('check if two squares are on the same row - invalid both squares props null', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameRow({ props: null }, { props: null })).toBe(false);
    });

    test('check if two squares are on the same row - invalid square1 empty x', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameRow({ props: { x: {} } }, square3)).toBe(false);
    });

    test('check if two squares are on the same row - invalid square2 empty x', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameRow(square1, { props: { x: {} } })).toBe(false);
    });

    test('check if two squares are on the same row - invalid both squares empty x', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameRow({ props: { x: {} } }, { props: { x: {} } })).toBe(false);
    });
});

describe('Testing the checkIfTwoSquaresAreOnTheSameColumn() function', () => {
    const square1 = <Square x={1} y={0} piece='white-king' />
    const square2 = <Square x={2} y={0} piece='black-king' />
    const square3 = <Square x={2} y={1} piece='black-pawn' />

    test('check if two squares are on the same column - valid squares on the same column', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameColumn(square1, square2)).toBe(true);
    });

    test('check if two squares are on the same column - invalid squares on different columns', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameColumn(square1, square3)).toBe(false);
    });

    test('check if two squares are on the same column - invalid square1 null', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameColumn(null, square3)).toBe(false);
    });

    test('check if two squares are on the same column - invalid square2 null', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameColumn(square1, null)).toBe(false);
    });

    test('check if two squares are on the same column - invalid both squares null', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameColumn(null, null)).toBe(false);
    });

    test('check if two squares are on the same column - invalid square1 props null', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameColumn({ props: null }, square3)).toBe(false);
    });

    test('check if two squares are on the same column - invalid square2 props null', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameColumn(square1, { props: null })).toBe(false);
    });

    test('check if two squares are on the same column - invalid both squares props null', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameColumn({ props: null }, { props: null })).toBe(false);
    });

    test('check if two squares are on the same column - invalid square1 empty y', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameColumn({ props: { y: {} } }, square3)).toBe(false);
    });

    test('check if two squares are on the same column - invalid square2 empty y', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameColumn(square1, { props: { y: {} } })).toBe(false);
    });

    test('check if two squares are on the same column - invalid both squares empty y', () => {
        expect(HelperMethods.checkIfTwoSquaresAreOnTheSameColumn({ props: { y: {} } }, { props: { y: {} } })).toBe(false);
    });
});

// Template
/*
describe('Testing the {FUNCTION_NAME} function', () => {
    test('check if {WHAT_THE_FUNCTION_SHOULD_BE_DOING}', () => {
        expect({WHAT_TO_SEND_TO_THE_FUNCTION}).toBe({WHAT_TO_EXPECT_FROM_THE_FUNCTION_AS_A_RESULT});
    });
});
*/