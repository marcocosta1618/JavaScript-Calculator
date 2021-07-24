import calculatorMachine from "./calculatorMachine.js";
import { useMachine } from "@xstate/react";
import buttons from "./buttons.js";
import { useEffect } from "react";
import './style/Calculator.css';

export default function Calculator() {

  const [state, send] = useMachine(calculatorMachine);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [])

  function handleKeydown(e) {
    let buttonPress = "";
    if (/\d|\./.test(e.key)) {              // number pressed
      buttonPress = buttons.find(button => button.char === e.key).id;
      document.getElementById(buttonPress).click();
    } else if (/[%*+-/=]/.test(e.key)) {    // operator pressed
      buttonPress = buttons.find(button => button.char === e.key).id;
      document.getElementById(buttonPress).click();
    } else if (e.key === 'c') {             // clear pressed
      document.getElementById('clear').click();
    } else if (e.key === 'Enter') {         // enter pressed
      document.getElementById('equals').click();
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
              <button
                id={button.id}
                key={button.id}
                className={button.type}
                onClick={(e) => {
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
                        send([{ type: button.type.toUpperCase(), payload: button.char }]);
                  }
                }}
                >
                  {button.char}
                </button>
            )
          })}
        </div>
      </div>
    </>
  );
}
