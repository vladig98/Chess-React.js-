import Board from "./Board.js";

export default function Chess() {
    return (<>
        <div className="chessContainer">
            <div id="grid" className="chessGrid">
                <Board />
            </div>
        </div>
    </>)
}