import React, { CSSProperties, useRef, useState } from 'react';
import Canvas, { draw } from '../components/Canvas';
import useGameLogic, { GAME_STATE } from './gameLogic';

const GameWrapperStyle = {
    width: "100% auto",
    display: "flex",
    alignItems: "center",
    outline: "none",
    // flexDirection: "column"
};

type Props = {
    // children?: JSX.Element
    children?: String
}

const scoreStyle: CSSProperties = {
    background: "linear-gradient(to left, #753ad5, #d53a9d)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
}




const Score = ({children}: Props) => 
    <h1
        style={scoreStyle}
    >{children}</h1>

const Game = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<GAME_STATE>(GAME_STATE.RUNNING);

    const onGameOver = () => setGameState(GAME_STATE.GAME_OVER);

    const { state, onKeyDownHandler, onReset} = useGameLogic({canvasHeight: 150, canvasWidth: 300, onGameOver, gameState});
    const {snakeBody, foodPosition} = state
    return (
        <div tabIndex={0} style={GameWrapperStyle}>
            <Canvas 
                ref={canvasRef} 
                draw={ (ctx: CanvasRenderingContext2D) => draw({ctx, snakeBody, foodPosition})}/>
            <Score>{`Your score: ${(snakeBody.length - 1) * 10}`}</Score>
        </div>
    )
}

export default Game;