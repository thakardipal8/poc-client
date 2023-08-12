const InfoInput = (props) => {
  return (
    <div className={props.className}>
      <label className="plain-text-heading" htmlFor={props.id}>
        {props.title}
      </label>
      <input
        type={props.type}
        id={props.id}
        defaultValue={props.value}
        placeholder={props.value}
        className="text-input"
        onChange={props.onChange}
      />
    </div>
  );
};

export default InfoInput;
