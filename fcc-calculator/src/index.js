import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Button({
  buttonClass,
  keyName,
  handleClick
}) {
  return (

    <button className={buttonClass} onClick={handleClick}>{keyName}</button>

  )
}

function Screen({
  firstRow,
  secondRow
}) {
  return (
    <div className="screen">
      <div className="screen-first-row" >{firstRow}</div>
      <div className="screen-second-row" >{secondRow}</div>
    </div>
  )
}

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      number: [],
      operator: "",
      curNum: 0,
      opPressed: false,
      firstRow: 0,
      secondRow: 0
    };


    this.history = []; // 
    this.numKeys = [];
    this.operators = [];
    this.numbers = [];
    this.cal = [];
    this.result = 0;
    this.key = null;
    this.prevResult = 0;
  }

  allClear = () => {
    this.history = [];
    this.numKeys = [];
    this.cal = [];

    this.result = 0;
    this.prevResult = 0;

    this.display();

  }

  clearEntry = () => {
    this.numKeys = [];
    this.display();
  }

  pressKey = (key) => {
    this.key = key;
    switch (typeof key) {
      case 'number':
        this.handleNum(key);
        break;
      case 'string':
        if (key === 'AC') {
          this.allClear();
          break;
        } else if (key === '.') {
          this.handleNum(key);
          break;
        } else if(key === 'CE') {
          this.clearEntry();
          break;
        }
        this.handleOperator(key);
        break;
      default:
        break;
    }


  }

  handleNum = (key) => {
    if(this.cal.length === 1) {
      this.allClear()
    }

    if (key === '.') {
      if (this.numKeys.length === 0) {
        this.numKeys = [0, '.'];
      } else if (this.numKeys.indexOf(key) !== -1 ) {
        this.numKeys.push(key);
      }
    } else {
      this.numKeys.push(key);
    }
    
    this.prevResult = key;
    this.display();

  }

  handleOperator = (key) => {
    let numKeys = this.numKeys,
      cal = [...this.cal],
      history = [...this.history],
      result;


    if (numKeys.length > 0) {
      history.push(numKeys.join(''));
      cal.push(numKeys.join(''));
      this.numKeys = [];
    }

    if (cal.length === 0) {
      cal = [0, key];
      history = cal;
      result = 0;
    } else if (cal.length === 1 && key === '=') {
      result = cal[cal.length - 1];
    } else {
      [cal, history, result] = this.plusMinusMultiDivide(cal, history, key);
    }


    this.cal = cal;
    this.history = history;
    this.result = result;
    this.display(key);
  }


  plusMinusMultiDivide = (cal, history, key) => {
    let result;

    if (cal[cal.length - 1] === '+' || cal[cal.length - 1] === '-' || cal[cal.length - 1] === '*' || cal[cal.length - 1] === '/') {
      cal.pop();
      history.pop();
    }

    history.push(key);
    cal.push(key);

    if (cal.length === 4) {
      if (key === '+' || key === '-') {
        result = this.calculation(cal);
        cal = [result, key];
        this.prevResult = result;

      } else if (key === '=') {
        result = this.calculation(cal);
        cal = [result]
        this.prevResult = result;
      } else {
        result = this.prevResult;
      }
    } else if (cal.length === 6) {
      if (key === '=') {
        let re = this.calculation(cal.slice(2))
        let tempCal = cal.slice(0, 2);
        tempCal.push(re);
        result = this.calculation(tempCal);
        cal = [result];
        this.prevResult = result;
      } else if (key === '+' || key === '-') {
        let re = this.calculation(cal.slice(2))
        let tempCal = cal.slice(0, 2);
        tempCal.push(re);
        result = this.calculation(tempCal);
        cal = [result, key];
        this.prevResult = result;
      } else if (key === '*' || key === '/') {
        let re = this.calculation(cal.slice(2))
        let tempCal = cal.slice(0, 2);
        cal = [...tempCal, re, key]
        result = this.prevResult;
      }
    }

    return [cal, history, result]
  }

  calculation = (exp) => {
    let result;
    switch (exp[1]) {
      case '+':
        result = parseFloat(exp[0]) + parseFloat(exp[2]);
        break;
      case '-':
        result = parseFloat(exp[0]) - parseFloat(exp[2]);
        break;
      case '*':
        result = parseFloat(exp[0]) * parseFloat(exp[2]);
        break;
      case '/':
        result = parseFloat(exp[0]) / parseFloat(exp[2]);
        break;
      default:
        break;
    }

    return result;

  }

  display = (key) => {
    // console.log('thisKey', this.key);
    // console.log('numKeys', this.numKeys);
    // console.log('Cal', this.cal);
    // console.log('History', this.history);
    // console.log('result', this.result);
    // console.log('---------');
    let firstRow = this.history.join('') ? this.history.join('') : 0,
      secondRow = this.numKeys.join('') ? this.numKeys.join('') : 0;

    if (key === '+' || key === '-' || key === '*' || key === '/') {
      secondRow = this.result;

    } else if (key === '=') {
      this.history = [this.result];
      secondRow = this.result;
    }


    this.setState(prevState => ({
      firstRow,
      secondRow
    }))

  }










  render() {
    let number = this.state.number.slice();
    let curNum = this.state.curNum;

    const firstRow = this.state.firstRow,
      secondRow = this.state.secondRow;

    console.log(firstRow, secondRow);

    return (
      <div className="shell">
        <Screen
          firstRow={firstRow}
          secondRow={secondRow}
        />
        <div className="keys-row">
          <Button buttonClass={"btn btn-danger"} keyName={"AC"} handleClick={() => this.pressKey('AC')} />
          <Button buttonClass={"btn btn-danger"} keyName={"CE"} handleClick={() => this.pressKey("CE")} />
          <Button buttonClass={"btn btn-default"} keyName={"÷"} handleClick={() => this.pressKey('/')} />
          <Button buttonClass={"btn btn-default"} keyName={"×"} handleClick={() => this.pressKey('*')} />
        </div>
        <div className="keys-row">
          <Button buttonClass={"btn btn-default"} keyName={"7"} handleClick={() => this.pressKey(7)} />
          <Button buttonClass={"btn btn-default"} keyName={"8"} handleClick={() => this.pressKey(8)} />
          <Button buttonClass={"btn btn-default"} keyName={"9"} handleClick={() => this.pressKey(9)} />
          <Button buttonClass={"btn btn-default"} keyName={"-"} handleClick={() => this.pressKey('-')} />
        </div>
        <div className="keys-row">
          <Button buttonClass={"btn btn-default"} keyName={"4"} handleClick={() => this.pressKey(4)} />
          <Button buttonClass={"btn btn-default"} keyName={"5"} handleClick={() => this.pressKey(5)} />
          <Button buttonClass={"btn btn-default"} keyName={"6"} handleClick={() => this.pressKey(6)} />
          <Button buttonClass={"btn btn-default"} keyName={"+"} handleClick={() => this.pressKey('+')} />
        </div>
        <div className="last-row-1">
          <Button buttonClass={"btn btn-default"} keyName={"1"} handleClick={() => this.pressKey(1)} />
          <Button buttonClass={"btn btn-default"} keyName={"2"} handleClick={() => this.pressKey(2)} />
          <Button buttonClass={"btn btn-default"} keyName={"3"} handleClick={() => this.pressKey(3)} />
        </div>
        <div className="last-row-2">
          <Button buttonClass={"btn btn-default key-0"} keyName={"0"} handleClick={() => this.pressKey(0)} />
          <Button buttonClass={"btn btn-default"} keyName={"."} handleClick={() => this.pressKey('.')} />
        </div>
        <Button buttonClass={"btn btn-primary key-equal"} keyName={"="} handleClick={() => this.pressKey('=')} />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('real-shell')
)


