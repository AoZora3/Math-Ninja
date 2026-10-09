import React, { useState } from "react";
import BoardSlide from "./BoardSlider.jsx";
import "../../../Assets/Styles/GettingStarted.css";
import Temp from "../../../Assets/Images/TempImage.png";

const SLIDES = [
    {
        imageSrc: Temp,
        imageAlt: "Logus",
        title: "Welcome!",
        description: "Welcome to MathNinja Where you Slice • Solve • Master.",
        accentColor: "  #f76a24",
    },
    {
        imageSrc: Temp,
        imageAlt: "Stages",
        title: "Select a Stage",
        description: "Each Stage represent different function. Progress through Algebraic, Trigonometric, Logarithmic, and Exponential stages — each one throws new curves at you.",
        accentColor: " #f7b824",
    },
    {
      imageSrc: Temp,
      imageAlt: "Edit",
      title: "Edit or Add Preset Equation",
      description: "You can add or edit preset equations for you to use later.",
      accentColor:" #f7f024",
    },
    {
      imageSrc: Temp,
      imageAlt: "Hotbar",
      title: "Hotbar",
      description: "The preset equations that you save in the hotbar will be displayed at the bottom of the screen for you to use.",
      accentColor:" #71f724",
    },
    {
      imageSrc: Temp,
      imageAlt: "Adjust",
      title: "Adjust Equations",
      description: "You can change the equation before you fire so that you wont accidentally hit a bomb.",
      accentColor: " #24f760",
    },
    {
      imageSrc: Temp,
      imageAlt: "Objects",
      title: "Fruits and Bombs",
      description: "The fruits give you points, but watch out, the bomb will damage you and deduct your health.",
      accentColor:" #24f0f7",
    },
    {
      imageSrc: Temp,
      imageAlt: "Fire",
      title: "Fire the Equation",
      description: "Think before you fire! Look at the preview of your equation first before firing to avoid hitting a bomb.",
      accentColor:" #2455f7",
    },
    {
      imageSrc: Temp,
      imageAlt: "Life",
      title: "Health",
      description: "Be aware of your life. If your life reaches 0 you will automatically lose.",
      accentColor:" #242ff7",
    },
    {
      imageSrc: Temp,
      imageAlt: "Time",
      title: "Time",
      description: "You also need to be fast. Running out of time will also result in defeat.",
      accentColor: " #9824f7",
    },
    {
      imageSrc: Temp,
      imageAlt: "Combo",
      title: "Combo and Hitrate",
      description: "Hitting fruits consecutively will create a combo. Having a higher combo will give you a points multiplyer.",
      accentColor: " #d024f7",
    },
    {
      imageSrc: Temp,
      imageAlt: "Stars",
      title: "Stars",
      description: "Completing a stage will give you stars base on your performance. Each star represents: having more than 1 health, having at least 80% hit rate, and completing the stage within the designated time.",
      accentColor: " #f724e6",
    },
    {
      imageSrc: Temp,
      imageAlt: "GoodJob",
      title: "That is all!",
      description: "You've got the basics. Jump in, graph your first equation, and start slicing.",
      accentColor: " #f72424",
    }
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
