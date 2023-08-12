import { Link } from "react-router-dom";

const InfoBox = (props) => {
  return (
    <div className={props.className}>
      <h3 className="plain-text-heading">{props.title}</h3>

      {props.link ? (
        <Link to={props.path} className="bold-figure" id={props.id}>
          {props.content}
        </Link>
      ) : (
        <p className="bold-figure" id={props.id}>
          {props.content}
        </p>
      )}
    </div>
  );
};

export default InfoBox;
