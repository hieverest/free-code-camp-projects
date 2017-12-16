import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';




 // Below is two stateless UI components
/**
 * 
 * @param {any} {
 *   buttonClass, - define the class of button element to set the style in Bootstrap
 *   keyName,     - diplay the key name on the button
 *   handleClick  - listen to the click event
 * } 
 * @returns 
 */
function Button({
  buttonClass,
  keyName,
  handleClick
}) {
  return (<button className={buttonClass} onClick={handleClick}>{keyName}</button>)
}

/**
 * Screen will have two rows of display;
 * First row displays the calculation history;
 * 
 * @param {any} {
 *   firstRow, - display the calculation history
 *   secondRow - display the result
 * } 
 * @returns 
 */
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
      operator: "",
      opPressed: false,
      firstRow: 0,
      secondRow: 0
    };

    // Store the calculating history, until '='is pressed.
    // history is only for the first row displaying.
    this.history = []; 

    // Store the number flow, like if we want a 12, we would press key 1 and 2 respectively;
    // The numbers would be stored in this array until a math symbol +-*/ is pressed.
    this.numKeys = [];
    // this.operators = [];
    // this.numbers = [];

    // cal array is used for the calculation;
    // cal will be updated in the calculation process;
    // The length of cal won't be longer than 6,
    // please check the function plusMinusMultiDivide()
    // for the logic reason of this.
    this.cal = [];

    // result of every time calculation    
    this.result = 0;

    // The key get pressed;
    this.key = null;

    // Store the result of last calculation.
    this.prevResult = 0;
  }
  /**
   * All clear function;
   * 
   * @memberof App
   */
  allClear() {
    this.history = [];
    this.numKeys = [];
    this.cal = [];
    this.result = 0;
    this.prevResult = 0;

    this.display();
  }
  /**
   * Clear the entry, only for numbers entry;
   * 
   * @memberof App
   */
  clearEntry() {
    this.numKeys = [];
    this.display();
  }

  /**
   * Check the input key
   * 
   * @param {number | string} key
   * @return {void}
   */
  pressKey(key) {
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

    /**
     * Handle input of number
     * 
     * @param {number|string} key
     * @return {void}
     */
  handleNum(key) {
    // If 
    if(this.cal.length === 1) {
      this.allClear()
    }

    // Check if the is '.' or number;
    if (key === '.') {
      // Check if '.' is the first input;
      // Or if '.' existed before, then will ignore this '.' input;
      if (this.numKeys.length === 0) {
        this.numKeys = [0, '.'];
      } else if (this.numKeys.indexOf(key) === -1 ) {
        this.numKeys.push(key);
      }
    } else {
      this.numKeys.push(key);
    }
    
    this.prevResult = key;
    this.display(key);

  }
  /**
   * Handle input of math symbol "+ - * / ="
   * 
   * @param {any} key 
   * @memberof App
   */
  handleOperator(key) {
    let numKeys = this.numKeys,
      cal = [...this.cal],
      history = [...this.history],
      result;

    // If have input a number before, then push the number into history and
    // cal, and clear the numKeys;
    if (numKeys.length > 0) {
      history.push(numKeys.join(''));
      cal.push(numKeys.join(''));
      this.numKeys = [];
    }

    // If no number input before, we add 0 as the number to be the first
    // number in cal;
    if (cal.length === 0) {
      cal = [0, key];
      history = cal;
      result = 0;
    // If cal has a number, and '=' is pressed, then result is the number
    } else if (cal.length === 1 && key === '=') {
      result = cal[cal.length - 1];
      // Otherwise, we call plusMinusMultiDivide() to calculate;
    } else {
      [cal, history, result] = this.plusMinusMultiDivide(cal, history, key);
    }


    this.cal = cal;
    this.history = history;
    this.result = result;
    this.display(key);
  }

  /**
   * This function is the core calculation logic of this app.
   * It will decide the calculation prority if we have a chain
   * calculation. e.g. 1 + 2 * 3, it will calculate 2 * 3 first.
   * 
   * Also this function would consider the situation that we may
   * have a typo of the math symbol, and make a change of it. 
   * e.g. 1 + 2 * , but actually we want to input 1 + 2 +. I covered
   * this situation in this function.
   * 
   * @param {number[]} cal 
   * @param {number[]} history 
   * @param {string} key 
   * @returns {[number[], number[], number]} 
   */
  plusMinusMultiDivide(cal, history, key) {
      let result;

      // If last element in cal is a math symbol, then override it with the new symbol
      if (cal[cal.length - 1] === '+' || cal[cal.length - 1] === '-' || cal[cal.length - 1] === '*' || cal[cal.length - 1] === '/') {
        cal.pop();
        history.pop();
      }
      // When we start new calculation by using the previous result, we clear the previous history.
      else if (cal.length === 1) {
        history = cal.slice();
      }
      history.push(key);
      cal.push(key);

      // When cal.length is 4, means cal is e.g. [1 + 3 *]
      if (cal.length === 4) {
        // If key is + or -, means we don't have priority in this symbol, 
        // so we can firstly calculate the first two numbers;
        if (key === '+' || key === '-') {
          result = this.calculation(cal);
          cal = [result, key];
          this.prevResult = result;
        } else if (key === '=') {
          result = this.calculation(cal);
          cal = [result] // Put result as the first element in cal array, 
          // in case we will use it as the first number to make next round calculation;
          this.prevResult = result;
        } else {
          result = this.prevResult;
        }
      }
      // When cal.length == 6, e.g. [ 1 + 2 * 3 * ];
      // We will calculate 2 * 3 first, and update cal -> [1 + 6 *],
      else if (cal.length === 6) {
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

  /**
   * Calculate the first 3 elements in the cal parameter;
   * 
   * @param {number[]} cal 
   * @returns 
   * @memberof App
   */
  calculation(cal) {
    let result;
    switch (cal[1]) {
      case '+':
        result = parseFloat(cal[0]) + parseFloat(cal[2]);
        break;
      case '-':
        result = parseFloat(cal[0]) - parseFloat(cal[2]);
        break;
      case '*':
        result = parseFloat(cal[0]) * parseFloat(cal[2]);
        break;
      case '/':
        result = parseFloat(cal[0]) / parseFloat(cal[2]);
        break;
      default:
        break;
    }

    return result;

  }

  /**
   * Display function
   * 
   * @param {number|string} key 
   * @memberof App
   */
  display(key) {
    console.log('this.Key', this.key);
    console.log('numKeys', this.numKeys);
    console.log('Cal', this.cal);
    console.log('History', this.history);
    console.log('result', this.result);
    console.log('---------');

    let firstRow = this.history.join('') ? this.history.join('') : 0,
      secondRow = this.numKeys.join('') ? this.numKeys.join('') : 0;

    if (key === '+' || key === '-' || key === '*' || key === '/' || key === '=') {
      secondRow = this.result;
    }


    this.setState(prevState => ({
      firstRow,
      secondRow
    }))

  }



  render() {
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


