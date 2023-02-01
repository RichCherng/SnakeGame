import React, { CanvasHTMLAttributes, CSSProperties, DetailedHTMLProps, forwardRef, RefObject, useEffect } from 'react'
import { isContext } from 'vm';
import { SEGMENT_SIZE } from './draw';


type CanvasProps = DetailedHTMLProps<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> & {
    draw: (context: CanvasRenderingContext2D) => void;
}

const style: CSSProperties = {
    width: "800",
    height: "400",
    border: "10px solid black",
    boxSizing: "border-box",
    borderImageSlice: "1",
    borderImageSource: "linear-gradient(to left, #743ad5, #d53a9d)",
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(({draw, ...props}, ref) => {
    
    useEffect(() => {
        if (!ref) {
            return;
        }

        const canvas = (ref as RefObject<HTMLCanvasElement>).current;
        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return ;
        }

        draw(context);
        return () => context.clearRect(0, 0, window.innerWidth, 400);
    }, [draw, ref])
    

    if (!ref) {
        return null;
    }

    return (
    <canvas
        width="300"
        height="150"
        style={style}
        ref={ref as any}
        {...props} />);
});

export { SEGMENT_SIZE, draw } from './draw'
export default Canvas;