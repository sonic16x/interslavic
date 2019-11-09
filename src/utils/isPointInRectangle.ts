function isBetweenInclusively(min: number, x: number, max: number) {
    return min <= x && x <= max;
}

export function isPointInRectangle(x: number, y: number, rectangle: ClientRect): boolean {
    return isBetweenInclusively(rectangle.left, x, rectangle.right)
        && isBetweenInclusively(rectangle.top, y, rectangle.bottom);
}
