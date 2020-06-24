import React, {useState, useEffect} from 'react';
import produce from 'immer';

// const gridSize = 10;
// const cellSize = 30;
// const color = 'blue'

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

function App() {

  const [gridSize, setGridSize] = React.useState(10);
  const [cellSize, setCellSize] = React.useState(30);
  const [color, setColor] = React.useState("blue");
  const [speed, setSpeed] = React.useState(1);

  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < gridSize; i++) {
      rows.push(Array.from(Array(gridSize), () => 0));
    }
    return rows
  })

  const [generation, setGeneration] = useState(0)

  const [running, setRunning] = useState(false)

  function toggle() {
    setRunning(!running);
  }

  function reset() {
    setGeneration(0);
    setRunning(false);
  }

  useEffect(() => {
    let interval = null;
    if (running) {
      // console.log("hit")
      setGrid((g) => {
        // console.log(g)
        return produce(g, gridCopy => {
          for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++){
              let neighbors = 0;
              operations.forEach(([x, y]) => {
                const k = i + x
                const l = j + y
                // console.log(k, l)
                if (k >= 0 && k < gridSize && l >= 0 && l < gridSize) {
                  // console.log(k, l)
                  neighbors += g[k][l]
                  // console.log(neighbors)
                }
              })

              if (neighbors < 2 || neighbors > 3) {
                gridCopy[i][j] = 0
              } else if (g[i][j] === 0 && neighbors === 3) {
                gridCopy[i][j] = 1
              }
            }
          }
        })
      })
      interval = setInterval(() => {
        setGeneration(generation => generation + 1);
      }, speed * 1000);
    } else if (!running && generation !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running, generation]);

  return (
    <div className="App">
      <form>
      <h1>Create Account</h1>

      <label>
        Grid Size:
        <input
          name="gridSize"
          type="number"
          value={gridSize}
          onChange={e => setGridSize(e.target.value)}
          required />
      </label>

      <label>
        Cell Size:
        <input
          name="cellSize"
          type="number"
          value={cellSize}
          onChange={e => setCellSize(e.target.value)}
          />
      </label>

      <label>
        Color:
        <input
          name="cellSize"
          type="text"
          value={color}
          onChange={e => setColor(e.target.value)}
          />
      </label>

      <label>
        Speed:
        <input
          name="Speed"
          type="number"
          value={speed}
          onChange={e => setSpeed(e.target.value)}
          />
      </label>

      <button>Submit</button>
    </form>
      <button onClick={toggle}>
          {running ? 'Pause' : 'Start'}
      </button>
      <button onClick={reset}>
          Reset
      </button>
      <div>Generation: {generation}</div>
      <div style ={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`
      }}>
        {grid.map((rows, ri) =>
          rows.map((col, ci) => 
            <div 
            key ={`${ri}x${ci}`} 
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[ri][ci] = grid[ri][ci] ? 0 : 1;
              });
              setGrid(newGrid);
            }}
            style={{
              width: cellSize, 
              height: cellSize, 
              backgroundColor: grid[ri][ci] ? `${color}` : undefined, 
              border: "solid 1px black"
            }} />)
        )}
      </div>
    </div>
  );
}

export default App;
