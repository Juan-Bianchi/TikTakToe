/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'*/
import './App.css'
import {MouseEventHandler, useState} from "react";

type SquareProps = {
    value: string | null;
    onSquareClick: MouseEventHandler<HTMLButtonElement>;
    isWinnerCell: boolean;
}

type BoardProps = {
    xIsNext: boolean;
    squares: (string | null)[];
    onPlay: Function;
}

function calculateWinner(squares: (string | null)[] ): number[] | null {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }
    return null;
}

function Square({value, onSquareClick, isWinnerCell}: SquareProps) {
    let colorClass = '';
    let borderClass: string;

    if (value === 'X') {
        colorClass = 'x-square';
    } else if (value === 'O') {
        colorClass = 'o-square';
    }

    if (isWinnerCell) {
        borderClass = 'winner-cell'
    }
    else {
        borderClass = 'normal-cell'    }

    return (
        <button className={`square ${colorClass} ${borderClass}`} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({xIsNext, squares, onPlay}: BoardProps) {
    function handleClick(i: number): void {

        if(squares[i] || calculateWinner(squares)) {
            return
        }
        const nextSquares = squares.slice()
        if(xIsNext) {
            nextSquares[i] = 'X'
        }
        else {
            nextSquares[i] = 'O'
        }
        onPlay(nextSquares, i);
    }

    const winningLine: number[] | null = calculateWinner(squares);
    const winner: string | null = winningLine? squares[winningLine[0]]: null;
    let status;
    if(winner) {
        status = 'Winner: ' + winner;
    }
    else if(!squares.some(space => space == null)) {
        status = 'There is a draw'
    }
    else {
        status = 'Next player: ' + (xIsNext? 'X': 'O');
    }

    const boardRows = [];
    for(let i: number = 0; i < 3; i++) {
        const squareLine = [];
        for(let j: number = 0; j < 3; j++) {
            const key: number = i * 3 + j;
            if(winningLine?.some(position => position === key)) {
                squareLine.push(<Square isWinnerCell={true} key={key} value={squares[key]} onSquareClick={()=> handleClick(key)}/>)
            }
            else {
                squareLine.push(<Square isWinnerCell={false} key={key} value={squares[key]} onSquareClick={()=> handleClick(key)}/>)
            }

        }
        boardRows.push(<div key={i} className='board-row'>{squareLine}</div>)
    }
    return (
        <>
            <div className="status">{status}</div>
            {boardRows}
        </>
    )

}


export default function Game()  {
    const [history, setHistory] = useState <Array<Array<string|null>>> ([Array(9).fill(null)])
    const [currentMove, setCurrentMove] = useState<number>(0)
    const [isAscending, setIsAscending] = useState<boolean>(true);
    const currentSquares: (string | null)[] = history[currentMove]
    const xIsNext = currentMove % 2 === 0;
    const [positions, setPositions] = useState<Array<number | null>>([])

    function handlePlay(nextSquares: (string | null)[], pos: number) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        const nextPos = [... positions.slice(0, currentMove)]
        nextPos.push(pos+1)
        console.log((nextPos))
        setPositions((nextPos))
    }

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((_squares, move) => {
        let description;
        const movement = move + 1;
        if( move === currentMove) {
            description = 'You are in the move # ' + movement;
            return (
                <li key={move}>
                    <span> {description} </span>
                </li>
            )
        }
        const pos = positions[move] as number
        const line = Math.ceil(pos as number / 3)
        const column = Math.floor((pos) % 3 === 0? 3: pos % 3)
        if (move > 0 && column && line) {
            description = 'Go to move #' + movement + ' (line: ' + line + ', column: ' + column + ')';
        } else if(move > 0){
            description = 'Go to move #' + movement + ' (line: not chosen, column: not chosen)';
        } else {
            description = 'Go to game start (line: '+ line + ', column: ' + column + ')';
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    function changeOrder() {
        setIsAscending(!isAscending);
    }

    const orderedMoves = isAscending ? moves : moves.slice().reverse();

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
            </div>
            <div className="game-info">
                <ol>{ orderedMoves }</ol>
            </div>
            <div className="game-info">
                <button onClick={()=> changeOrder()}>Toggle order</button>
            </div>
        </div>
      );
}


