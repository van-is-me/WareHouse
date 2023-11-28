import React, { useEffect, useState } from "react";
import { FaMoneyBillAlt, FaRegStar, FaStar } from "react-icons/fa";

function Rating({ numberRating = 5, onRatingChange, readOnly = true }) {
  const [listRating, setListRating] = useState([]);
  const [emptyRating, setEmptyRating] = useState([]);
  useEffect(() => {
    let tmpList = [];
    for (let i = 1; i <= numberRating; i++) {
      tmpList.push(i);
    }
    setListRating(tmpList);

    let tmpList2 = [];
    if (5 - tmpList.length > 0) {
      for (let j = 1; j <= 5 - tmpList.length; j++) {
        tmpList2.push(j);
      }
    }
    setEmptyRating(tmpList2);
  }, [numberRating]);

  return (
    <div className="w-full">
      {readOnly == false ? (
        <div className="flex items-center">
          {listRating.map((item) => (
            <FaStar
              className="text-secondary text-[24px] mx-1 cursor-pointer"
              key={item}
              onClick={() => onRatingChange(item)}
            />
          ))}
          {emptyRating.map((item) => (
            <FaRegStar
              className="text-secondary text-[24px] mx-1 cursor-pointer"
              key={item}
              onClick={() => onRatingChange(item + listRating.length)}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center">
          {listRating.map((item) => (
            <FaStar
              className="text-secondary text-[24px] mx-1"
              key={item}
            />
          ))}
          {emptyRating.map((item) => (
            <FaRegStar
              className="text-secondary text-[24px] mx-1"
              key={item}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Rating;
