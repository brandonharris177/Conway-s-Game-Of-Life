import React, {useState, useEffect} from 'react';
import produce from 'immer';

function App() {
  const [color, setColor] = useState("black");
  const [cellBackground, setCellBackground] = useState("white");
  const [speed, setSpeed] = useState(1);
  const [ngen, setNgen] = useState(0)
  const [generation, setGeneration] = useState(0)
  const [running, setRunning] = useState(false)
  const gridSize = 25;
  const cellSize = 30;

  const [grid, setGrid] = useState(Array.from({length: gridSize}).map(() => Array.from({length: gridSize}).fill(0)))

  const neighborsArray = [[0, 1], [0, -1], [1, -1], [-1, 1], [1, 1], [-1, -1], [1, 0], [-1, 0]]  

  function toggle() {
    setRunning(!running);
  }

  function nGeneration() {
    let count = generation+1
    while (count < ngen) {
      setGrid((oldGrid) => {
        return produce(oldGrid, newGrid => {
          for (let row = 0; row < gridSize; row++) {
            for (let column = 0; column < gridSize; column++){
              let neighbors = 0;
              neighborsArray.forEach(neighbor => {
                const xValue = row + neighbor[0]
                const yValue = column + neighbor[1]
                if (xValue >= 0 && xValue < gridSize && yValue >= 0 && yValue < gridSize) {
                  neighbors += oldGrid[xValue][yValue]
                }
              })
              if (neighbors < 2) {
                newGrid[row][column] = 0
              }  
              else if (neighbors > 3) {
                  newGrid[row][column] = 0
                }
              else if (oldGrid[row][column] === 0 && neighbors === 3) {
                  newGrid[row][column] = 1
              }
            }
          }
        })
      })
      count += 1
    }
    setGeneration(count)
  }

  function reset() {
    setGeneration(0);
    setGrid(Array.from({length: gridSize}).map(() => Array.from({length: gridSize}).fill(0)))
  }

  useEffect(() => {
    setGrid((oldGrid) => {
      return produce(oldGrid, newGrid => {
        for (let row = 0; row < gridSize; row++) {
          for (let column = 0; column < gridSize; column++){
            let neighbors = 0;
            neighborsArray.forEach(neighbor => {
              const xValue = row + neighbor[0]
              const yValue = column + neighbor[1]
              if (xValue >= 0 && xValue < gridSize && yValue >= 0 && yValue < gridSize) {
                neighbors += oldGrid[xValue][yValue]
              }
            })

            if (neighbors < 2) {
              newGrid[row][column] = 0
            }  
            else if (neighbors > 3) {
                newGrid[row][column] = 0
              }
            else if (oldGrid[row][column] === 0 && neighbors === 3) {
                newGrid[row][column] = 1
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
      <p>
      The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead, (or populated and unpopulated,
       respectively). 
       <br>
      </br>
       Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:
       <br>
      </br>
      Any live cell with fewer than two live neighbours dies, as if by underpopulation.
      <br>
      </br>
      Any live cell with two or three live neighbours lives on to the next generation.
      <br>
      </br>
      Any live cell with more than three live neighbours dies, as if by overpopulation.
      <br>
      </br>
      Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
      <br>
      </br>
      These rules, which compare the behavior of the automaton to real life, can be condensed into the following:

      Any live cell with two or three live neighbours survives.
      <br>
      </br>
      Any dead cell with three live neighbours becomes a live cell.
      <br>
      </br>
      All other live cells die in the next generation. Similarly, all other dead cells stay dead.
      </p>
      <form>
      <h1>Input options</h1>

      <label>
        Color:
        <input
          type="text"
          value={color}
          onChange={e => setColor(e.target.value)}
          />
      </label>

      <label>
        Background Color:
        <input
          type="text"
          value={cellBackground}
          onChange={e => setCellBackground(e.target.value)}
          />
      </label>

      <label>
        nth Generation:
        <input
          type="number"
          value={ngen}
          onChange={e => setNgen(e.target.value)}
          />
      </label>

      <label>
        Speed per Generation in seconds:
        <input
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
        reset();
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
              const newGrid = produce(grid, newGrid => {
                newGrid[ri][ci] = grid[ri][ci] ? 0 : 1;
              });
              setGrid(newGrid);
            }}
            style={{
              width: cellSize, 
              height: cellSize, 
              backgroundColor: grid[ri][ci] ? `${color}` : `${cellBackground}`, 
              border: "solid 1px black"
            }} />)
        )}
      </div>
    </div>
  );
}

export default App;
