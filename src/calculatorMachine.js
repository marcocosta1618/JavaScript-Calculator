import { createMachine, assign } from "xstate";
import { create, all } from "mathjs";
const math = create(all);

const calculatorMachine = createMachine(
  {
    id: "calculator",
    initial: "start",
    context: {
      display: "0",
      operand1: "0",
      operand2: "0",
      operation: ""
    },
    states: {
      start: {
        initial: "zero",
        states: {
          zero: {
            id: "zero",
            on: {
              NUMBER: {
                target: "#getOperand1",
                actions: "update_display"
              },
              OPERATOR: {
                target: "#getOperator",
                actions: ["store_operand1", "store_operator"]
              }
            },
            entry: "reset"
          },
          result: {
            id: "result",
            on: {
              NUMBER: {
                target: "#getOperand1",
                actions: ["clear_display", "update_display"]
              },
              OPERATOR: {
                target: "#getOperator",
                actions: ["store_operand1", "store_operator"]
              },
              PERCENT: {
                target: ".#result",
                actions: "percentage1"
              },
              EQUALS: {
                target: ".#result",
                actions: "repeat_last_operation"
              },
              CLEAR: "#zero"
            }
          }
        }
      },
      getOperand1: {
        id: "getOperand1",
        on: {
          NUMBER: {
            target: ".#getOperand1",
            actions: ["update_display"]
          },
          OPERATOR: {
            target: "getOperator",
            actions: ["store_operand1", "store_operator"]
          },
          PERCENT: {
            target: ".#getOperand1",
            actions: "percentage1"
          },
          CLEAR: "#zero"
        }
      },
      getOperator: {
        id: "getOperator",
        on: {
          OPERATOR: {
            target: ".#getOperator",
            actions: ["store_operator"]
          },
          NUMBER: {
            target: "getOperand2",
            actions: ["clear_display", "update_display"]
          },
          PERCENT: {
            target: ".#getOperator",
            actions: ["percentage1", "store_operand1"]
          },
          EQUALS: "#result",
          CLEAR: "#zero"
        }
      },
      getOperand2: {
        id: "getOperand2",
        on: {
          NUMBER: {
            target: ".#getOperand2",
            actions: ["update_display"]
          },
          OPERATOR: {
            target: "getOperator",
            actions: [
              "store_operand2",
              "display_result",
              "store_operand1",
              "clear_operator",
              "store_operator"
            ]
          },
          PERCENT: {
            target: ".#getOperand2",
            actions: ["store_operand2", "percentage2"]
          },
          EQUALS: {
            target: "#result",
            actions: ["store_operand2", "display_result"]
          },
          CLEAR: "#zero"
        }
      }
    }
  },
  {
    actions: {
      update_display: assign({
        display: (context, event) => handleDotsAndZeros(context, event)
      }),
      clear_display: assign({
        display: ""
      }),
      store_operand1: assign({
        operand1: (context) => context.display
      }),
      store_operator: assign({
        operation: (context, event) => handleOperators(context, event)
      }),
      store_operand2: assign({
        operand2: (context) => context.display
      }),
      clear_operator: assign({
        operation: ""
      }),
      percentage1: assign({
        display: (context) =>
          math.evaluate(
            context.display / 100
          )
      }),
      percentage2: assign({
        display: (context) =>
          math.evaluate(
            `${context.operand1 / 100} * ${context.operand2}`
          )
      }),
      display_result: assign({
        display: (context) =>
          math.evaluate(
            `${context.operand1} ${context.operation} ${context.operand2}`
          )
      }),
      repeat_last_operation: assign({
        display: (context) =>
          math.evaluate(
            `${context.display} ${context.operation} ${context.operand2}`
          )
      }),
      reset: assign({
        display: "0",
        operand1: "0",
        operand2: "0",
        operation: ""
      })
    }
  }
);

export default calculatorMachine;

// HELPER FUNCTIONS

// update_display action:
// 1. prevent multiple dots;
// 2. allows more than 1 leading zero only if first zero is followed by a dot ("."):
function handleDotsAndZeros(context, event) {
  return /^\./.test(context.display + event.payload)
    ? (context.display + event.payload).replace(/\./, "0.")  // add leading zero if user digits '.'
    : /\./.test(context.display + event.payload)             // (if number is float);
      ? (context.display + event.payload)
        .replace(/(?<=(\d+(\.)+\d*))\./g, "")  // keep first dot only AND
        .replace(/^0+/, "0")                   // allow only one leading zero 
      : (context.display + event.payload).replace(/^0+/, "") || 0   // allow only one leading zero 
}                                                                   // (if number is integer)

// store_operator action:
// if minus is pressed:
// 1. if no operator is stored use store minus;
// 2. if stored operator is +, -, *, /, append minus so that operand2 become a negative number;
// 3. if a minus is already appended, remove it so that operand2 become a positive number.  
function handleOperators(context, event) {
  if (event.payload !== "-") {
    return context.operation = event.payload
  } else if (event.payload === "-") {
    if (context.operation.length === 0) { 
      return context.operation = event.payload }
    if (context.operation.length === 1) { 
      return context.operation = context.operation + event.payload
    }
    if (context.operation.length === 2) {
      return context.operation = context.operation[0] 
    }
  }
}