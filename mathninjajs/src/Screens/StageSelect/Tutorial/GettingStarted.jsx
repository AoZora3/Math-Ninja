import React, { useState } from "react";
import BoardSlide from "./BoardSlider.jsx";
import "../../../Assets/Styles/GettingStarted.css";
import Temp from "../../../Assets/Images/TempImage.png";


const SLIDES = [
    {
        imageSrc: Temp,
        imageAlt: "Logus",
        title: "Welcome!",
        description: "Welcome to MathNinja Where you Slice • Solve • Master",
        accentColor: "  #b8bb00",
    },
    {
        imageSrc: Temp,
        imageAlt: "Stages",
        title: "Stages",
        description: "Each Stage represent different function. Progress through Algebraic, Trigonometric, Logarithmic, and Exponential stages — each one throws new curves at you.",
        accentColor: "#dd55e2",
    },
    {
        imageSrc: Temp,
        imageAlt: "Edit",
        title: "Preset Equations",
        description: "Save your go-to equations as presets so you can fire them again instantly, no retyping needed.",
        accentColor: "#826ae9",
    },
    {
        imageSrc: Temp,
        imageAlt: "FruitSlice",
        title: "Slice The Fruits",
        description: "Slice the Fruits with the preset equations in the hotbar. Avoid slicing the Bombs",
        accentColor: "#E17055",
    },
    {
        imageSrc: Temp,
        imageAlt: "GoodJob",
        title: "That’s All! Start Playing.",
        description: "You've got the basics. Jump in, graph your first equation, and start slicing.",
        accentColor: "#10ff30",
    },
];


function GettingStarted({ onClose, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === SLIDES.length - 1;


  const handleNext = () => {
    if (isLastSlide) {
      handleFinish();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstSlide) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      console.log("Closed onboarding.");
    }
  };

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    } else {
      console.log("Onboarding finished!");
    }
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const activeSlide = SLIDES[currentIndex];

  return (
    <div className="getting-started_backdrop" onClick={handleClose}>
      <div
        className="getting-started"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="getting-started_close-btn"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>
      
        <BoardSlide
          imageSrc={activeSlide.imageSrc}
          imageAlt={activeSlide.imageAlt}
          title={activeSlide.title}
          description={activeSlide.description}
          accentColor={activeSlide.accentColor}
        />

        <div className="getting-started_nav-row">
          <div className="getting-started_dots">
            {SLIDES.map((slide, index) => (
              <span
                key={index}
                className={
                  "getting-started_dot" +
                  (index === currentIndex ? " getting-started_dot--active" : "")
                }
                onClick={() => handleDotClick(index)}
              />
            ))}
          </div>

          <div className="getting-started_nav-buttons">
            <button
              className="getting-started_back-btn"
              onClick={handleBack}
              disabled={isFirstSlide}
            >
              Back
            </button>

            <button
              className="getting-started_next-btn"
              style={{ backgroundColor: activeSlide.accentColor }}
              onClick={handleNext}
            >
              {isLastSlide ? "Continue" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default GettingStarted;
