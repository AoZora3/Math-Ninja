import React, { useState } from "react";
import BoardSlide from "./BoardSlider.jsx";
import "../../../Assets/Styles/GettingStarted.css";
import EquControl from "../../../Assets/Images/EquationControl.png";
import GoodJob from "../../../Assets/Images/GoodJob.png";
import Hotbar from "../../../Assets/Images/Hotbar.png";
import Spawning from "../../../Assets/Images/Spawning.png";
import Stages from "../../../Assets/Images/Stages.png";
import Combo from "../../../Assets/Images/Combo.png";
import Hearts from "../../../Assets/Images/Hearts.png";
import Time from "../../../Assets/Images/Time.png";
import Stars from "../../../Assets/Images/Stars.png";
import Edit from "../../../Assets/Images/EditEquation.png";
import MathNinjaLogo from "../../../Assets/Images/MathNinjaLogo.png";
import Build from "../../../Assets/Images/BuildChallenge.png";
import Endless from "../../../Assets/Images/EndlessPresetType.png";

const SLIDES = [
    {
        imageSrc: MathNinjaLogo,
        imageAlt: "Logus",
        title: "Welcome!",
        description: "Welcome to MathNinja Where you Slice • Solve • Master.",
        accentColor: "  #f75524",
    },
    {
        imageSrc: Stages,
        imageAlt: "Stages",
        title: "Select a Stage",
        description: "Progress through algebraic, trigonometric, logarithmic, and exponential equations across three stages. Each stage will be unlocked after completing the previous stage. Completing all 3 stage will unlock the Endless Mode.",
        accentColor: " #f7b824",
    },
    {
        imageSrc: Build,
        imageAlt: "Build",
        title: "Build Challenge",
        description: "To enter a stage, you first have to build at least 4 preset equation with build challenge. In build Challenge, you have to match the target equation by using the choices provided and adjusting the A and B.",
        accentColor: " #f56a19",
    },
    {
      imageSrc: Edit,
      imageAlt: "Edit",
      title: "Edit or Add Preset Equation",
      description: "Preset equations for you to use later. You can edit the equations from build challenge to fit your play style. In endless mode, you have more freedom of adding and editng preset equation for more convenient time.",
      accentColor:" #f7f024",
    },
    {
      imageSrc: Hotbar,
      imageAlt: "Hotbar",
      title: "Hotbar",
      description: "The preset equations that you save in the hotbar will be displayed at the bottom of the screen for you to use.",
      accentColor:" #71f724",
    },
    {
      imageSrc: Spawning,
      imageAlt: "Objects",
      title: "Fruits and Bombs",
      description: "The fruits give you points, but watch out, the bomb will damage you and deduct your health.",
      accentColor:" #24f0f7",
    },
    {
      imageSrc: EquControl,
      imageAlt: "EquControl",
      title: "Fire the Equation",
      description: "Think before you fire! Look at the preview of your equation first before firing to avoid hitting a bomb. You can change the equation before you fire so that you wont accidentally hit a bomb.",
      accentColor:" #2455f7",
    },
    {
      imageSrc: Hearts,
      imageAlt: "Life",
      title: "Health",
      description: "Be aware of your life. If your life reaches 0 you will automatically lose.",
      accentColor:" #242ff7",
    },
    {
      imageSrc: Time,
      imageAlt: "Time",
      title: "Time",
      description: "You also need to be fast. Running out of time will also result in defeat.",
      accentColor: " #9824f7",
    },
    {
      imageSrc: Combo,
      imageAlt: "Combo",
      title: "Combo and Hitrate",
      description: "Hitting fruits consecutively will create a combo. Having a higher combo will give you a points multiplyer.",
      accentColor: " #d024f7",
    },
    {
      imageSrc: Stars,
      imageAlt: "Stars",
      title: "Stars",
      description: "Completing a stage will give you stars base on your performance. Each star represents: having more than 1 health, having at least 80% hit rate, and completing the stage within the designated time.",
      accentColor: " #f724e6",
    },
    {
      imageSrc: Endless,
      imageAlt: "Endless",
      title: "Endless Mode",
      description: "The Endless mode uses a bit different mechanic compared to other stages. The mode utilizes all equation types from other stages. Hitting a fruit increases the time remaining while hitting a bomb decreases the time remaining.",
      accentColor: " #f724e6",
    },
    {
      imageSrc: GoodJob,
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
