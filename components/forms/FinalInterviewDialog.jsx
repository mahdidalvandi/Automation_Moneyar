import { Dialog } from "@headlessui/react";
import { useState } from "react";
import axios from "../../lib/axios";
import Textarea from "./textarea";
import InputBox from "./inputBox";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

export default function FinalInterviewDialog(props) {
  const [loadingData, setLoadingData] = useState(false);
  const [comment, setComment] = useState("");
  const [startDate, setStartDate] = useState();
  const [approved, setApproved] = useState(-1);
  const [contractDuration, setContractDuration] = useState("");
  const [interviewId, setInterviewId] = useState("");
  const [salary, setSalary] = useState();
  const [errors, setErrors] = useState([]);

  const hiringTypeMethods = [
    { id: "0", title: "رد شده" },
    { id: "1", title: "قبول" },
    { id: "2", title: "مشروط" },
    { id: "3", title: "عدم توافق پکیج" },
  ];
  const addCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");
  const onSubmit = async (event) => {
    event.preventDefault();
    var object = {};
    var hasError = false;

    if (approved == 1 || approved == 2) {
      if (!salary) {
        object["salary"] = "حقوق پایه الزامی است";
        hasError = true;
      }
      if (approved == -1) {
        object["approved"] = "تایید و یا عدم تایید الزامی است";
        hasError = true;
      }
      if (contractDuration == "") {
        object["contractDuration"] = "مدت قرارداد الزامی است";
        hasError = true;
      }
      if (!startDate) {
        object["startDate"] = "تاریخ شروع به کار الزامی است";
        hasError = true;
      }
    }

    if (!comment) {
      object["comment"] = "نظر مدیریت الزامی است";
      hasError = true;
    }

    if (hasError) {
      setErrors(object);
      return;
    }
    axios
      .post("/api/v1/interview/comment", {
        startDate: startDate ? String(startDate.unix) : "",
        approved: approved,
        contractDuration: contractDuration,
        salary: salary,
        comment: comment,
        interview_uuid: props.interviewId,
        applicant_uuid: props.applicantId,
        type: 2,
      })
      .then((res) => {
        props.setDialog(false);
      })
      .catch((err) => {
        object["master"] = err.response.data.message;
        setErrors(object);
      });
  };

  return (
    <Dialog
      open={props.dialogOpen}
      onClose={() => props.setDialog(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 h-500">
        <div className="flex min-h-full items-center justify-center">
          <Dialog.Panel className="max-w-full rounded bg-white p-5">
            <Dialog.Title>
              <div className="max-w-8xl mx-auto px-2 sm:px-2 md:px-4">
                <div className="bg-white">
                  <div className="-ml-3 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <div className="mt-2">
                      <h2 className="text-lg leading-6 font-large text-gray-900">
                        نتیجه نهایی مصاحبه
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Title>
            <div style={{ width: "90vh" }}>
              <div className="grid grid-cols-4 gap-4 mt-3">
                <div className="sm:col-span-2">
                  <p
                    htmlFor="cover-photo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    وضعیت استخدام در شرکت
                  </p>
                  <fieldset className="mt-4">
                    <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-1">
                      {hiringTypeMethods.map((hiringTypeMethods) => (
                        <div
                          key={`genderStatusTypeMethods${hiringTypeMethods.id}`}
                          className="flex items-center"
                        >
                          <label
                            htmlFor={`genderStatusTypeMethods${hiringTypeMethods.id}`}
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            <input
                              id={hiringTypeMethods.id}
                              name="GenderStatusMethod"
                              type="radio"
                              className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                              onChange={(e) => {
                                setApproved(e.target.id);
                              }}
                            />
                            {hiringTypeMethods.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                  {errors["approved"] ? (
                    <span className="text-sm text-red-500">
                      {errors["approved"]}
                    </span>
                  ) : null}
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium  text-gray-700 mb-1"
                  >
                    تاریخ شروع به کار *
                  </label>
                  <DatePicker
                    id="321"
                    format="YYYY/MM/DD"
                    value={startDate}
                    onChange={(date) => {
                      setStartDate(date);
                    }}
                    calendar={persian}
                    locale={persian_fa}
                    placeholder="انتخاب کنید.."
                    calendarPosition="bottom-right"
                    inputClass={`appearance-none block w-full px-3 py-2 border ${
                      errors["startDate"] ? "border-red-300" : "border-gray-300"
                    }  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                    containerStyle={{
                      width: "100%",
                    }}
                  />
                  <p className="text-red-500 text-sm ">{errors["startDate"]}</p>
                </div>
                <div className="sm:col-span-2">
                  <InputBox
                    title="مدت قرارداد *"
                    name={contractDuration}
                    value={contractDuration}
                    error={errors["contractDuration"]}
                    onChange={(event) =>
                      setContractDuration(event.target.value)
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <InputBox
                    title="حقوق پایه(ریال) *"
                    name={salary}
                    error={errors["salary"]}
                    value={salary}
                    onChange={(event) =>
                      setSalary(addCommas(removeNonNumeric(event.target.value)))
                    }
                  />
                </div>
                <div className="sm:col-span-4">
                  <Textarea
                    title="نظر مدیریت *"
                    name="Agenda"
                    error={errors["comment"]}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                    defaultValue={comment}
                    rows="5"
                    type="text"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={onSubmit}
              className="bg-[#43a047] hover:bg-[#2d592f] ml-2 text-white px-2 py-2 mt-5 rounded-md text-sm inline-block"
            >
              ثبت
            </button>
            <button
              onClick={() => props.setDialog(false)}
              className="bg-[#eb5757] hover:bg-[#843737] text-white px-2 py-2 mt-5 rounded-md text-sm inline-block"
            >
              بستن
            </button>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
