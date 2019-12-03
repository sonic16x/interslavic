function createPairMatcher(expected1: string, expected2: string) {
  return function isPair(a: string, b: string): boolean {
    return (
      (a === expected1 && b === expected2) ||
      (a === expected2 && b === expected1)
    );
  };
}

const isAO = createPairMatcher('å', 'o');

function difference(chr1: string, chr2: string): number {
  if (chr1 === chr2) {
    return 0;
  }

  if (isAO(chr1, chr2)) {
    return 0.5;
  }

  const base1 = chr1.normalize('NFD')[0];
  const base2 = chr2.normalize('NFD')[0];

  if (base1 === base2) {
    return 0.5;
  }

  return 1;
}

export function levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) {
        return b.length;
    }
    if (b.length === 0) {
        return a.length;
    }

    const matrix = [];

    // increment along the first column of each row
    let i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            const delta = difference(b.charAt(i - 1), a.charAt(j - 1));
            if (delta === 0) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + delta, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
}
