export function transposeMatrix<T>(a: T[][]): T[][] {
    // Calculate the width and height of the Array
    const w = a.length || 0;
    const h = a[0].length || 0;

    // In case it is a zero matrix, no transpose routine needed.
    if (h === 0 || w === 0) {
        return [];
    }

    const t = [];

    // Loop through every item in the outer array (height)
    for (let i = 0; i < h; i++) {

        // Insert a new row (array)
        t[i] = [];

        // Loop through every item per item in outer array (width)
        for (let j = 0; j < w; j++) {

            // Save transposed data.
            t[i][j] = a[j][i];
        }
    }

    return t;
}
