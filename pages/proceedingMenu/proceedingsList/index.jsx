import { useEffect, useState } from "react";
import {
    SearchIcon,
} from "@heroicons/react/outline";
// ELEMENTS
import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import TablePage from "../../../components/table/eventTable";
import navigationList from "../../../components/layout/navigationList";
import { useRouter } from "next/router";
require("react-big-calendar/lib/css/react-big-calendar.css");
import Forbidden from "../../../components/forms/forbidden";

// LIB
import axios from "../../../lib/axios";
import moment from "jalali-moment";
moment.locale("fa");

import { useAuth } from "../../../hooks/auth";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function ProceedingsList() {
    const { asPath } = useRouter();
    const [selectedMonth, setSelectedMonth] = useState(moment().format("jM"));
    const [loading, setLoading] = useState(true);
    const [meetings, setMeetings] = useState([]);
    const [searchMeetings, setSearchMeetings] = useState([]);

    const [selectedYear, setSelectedYear] = useState(1402);
    const [firstDayOfMonth, setFirstDay] = useState(null);
    const [monthDays, setMonthDays] = useState(
        moment.jDaysInMonth(selectedYear, moment().format("jM") - 1)
    );
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [searchHasValue, setSearchHasValue] = useState(false);
    const [isHolding, setIsHolding] = useState(false);

    const [filterCanceled, setFilterCanceled] = useState(false);
    const [filterOk, setFilterOk] = useState(false);
    const [filterHasMinut, setFilterHasMinut] = useState(false);
    const [searchValue, setSearchValue] = useState(false);

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

    function search(val, canceled, ok, hasMinute) {
        if (meetings) {
            var metingBuf = []
            if (val.length > 2) {
                setSearchHasValue(true);
                for (let i = 0; i < meetings.length; i++) {
                    if (meetings[i].company_title.includes(val)) {
                        metingBuf = [...metingBuf, meetings[i]]
                    }
                }
                var meetingFilter = [];
                if (ok || canceled || hasMinute) {
                    for (let i = 0; i < metingBuf.length; i++) {
                        if (canceled) {
                            if (metingBuf[i].status == 0 && metingBuf[i].is_canceled) {
                                meetingFilter = [...meetingFilter, metingBuf[i]]
                            }
                        }
                        if (ok) {
                            if (metingBuf[i].status == 1 && !metingBuf[i].is_canceled) {
                                meetingFilter = [...meetingFilter, metingBuf[i]]
                            }
                        }
                        if (hasMinute) {
                            if (metingBuf[i].hast_minutes) {
                                meetingFilter = [...meetingFilter, metingBuf[i]]
                            }
                        }
                    }
                }
                else meetingFilter = metingBuf;
            }
            else if (ok || canceled || hasMinute) {
                setSearchHasValue(true);
                var meetingFilter = [];
                for (let i = 0; i < meetings.length; i++) {
                    if (canceled) {
                        if (meetings[i].status == 0 && meetings[i].is_canceled) {
                            meetingFilter = [...meetingFilter, meetings[i]]
                        }
                    }
                    if (ok) {
                        if (meetings[i].status == 1 && !meetings[i].is_canceled) {
                            if (!meetingFilter.some(e => e.uuid === meetings[i].uuid)) {
                                meetingFilter = [...meetingFilter, meetings[i]]
                            }

                        }
                    }
                    if (hasMinute) {
                        if (meetings[i].hast_minutes) {
                            if (!meetingFilter.some(e => e.uuid === meetings[i].uuid)) {
                                meetingFilter = [...meetingFilter, meetings[i]]
                            }
                        }
                    }
                }
            }
            else setSearchHasValue(false);
            setSearchMeetings(meetingFilter);
        }
    }

    function setFilter(canceled, ok, hasMinute) {
        setFilterCanceled(canceled);
        setFilterOk(ok);
        setFilterHasMinut(hasMinute);

    }

    useEffect(() => {
        axios
            .get(
                `/api/v1/calendar/list?timestamp=${moment(
                    `${selectedYear}/${selectedMonth}/01`,
                    "jYYYY/jM/jD"
                ).unix()}`
            )
            .then((res) => {
                setLoading(false);
                setMeetings(res.data.data);
                setSearchHasValue(false);
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
            .get(`/api/v1/calendar/list?timestamp=${timestamp_request}&sort=asc`)
            .then((res) => {
                // setLoading(false);
                setMeetings(res.data.data);
                var firstDay = moment(`${year_temp}/${month_temp}/01`, "jYYYY/jM/jD").day()
                setFirstDay(firstDay == 6 ? -1 : firstDay + 1)
                setMonthDays(moment.jDaysInMonth(selectedYear, moment().format("jM") - 1) + (firstDay == 6 ? -1 : firstDay) + 1)
            });
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
                setIsHolding={(props) => setIsHolding(props.isHolding)}
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
                                                جلسات
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
                                                    </option>                                                   
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


                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-4 sm:px-6 md:px-8">
                                {isHolding ?
                                    <div className="grid grid-cols-8 gap-y-2 gap-x-4 mb-2 ">
                                        <form
                                            className="w-full flex md:ml-0 mb-2 mt-4 col-span-5"
                                            action="#"
                                            method="GET"
                                        >
                                            <label htmlFor="search-field" className="sr-only">
                                                جستجو
                                            </label>
                                            <div className="relative w-full text-gray-400  focus-within:text-gray-600">
                                                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                                    <SearchIcon
                                                        className="h-5 w-5 ml-2"
                                                        aria-hidden="true"
                                                    />
                                                </div>
                                                <input
                                                    onChange={(e) => {
                                                        setSearchValue(e.target.value);
                                                        search(e.target.value, filterCanceled, filterOk, filterHasMinut);
                                                    }}
                                                    id="search-field"
                                                    className="block w-full h-full pl-8 pr-3 py-2border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-gray-300 sm:text-sm"
                                                    placeholder="جستجو نام شرکت"
                                                    type="text"
                                                    name="search"
                                                />
                                            </div>
                                        </form>
                                        <div className="col-span-3 grid lg:grid-cols-3 sm:gir-cols-3">
                                            <span className="flex items-center mr-2 ">
                                                <input
                                                    id="/dashboard"
                                                    name="/dashboard"
                                                    type="checkbox"
                                                    checked={filterCanceled}
                                                    onClick={(e) => {
                                                        setFilterCanceled(e.target.checked)
                                                        search(searchValue, e.target.checked, filterOk, filterHasMinut)
                                                    }}
                                                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                                                />
                                                <label
                                                    htmlFor="/dashboard"
                                                    className="mr-2 block text-sm text-gray-900"
                                                >
                                                    لغو شده
                                                </label>
                                            </span>
                                            <span className="flex items-center mr-2 ">
                                                <input
                                                    id="/dashboard"
                                                    name="/dashboard"
                                                    type="checkbox"
                                                    checked={filterOk}
                                                    onClick={(e) => {
                                                        setFilterOk(e.target.checked)
                                                        search(searchValue, filterCanceled, e.target.checked, filterHasMinut)
                                                    }}
                                                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                                                />
                                                <label
                                                    htmlFor="/dashboard"
                                                    className="mr-2 block text-sm text-gray-900"
                                                >
                                                    برگزار شده
                                                </label>
                                            </span>
                                            <span className="flex items-center mr-4 ">
                                                <input
                                                    id="/dashboard"
                                                    name="/dashboard"
                                                    type="checkbox"
                                                    checked={filterHasMinut}
                                                    onClick={(e) => {
                                                        setFilterHasMinut(e.target.checked)
                                                        search(searchValue, filterCanceled, filterOk, e.target.checked)
                                                    }}
                                                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                                                />
                                                <label
                                                    htmlFor="/dashboard"
                                                    className="mr-2 block text-sm text-gray-900"
                                                >
                                                    صورت‌جلسه ثبت شده
                                                </label>
                                            </span>
                                        </div>
                                    </div> : null}

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
                                    <TablePage data={searchHasValue ? searchMeetings : meetings} loadingData={false} roleData={currentUserRole} />
                                </div>
                            </div>
                        </div>
                    </main> : <Forbidden />}
            </div>
        </div>
    );
}
