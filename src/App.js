import React, {useState, useEffect} from 'react';
import produce from 'immer';

const gridSize = 10;
const cellSize = 30;
const color = 'blue'

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < gridSize; i++) {
      rows.push(Array.from(Array(gridSize), () => 0));
    }
    return rows
  })

  // var generation = 0
  const [generation, setGeneration] = useState(0)

  // var start = false
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
      interval = setInterval(() => {
        setGeneration(generation => generation + 1);
      }, 1000);
    } else if (!running && generation !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running, generation]);

  return (
    <div className="App">
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
