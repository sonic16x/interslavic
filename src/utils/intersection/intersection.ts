export function intersection(a, b) {
    return a.filter((x) => b.some((y) => x == y))
}
