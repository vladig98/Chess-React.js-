import React from 'react';
import Board from "./Board";

/**
 * The Chess component is the main component that renders the chessboard.
 * It includes the container and the grid which holds the Board component.
 *
 * @component
 * @returns {JSX.Element} The rendered Chess component.
 */
export default function Chess() {
    return (
        <div className="chessContainer">
            <div id="grid" className="chessGrid">
                <Board />
            </div>
        </div>
    );
}