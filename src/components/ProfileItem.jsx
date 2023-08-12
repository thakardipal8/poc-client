const ProfileItem = ({
  heading,
  error,
  icon,
  edit,
  alt,
  content,
  onChange,
}) => {
  return (
    <div className="profile-item">
      <img src={icon} alt={alt} />
      <div className="profile-item-text">
        <h3 className="plain-text-heading">
          {heading}
          {error ? <p className="error-message">{error}</p> : ""}
        </h3>

        {edit === false ? (
          <p className="para-text">{content}</p>
        ) : (
          <input
            type="text"
            placeholder={content}
            value={content}
            className="text-input"
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileItem;
