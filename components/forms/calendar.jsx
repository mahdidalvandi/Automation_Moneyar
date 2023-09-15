import React, { useEffect, useState } from "react";
import moment from "moment-jalaali";
import axios from "axios";
import axios2 from "../../lib/axios";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Button, ThemeProvider, Tooltip } from "@mui/material";

const PersianWeeklyCalendar = () => {
  const [currentDate, setCurrentDate] = React.useState(moment());
  const renderDaysOfWeek = () => {
    const daysOfWeek = moment.weekdays(true);
    // Get array of weekdays in Persian
    return daysOfWeek.map((day) => (
      <div className="mt-1 border-t border-r" key={day}>
        {day}
      </div>
    ));
  };

  let weekday = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ][new Date().getDay()];
  const [enDay, setEnDay] = useState(weekday);
  const [todayNum, setTodayNum] = useState(0);
  const [todayRange, setTodayRange] = useState(0);
  const [firstDayOfMonth, setFirstDay] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(1402);
  const [selectedMonth, setSelectedMonth] = useState(moment().format("jM"));
  const [events, setEvents] = useState([]);
  const [numDay, setNumDay] = useState(0);
  const [thisWeek, setThisWeek] = useState(0);
  const [convertor, setConvertor] = useState([]);
  const [monthDays, setMonthDays] = useState(
    moment.jDaysInMonth(selectedYear, moment().format("jM") - 1)
  );

  const goToPrevWeek = () => {
    setThisWeek(thisWeek - 1);
    setCurrentDate(moment(currentDate).subtract(7, "days"));
  };

  const goToNextWeek = () => {
    setThisWeek(thisWeek + 1);
    setCurrentDate(moment(currentDate).add(7, "days"));
  };

  useEffect(() => {
    if (enDay == "saturday") {
      setNumDay(0);
      setTodayNum(0);
      setTodayRange(7);
    } else if (enDay == "sunday") {
      setNumDay(1);
      setTodayNum(-1);
      setTodayRange(6);
    } else if (enDay == "monday") {
      setNumDay(2);
      setTodayNum(-2);
      setTodayRange(5);
    } else if (enDay == "tuesday") {
      setNumDay(3);
      setTodayNum(-3);
      setTodayRange(4);
    } else if (enDay == "wednesday") {
      setNumDay(4);
      setTodayRange(3);
      setTodayNum(-4);
    } else if (enDay == "thursday") {
      setNumDay(5);
      setTodayNum(-5);
      setTodayRange(2);
    } else if (enDay == "friday") {
      setNumDay(6);
      setTodayNum(-6);
      setTodayRange(1);
    }
  });

  var i = thisWeek;
  var strthisWeek = i.toString();

  useEffect(() => {
    axios2
      .post("api/v1/dashboard/events", {
        week: strthisWeek,
      })
      .then((res) => {
        setEvents(res.data.data.event_calendar_model);
      });
  }, [thisWeek]);
  const Timeconv = (time) => {
    const dtFormat = new Intl.DateTimeFormat("fa", {
      timeStyle: "short",
      timeZone: "Asia/Tehran",
    });
    return dtFormat.format(new Date(time * 1000));
  };

  const WeekDatesByEvent = () => {
    const formattedDates = [];
    var i = todayNum;
    var x = todayRange;

    for (i; i < x; i++) {
      const date = moment(currentDate).add(i, "days");
      const timeS = moment(date).format("jMM jDD").replace(" ", "/");
      formattedDates.push(
        <>
          <div
            key={i}
            className={`${
              thisWeek == 0 && !i && "text-[#52a071] font-semibold"
            } flex text-center flex-col`}
          >
            {timeS}
            {thisWeek == 0 &&
              events?.map((item, n) => (
                <div className="hover:cursor-help" key={n}>
                  {item.day_of_week == i + numDay && (
                    <>
                      <Tooltip title={item?.title} placement="top">
                        <Button
                          className={`${
                            item.day_of_week == 1 ||
                            item.day_of_week == 3 ||
                            item.day_of_week == 5
                              ? "bg-[#7ACC9D] text-black"
                              : item.day_of_week == 0 ||
                                item.day_of_week == 2 ||
                                item.day_of_week == 4 ||
                                item.day_of_week == 6
                              ? "bg-[#82B9FF]"
                              : ""
                          } flex-col hover:cursor-help m-1 hover:items-center justify-center mt-2
                          text-black  font-medium rounded-md text-sm`}
                        >
                          {Timeconv(item?.timestamp)}
                        </Button>
                      </Tooltip>
                    </>
                  )}
                </div>
              ))}
          </div>
        </>
      );
    }
    return formattedDates;
  };

  return (
    <div className="">
      <div className="flex px-1 mt-4 w-full cursor-pointer h-1/3">
        <div className="w-1/2 cursor-auto">
          <ArrowForwardIosIcon fontSize="small" />
          <button onClick={goToPrevWeek} className="text-[#666666] ">
            هفته قبل
          </button>
        </div>
        <div className="w-1/2 cursor-auto pl-3 text-left">
          <button onClick={goToNextWeek} className="text-[#666666] text-left">
            هفته بعد
          </button>
          <ArrowBackIosIcon fontSize="small" />
        </div>
      </div>
      <div className="flex text-[#666666] font-medium mt-4  ml-3 text-center border-[#F0F0F0] leading-6lg:flex-auto">
        <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-px">
          {renderDaysOfWeek()}
        </div>
      </div>
      <div className="flex ml-3 border-[#F0F0F0] font-medium border-r leading-6 text-[#666666] mt-2 lg:flex-auto">
        <div className="hidden border-l border-[#F0F0F0] w-full h-60 lg:grid lg:grid-cols-7 pl-2 lg:grid-rows-5 lg:gap-px">
          {WeekDatesByEvent()}
        </div>
      </div>
    </div>
  );
};

export default PersianWeeklyCalendar;
