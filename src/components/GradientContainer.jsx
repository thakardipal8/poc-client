import gradientBackground from "../assets/background/gradient-background.webp";

const GradientContainer = (props) => {
  return (
    <div
      className="guest-content-right"
      style={{ backgroundImage: `url(${gradientBackground})` }}
    >
      <span className="logo-text">PayMate</span>
      <div className="right-flex-content">
        <h2 className="welcome-text">{props.text}</h2>
      </div>
    </div>
  );
};

export default GradientContainer;
