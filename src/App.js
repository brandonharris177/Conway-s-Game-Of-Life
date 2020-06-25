import React, {useState, useEffect} from 'react';
import produce from 'immer';
import styled from 'styled-components';

function App() {
  const [color, setColor] = useState("black");
  const [cellBackground, setCellBackground] = useState("white");
  const [speed, setSpeed] = useState(1);
  const [ngen, setNgen] = useState(0)
  const [generation, setGeneration] = useState(0)
  const [running, setRunning] = useState(false)
  const gridSize = 25;
  const cellSize = 25;
  const font = "'VT323', monospace"
  const textColor = "white"
  const fontSize = 2.1

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

  const Heading = styled.h2`
  font-size: ${fontSize+.5}rem;
  font-family: ${font};
  color: ${textColor};
  `
  
  const Button = styled.button`
  font-size: 1.5rem;
  padding: 0.25em 1em;
  border-radius: 7%;
  font-family: ${font};
`;

  const UnorderdList = styled.ul`

  `;

  const ListItem = styled.li`
  font-family: ${font};
  font-size: 2rem;
  color: ${textColor}
  `;

  const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  `;

  const Paragraph = styled.p`
  font-family: ${font};
  font-size: 1.5rem;
  color: ${textColor};
  `;

  const inputStyle = {
    fontFamily: `${font}`,
    fontSize: `${fontSize}rem`,
    color: `${textColor}` 
  }

  return (
    <div className="App">
      <section className = "writing">
        <Paragraph>
        The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells, each of which is in one of two possible states, live or dead, (or populated and unpopulated,
        respectively). 
        <br/>
        Every cell interacts with its eight neighbours, which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:
        <br/>
        </Paragraph>
        <UnorderdList>
        <ListItem>Any live cell with fewer than two live neighbours dies, as if by underpopulation.</ListItem>
        <br/>
        <ListItem>Any live cell with two or three live neighbours lives on to the next generation.</ListItem>
        <br/>
        <ListItem>Any live cell with more than three live neighbours dies, as if by overpopulation.</ListItem>
        <br/>
        <ListItem>Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.</ListItem>
        <br/>
        </UnorderdList>
        <Paragraph>
        These rules, which compare the behavior of the automaton to real life, can be condensed into the following:
        </Paragraph>
        <UnorderdList>
        <ListItem>Any live cell with two or three live neighbours survives.</ListItem>
        <br/>
        <ListItem>Any dead cell with three live neighbours becomes a live cell.</ListItem>
        <br/>
        <ListItem>All other live cells die in the next generation. Similarly, all other dead cells stay dead.</ListItem>
        </UnorderdList>
        <br/>
        <Paragraph>
        For this game of life the cells outside of the grid are considered dead. You can use the controls to select the color of the live cells, the color of the dead cells, the speed of the generations, and skip to the generation you want to view. 
        </Paragraph>
      </section>
    
      <section className = "game">
        <form>
        <Heading>Input options</Heading>

        <label
          style={inputStyle}>
          Live Cell Color:
          <input
            type="text"
            value={color}
            onChange={e => setColor(e.target.value)}
            />
        </label>

        <br/>

        <label
          style={inputStyle}>
          Dead Cell Color: 
          <input
            type="text"
            value={cellBackground}
            onChange={e => setCellBackground(e.target.value)}
            />
        </label>

        <br/>

        <label
          style={inputStyle}>
          nth Generation:
          <input
            type="number"
            value={ngen}
            onChange={e => setNgen(e.target.value)}
            />
        </label>

        <br/>

        <label
          style={inputStyle}>
          Speed per Generation in seconds:
          <input
            type="number"
            value={speed}
            onChange={e => setSpeed(e.target.value)}
            />
        </label>

      </form>
      <ButtonContainer>
        <Button 
        onClick={toggle}>
            {running ? 'Stop' : 'Start'}
        </Button>

        <Button 
        onClick={nGeneration}>
            Skip to generation
        </Button>

        <Button 
        onClick={() => {
          reset();
        }}
        >
          Reset
        </Button>
      </ButtonContainer>

      <div
        style={inputStyle}>
          Generation: {generation}
      </div>

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
      </section>
    </div>
  );
}

export default App;
