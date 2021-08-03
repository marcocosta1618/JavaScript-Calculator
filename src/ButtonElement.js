import { useState, useEffect, useRef } from 'react';
import { PropTypes } from 'prop-types';

function ButtonElement({ id, className, char, keyboard, onClick }) {

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  })

  let buttonEl = useRef(null);

  function handleKeydown(e) {
    if (e.key === keyboard) {
      buttonEl.current.click();
    }
  }

  const [isClicked, setIsClicked ] = useState(false);   // state variable add/remove css animation class

  function trigAnim() {
    const reset = () => {
      setIsClicked(false);
    }
    setIsClicked(true);
    setTimeout(reset, 150);
  }

  return (
    <button
      id={id}
      key={id}
      className={`${className} ${isClicked ? 'clicked' : ''}`}
      char={char}
      onClick={() => {
        onClick();
        trigAnim();
      }}
      ref={buttonEl}
    >
      {char}
    </button>
  )
}

ButtonElement.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string, 
  char: PropTypes.string,
  keyboard: PropTypes.string, 
  onClick: PropTypes.func
}

export default ButtonElement