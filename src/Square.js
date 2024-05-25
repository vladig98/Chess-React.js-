import React, { useCallback } from 'react';
import { CurrentSquareSelection, PossibleMoves } from "./globalVariables.js";

/**
 * A React component representing a single square on the chessboard.
 * 
 * @component
 * @param {Object} props - The props for the component.
 * @param {Function} props.getPossibleMoves - Function to get possible moves for the piece.
 * @param {number} props.x - The x-coordinate of the square.
 * @param {number} props.y - The y-coordinate of the square.
 * @param {string} props.piece - The piece on the square.
 * @param {string} props.color - The color of the square.
 * @param {Function} props.movePiece - Function to move the piece to a new square.
 * @param {boolean} props.isPossibleMove - Indicates if the square is a possible move.
 * @param {Function} props.resetPossibleMoves - Function to reset possible moves.
 * @returns {JSX.Element} The rendered square component.
 */
const Square = ({
    getPossibleMoves,
    x,
    y,
    piece,
    color,
    movePiece,
    isPossibleMove,
    resetPossibleMoves
}) => {

    /**
     * Resets the current square selection.
     * 
     * @param {number} [newX=-1] - The new x-coordinate for the current selection.
     * @param {number} [newY=-1] - The new y-coordinate for the current selection.
     */
    const reset = useCallback((newX = -1, newY = -1) => {
        CurrentSquareSelection.x = newX;
        CurrentSquareSelection.y = newY;
        resetPossibleMoves();
    }, [resetPossibleMoves]);

    /**
     * Gets the current selection from the possible moves.
     * 
     * @returns {Object|null} The current selection or null if not found.
     */
    const getCurrentSelection = useCallback(() => {
        return PossibleMoves.find(m => m.piece.props.x === CurrentSquareSelection.x && m.piece.props.y === CurrentSquareSelection.y);
    }, []);

    /**
     * Checks if the current square is a possible move for the current selection.
     * 
     * @returns {boolean} True if the current square is a possible move, false otherwise.
     */
    const checkIfCurrentSquareIsAPossibleMoveForTheCurrentSelection = useCallback(() => {
        return getCurrentSelection()?.moves.some(m => m.props.x === x && m.props.y === y);
    }, [getCurrentSelection, x, y]);

    /**
     * Checks if this square is currently selected.
     * 
     * @returns {boolean} True if this square is currently selected, false otherwise.
     */
    const isThisSquareCurrentlySelected = useCallback(() => {
        return CurrentSquareSelection.x === x && CurrentSquareSelection.y === y;
    }, [x, y]);

    /**
     * Handles click events on the square.
     */
    const handleClick = useCallback(() => {
        if (checkIfCurrentSquareIsAPossibleMoveForTheCurrentSelection()) {
            movePiece(x, y);
            reset();
        } else {
            if (isThisSquareCurrentlySelected()) {
                PossibleMoves.splice(0, PossibleMoves.length);
                reset();
            } else {
                reset(x, y);
                getPossibleMoves();
            }
        }
    }, [checkIfCurrentSquareIsAPossibleMoveForTheCurrentSelection, isThisSquareCurrentlySelected, movePiece, getPossibleMoves, x, y, reset]);

    const styles = ['chessSquare', 'piece', color, piece, isPossibleMove && "possibleMove"].filter(Boolean).join(" ");

    return (
        <div onClick={handleClick} className={styles}>
        </div>
    );
}

export default React.memo(Square);