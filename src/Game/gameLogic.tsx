import React, { useEffect, useState } from 'react';
import { useInterval, RandomPositionOnGrid} from '../utils'
import { SEGMENT_SIZE } from '../components/Canvas';
import { ConsoleWriter } from 'istanbul-lib-report';

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

export class Position {
    public x: number;
    public y: number;

    constructor( position: {x : number, y: number}) {
        this.x = position.x;
        this.y = position.y;
    }

    public equal(obj: Position): boolean {
        return obj.x === this.x && obj.y === this.y;
    }

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
    onKeyDownHandler: (s: string) => void;
    onReset?: () => void;

}

enum INPUT_DIRECTION {
    ARROW_UP = 'ArrowUp',
    ARROW_DOWN = 'ArrowDown',
    ARROW_LEFT = 'ArrowLeft',
    ARROW_RIGHT = 'ArrowRight',
    KEY_UP = 'KeyW',
    KEY_DOWN = 'KeyS',
    KEY_LEFT = 'KeyA',
    KEY_RIGHT = 'KeyD',
}

enum ACTION {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    PAUSE,
    RESUME,
    END,
    UNKNOWN
}


const moveSnake = (direction: DIRECTION, snakeBody: Position[]): Position[] => {
    // remove the tail
    // const body = (([head, ...body]) => body)(snakeBody); // take out the head using spread
    const [head, ...bodyWithoutTail] = [...snakeBody].slice(-1);
    let newHead = null;
    console.log(direction)
    switch(direction) {
        case DIRECTION.DOWN:
            console.log("MOVING DOWN")
            newHead = new Position({ x: head.x, y: head.y + SEGMENT_SIZE});
            break;
        case DIRECTION.UP:
            console.log("MOVING UP")
            newHead = new Position({ x: head.x, y: head.y - SEGMENT_SIZE});
            break;
        case DIRECTION.LEFT:
            console.log("Moving Left")
            newHead = new Position({ x: head.x - SEGMENT_SIZE, y: head.y});
            break;
        case DIRECTION.RIGHT:
            console.log("moving right")
            newHead = new Position({ x: head.x + SEGMENT_SIZE, y: head.y});
            break;
    }

    return [newHead, ...bodyWithoutTail];
}

// generate food that does not overlap with snake body
const genNewFood = (snakeBody : Position[], generator: Generator<Position, void, unknown>): Position => {
    const newFoodPosition: Position | undefined = generator.next().value || undefined

    if (!newFoodPosition) {
        console.log("ERROR AT GENERATING FOOD POSITION")
        return new Position({x : 0, y: 0});
    }

    for(const body of snakeBody) {
        if (newFoodPosition.x === body.x && newFoodPosition.y === body.y) {
            return genNewFood(snakeBody, generator);
        }
    }

    return newFoodPosition
}


const willEat = (foodPosition: Position, snakeHead: Position, direction: DIRECTION | undefined): boolean => {
    return foodPosition.equal(snakeHead);
    // switch(direction) {
    //     case DIRECTION.UP:
    //         return foodPosition.equal(snakeHead); 
    //     case DIRECTION.DOWN:
    //     case DIRECTION.LEFT:
    //     case DIRECTION.RIGHT:
    // }
}

const encodeInput = (str: String): ACTION => {
    console.log(str);
    switch(str) {
        case INPUT_DIRECTION.ARROW_DOWN:
        case INPUT_DIRECTION.KEY_DOWN:
            return ACTION.DOWN;
        case INPUT_DIRECTION.ARROW_UP:
        case INPUT_DIRECTION.KEY_UP:
            return ACTION.UP;
        case INPUT_DIRECTION.ARROW_LEFT:
        case INPUT_DIRECTION.KEY_LEFT:
            return ACTION.LEFT;
        case INPUT_DIRECTION.KEY_RIGHT:
        case INPUT_DIRECTION.KEY_RIGHT:
            return ACTION.RIGHT;
        default:
            return ACTION.UNKNOWN;
    }
}

const useGameLogic = ({
    canvasHeight, 
    canvasWidth, 
    onGameOver, 
    gameState} : UseGameLogicArg): UseGameLogic => {

        const [direction, setDirection] = useState<DIRECTION | undefined>();
        const [snakeBody, setSnakeBody] = useState<Position[]>([new Position({x: 0, y:0})]);
        const [foodPosition, setFoodPosition] = useState<Position>(new Position({x: 0, y:0}));
        const snakeHead = snakeBody[0];

        const randomPositionOnGridGenerator = RandomPositionOnGrid({ 
            x : { gridSize: SEGMENT_SIZE, threshold: canvasWidth},
            y : { gridSize: SEGMENT_SIZE, threshold: canvasHeight}
        }
            )
        useEffect(() => {
            // initialize game
            if (!canvasHeight || !canvasWidth) return; // game not ready
            const newSnakeBody = [randomPositionOnGridGenerator.next().value || new Position({x: 0, y: 0})]
            setSnakeBody(newSnakeBody);
            setFoodPosition(genNewFood(newSnakeBody, randomPositionOnGridGenerator));
            
        }, [canvasHeight, canvasWidth])

        // update the game
        // useInterval(moveSnake, gameState === GAME_STATE.RUNNING? MOVEMENT_SPEED: null);
        const gameTick = () => {

            console.log(snakeBody, foodPosition, direction)
            // Should only run when all initialization is done
            if (!snakeBody || !foodPosition || direction === undefined) return;


            const snakePostUpdate: Position[] = moveSnake(direction, snakeBody);
            // if (checkGameOver(snakePostUpdate)) {
            //     onGameOver();
            //     return;
            // }
            if (willEat(foodPosition, snakePostUpdate[0], direction)) {
                const newSnakeBody = [foodPosition, ...snakeBody];
                setSnakeBody(newSnakeBody);
                setFoodPosition(genNewFood(newSnakeBody, randomPositionOnGridGenerator));
            } else if(false) {
                // snake hit the wall
            } else {
                setSnakeBody(snakePostUpdate);
            }
        }

        const eventHandler = (event: string) => {
            // console.log(event);
            const e = encodeInput(event);
            // console.log(event, e);
            switch(e) {
                case ACTION.DOWN:
                    console.log("GO DOWN")
                    setDirection(DIRECTION.DOWN);
                    break;
                case ACTION.UP:
                    console.log("GO Up")
                    setDirection(DIRECTION.UP);
                    break;
                case ACTION.LEFT:
                    console.log("Go Left")
                    setDirection(DIRECTION.LEFT);
                    break;
                case ACTION.RIGHT:
                    console.log("Go Right")
                    setDirection(DIRECTION.RIGHT);
                    break;
                default:
                    break;
            }
        }
        
        // update the game
        useInterval(gameTick, 1000);
        // useInterval(() => console.log(direction), 1000)
        const logics: UseGameLogic = {
            state: {snakeBody, foodPosition},
            onKeyDownHandler: eventHandler,

        }
        return logics
    }


export default useGameLogic;