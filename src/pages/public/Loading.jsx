import Header from "../../components/Header";

const Loading = () => {
  return (
    <div>
      <Header />
      <div className="loading-container">
        <h1 className="loading-text">Loading...</h1>
      </div>
    </div>
  );
};

export default Loading;
