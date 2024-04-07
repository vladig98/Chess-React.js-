import { Component } from "react"

export class Square extends Component {
    constructor(props) {
        super(props)
        this.updatePossibleMoves = props.updatePossibleMoves
        this.setSelectedSquareX = props.setSelectedSquareX
        this.setSelectedSquareY = props.setSelectedSquareY
    }

    onClick = () => {
        if (this.props.possibleMoves.some(m => m.x == this.props.x && m.y == this.props.y)) {
            this.props.movePiece(this.props.x, this.props.y)
        } else {
            if (this.props.selectedSquareX == this.props.x && this.props.selectedSquareY == this.props.y) {
                this.setSelectedSquareX("")
                this.setSelectedSquareY("")
                this.updatePossibleMoves([])
            } else {
                this.setSelectedSquareX(this.props.x)
                this.setSelectedSquareY(this.props.y)
                this.props.getPossibleMoves(this)
            }
        }
    }

    render() {
        let styles = ['chessSquare', 'piece'];
        styles.push(this.props.color);
        styles.push(this.props.piece);

        if (this.props.possibleMoves.some(move => move.x === this.props.x && move.y === this.props.y)) {
            styles.push("possibleMove");
        }

        return <div onClick={this.onClick} className={styles.filter(Boolean).join(" ")}></div>
    }
}