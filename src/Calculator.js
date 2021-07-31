import calculatorMachine from "./calculatorMachine.js";
import { useMachine } from "@xstate/react";
import { useRef, useState, useEffect } from "react";
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
  ////////////////////////////////////////////////////////

  // measure displayed number width and adjust font-size:
  const [displayFontSize, setDisplayFontSize] = useState('2rem');
  const style = { fontSize: displayFontSize };
  const displayRef = useRef(null);
  const rem = useRef(2);
  useEffect(() => {
    let width = displayRef.current.scrollWidth;
    if (width > 224) {
      while (width > 224) {
        rem.current -= 0.035;
        width -= 5;
        if (rem.current < 0.8) { rem.current = 0.8 }
      }
    }
    else if (width < 224) {
      while (width < 224) {
        rem.current += 0.035;
        width += 5;
        if (rem.current > 2) { rem.current = 2 }
      }
    }
    setDisplayFontSize(`${rem.current}rem`);
  }, [state.context.display])
  ////////////////////////////////////////////////////////////////////////

  return (
    <>
      <h2>JavaScript Calculator</h2>
      <div className="Calculator">
        <div id="display" ><span ref={displayRef} style={style}>{state.context.display}</span></div>
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