import { Position } from '../../Game/gameLogic'

export const SEGMENT_SIZE = 10;

interface DrawArgs {
    ctx: CanvasRenderingContext2D;
    snakeBody: Position[];
    foodPosition?: Position;
}


export const draw = ({ctx, snakeBody, foodPosition}: DrawArgs) => {
    if (foodPosition) {    
        ctx.fillStyle = 'rgb(0, 200, 0)';
        ctx.fillRect(foodPosition?.x, foodPosition.y, SEGMENT_SIZE, SEGMENT_SIZE);
    }

    ctx.fillStyle = 'rgb(200, 0, 0)';
    snakeBody.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, SEGMENT_SIZE, SEGMENT_SIZE);
    })
}
