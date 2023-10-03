import React from "react";

const CalendarDayRender = (props) => {
  const { p2e, day_string, day, firstDayOfMonth, newFridayNum } = props;
  return (
    <div>
      <span
        className={`${
          p2e(new Date().toLocaleDateString("fa-IR")) == day_string
            ? "text-[#2E8BFF] font-semibold text-base"
            : "bg-white"
        } bg-white py-2 px-3 h-40 hover:bg-gray-50`}
      >
        {day + 1 - (firstDayOfMonth == -1 ? 0 : firstDayOfMonth)}
      </span>
    </div>
  );
};

export default CalendarDayRender;
