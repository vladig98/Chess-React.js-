import React, { useState, useEffect } from 'react';
import { CurrentSquareSelection, PossibleMoves } from "./globalVariables.js"

function Square({
    getPossibleMoves,
    x,
    y,
    piece,
    color,
    movePiece,
    isPossibleMove,
    resetPossibleMoves
}) {

    function reset(newX = -1, newY = -1) {
        CurrentSquareSelection.x = newX
        CurrentSquareSelection.y = newY
        resetPossibleMoves()
    }

    function handleClick() {
        if (PossibleMoves.find(m => m.piece.props.x == CurrentSquareSelection.x && m.piece.props.y == CurrentSquareSelection.y)?.moves.some(m => m.props.x == x && m.props.y == y)) {
            movePiece(x, y)
            reset()
        } else {
            if (CurrentSquareSelection.x == x && CurrentSquareSelection.y == y) {
                PossibleMoves.splice(0, PossibleMoves.length);
                reset()
            } else {
                reset(x, y)
                getPossibleMoves()
            }
        }
    }

    let styles = ['chessSquare', 'piece'];
    styles.push(color);
    styles.push(piece);

    //if (PossibleMoves.some(move => move.moves.some(m => m.props.x === x && m.props.y === y))) {
    if (isPossibleMove) {
        styles.push("possibleMove");
    }

    return (
        <>
            <div onClick={handleClick} className={styles.filter(Boolean).join(" ")}>
                {/* <span className='coordinates'>{x}-{y}</span> */}
            </div>
        </>
    )
}

export default Square