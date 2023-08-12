import { getNextBonusAndCompReviewDate } from "../../functions/getNextBonusAndCompReviewDate";

const NextBonusAndCompWidget = () => {
  const nextReviewDate = getNextBonusAndCompReviewDate();

  return (
    <div>
      <h1 className="section-heading-overview">
        Bonus and Compensation Review
      </h1>
      <h2 className="para-text">{nextReviewDate}</h2>
      <hr />
      <p className="medium-figure">
        The next round of bonus payments and compensation reviews will take
        place on:
      </p>
      <p className="medium-figure">{nextReviewDate}</p>
    </div>
  );
};

export default NextBonusAndCompWidget;
