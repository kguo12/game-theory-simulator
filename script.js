document.getElementById("runBtn").addEventListener("click", () => {
  alert("Button clicked");
  const table = document.getElementById("payoffTable");
  const matrix = [];

  for (let i = 1; i < table.rows.length; i++) {
    const row = [];
    for (let j = 1; j < table.rows[i].cells.length; j++) {
      const text = table.rows[i].cells[j].innerText.trim();
      row.push(text);
    }
    matrix.push(row);
  }

  // Convert text to numbers
  const payoffMatrix = rawMatrix.map(row =>
    row.map(parsePayoff)
  );

  const result = findOneDominatedStrategy(payoffMatrix);

  console.log("Dominance result:", result);
  if (result) {
    animateElimination(result);
    document.getElementById("output").innerText =
      `${result.type} ${result.index} eliminated`;
  } else {
    document.getElementById("output").innerText =
      "No strictly dominated strategies found.";
  }

  document.getElementById("output").innerText =
    JSON.stringify(payoffMatrix, null, 2);
});

// Parse user inputted payoff matrix into numbers
function parsePayoff(cellText) {
  const match = cellText.match(/\((-?\d+),\s*(-?\d+)\)/);

  if (!match) {
    throw new Error("Invalid payoff format: " + cellText);
  }

  return {
    p1: Number(match[1]),
    p2: Number(match[2])
  };
}


// Dominance Functions

function strictlyDominatesRow(i, k, matrix) {
  for (let j = 0; j < matrix[0].length; j++) {
    if (matrix[i][j].p1 <= matrix[k][j].p1) {
      return false;
    }
  }
  return true;
}

function strictlyDominatesCol(j, l, matrix) {
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i][j].p2 <= matrix[i][l].p2) {
      return false;
    }
  }
  return true;
}


// Iterated DSDS step (order of deletion is irrelevant)

function findPureDominatedRow(matrix) {
  const numRows = matrix.length;
  const numCols = matrix[0].length;

  for (let r = 0; r < numRows; r++) {
    for (let k = 0; k < numRows; k++) {
      if (k === r) continue;

      if (strictlyDominatesRow(k, r, matrix)) {
        return {
          type: "row",
          index: r,
          dominatedBy: k
        };
      }
    }
  }
  return null;
}

function findPureDominatedCol(matrix) {
  const numRows = matrix.length;
  const numCols = matrix[0].length;

  for (let c = 0; c < numCols; c++) {
    for (let l = 0; l < numCols; l++) {
      if (l === c) continue;

      if (strictlyDominatesCol(l, c, matrix)) {
        return {
          type: "col",
          index: c,
          dominatedBy: l
        };
      }
    }
  }
  return null;
}

function findOneDominatedStrategy(matrix) {
  return (
    findPureDominatedRow(matrix) ||
    findPureDominatedCol(matrix)
  );
}


// Animation of Deletion

function animateElimination(result) {
  const table = document.getElementById("payoffTable");

  if (result.type === "row") {
    const rowIndex = result.index + 1; // skip header row
    table.rows[rowIndex].classList.add("eliminated");
  }

  if (result.type === "col") {
    const colIndex = result.index + 1; // skip header column
    for (let i = 0; i < table.rows.length; i++) {
      table.rows[i].cells[colIndex].classList.add("eliminated");
    }
  }
}
