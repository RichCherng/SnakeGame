import React, { useEffect, useState } from 'react';
import { RandomPositionOnGrid} from '../utils'
import { SEGMENT_SIZE } from '../components/Canvas';

export enum GAME_STATE {
    RUNNING,
    GAME_OVER,
    PAUSED
}

enum DIRECTION {
    UP,
    DOWN,
    LEFT,
    RIGHT
}

export interface Position {
    x: number;
    y: number;
}

type UseGameLogicArg = {
    canvasHeight?: number;
    canvasWidth?: number;
    onGameOver?: () => void;
    gameState: GAME_STATE
}

interface GameState {
    snakeBody: Position[],
    foodPosition: Position
}

interface UseGameLogic {
    state: GameState;
    onKeyDownHandler?: () => void;
    onReset?: () => void;

}



const useGameLogic = ({
    canvasHeight, 
    canvasWidth, 
    onGameOver, 
    gameState} : UseGameLogicArg): UseGameLogic => {

        const [direction, setDirection] = useState<DIRECTION | undefined>();
        const [snakeBody, setSnakeBody] = useState<Position[]>([{x: 0, y:0}]);
        const [foodPosition, setFoodPosition] = useState<Position>({x: 0, y:0});
        const snakeHead = snakeBody[0];


        useEffect(() => {
            // initialize game
            if (!canvasHeight || !canvasWidth) return; // game not ready
            const randomFoodPosition = RandomPositionOnGrid([
                {gridSize: SEGMENT_SIZE, threshold: canvasWidth},
                {gridSize: SEGMENT_SIZE, threshold: canvasHeight},
                {gridSize: SEGMENT_SIZE, threshold: canvasWidth},
                {gridSize: SEGMENT_SIZE, threshold: canvasHeight},
            ]);
            const test = randomFoodPosition.next().value || 0;
            setFoodPosition({ x: test, y: randomFoodPosition.next().value || 0});
            setSnakeBody([{x: randomFoodPosition.next().value || 0 , y: randomFoodPosition.next().value || 0}]);
        }, [canvasHeight, canvasWidth])
        const moveSnake = () => {
            let snakeBodyAfterMovement: Position[] | undefined;
        }

        // update the game
        // useInterval(moveSnake, gameState === GAME_STATE.RUNNING? MOVEMENT_SPEED: null);
        const logics: UseGameLogic = {
            state: {snakeBody, foodPosition},

        }
        return logics
    }


export default useGameLogic;