

// interface Rule {
//     gridSize: number;
//     threshold: number;
// }
// export function* RandomPositionOnGrid(rules: Rule[]) {
//     for(let i = 0; i < rules.length; i++) {
//         const { threshold, gridSize } = rules[i];
//         yield Math.floor(Math.random() * (threshold / gridSize)) * gridSize;
//     }
//     yield 0;
// }

import { Position } from "../Game/gameLogic";


interface Limitation {
    gridSize: number | undefined;
    threshold: number | undefined;
}

interface Rule {
    x : Limitation,
    y: Limitation
}

const gen = ({gridSize = 1, threshold = 1}: Limitation) => {
    return Math.floor(Math.random() * (threshold / gridSize)) * gridSize;
}

export function* RandomPositionOnGrid(rule: Rule):Generator<Position, void, unknown> {
    // const newPosition = ():Position => new Position({x: gen(rule.x), y: gen(rule.y)})
    // yield new Position({x: gen(rule.x), y: gen(rule.y)})
    while(true) {
        yield new Position({x: gen(rule.x), y: gen(rule.y)})
    }
}