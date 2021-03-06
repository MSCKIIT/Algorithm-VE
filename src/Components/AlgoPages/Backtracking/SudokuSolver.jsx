import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import {Container, Col, Card , Button , FormCheck, Row} from 'react-bootstrap'
import Board from "./Board";
import sudokuService, { EMPTY_GRID, EMPTY_START_GRID } from "./sudokuService";
import storageService from "./storageService";
import Generator from './sudokuGenerator';
import './style.css'
import celebration from '../../../Assets/celebration.gif'
import failure from '../../../Assets/failure.gif'
import Dropdown from 'react-bootstrap/Dropdown'

export default function SudokuSolver() {
  const [grid, setGrid] = useState(EMPTY_GRID);
  const [startGrid, setStartGrid] = useState(EMPTY_START_GRID);
  const [isGridDisabled, setIsGridDisabled] = useState(false);
  const [isShowProcessChecked, setIsShowProcessChecked] = useState(true);
  const [isSolved, setIsSolved] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [value,setValue]=useState('');
  const progressSpeed = 5;


  useEffect(() => {
    const storageBoard = Generator.generate();
    if (storageBoard) 
      setGrid(storageBoard);
  }, []);

  const handleValueChange = (e, id) => {
    const { value } = e.target;
    if ((value <= 9 && value > 0) || value === "") {
      const position = id.split(",");
      const newGrid = grid.map((arr) => arr.slice());
      if (value === "")
      { 
          newGrid[position[0]][position[1]] = 0;
          
      }
      else 
      {
        newGrid[position[0]][position[1]] = Number(value);
      }
        setGrid(newGrid);
      storageService.setBoard(newGrid);

    }
  };


  const showProgress = async (progress) => {
    setIsGridDisabled(true);
    for (const grid of progress) {
      setGrid(grid);
      await new Promise((resolve) => setTimeout(resolve, progressSpeed));
    }
    setIsSolved(true);
    setIsSolving(false);
  };

  const handleSolveButtonClicked = () => {
    setIsSolving(true);
    setIsSolved(false);
    setStartGrid(grid.map((arr) => arr.slice()));
    const progress = sudokuService.solve(grid);
    if (isShowProcessChecked) {
      showProgress(progress);
    } else {
      setIsGridDisabled(true);
      setGrid(progress[progress.length - 1]);
      setIsSolved(true);
      setIsSolving(false);
    }
  };

  const reset = () => {
    ReactDOM.render("",document.getElementById('temp'));
    setGrid(EMPTY_GRID);
    setStartGrid(EMPTY_START_GRID);
    setIsGridDisabled(false);
    setIsSolved(false);
    storageService.setBoard(EMPTY_GRID());
  };

  const undo = () => {
    ReactDOM.render("",document.getElementById('temp'));
    setIsGridDisabled(false);
    setGrid(startGrid);
    setStartGrid(EMPTY_START_GRID);
    setIsSolved(false);
  };

  function result(chk){
    if(chk==true)
    {
      return(
      <div>
        <img src={celebration} alt="" />
        <p style={{color:"green"}}> <b style={{fontWeight:"bolder"}}>Congratulations!!!</b> You did it.</p>
      </div>
      );
    }
    else{
      return(
        <div>
          <img src={failure} alt="" />
          <p style={{color:"red"}}> <b style={{fontWeight:"bolder"}}>You went wrong somewhere!!!</b>
          <br />
          Click on Undo to try again.
        </p>
        </div>
        );  
    }
  
  }

  const checksol = () => {
    let check=sudokuService.checkans(grid);
    ReactDOM.render(result(check),document.getElementById('temp'));
    setIsSolved(true);
  }

  const handleSelect=(e)=>{
    console.log(e);
    setValue(e)
  }

  return (
    <Row>
      <Col sm={8} className="mb-5" style={{backgroundColor:"#bbecf0" , padding:"30px", borderRadius:"2%"}}>
        <Board  startGrid={startGrid} grid={grid} onChange={handleValueChange}  disabled={isGridDisabled} />
      </Col>
      <Col lg className="mb-5">
        <Row >
          <div id="temp"></div>
        </Row>
        <Row>
        <Card className="shadow" id="crd">
          <Card.Body>
          {/* <Dropdown disabled={isSolving} className="bttn" style={{ border:"none"}}>
            <Dropdown.Toggle variant="success" id="dropdown-basic" title="Difficulty"
              onSelect={() => {
                handleSelect();
                reset();
                var randomGrid = Generator.generate(value);
                setGrid(randomGrid);
                storageService.setBoard(randomGrid);
              }}>Dropdown Button </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item eventKey="0">Easy</Dropdown.Item>
              <Dropdown.Item eventKey="1">Medium</Dropdown.Item>
              <Dropdown.Item eventKey="2">Difficult</Dropdown.Item>
              <Dropdown.Item eventKey="3">Inhuman</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}

            <Button disabled={isSolving} variant="dark" className="bttn" style={{ border:"none"}}
              onClick={() => {
                reset();
                var randomGrid = Generator.generate();
                setGrid(randomGrid);
                storageService.setBoard(randomGrid);
              }}>
              Generate Board</Button>
            <br />
            {isSolving ? (<Button className="mt-3 bttn"  style={{backgroundColor:"red" , borderRadius:"100%" ,border:"none"}} onClick={() => window.location.reload()}>
                Stop
              </Button>
            ):(
              <Button className="mt-3 bttn" style={{backgroundColor:"green" , border:"none"}} onClick={handleSolveButtonClicked}>Solve</Button>
            )}
            <FormCheck  className="mt-3"  type="checkbox" label="Show solving process"  disabled={isSolving}
              checked={isShowProcessChecked}  onChange={(e) => setIsShowProcessChecked(e.target.checked)}/>
            <Button className="mt-3 mr-1 bttn" style={{backgroundColor:"red" , border:"none"}}  disabled={isSolving}  onClick={reset}>Clear</Button>
            <Button className="mt-3 ml-1 bttn" style={{border:"none"}}  disabled={!isSolved}  onClick={undo}>Undo</Button>
            <Button className="mt-3 mr-1 bttn" style={{backgroundColor:"green" , border:"none"}} disabled={isSolving}  onClick={checksol}>Submit</Button>
          </Card.Body>
        </Card>
        </Row>
      </Col>
    </Row>
  );
}