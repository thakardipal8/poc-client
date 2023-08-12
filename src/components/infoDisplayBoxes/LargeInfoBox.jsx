const LargeInfoBox = (props) => {
  return (
    <div className={props.className}>
      <div className="form-row">
        {props.edit ? (
          <div className="form-row">
            <label className="bold-figure" htmlFor="form-input">
              {props.label}
            </label>
            {props.inputType === "select" ? (
              <select
                className="text-input"
                onChange={props.onChange}
                id="form-input"
                value={props.content}
              >
                <option value={props.optionOne}>{props.optionOne}</option>
                <option value={props.optionTwo}>{props.optionTwo}</option>
                <option value={props.optionThree}>{props.optionThree}</option>
              </select>
            ) : (
              <input
                type={props.inputType}
                placeholder={props.content}
                className="admin-input"
                onChange={props.onChange}
                id="form-input"
              />
            )}
          </div>
        ) : (
          <p className="bold-figure">
            {props.text} <span className="bold-figure">{props.content}</span>
          </p>
        )}
      </div>
      <button className="yellow-link-button" onClick={props.onClick}>
        {props.buttonText}
      </button>
    </div>
  );
};

export default LargeInfoBox;
