import SidebarDesktop from "../../components/layout/sidebarDesktop";
import SidebarMobile from "../../components/layout/sidebarMobile";
import StickyHeader from "../../components/layout/stickyHeader";
import TablePage from "../../components/table/cartableFull";
import navigationList from "../../components/layout/navigationList";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/auth";
import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import Link from "next/link";
import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Textarea from "../../components/forms/textarea";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import React from "react";
import Forbidden from "../../components/forms/forbidden";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

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
    const [selectedType, setSelectedType] = useState(0);

    const handleChange = async (event) => {
        setSelectedType(event.target.value);
        await axios.get(`/api/v1/cartable/list?type=${event.target.value}`).then((response) => {
            setData(response.data.data);
            setDefaultData(response.data.data);
            setLoadingData(false);
        });
    };

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
        await axios.get(`/api/v1/cartable/list?type=0`).then((response) => {
            setData(response.data.data);
            setDefaultData(response.data.data);
            setLoadingData(false);
        });
    }
    function CheckIfAccessToPage(val) {
        if (currentUserActions && currentUserActions.indexOf(val) > -1) return true;
        return false;
    }
    if (isLoading || !user) {
        return null;
    }

    const types = [
        { name: 'همه', code: '0' },
        { name: 'خوانده نشده', code: '1' },
        { name: 'ستاره دار', code: '2' }
    ];
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
                                            نامه‌های دریافتی
                                        </h2>
                                    </div>

                                    <div className="ml-4 mt-2 flex-shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => setOpen(true)}
                                            className="relative inline-flex items-center ml-2 px-4 py-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#ffc107] hover:bg-[#a97e35] focus:outline-none "
                                        >
                                            <SearchIcon
                                                className="ml-2 h-5 w-5 text-white"
                                                aria-hidden="true"
                                            />
                                            <span>جست‌وجو</span>
                                        </button>
                                        {/* <Link href="/cartable/newMail">
                                        <button
                                            type="button"
                                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                                        >
                                            <PlusIcon
                                                className="ml-2 h-5 w-5 text-gray-400"
                                                aria-hidden="true"
                                            />
                                            <span>افزودن نامه جدید</span>
                                        </button>
                                    </Link> */}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end mt-2">
                            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                <Select
                                    value={selectedType}
                                    onChange={handleChange}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    <MenuItem value={0}>همه</MenuItem>
                                    <MenuItem value={1}>خوانده نشده</MenuItem>
                                    <MenuItem value={2}>ستاره دار</MenuItem>
                                </Select>
                                </FormControl>
                            </div>
                        </div>
                        <TablePage data={data} loadingData={loadingData} source="cartable" />
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
                                                            <p className="text-lg  text-white">
                                                                جست‌وجو
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
                                                                        جست‌وجو
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
                                                                            جست‌وجو
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
                                                        className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#ffc107] hover:bg-[#a97e35] focus:outline-none "
                                                    >
                                                        جست‌وجو
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
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
                    </main> : <Forbidden />}
            </div>
        </div>
    );
}
