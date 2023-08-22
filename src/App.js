import './index.css'
import { useState, useRef } from "react";

export default function App() {
  const [position, setPosition] = useState({
    btn1: 0,
    btn2: 20,
    btn3: 40,
    btn4: 60,
    btn5: 80,
    btn6: 250,
    btn7: 270,
    btn8: 290,
    btn9: 310,
    btn10: 330,
  });
  const sliderRef = useRef(null);
  const BTN_WIDTH = 20;
  const isMousePressedRef = useRef(false);
  const [prevPosition, setPrevPosition] = useState(null);
  let sliderDirection = "none"; // Default value

  const calculareShiftLeft = (btnId) => {
    if (btnId === "btn1") return 0;

    return (btnId - 1) * BTN_WIDTH;
  };

  const calculareShiftRight = (btnId, allButtonsObj) => {
    const btnsLength = Object.keys(allButtonsObj).length;
    return (btnsLength - btnId + 1) * BTN_WIDTH;
  };

  const handleBtnMove = (e) => {
    // console.log(e.target.id);
    const currentBtn = e.target.id;
    const currentBtnId = currentBtn.split("").pop();
    // shiftLeft is a value that is changing for each following btn because we do not want the
    // btns to go out of the parent borders

    const shiftLeft = calculareShiftLeft(currentBtnId);
    const shiftRight = calculareShiftRight(currentBtnId, position);

    if (isMousePressedRef.current) {
      const sliderBounds = sliderRef.current.getBoundingClientRect();
      const newPosition = e.clientX - 10 - sliderBounds.left;
      const newPositionClamped = Math.min(
        Math.max(newPosition, shiftLeft),
        sliderBounds.width - shiftRight
      );


      const updatePositions = (
        currentBtn,
        allBtnsObj,
        currentPosition
      ) => {
        const array = Object.keys(allBtnsObj);
        const updatedPosition = { ...allBtnsObj };
        // console.log("updatePositions array", array);
        // Determine slider direction based on currentPosition and prevPosition

        if (prevPosition !== null) {
          if (newPositionClamped > prevPosition) {
            sliderDirection = "right";
          } else if (newPositionClamped < prevPosition) {
            sliderDirection = "left";
          }
        }
        setPrevPosition(currentPosition);
        for (let i = 0; i < array.length; i++) {
          console.log(position[array[i]]);
          let prevBtnPosition = i > 0 ? updatedPosition[array[i - 1]] : null;
          let currentBtnPosition = updatedPosition[array[i]];
          let nextBtnPosition = updatedPosition[array[i + 1]];
          // console.log(
          //   "currentBtnPosition",
          //   currentBtnPosition,
          //   currentBtnPosition <= prevBtnPosition + 20,
          //   "prevBtnPosition:",
          //   prevBtnPosition
          // );
          if (array[i] === currentBtn) {
            updatedPosition[array[i]] = currentPosition;
            console.log("currentbTN MATCHED", updatedPosition);
          }
          console.log("sliderDirection:", sliderDirection);
          if (
            prevBtnPosition &&
            sliderDirection === "left" &&
            currentBtnPosition <= prevBtnPosition + BTN_WIDTH
          ) {
            updatedPosition[array[i - 1]] = currentBtnPosition - BTN_WIDTH;
            console.log("else if ", updatedPosition);
          }

          if (
            nextBtnPosition &&
            sliderDirection === "right" &&
            currentBtnPosition + BTN_WIDTH >= nextBtnPosition
          ) {
            console.log("last if", updatedPosition[array[i + 1]]);
            updatedPosition[array[i + 1]] = currentBtnPosition + BTN_WIDTH;
          }
        }
        return updatedPosition;
      };

      const updated = updatePositions(
        currentBtn,
        position,
        newPositionClamped
      );
      // console.log("updated", updated);
      setPosition(updated);
     
    }
  };

  const handleMouseDown = () => {
    isMousePressedRef.current = true;
  };

  const handleMouseUp = () => {
    isMousePressedRef.current = false;
  };

  const handleMouseMove = (e) => {
    handleBtnMove(e);
  };
  const handleMouseLeave = () => {
    isMousePressedRef.current = false;
  };

  return (
    <div className="App">
      <div className="slider" ref={sliderRef}>
        <div className="line"></div>
        {Object.keys(position).map((btnId, index) => (
          <button
            key={btnId}
            className={`slider__btn ${index < 5 ? 'red' : 'green'}`}
            id={btnId}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform: `translateX(${position[btnId]}px)` }}
          >
            {btnId.split("").pop()}
          </button>
        ))}
      </div>
    </div>
  );
}
