

interface Rule {
    gridSize: number;
    threshold: number;
}
export function* RandomPositionOnGrid(rules: Rule[]) {
    for(let i = 0; i < rules.length; i++) {
        const { threshold, gridSize } = rules[i];
        yield Math.floor(Math.random() * (threshold / gridSize)) * gridSize;
    }
    yield 0;
}