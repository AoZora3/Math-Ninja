import React from "react";
class BoardSlider extends React.Component {
  render() {
    const { imageSrc, imageAlt, title, description, accentColor } = this.props;

    return (
      <div className="BoardSlide">
        <h2 className="BoardSlide_title" style={{ color: accentColor }}>
          {title}
        </h2>
       
        <div className="BoardSlide_image-wrapper">
          <img
            className="BoardSlide_image"
            src={imageSrc}
            alt={imageAlt}
          />
        </div>

        <p className="BoardSlide_description">{description}</p>
      </div>
    );
  }
}

export default BoardSlider;
