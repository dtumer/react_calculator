import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Button extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick(this.props.value)}>{this.props.value}</button>
    );
  }
}

// represents the calculator
class Calculator extends React.Component {

  // renders an operator button
  renderOperator(value) {
    return <Button value={value} onClick={() => this.props.handleOperator(value)} />;
  }

  // renders a number button
  renderNumber(value) {
    return <Button value={value} onClick={() => this.props.handleNumber(value)} />;
  }

  // renders the clear formula button
  renderClear(value) {
    return <Button value={value} onClick={() => this.props.handleClear()} />;
  }

  // renders the equals button
  renderEquals(value) {
    return <Button value={value} onClick={() => this.props.handleEquals()} />;
  }

  render() {
    return (
      <div>
        <div className="calc-row">
          {this.renderOperator('')}
          {this.renderOperator('')}
          {this.renderOperator('%')}
          {this.renderClear('AC')}
        </div>
        <div className="calc-row">
          {this.renderNumber(7)}
          {this.renderNumber(8)}
          {this.renderNumber(9)}
          {this.renderOperator('/')}
        </div>
        <div className="calc-row">
          {this.renderNumber(4)}
          {this.renderNumber(5)}
          {this.renderNumber(6)}
          {this.renderOperator('*')}
        </div>
        <div className="calc-row">
          {this.renderNumber(1)}
          {this.renderNumber(2)}
          {this.renderNumber(3)}
          {this.renderOperator('-')}
        </div>
        <div className="calc-row">
          {this.renderNumber(0)}
          {this.renderNumber('.')}
          {this.renderEquals('=')}
          {this.renderOperator('+')}
        </div>
      </div>
    );
  }
}

// represents the application with a calculator on it
class CalculatorApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputHasSomething: false,
      formulaContainsOperator: false,
      input: '',
      formula: ''
    };
  }

  // handles when the user inputs a number
  handleNumber(value) {
    const formula = this.state.formula.slice();
    const input = this.state.input.slice();

    this.setState({
      inputHasNumber: true,
      formula: formula.concat(value),
      input: input.concat(value)
    });
  }

  // handles when the user inputs an operator
  handleOperator(operator) {
    const formula = this.state.formula.slice();

    // only add an operator if we've previously added a number
    if (this.state.inputHasNumber) {
      // if we haven't pushed an operator yet then push the operator to the formula
      // otherwise evaluate the formula
      if (!this.state.formulaContainsOperator) {
        this.setState({
          inputHasNumber: false,
          formulaContainsOperator: true,
          formula: formula.concat(operator)
        });
      } else {
        this.evaluateFormula(operator);
      }
    }
  }

  // handles clearing the formula
  handleClear() {
      this.setState({
        formula: ''
      });
  }

  // handles pressing equals
  handleEquals() {
    this.evaluateFormula();
  }

  // evaluates the fomula and puts the result back into formula
  evaluateFormula(operator) {
    const postfix = this.infixToPostfix(this.state.formula.slice());
    const result = this.evaluatePostfix(postfix);
    let formula = '' + result;
    let formulaContainsOperator = false;

    if (operator !== undefined) {
      formula += operator
      formulaContainsOperator = true;
    }

    this.setState({
      formula: formula,
      inputHasNumber: true,
      formulaContainsOperator: formulaContainsOperator
    });
  }

  // converts infix formula to postfix formula
  infixToPostfix(formula) {
    const formulaArr = formula.split("");
    let currentNumber = '';
    let postfix = [];
    let operatorStack = [];

    for (let i = 0; i < formulaArr.length; i++) {
      if (this.isNumber(formulaArr[i]) || this.isDecimal(formulaArr[i])) {
        currentNumber += formulaArr[i];
      } else if (this.isOperator(formulaArr[i])) {
        postfix.push(currentNumber);
        currentNumber = '';
        operatorStack.push(formulaArr[i]);
      }
    }

    // add any additional numbers to the postfix array
    postfix.push(currentNumber);

    while (operatorStack.length > 0) {
      postfix.push(operatorStack.pop());
    }

    return postfix;
  }

  // evaluates a postfix expression and outputs the result
  evaluatePostfix(postfix) {
    let stack = [];

    for (let i = 0; i < postfix.length; i++) {
      if (this.isNumber(postfix[i])) {
        stack.push(postfix[i]);
      } else if (this.isOperator(postfix[i])) {
        if (stack.length >= 2) {
          const value1 = stack.pop();
          const value2 = stack.pop();
          const result = this.evaluate(value2, postfix[i], value1);
          stack.push(result);
        } else {
          return '';
        }
      }
    }

    return stack.pop();
  }

  // checks if a value is a number
  isNumber(value) {
    return !isNaN(value);
  }

  // determines if a value is a decimal point
  isDecimal(value) {
    return value === '.';
  }

  // checks if a value is an operator
  isOperator(value) {
    return value === "/" || value === "*" || value === "%" || value === "+" || value === "-";
  }

  // evaluates given two operands and an operator
  evaluate(op1, operator, op2) {
    if (operator === '+') {
      return this.parseNumber(op1) + this.parseNumber(op2);
    } else if (operator === '-') {
      return this.parseNumber(op1) - this.parseNumber(op2);
    } else if (operator === '*') {
      return this.parseNumber(op1) * this.parseNumber(op2);
    } else if (operator === '/') {
      return this.parseNumber(op1) / this.parseNumber(op2);
    } else if (operator === '%') {
      return this.parseNumber(op1) % this.parseNumber(op2);
    }
  }

  // parses a number as an integer or float depending on it's type
  parseNumber(number) {
    if (number % 1 !== 0) {
      return parseFloat(number);
    } else {
      return parseInt(number);
    }
  }

  render() {
    const formula = this.state.formula;

    return (
      <div className="app">
        <div className="app-info">
          <div>{formula}</div>
        </div>
        <div>
          <Calculator 
            handleNumber={i => this.handleNumber(i)}
            handleOperator={i => this.handleOperator(i)}
            handleClear={() => this.handleClear()}
            handleEquals={() => this.handleEquals()}
          />
        </div>
      </div>
    );
  }
}

// ========================================================

ReactDOM.render(<CalculatorApp />, document.getElementById('root'));
