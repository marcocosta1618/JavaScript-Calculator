import calculatorMachine from "./calculatorMachine.js";
import { useMachine } from "@xstate/react";
import { numbers, operators } from "./buttons.js";
import './style/Calculator.css';

export default function Calculator() {
  const [state, send] = useMachine(calculatorMachine);

  return (
    <div className="App">
      <h3>JS Calculator</h3>
      <div id="display">{state.context.display}</div>
      <div className="keyboard">
        {numbers.map((number) => {
          return (
            <button
              id={number.id}
              key={number.id}
              onClick={(e) => {
                send([{ type: "NUMBER", payload: e.target.textContent }]);
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
              onClick={(e) => {
                switch (e.target.textContent) {
                  case "C":
                    send([{ type: "CLEAR" }]);
                    break;
                  case "=":
                    send([{ type: "EQUALS" }]);
                    break;
                  default:
                    send([{ type: "OPERATOR", payload: e.target.textContent }]);
                }
              }}
            >
              {operator.char}
            </button>
          );
        })}
      </div>
    </div>
  );
}


