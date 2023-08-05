import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import MailRoomIssuedTable from "../../../components/table/mailRoomIssued";
import navigationList from "../../../components/layout/navigationList";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/auth";
import { useState, useEffect } from "react";
import axios from "../../../lib/axios";
import Link from "next/link";
import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Textarea from "../../../components/forms/textarea";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import React from "react";
import Forbidden from "../../../components/forms/forbidden";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
    const { asPath } = useRouter();
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [recipient, setRecipient] = useState("");
    const [subject, setSubject] = useState("");
    const [sender, setSender] = useState("");
    const [primarySender, setPrimarySender] = useState("");
    const [primaryRecipient, setPrimaryRecipient] = useState("");
    const [errors, setErrors] = useState("");
    const [defaultData, setDefaultData] = useState({});
    const [searchDate, setSearchDate] = useState("");
    const [startDate, setStartDate] = useState({});
    const [endDate, setEndDate] = useState({});
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [searchHasValue, setSearchHasValue] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    function toFarsiNumber(n) {
        const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    
        return n
            .toString()
            .replace(/\d/g, x => farsiDigits[x]);
    }
    function search(val) {
        if (data) {
            var resumeBuf = []
            if (val.length > 2) {
                setSearchHasValue(true);
                for (let i = 0; i < data.length; i++) {
                    if (data[i].indicator.includes(val) || (data[i].secretariat_number && data[i].secretariat_number.includes(toFarsiNumber(val))) || data[i].subject.includes(val) || data[i].to_company.includes(val)) {
                        resumeBuf = [...resumeBuf, data[i]]
                    }
                }
            }
            else setSearchHasValue(false);
            setSearchData(resumeBuf);
        }
    }

    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });
    const handleDate = (date) => {
        setStartDate(date[0]);
        setEndDate(date[1]);
    };
    const removeDate = () => {
        setStartDate({});
        setEndDate({});
        setSearchDate("");
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setErrors("");
        const SearchFormData = new FormData();
        SearchFormData.append("sender", sender);
        SearchFormData.append("primary_sender", primarySender);
        SearchFormData.append("receiver", recipient);
        SearchFormData.append("primary_receiver", primaryRecipient);
        SearchFormData.append("subject", subject);
        SearchFormData.append(
            "startDate",
            typeof startDate !== "undefined" ? startDate.unix : ""
        );
        SearchFormData.append(
            "endDate",
            typeof endDate !== "undefined" ? endDate.unix : ""
        );
        const JsonData = JSON.stringify(Object.fromEntries(SearchFormData));

        try {
            setLoadingData(true);
            const response = await axios({
                method: "post",
                url: "/api/v1/cartable/search",
                data: JsonData,
            });
            if (response.data.status == 200 && response.data.data != null) {
                setData(response.data.data);
                setOpen(false);
                setLoadingData(false);
                setErrors("");
            } else {
                setErrors("نامه ای با این اطلاعات یافت نشد");
                setData(defaultData);
                setLoadingData(false);
            }
        } catch (error) {
            // setErrors(response.data.message);
        }
    };

    useEffect(() => {
        if (loadingData) {
            getData();
        }
    }, []);

    async function getData() {
        await axios.get(`/api/v1/mailroom/issued/list`).then((response) => {
            setData(response.data.data.reverse());
            setDefaultData(response.data.data.reverse());
            setLoadingData(false);
            const reversed = response.data.data.reverse()
        });
    }
    function CheckIfAccessToPage(val) {
        if (currentUserActions && currentUserActions.indexOf(val) > -1) return true;
        return false;
    }
    function CheckIfAccess(val) {
        if (currentUserRole && currentUserRole.indexOf(val) > -1) return true;
        return false;
    }
    if (isLoading || !user) {
        return null;
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
                        <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                            <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                    <div className="ml-4 mt-2">
                                        <h2 className="text-lg leading-6 font-large text-gray-900">
                                            نامه‌های صادره
                                        </h2>
                                    </div>

                                    <div className="ml-4 mt-2 flex-shrink-0">
                                        {/* <button
                                            type="button"
                                            onClick={() => setOpen(true)}
                                            className="relative inline-flex items-center ml-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                        >
                                            <SearchIcon
                                                className="ml-2 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            <span>جستجو پیشرفته</span>
                                        </button> */}

                                        {CheckIfAccess("issued_newMail") ?
                                            <Link href="/mailRoom/issued/getSecretariatNumber">
                                                <button
                                                    type="button"
                                                    className="relative inline-flex  mr-2 items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#1f2937] hover:bg-[#11151b] "
                                                >
                                                    <PlusIcon
                                                        className="ml-2 h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                    <span>دریافت شماره نامه </span>
                                                </button>
                                            </Link> : null}

                                        {CheckIfAccess("issued_newMail") ?
                                            <Link href="/mailRoom/issued/newMail">
                                                <button
                                                    type="button"
                                                    className="relative inline-flex  mr-2 items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#1f2937] hover:bg-[#11151b] "
                                                >
                                                    <PlusIcon
                                                        className="ml-2 h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                    <span>ثبت پیش نویس جدید</span>
                                                </button>
                                            </Link> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full px-4 sm:px-6 md:px-8">
                            <div className="grid grid-cols-4 gap-y-2 gap-x-4 mb-2 ">
                                <form
                                    className="w-full flex md:ml-0 mb-2 mt-4 col-span-4"
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
                                                search(p2e(e.target.value));
                                            }}
                                            id="search-field"
                                            className="block w-full h-full pl-8 pr-3 py-2border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-gray-300 sm:text-sm"
                                            placeholder="جستجو"
                                            type="text"
                                            name="search"
                                        />
                                    </div>
                                </form>
                            </div>
                            <MailRoomIssuedTable data={searchHasValue ? searchData : data} loadingData={loadingData} />
                            <Transition.Root show={open} as={Fragment}>
                                <Dialog
                                    as="div"
                                    className="fixed inset-0 overflow-hidden z-50"
                                    onClose={setOpen}
                                >
                                    <div className="absolute inset-0 overflow-hidden ">
                                        <Dialog.Overlay className="absolute inset-0" />

                                        <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10 sm:pr-16">
                                            {/* <Transition.Child
                                        as={Fragment}
                                        enter="transform transition ease-in-out duration-10 sm:duration-10"
                                        enterFrom="translate-x-full"
                                        enterTo="translate-x-0"
                                        leave="transform transition ease-in-out duration-10 sm:duration-10"
                                        leaveFrom="translate-x-0"
                                        leaveTo="translate-x-full"
                                    > */}
                                            <div className="pointer-events-auto w-screen max-w-md">
                                                <form
                                                    onSubmit={onSubmit}
                                                    className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                                                >
                                                    <div className="h-0 flex-1 overflow-y-auto">
                                                        <div className="bg-[#1f2937] py-6 px-4 sm:px-6">
                                                            <div className="flex items-center justify-between">
                                                                <div className="ml-3 flex h-1 items-center">
                                                                    {/* <button
                                                                type="button"
                                                                className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                                onClick={() =>
                                                                    setOpen(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                <span className="sr-only">
                                                                    Close panel
                                                                </span>
                                                                <XIcon
                                                                    className="h-6 w-6"
                                                                    aria-hidden="true"
                                                                />
                                                            </button> */}
                                                                </div>
                                                            </div>
                                                            <div className="mt-1">
                                                                <p className="text-lg text-white">
                                                                    جستجو پیشرفته
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-1 flex-col justify-between">
                                                            <div className="divide-y divide-gray-200 px-4 sm:px-6">
                                                                <div className="space-y-6 pt-6 pb-5">
                                                                    <div>
                                                                        <Textarea
                                                                            title="فرستنده"
                                                                            name={
                                                                                sender
                                                                            }
                                                                            rows="1"
                                                                            onChange={(
                                                                                event
                                                                            ) =>
                                                                                setSender(
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            // error={errors["subject"]}
                                                                            type="text"
                                                                            isrequired="true"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Textarea
                                                                            title="فرستنده اصلی"
                                                                            name={
                                                                                primarySender
                                                                            }
                                                                            rows="1"
                                                                            onChange={(
                                                                                event
                                                                            ) =>
                                                                                setPrimarySender(
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            // error={errors["subject"]}
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Textarea
                                                                            title="گیرنده"
                                                                            name={
                                                                                recipient
                                                                            }
                                                                            rows="1"
                                                                            onChange={(
                                                                                event
                                                                            ) =>
                                                                                setRecipient(
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            // error={errors["subject"]}
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Textarea
                                                                            title="گیرنده اصلی"
                                                                            name={
                                                                                primaryRecipient
                                                                            }
                                                                            rows="1"
                                                                            onChange={(
                                                                                event
                                                                            ) =>
                                                                                setPrimaryRecipient(
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            // error={errors["subject"]}
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Textarea
                                                                            title="موضوع"
                                                                            name={
                                                                                subject
                                                                            }
                                                                            rows="1"
                                                                            onChange={(
                                                                                event
                                                                            ) =>
                                                                                setSubject(
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            // error={errors["subject"]}
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label
                                                                            htmlFor="date"
                                                                            className="block text-sm font-medium  text-gray-700 mb-2"
                                                                        >
                                                                            بازه زمانی
                                                                            جستجو
                                                                        </label>


                                                                        <table className="w-full">
                                                                            <tbody>
                                                                                <tr id="tr0">
                                                                                    <td id="td0" align="right">

                                                                                        <DatePicker
                                                                                            format="YYYY/MM/DD"
                                                                                            value={
                                                                                                searchDate
                                                                                            }
                                                                                            onChange={(
                                                                                                dateObject
                                                                                            ) => {
                                                                                                handleDate(
                                                                                                    dateObject
                                                                                                );
                                                                                            }}
                                                                                            range
                                                                                            calendar={
                                                                                                persian
                                                                                            }
                                                                                            locale={
                                                                                                persian_fa
                                                                                            }
                                                                                            // plugins={[
                                                                                            //     <TimePicker
                                                                                            //         key="01"
                                                                                            //         position="bottom"
                                                                                            //     />,
                                                                                            // ]}
                                                                                            placeholder="انتخاب کنید.."
                                                                                            calendarPosition="bottom-right"
                                                                                            inputClass="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                                            containerStyle={{
                                                                                                width: "100%",
                                                                                            }}
                                                                                        /> </td>
                                                                                    <td id="td0" align="right">
                                                                                        {/* <button
                                                                                    onClick={() => removeDate()}>
                                                                                    <XCircleIcon
                                                                                        className="ml-1 h-5 w-5 text-red-600"
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                </button> */}
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                    <div>
                                                                        <button
                                                                            onClick={() =>
                                                                                window.location.reload()
                                                                            }
                                                                        >
                                                                            <p className="text-blue-500 text-sm">
                                                                                پاک کردن
                                                                                فیلتر
                                                                                جستجو
                                                                            </p>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <>
                                                                    {errors ? (
                                                                        <p className="text-sm text-red-500 p-2">
                                                                            {errors}
                                                                        </p>
                                                                    ) : null}
                                                                </>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                                                        <button
                                                            type="submit"
                                                            className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-green-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                                        >
                                                            جستجو سریع
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                                            onClick={() =>
                                                                setOpen(false)
                                                            }
                                                        >
                                                            انصراف
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                            {/* </Transition.Child> */}
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition.Root>
                        </div>
                    </main> : <Forbidden />}
            </div>
        </div>
    );
}
