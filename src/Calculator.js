import calculatorMachine from "./calculatorMachine.js";
import { useMachine } from "@xstate/react";
import { numbers, operators } from "./buttons.js";
import { useEffect } from "react";
import './style/Calculator.css';

export default function Calculator() {

  const [state, send] = useMachine(calculatorMachine);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [])

  function handleKeydown(e) {
    if (/\d|\./.test(e.key)) {
      let numPress = numbers.find(number => number.char === e.key).id;
      document.getElementById(numPress).click();
    } else if (/[%*+-/=]/.test(e.key)) {
      let opPress = operators.find(operator => operator.char === e.key).id;
      document.getElementById(opPress).click();
    } else if (e.key === 'c') {
      document.getElementById('clear').click();
    } else if (e.key === 'Enter') {
      document.getElementById('equals').click();
    }
  }

  return (
    <>
      <h2>JavaScript Calculator</h2>
      <div className="Calculator">
        <div id="display">{state.context.display}</div>
        <div className="keyboard-grid">
          {numbers.map((number) => {
            return (
              <button
                id={number.id}
                key={number.id}
                className={"numbers"}
                onClick={(e) => {
                  send([{ type: "NUMBER", payload: number.char }]);
                }}
              >
                {number.char}
              </button>
            );
          })}
          {operators.map((operator) => {
            return (
              <button
                id={operator.id}
                key={operator.id}
                className={"operators"}
                onClick={(e) => {
                  switch (operator.char) {
                    case "C":
                      send([{ type: "CLEAR" }]);
                      break;
                    case "=":
                      send([{ type: "EQUALS" }]);
                      break;
                    case "%":
                      send([{ type: "PERCENT" }]);
                      break;
                    default:
                      send([{ type: "OPERATOR", payload: operator.char }]);
                  }
                }}
              >
                {operator.char}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}