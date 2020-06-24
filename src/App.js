import React, {useState, useEffect} from 'react';
import produce from 'immer';


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
  const [color, setColor] = useState("black");
  const [speed, setSpeed] = useState(1);
  const [ngen, setNgen] = useState(0)
  const [generation, setGeneration] = useState(0)
  const [running, setRunning] = useState(false)
  const gridSize = 25;
  const cellSize = 30;

  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < gridSize; i++) {
      rows.push(Array.from(Array(gridSize), () => 0));
    }
    return rows
  })

  function toggle() {
    setRunning(!running);
  }

  function nGeneration() {
    let count = generation+1
    while (count < ngen) {
      setGrid((g) => {
        return produce(g, gridCopy => {
          for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++){
              let neighbors = 0;
              operations.forEach(([x, y]) => {
                const k = i + x
                const l = j + y
                if (k >= 0 && k < gridSize && l >= 0 && l < gridSize) {
                  neighbors += g[k][l]
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
      count += 1
    }
    setGeneration(count)
  }

  const reset = () => {
    console.log(gridSize)
    setGeneration(0);
    const rows = [];
    for (let i = 0; i < gridSize; i++) {
      rows.push(Array.from(Array(gridSize), () => 0));
    }
    return rows
  }

  useEffect(() => {
    setGrid((g) => {
      return produce(g, gridCopy => {
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++){
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const k = i + x
              const l = j + y
              if (k >= 0 && k < gridSize && l >= 0 && l < gridSize) {
                neighbors += g[k][l]
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
  }, [generation])

  useEffect(() => {
    let interval = null;
    if (running) {
      interval = setInterval(() => {
        setGeneration(generation => generation + 1);
      }, speed * 1000)
    } else if (!running && generation !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running, generation]);

  return (
    <div className="App">
      <form>
      <h1>Input options</h1>

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
        nth Generation:
        <input
          name="nGen"
          type="number"
          value={ngen}
          onChange={e => setNgen(e.target.value)}
          />
      </label>

      <label>
        Speed per Generation in seconds:
        <input
          name="Speed"
          type="number"
          value={speed}
          onChange={e => setSpeed(e.target.value)}
          />
      </label>

    </form>
      <button 
      onClick={toggle}>
          {running ? 'Stop' : 'Start'}
      </button>

      <button 
      onClick={nGeneration}>
          Skip to generation
      </button>

      <button 
      onClick={() => {
        setGrid(reset);
      }}
      >
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
