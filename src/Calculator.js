import calculatorMachine from "./calculatorMachine.js";
import { useMachine } from "@xstate/react";
import buttons from "./buttons.js";
import ButtonElement from "./ButtonElement.js";
import './style/Calculator.css';

export default function Calculator() {
  // finite state machine (calculatorMachine) handles app state:
  const [state, send] = useMachine(calculatorMachine);

  // send events to state machine on click (update state):
  function onClick(button) {
    switch (button.char) {
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
        send([{ type: button.type.toUpperCase(), payload: button.payload ? button.payload : button.char }]);
    }
  }

  return (
    <>
      <h2>JavaScript Calculator</h2>
      <div className="Calculator">
        <div id="display">{state.context.display}</div>
        <div className="keyboard-grid">
          {buttons.map((button) => {
            return (
              <ButtonElement
                id={button.id}
                key={button.id}
                char={button.char}         // displayed character
                keyboard={button.key}      // keyboard shortcut
                className={button.type}    // number or operator
                onClick={(e) => onClick(button)}
              >
              </ButtonElement>
            )
          })}
        </div>
      </div>
    </>
  );
}