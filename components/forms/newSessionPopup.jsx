import React, { useState } from "react";
import { useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import axios2 from "../../lib/axios";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputBox from "./inputBox";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Textarea from "./textarea";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewSessionPopup = () => {
  const [sendingForm, setSendingForm] = useState(false);
  const [recipient, setRecipient] = useState([]);
  const [title, setTitle] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState([]);
  const [open, setOpen] = useState(false);
  const [resSubmit, setResSubmit] = useState([]);

  /* Attendees of the meeting  */
  useEffect(() => {
    axios2
      .get("http://localhost:8000/api/v1/cartable/init")
      .then((res) => setPeople(res.data.data.users))
      .catch((error) => {
        if (error.response.status != 409) throw error;
      });
  }, []);
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState([]);
  const [place, setPlace] = useState("");
  const [agenda, setAgenda] = useState("");
  const [duration, setDuration] = useState("60");
  const [sendSMS, setSendSMS] = useState(false);
  const p2e = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
  const notify = () => toast.success("جلسه با موفقیت ثبت شد");

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) => {
          return person.full.includes(query.toLowerCase());
        });

  /* Send Button */
  function onSubmit(e) {
    e.preventDefault();
    setSendingForm(true);
    var object = {};
    var hasError = false;
    if (recipient == "") {
      object["recipient"] = "حاضرین جلسه الزامی است";
      hasError = true;
    }

    if (title == "") {
      object["title"] = "عنوان جلسه الزامی است";
      hasError = true;
    }

    if (!date) {
      object["date"] = "تاریخ جلسه الزامی است";
      hasError = true;
    }

    if (hasError) {
      setErrors(object);
      setSendingForm(false);
      return;
    }

    axios2
      .post("http://localhost:8000/api/v1/calendar/add", {
        title,
        timestamp: String(date.unix),
        place,
        agenda,
        send_sms: sendSMS,
        duration: duration,
        attends: strimer(recipient),
      })
      .then((res) => {
        setOpen(true);
        setResSubmit(res.status);
      })
      .catch((err) => {
        setSendingForm(false);
      });
    notify();
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }
  function strimer(data) {
    let tdata = String(data.map((dd) => dd.uuid));
    tdata = tdata.replace("[", "");
    return tdata.replace("]", "");
  }

  return (
    <div>
      <ToastContainer position="bottom-left" />

      <Popup
        trigger={
          <button className="w-48 ml-4 mt-1 text-[#22AA5B] bg-white border border-[#22AA5B] hover:bg-[#22AA5B] hover:text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
            + جلسه جدید
          </button>
        }
        modal
        nested
      >
        {(close) => (
          <div className="max-w-md rounded-lg bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
            <form autoComplete="off" onSubmit={(e) => onSubmit(e)}>
              <p className="font-medium mb-6 text-center">جلسه جدید</p>
              <div className="relative mb-6" data-te-input-wrapper-init>
                <InputBox
                  titleStyle="peer block min-h-[auto] w-full rounded border-1 border-[#E3E3E3] bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  name={title}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  error={errors["title"]}
                  type="text"
                  isrequired="true"
                />
                <label
                  htmlFor="exampleInput7"
                  className="pointer-events-none absolute top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-black transition-all duration-200 ease-out peer-focus:-translate-y-[1rem] peer-focus:-mr-4 peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                >
                  عنوان جلسه
                </label>
              </div>

              <div className="relative mb-6" data-te-input-wrapper-init>
                <InputBox
                  name={place}
                  value={place}
                  onChange={(event) => setPlace(event.target.value)}
                  error={errors["place"]}
                  isrequired="true"
                  type="text"
                  titleStyle="peer block min-h-[auto] w-full rounded border-1 border-[#22AA5B] bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="exampleInput8"
                />
                <label
                  htmlFor="exampleInput8"
                  className="pointer-events-none absolute top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-black transition-all duration-200 ease-out peer-focus:-translate-y-[1rem] peer-focus:-mr-4  peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                >
                  مکان جلسه
                </label>
              </div>
              <div className="relative mb-6" data-te-input-wrapper-init>
                <label
                  htmlFor="date"
                  className="pointer-events-none  absolute bottom-5 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-black transition-all duration-200 ease-out peer-focus:-translate-y-[1rem] peer-focus:-mr-4  peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                >
                  تاریخ جلسه
                </label>
                <DatePicker
                  className="peer block min-h-[auto] w-full rounded border-1 border-[#E3E3E3] bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                  id="321"
                  format="YYYY/MM/DD HH:mm:ss"
                  value={date}
                  onChange={(date) => {
                    setDate(date);
                  }}
                  calendar={persian}
                  locale={persian_fa}
                  plugins={[<TimePicker key="01" position="bottom" />]}
                  calendarPosition="bottom-right"
                  inputClass={`appearance-none block w-full px-3 py-2 border ${
                    errors["date"] ? "border-red-300" : "border-gray-300"
                  }  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                  containerStyle={{
                    width: "100%",
                  }}
                />
                <p className="text-red-500 text-sm ">{errors["date"]}</p>
              </div>
              <div className="relative mb-6" data-te-input-wrapper-init>
                <InputBox
                  name={duration}
                  value={duration}
                  onChange={(event) => setDuration(p2e(event.target.value))}
                  error={errors["duration"]}
                  type="text"
                  isrequired="true"
                />
                <label className="bottom-5 -mr-4 absolute max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-black transition-all duration-200 ease-out peer-focus:-translate-y-[1rem] peer-focus:-mr-6 peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
                  مدت زمان جلسه (دقیقه)
                </label>
              </div>
              <div className="mt-1 rounded-md shadow-sm">
                <Autocomplete
                  multiple
                  id="tags-standard"
                  className="relative flex mb-2 items-stretch flex-grow focus-within:z-10"
                  options={filteredPeople}
                  noOptionsText="یافت نشد!"
                  value={recipient}
                  onChange={(event, newValue) => {
                    setRecipient(newValue);
                  }}
                  getOptionLabel={(person) => person.full}
                  renderInput={(params) => (
                    <TextField
                      className="appearance-none mb-5 block w-full px-3 py-2 border-gray-300 shadow-sm
                       placeholder-gray-400 focus:outline-none sm:text-sm"
                      {...params}
                      variant="standard"
                      placeholder="حاضرین جلسه ..."
                      onChange={(event) => setQuery(event.target.value)}
                    />
                  )}
                />
              </div>
              <div className="relative mb-3" data-te-input-wrapper-init>
                <Textarea
                  name={agenda}
                  value={agenda}
                  rows="5"
                  onChange={(event) => setAgenda(event.target.value)}
                  error={errors["agenda"]}
                  type="text"
                  isrequired="false"
                />
                <label className=" bottom-28 -mr-2 absolute max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-black transition-all duration-200 ease-out peer-focus:-translate-y-[1rem] peer-focus:-mr-6 peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary">
                  دستور جلسه
                </label>
              </div>
              <form action="/action_page.php" className="mt-2">
                <input
                  type="checkbox"
                  id="vehicle1"
                  name="vehicle1"
                  value="Bike"
                  className="border border-[#ABD1FF]"
                />
                <label className="text-sm font-sans mr-1" htmlFor="vehicle1">
                  اطلاع رسانی از طریق پیامک
                </label>
              </form>
              <div className="flex">
                <button className="w-60 mt-3 ml-4 text-white bg-[#22AA5B] border border-[#22AA5B] hover:bg-[#22AA5B] hover:text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
                  ثبت
                </button>
                <button
                  onClick={() => close()}
                  className="w-32 mt-3 text-[#22AA5B] border border-[#22AA5B] hover:bg-[#22AA5B] hover:text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        )}
      </Popup>
    </div>
  );
};

export default NewSessionPopup;
