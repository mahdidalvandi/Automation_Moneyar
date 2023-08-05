import { useEffect, useState } from "react";

// ELEMENTS
import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import { useRouter } from "next/router";
require("react-big-calendar/lib/css/react-big-calendar.css");
import { Dialog } from "@headlessui/react";
import Tooltip from "@mui/material/Tooltip";
import Textarea from "../../../components/forms/textarea";
import Forbidden from "../../../components/forms/forbidden";

import {
    PlusIcon,
    SearchIcon,
} from "@heroicons/react/outline";

// LIB
import axios from "../../../lib/axios";
import moment from "jalali-moment";
moment.locale("fa");

import { useAuth } from "../../../hooks/auth";
import Link from "next/link";
import {
    PencilIcon,
    CheckIcon,
    XIcon
} from "@heroicons/react/outline";
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Proceedings() {
    const { asPath } = useRouter();
    const [selectedMonth, setSelectedMonth] = useState(moment().format("jM"));
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editAgenda, setEditAgenda] = useState(false);
    const [agenda, setAgenda] = useState(null)
    const [meetings, setMeetings] = useState([]);
    const [selectedYear, setSelectedYear] = useState(1402);
    const [selectedDay, setSelectedDay] = useState(moment().format("jD"));
    const [selectedDate, setSelectedDate] = useState(
        moment().format("jYYYY/jM/jD")
    );
    const [selectedEvent, setEvent] = useState(null);
    const [firstDayOfMonth, setFirstDay] = useState(null);
    const [monthDays, setMonthDays] = useState(
        moment.jDaysInMonth(selectedYear, moment().format("jM") - 1)
    );
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });
    const weekDaysArray = [
        {
            id: 1, value: 'شنبه'
        },
        {
            id: 2, value: 'یکشنبه'
        },
        {
            id: 3, value: 'دوشنبه'
        },
        {
            id: 4, value: 'سه شنبه'
        },
        {
            id: 5, value: 'چهارشنبه'
        },
        {
            id: 6, value: 'پنجشنبه'
        },
        {
            id: 7, value: 'جمعه'
        }
    ]
    function dialgClosed(param) {
        setDialogOpen(param)
        setEditAgenda(param)
    }
    function cancelEditAgenda(param) {
        setEditAgenda(false)
        setAgenda(param)
    }
    function updateAgenda(event_uuid, agenda) {
        axios
            .post("api/v1/calendar/update", {
                event_uuid: event_uuid,
                agenda: agenda
            })
            .then((res) => {
                setEditAgenda(false);
                setDialogOpen(false);
                getNewList();

            });
    }
    useEffect(() => {
        axios
            .get(
                `/api/v1/interview/list?timestamp=${moment(
                    `${selectedYear}/${selectedMonth}/01`,
                    "jYYYY/jM/jD"
                ).unix()}`
            )
            .then((res) => {
                setLoading(false);
                setMeetings(res.data.data);
                var firstDay = moment(`${selectedYear}/${selectedMonth}/01`, "jYYYY/jM/jD").day()
                setFirstDay(firstDay == 6 ? 1 : firstDay + 1)
                setMonthDays(moment.jDaysInMonth(selectedYear, moment().format("jM") - 1) + (firstDay == 6 ? 1 : firstDay) + 1)
            });
    }, []);

    function getNewList(year = null, month = null) {
        let month_temp = month ? month : selectedMonth;
        let year_temp = year ? year : selectedYear;
        // setLoading(true);
        setMeetings([]);
        let timestamp_request = moment(
            `${year_temp}/${month_temp}/1`,
            "jYYYY/jM/jD"
        ).unix();
        axios
            .get(`/api/v1/interview/list?timestamp=${timestamp_request}`)
            .then((res) => {
                // setLoading(false);
                setMeetings(res.data.data);
                var firstDay = moment(`${year_temp}/${month_temp}/01`, "jYYYY/jM/jD").day()
                setFirstDay(firstDay == 6 ? -1 : firstDay + 1)
                setMonthDays(moment.jDaysInMonth(selectedYear, moment().format("jM") - 1) + (firstDay == 6 ? -1 : firstDay) + 1)
            });
    }

    function doneEvent(uuid) {
        axios
            .post("/api/v1/calendar/updateStatus", {
                event_uuid: uuid,
            })
            .then((res) => {
                setDialogOpen(false);
                getNewList();
            });
    }
    function resendLink(uuid) {
        axios
            .post("/api/v1/interview/resend_sms", {
                uuid: uuid,
            })
            .then((res) => {
                setDialogOpen(false);
                getNewList();
            });
    }

    function checkIfToday(selectedEvent) {
        var today = Date.now()
        if (selectedEvent.timestamp * 1000 <= today) {
            return true
        }
        return false;
    }
    function checkIfSigner(admin_uuid) {
        if (admin_uuid == user.uuid) {
            return true;
        }
        return false;
    }

    if (isLoading || !user || loading) {
        return null;
    }
    function CheckIfAccess(val) {
        if (currentUserRole && currentUserRole.indexOf(val) > -1) return true;
        return false;
    }
    function CheckIfAccessToPage(val) {
        if (currentUserActions && currentUserActions.indexOf(val) > -1) return true;
        return false;
    }
    return (
        <div>
            <SidebarMobile menu={navigationList()} loc={asPath} />
            <SidebarDesktop menu={navigationList()} loc={asPath}
                setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
                setActions={(props) => setCurrentUserActions(props.currentUserActions)}
                setIsHolding={(props) => { }}
                setSuperUser={(props) => { }} />
            <div className="md:pr-52 flex flex-col flex-1">
                <StickyHeader />
                {!currentUserActions ? null : CheckIfAccessToPage(window.location.pathname) ?

                    <main>
                        <div className="py-6">
                            <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
                                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                    <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                        <div className="ml-4 flex items-center">
                                            <h2 className="text-lg leading-6 font-large text-gray-900">
                                                مصاحبه‌ها
                                            </h2>
                                            <div className="mr-10 space-x-3 space-x-reverse">
                                                <select
                                                    onChange={(year) => {
                                                        setSelectedYear(
                                                            year.currentTarget.value
                                                        );
                                                        getNewList(
                                                            year.currentTarget
                                                                .value,
                                                            selectedMonth
                                                        );
                                                    }}
                                                    className="pr-10 relative items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                                >
                                                    <option>انتخاب سال</option>
                                                    <option
                                                        selected={
                                                            selectedYear == 1402
                                                        }
                                                        value={1402}
                                                    >
                                                        1402
                                                    </option>
                                                    <option
                                                        selected={
                                                            selectedYear == 1401
                                                        }
                                                        value={1401}
                                                    >
                                                        1401
                                                    </option>
                                                    <option
                                                        selected={
                                                            selectedYear == 1400
                                                        }
                                                        value={1400}
                                                    >
                                                        1400
                                                    </option>ƒ
                                                </select>
                                                <select
                                                    onChange={(month) => {
                                                        setSelectedMonth(
                                                            month.currentTarget
                                                                .value
                                                        );
                                                        getNewList(
                                                            selectedYear,
                                                            month.currentTarget
                                                                .value
                                                        );
                                                    }}
                                                    className="pr-10 relative items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                                >
                                                    <option>انتخاب ماه</option>
                                                    <option
                                                        value={1}
                                                        selected={
                                                            selectedMonth == 1
                                                        }
                                                    >
                                                        فروردین
                                                    </option>
                                                    <option
                                                        value={2}
                                                        selected={
                                                            selectedMonth == 2
                                                        }
                                                    >
                                                        اردیبهشت
                                                    </option>
                                                    <option
                                                        value={3}
                                                        selected={
                                                            selectedMonth == 3
                                                        }
                                                    >
                                                        خرداد
                                                    </option>
                                                    <option
                                                        value={4}
                                                        selected={
                                                            selectedMonth == 4
                                                        }
                                                    >
                                                        تیر
                                                    </option>
                                                    <option
                                                        value={5}
                                                        selected={
                                                            selectedMonth == 5
                                                        }
                                                    >
                                                        مرداد
                                                    </option>
                                                    <option
                                                        value={6}
                                                        selected={
                                                            selectedMonth == 6
                                                        }
                                                    >
                                                        شهریور
                                                    </option>
                                                    <option
                                                        value={7}
                                                        selected={
                                                            selectedMonth == 7
                                                        }
                                                    >
                                                        مهر
                                                    </option>
                                                    <option
                                                        value={8}
                                                        selected={
                                                            selectedMonth == 8
                                                        }
                                                    >
                                                        آبان
                                                    </option>
                                                    <option
                                                        value={9}
                                                        selected={
                                                            selectedMonth == 9
                                                        }
                                                    >
                                                        آذر
                                                    </option>
                                                    <option
                                                        value={10}
                                                        selected={
                                                            selectedMonth == 10
                                                        }
                                                    >
                                                        دی
                                                    </option>
                                                    <option
                                                        value={11}
                                                        selected={
                                                            selectedMonth == 11
                                                        }
                                                    >
                                                        بهمن
                                                    </option>
                                                    <option
                                                        value={12}
                                                        selected={
                                                            selectedMonth == 12
                                                        }
                                                    >
                                                        اسفند
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="ml-4 mt-2 flex-shrink-0 space-x-2 space-x-reverse">
                                            {CheckIfAccess("add_resume_calendar") ?
                                                <Link href="/recruitment/resumeCalendar/store">
                                                    <button
                                                        type="button"
                                                        className="relative inline-flex items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#1f2937] hover:bg-[#11151b] "
                                                    >
                                                        <PlusIcon
                                                            className="ml-2 h-5 w-5 text-white"
                                                            aria-hidden="true"
                                                        />
                                                        <span>افزودن مصاحبه جدید</span>
                                                    </button>
                                                </Link> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-4 sm:px-6 md:px-8">
                                <div className="lg:flex lg:h-full lg:flex-col">
                                    <header className="relative z-20 flex items-center justify-between border-b border-gray-200 py-4 px-6 lg:flex-none">
                                        <h1 className="text-lg font-semibold text-gray-900">
                                            <time dateTime="2022-01"></time>
                                        </h1>
                                    </header>
                                    <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
                                        <div className="hidden grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
                                            <div className="bg-white py-2">
                                                شنبه
                                            </div>
                                            <div className="bg-white py-2">
                                                یک‌شنبه
                                            </div>
                                            <div className="bg-white py-2">
                                                دوشنبه
                                            </div>
                                            <div className="bg-white py-2">
                                                سه‌شنبه
                                            </div>
                                            <div className="bg-white py-2">
                                                چهارشنبه
                                            </div>
                                            <div className="bg-white py-2">
                                                پنج‌شنبه
                                            </div>
                                            <div className="bg-white py-2">
                                                جمعه
                                            </div>
                                        </div>



                                        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
                                            <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-px">

                                                {weekDaysArray.map(
                                                    (item, i) => {
                                                        return (

                                                            <div
                                                                key={i}
                                                                className="relative bg-[#1f2937] text-white py-2 px-3 h-10 hover:bg-[#374151]">
                                                                <span>
                                                                    {item.value}
                                                                </span>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
                                            <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-5 lg:gap-px">

                                                {[...Array(monthDays).keys()].map(
                                                    (day, key) => {
                                                        let day_string = `${selectedYear}/${selectedMonth}/${day + 1
                                                            - (firstDayOfMonth == -1 ? 0 : firstDayOfMonth)}`;
                                                        return (
                                                            day - firstDayOfMonth < 0 ?
                                                                <div
                                                                    key={key}
                                                                    className="relative bg-gray-200 py-2 px-3 h-40 hover:bg-gray-200">

                                                                    <span>
                                                                    </span>
                                                                    <div className="flex flex-col space-y-1 overflow-y-auto h-28">

                                                                    </div>
                                                                </div>
                                                                :
                                                                <div
                                                                    key={key}
                                                                    className="relative bg-white py-2 px-3 h-40 hover:bg-gray-50"
                                                                >

                                                                    <span>
                                                                        {day + 1 - (firstDayOfMonth == -1 ? 0 : firstDayOfMonth)}
                                                                    </span>
                                                                    <div className="flex flex-col space-y-1 overflow-y-auto h-28">
                                                                        {meetings.map(
                                                                            (
                                                                                meet,
                                                                                meet_key
                                                                            ) => {
                                                                                if (
                                                                                    day_string ==
                                                                                    `${meet.year}/${meet.month}/${meet.day_of_month}`
                                                                                ) {
                                                                                    return (
                                                                                        <button
                                                                                            onClick={(
                                                                                                _
                                                                                            ) => {
                                                                                                setDialogOpen(
                                                                                                    true
                                                                                                );
                                                                                                setEvent(
                                                                                                    meet
                                                                                                );

                                                                                            }}
                                                                                            key={
                                                                                                meet_key
                                                                                            }
                                                                                            className="flex justify-between items-center bg-amber-400 px-1 rounded-md"
                                                                                        >
                                                                                            <p className="text-[10px]">
                                                                                                {
                                                                                                    meet.applicant_name
                                                                                                }
                                                                                            </p>
                                                                                            {meet.applicant_uuid ?
                                                                                                <Tooltip title="اطلاعات وارد شده">
                                                                                                    <span className="w-2 h-2 inline-block rounded-full text-[11px] font-bold bg-green-500"></span>
                                                                                                </Tooltip> :
                                                                                                <Tooltip title="اطلاعات وارد نشده">
                                                                                                    <span className="w-2 h-2 inline-block rounded-full text-[11px] font-bold bg-red-600"></span>
                                                                                                </Tooltip>
                                                                                            }
                                                                                        </button>
                                                                                    );
                                                                                }
                                                                            }
                                                                        )}
                                                                    </div>
                                                                </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main> : <Forbidden />}
            </div>
            {selectedEvent ? (
                <Dialog
                    open={dialogOpen}
                    onClose={() => dialgClosed(false)}
                    className="relative z-50"
                >
                    <div
                        className="fixed inset-0 bg-black/30"
                        aria-hidden="true"
                    />
                    <div className="fixed inset-0 flex items-center justify-center p-2">
                        <div className="w-1/2 flex min-h-full items-center justify-center">
                            <Dialog.Panel className="w-full mx-auto max-w-sm rounded bg-white p-5">
                                <Dialog.Title>
                                    {selectedEvent.applicant_name}
                                </Dialog.Title>
                                <div className="my-4 space-y-3 border-t py-4">
                                    <div className="flex justify-between w-full items-center text-sm">
                                        <span>وضعیت تکمیل اطلاعات</span>
                                        <span className="text-gray-600">
                                            {`${selectedEvent.applicant_uuid ? "تکمیل شده" :
                                                "تکمیل نشده"
                                                }`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between w-full items-center text-sm">
                                        <span>موقعیت شغلی درخواستی</span>
                                        <span className="text-gray-600">
                                            {selectedEvent.applicant_job_position}
                                        </span>
                                    </div>
                                    <div className="flex justify-between w-full items-center text-sm">
                                        <span>مصاحبه کننده</span>
                                        <span className="text-gray-600">
                                            {selectedEvent.interviewer_name}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-x-4 space-x-reverse">
                                    {selectedEvent.applicant_uuid ?
                                        <Link
                                            href={`/recruitment/resumeCalendar/${selectedEvent.applicant_uuid}`}
                                        >
                                            <span
                                                className="rounded-md  bg-[#43a047] cursor-pointer py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#2d592f] focus:outline-none ">
                                                مشاهده فرم
                                            </span>
                                        </Link>
                                        : <button
                                            onClick={() =>
                                                resendLink(selectedEvent.uuid)
                                            }
                                            className="rounded-md  bg-[#43a047] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#2d592f] focus:outline-none ">
                                            ارسال مجدد پیامک اطلاع رسانی
                                        </button>}
                                    <button
                                        onClick={() => setDialogOpen(false)}
                                        className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none ">
                                        انصراف
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog >
            ) : null
            }
        </div >
    );
}
