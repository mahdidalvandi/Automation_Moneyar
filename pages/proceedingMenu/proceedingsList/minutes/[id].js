// BY @A
import { useState, useEffect } from "react";

// NAVIGATION
import SidebarDesktop from "../../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../../components/layout/sidebarMobile";
import StickyHeader from "../../../../components/layout/stickyHeader";
import Link from "next/link";
import navigationList from "../../../../components/layout/navigationList";
import { useRouter } from "next/router";

// ELEMENTS
import InputBox from "../../../../components/forms/inputBox";
import Textarea from "../../../../components/forms/textarea";
import TextWithLabel from "../../../../components/forms/textWithLabel";
import { CloudDownloadIcon } from "@heroicons/react/solid";

import { Dialog } from "@headlessui/react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// CALENDAR
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import moment from "jalali-moment";
moment.locale("fa");

// LIB
import axios from "../../../../lib/axios";
import { useAuth } from "../../../../hooks/auth";
import fileDownload from "js-file-download";

export default function SubStoreCalendar(props) {
  const router = useRouter();
  const { id } = router.query;
  const [eventUUID, setEventUUID] = useState(id);
  const [event, setEvent] = useState([]);
  const [date, setDate] = useState("");
  const [date2, setDate2] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const [errors, setErrors] = useState([]);
  const { user, isLoading } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/",
  });

  useEffect((_) => {
    getEventInfo();
  }, []);

  function getEventInfo() {
    axios.get(`/api/v1/calendar/minutes/info/${eventUUID}`).then((res) => {
      setEvent(res.data.data);
      setDate(
        moment.unix(res.data.data.start_at).format("YYYY/MM/DD HH:mm:ss")
      );
      setDate2(moment.unix(res.data.data.end_at).format("YYYY/MM/DD HH:mm:ss"));
    });
  }
  function getBack() {
    window.location.href = `/proceedingMenu/proceedingsList`;
  }

  function onSubmit() {
    var object = {};
    axios
      .post("/api/v1/calendar/minutes/sign", {
        minute_uuid: event.uuid,
      })
      .then((res) => {
        object = {};
        setErrors(object);
        getEventInfo();
      })
      .catch((error) => {
        if (error.response != undefined) {
          object["master"] = error.response.data.message;
          setErrors(object);
        }
      });
  }
  function onCancelSubmit() {
    var object = {};
    axios
      .post("/api/v1/calendar/minutes/unsign", {
        minute_uuid: event.uuid,
      })
      .then((res) => {
        object = {};
        setErrors(object);
        getEventInfo();
      })
      .catch((error) => {
        if (error.response != undefined) {
          object["master"] = error.response.data.message;
          setErrors(object);
        }
      });
  }

  function checkIfAttend() {
    if (event.attends) {
      for (let i = 0; i < event.attends.length; i++) {
        if (event.attends[i].user_uuid == user.uuid) {
          return true;
        }
      }
    }
    return false;
  }

  function checkIfSigner() {
    if (event.attends) {
      for (let i = 0; i < event.attends.length; i++) {
        if (
          event.attends[i].user_uuid == user.uuid &&
          !event.attends[i].is_approved
        ) {
          return true;
        }
      }
    }
    return false;
  }

  const DownloadFile = (value, type, name) => {
    axios
      .get(`/api/v1/file/download`, {
        params: {
          file_uuid: value,
        },
        responseType: "blob",
      })
      .then((res) => {
        if (name) {
          fileDownload(res.data, name);
        } else {
          fileDownload(res.data, value + "." + type);
        }
      });
  };

  function getPrintLink() {
    axios
      .post("/api/v1/calendar/report", {
        event_uuid: eventUUID,
      })
      .then((res) => {
        window.open(res.data.data.report_url, "_blank", "noopener,noreferrer");
      });
    getEventInfo();
  }
  function CheckIfAccess(val) {
    if (currentUserRole && currentUserRole.indexOf(val) > -1) return true;
    return false;
  }
  return (
    <div>
      <SidebarMobile menu={navigationList()} loc={router.asPath} />
      <SidebarDesktop
        menu={navigationList()}
        loc={router.asPath}
        setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
        setActions={(props) => setCurrentUserActions(props.currentUserActions)}
        setIsHolding={(props) => {}}
        setSuperUser={(props) => {}}
      />
      <div className="md:pr-52 flex flex-col flex-1 mb-20">
        <StickyHeader />

        <div className="w-full mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-2 gap-6 py-10">
          <div className="flex justify-start col-span-2 gap-2 "></div>
          <div className="flex flex-col space-y-2">
            <p className="block text-sm font-medium  text-gray-700">
              عنوان جلسه
            </p>
            <p className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm">
              {event.title}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="block text-sm font-medium  text-gray-700">
              موضوع جلسه
            </p>
            <p className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm">
              {event.subject}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="block text-sm font-medium  text-gray-700">
              مکان جلسه
            </p>
            <p className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm">
              {event.place}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="block text-sm font-medium  text-gray-700">
              ساعت شروع جلسه
            </p>
            <p className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm">
              {event.start_at
                ? moment.unix(event.start_at).format("HH:mm:00 YYYY/MM/DD")
                : null}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="block text-sm font-medium  text-gray-700">
              ساعت پایان جلسه
            </p>
            <p className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm">
              {event.end_at
                ? moment.unix(event.end_at).format("HH:mm:00 YYYY/MM/DD")
                : null}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="block text-sm font-medium  text-gray-700">
              دبیر‌جلسه
            </p>
            <p className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm">
              {event.author_name}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="block text-sm font-medium  text-gray-700">
              دستور جلسه
            </p>
            <p
              className="text-justify appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              style={{ whiteSpace: "pre-line" }}
            >
              {event.agenda}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="block text-sm font-medium  text-gray-700">
              دستور جلسه آتی
            </p>
            <p
              className="text-justify appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              style={{ whiteSpace: "pre-line" }}
            >
              {event.upcoming_agenda}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="block text-sm font-medium  text-gray-700">شرح جلسه</p>
            <p
              className="text-justify appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              style={{ whiteSpace: "pre-line" }}
            >
              {event.session_desc}
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <p className="block text-sm font-medium  text-gray-700">
              توضیحات جلسه
            </p>
            <p
              className="text-justify appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
              style={{ whiteSpace: "pre-line" }}
            >
              {event.desc}
            </p>
          </div>

          <div className="col-span-2">
            <p className="block text-sm font-medium  text-gray-700">مصوبات</p>
            <div>
              <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2" style={{ width: "5%" }}>
                      ردیف
                    </th>
                    <th className="text-right" style={{ width: "50%" }}>
                      شرح اقدام
                    </th>
                    <th style={{ width: "15%" }}>اقدام کننده</th>
                    <th style={{ width: "15%" }}>نام مسئول</th>
                    <th style={{ width: "15%" }}>مهلت زمان بررسی</th>
                  </tr>
                </thead>
                <tbody>
                  {event.approvals &&
                    event.approvals.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>
                            <p className="text-sm w-full border-0 p-2">
                              {item.sharhEghdam}
                            </p>
                          </td>
                          <td>
                            <input
                              type="text"
                              disabled
                              value={item.eghdamKonande}
                              onChange={(e) =>
                                changeEghdamKonande(index, e.target.value)
                              }
                              className="text-sm text-center w-full border-0 p-2"
                              placeholder="اقدام کننده"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              disabled
                              value={item.nameMasol}
                              onChange={(e) =>
                                changeNameMasol(index, e.target.value)
                              }
                              className="text-sm text-center w-full border-0 p-2"
                              placeholder="نام مسئول"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              disabled
                              value={item.mohlatZamanBaresi}
                              onChange={(e) =>
                                changeMohlatZamanBaresi(index, e.target.value)
                              }
                              className="text-sm text-center w-full border-0 p-2"
                              placeholder="مهلت زمان بررسی"
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-span-2">
            <p className="block text-sm font-medium  text-gray-700">
              امضا کنندگان
            </p>
            <div>
              <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2" style={{ width: "5%" }}>
                      ردیف
                    </th>
                    <th className="text-right">نام و نام‌خانوادگی</th>
                    <th>امضا</th>
                    <th className="hidden">تاریخ امضا</th>
                  </tr>
                </thead>
                <tbody>
                  {event.attends &&
                    event.attends.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>
                            <input
                              type="text"
                              disabled
                              value={item.first_name + " " + item.last_name}
                              className="text-sm w-full border-0 p-2"
                              placeholder="شرح اقدام"
                            />
                          </td>
                          <td className="text-center">
                            {item.is_approved ? (
                              <span className="text-green-500">امضا شده</span>
                            ) : (
                              <span className="text-red-500">عدم امضا</span>
                            )}
                          </td>
                          <td className="hidden">
                            <span>{item.approved_timestamp}</span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sm:col-span-2 text-base">
            <p className="text-sm mb-2">سطح محرمانگی *</p>
            <div className="space-x-5 space-x-reverse ">
              <label>
                <input
                  type="radio"
                  name="confidentiality"
                  disabled
                  checked={event.confidentiality == 2}
                />
                <span className="mr-2">خیلی محرمانه</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="confidentiality"
                  disabled
                  checked={event.confidentiality == 1}
                />
                <span className="mr-2">محرمانه</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="confidentiality"
                  disabled
                  checked={event.confidentiality == 0}
                />
                <span className="mr-2">عادی</span>
              </label>
            </div>
          </div>

          {/* <div className="sm:col-span-2">
                        <TextWithLabel title="ضمیمه" />

                        <div className="mb-4">
                            {event && event.attachment && event.attachment.length > 0
                                ? event.attachment.map((file, index) => (
                                    <span
                                        key={index}
                                        className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                    >
                                        <button
                                            type="button"
                                            disabled
                                            className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                        >
                                            {file.name ?
                                                file.name
                                                :
                                                "فایل" + " " + (index + 1) +
                                                "." +
                                                file.type}
                                        </button>

                                        <button
                                            onClick={() =>
                                                DownloadFile(
                                                    file.guid,
                                                    file.type,
                                                    file.name
                                                )
                                            }
                                            type="button"
                                            className="-mr-px relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                        >
                                            <CloudDownloadIcon
                                                className="-ml-1 ml-1 h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </span>
                                ))
                                : " ندارد"}
                        </div>
                    </div> */}

          {checkIfAttend() ? (
            user && event.attends && user.uuid && checkIfSigner() ? (
              <div className="sm:col-span-2 text-base mt-5">
                <button
                  onClick={(_) => onSubmit()}
                  className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                >
                  امضا صورت‌جلسه
                </button>
              </div>
            ) : (
              <div className="sm:col-span-2 text-base mt-5">
                <button
                  onClick={(_) => onCancelSubmit()}
                  className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#eb5757] hover:bg-[#843737] focus:outline-none "
                >
                  لغو امضا
                </button>
              </div>
            )
          ) : null}
          {errors["master"] ? (
            <span className="text-md text-red-500">{errors["master"]}</span>
          ) : null}
        </div>
        <div className="pt-5 border-t">
          <div className="flex justify-end ml-4 space-x-3 space-x-reverse">
            {event.length != 0 && CheckIfAccess("print_minute") ? (
              <button
                onClick={() => getPrintLink()}
                type="button"
                className=" inline-flex mb-4 justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
              >
                <span>چاپ صورت‌جلسه</span>
              </button>
            ) : null}
            {event.length != 0 && CheckIfAccess("edit_minute") ? (
              !event.has_sign ? (
                <Link
                  href={`/proceedingMenu/proceedingsList/minutes/edit/${eventUUID}`}
                >
                  <span className="rounded-md mb-4 ml-4 bg-[#ffc107] hover:bg-[#a97e35] cursor-pointer py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none ">
                    ویرایش صورت‌جلسه
                  </span>
                </Link>
              ) : (
                <button className="rounded-md ml-4 mb-4 bg-[#c7c7c7] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#c7c7c7] focus:outline-none ">
                  <span>ویرایش صورت‌جلسه</span>
                </button>
              )
            ) : null}
            <button
              type="button"
              onClick={getBack}
              className="rounded-md ml-4 mb-4 bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
            >
              <span>انصراف</span>
            </button>
            {/* </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  return { props: { id } };
}
