import { useEffect, useRef } from 'react';

export default function ButtonElement({ id, className, char, keyboard, onClick }) {

  let buttonEl = useRef(null);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  })

  function handleKeydown(e) {
    if (e.key === keyboard) {
      buttonEl.current.click();
    }
  }

  return (
    <button
      id={id}
      key={id}
      className={className}
      char={char}
      onClick={onClick}
      ref={buttonEl}
    >
      {char}
    </button>
  )
}