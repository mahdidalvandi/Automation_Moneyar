import SidebarDesktop from "../../components/layout/sidebarDesktop";
import SidebarMobile from "../../components/layout/sidebarMobile";
import StickyHeader from "../../components/layout/stickyHeader";
import AnnouncementsTable from "../../components/table/announcementsTable";
import navigationList from "../../components/layout/navigationList";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/auth";
import { PlusIcon } from "@heroicons/react/outline";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Textarea from "../../components/forms/textarea";
import { useState, useEffect } from "react";
import Forbidden from "../../components/forms/forbidden";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "../../lib/axios";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function InitialData() {
    const [data, setData] = useState();
    const [announcementsData, setAnnouncementsData] = useState();
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState([]);
    const [people, setPeople] = useState([]);
    const [query, setQuery] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [isHolding, setIsHolding] = useState(false);

    const { asPath } = useRouter();

    const onSubmit = async (event) => {
        event.preventDefault();
        var object = {};
        var hasError = false;
        if (!data) {
            object['data'] = ' متن اطلاعیه الزامی است';
            hasError=true;
        }
        if (!startDate) {
            object['startDate'] = ' تاریخ شروع اطلاعیه الزامی است';
            hasError=true;
        }
        if (!endDate) {
            object['endDate'] = ' تاریخ پایان اطلاعیه الزامی است';
            hasError=true;
        }
        if (startDate && endDate && startDate.unix >= endDate.unix) {
            object['endDate'] = "زمان پایان معتبر نمی باشد";
            hasError=true;
        }
        if (hasError) {
            setErrors(object);
            return;
        }
        const postFormData = new FormData();
        postFormData.append("data", data);
        postFormData.append("start_timestamp", startDate ? String(startDate.unix) : "");
        postFormData.append("end_timestamp", endDate ? String(endDate.unix) : "");
        try {
            setLoadingData(true);
            const response = await axios({
                method: "post",
                url: "/api/v1/announcements/add",
                data: postFormData,
            });
            if (response.data.status == 200) {
                setOpen(false);
                GetData();
               // window.location.reload();
                // setErrors("");
            } else {
                setErrors("یک مشکل پیش آمده است");
            }
        } catch (error) {
            var object = {};
            object['master'] = error.response.data.message;
            setErrors(object);
        }
    };
    useEffect(() => {
        GetData();
    }, []);

    const GetData = () => {
        axios
        .get("api/v1/announcements/list")
            .then((res) => {
                setLoadingData(false);            
                setAnnouncementsData(res.data.data.reverse())
            })
    }
    
    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });

    if (isLoading || !user) {
        return null;
    }
    function CheckIfAccess(val) {
        if (currentUserRole && currentUserRole.indexOf(val) > -1) return true;
        return false;
    }
    function CheckIfAccessToPage(val) {
        if (isHolding && currentUserActions && currentUserActions.indexOf(val) > -1) return true;
        return false;
    }
    return (
        <div>
            <SidebarMobile menu={navigationList()} loc={asPath} />
            <SidebarDesktop menu={navigationList()} loc={asPath}
                setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
                setActions={(props) => setCurrentUserActions(props.currentUserActions)}
                setIsHolding={(props) => { setIsHolding(props.isHolding) }}
                setSuperUser={(props) => { }} />
            <div className="md:pr-52 flex flex-col flex-1">
                <StickyHeader />
                {!currentUserActions ? null : CheckIfAccessToPage(window.location.pathname) ?
                    <main>
                        <div className="py-6">
                            <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                    <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                        <div className="ml-4 mt-2">
                                            <h2 className="text-lg leading-6 font-large text-gray-900">
                                                اطلاعیه‌ها
                                            </h2>
                                        </div>

                                        <div className="ml-4 mt-2 flex-shrink-0">
                                            {CheckIfAccess("add_announcements") ?
                                                <button
                                                    type="button"
                                                    onClick={() => setOpen(true)}
                                                    className="relative inline-flex items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#1f2937] hover:bg-[#11151b] "
                                                >
                                                    <PlusIcon
                                                        className="ml-2 h-5 w-5 text-white"
                                                        aria-hidden="true"
                                                    />
                                                    <span>ثبت اطلاعیه جدید</span>
                                                </button> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-4 sm:px-6 md:px-8">
                                {currentUserRole ?
                                    <AnnouncementsTable 
                                    roleData={currentUserRole}
                                    data={announcementsData}
                                    loadingData={loadingData}
                                    setClicked={(per) => {
                                        GetData(per)
                                    }} /> : null}
                            </div>
                        </div>
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
                                                                ثبت اطلاعیه جدید
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-1 flex-col justify-between">
                                                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                                                            <div className="space-y-6 pt-6 pb-5">
                                                                <div>
                                                                    <Textarea
                                                                        title="متن اطلاعیه *"
                                                                        name={
                                                                            data
                                                                        }
                                                                        rows="5"
                                                                        onChange={(
                                                                            event
                                                                        ) =>
                                                                            setData(
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        error={errors["data"]}
                                                                        type="text"
                                                                        isrequired="true"
                                                                    />
                                                                </div>
                                                                <div className="grid grid-cols-4 gap-2">
                                                                    <div className="sm:col-span-2">
                                                                        <label
                                                                            htmlFor="date"
                                                                            className="block text-sm font-medium  text-gray-700 mb-1"
                                                                        >
                                                                            تاریخ شروع *
                                                                        </label>
                                                                        <DatePicker
                                                                            id="321"

                                                                            format="YYYY/MM/DD"
                                                                            value={
                                                                                startDate
                                                                            }
                                                                            onChange={(
                                                                                date
                                                                            ) => {
                                                                                setStartDate(
                                                                                    date
                                                                                );
                                                                            }}
                                                                            calendar={
                                                                                persian
                                                                            }
                                                                            locale={
                                                                                persian_fa
                                                                            }

                                                                            placeholder="انتخاب کنید.."
                                                                            calendarPosition="bottom-right"
                                                                            inputClass={`appearance-none block w-full px-3 py-2 border ${errors['startDate'] ? "border-red-300" : "border-gray-300"}  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                                                                            containerStyle={{
                                                                                width: "100%",
                                                                            }}
                                                                        />
                                                                        <p className="text-red-500 text-sm ">{errors['startDate']}</p>

                                                                    </div>
                                                                    <div className="sm:col-span-2">
                                                                        <label
                                                                            htmlFor="date"
                                                                            className="block text-sm font-medium  text-gray-700 mb-1"
                                                                        >
                                                                            تاریخ پایان *
                                                                        </label>
                                                                        <DatePicker
                                                                            id="321"

                                                                            format="YYYY/MM/DD"
                                                                            value={
                                                                                endDate
                                                                            }
                                                                            onChange={(
                                                                                date
                                                                            ) => {
                                                                                setEndDate(
                                                                                    date
                                                                                );
                                                                            }}
                                                                            calendar={
                                                                                persian
                                                                            }
                                                                            locale={
                                                                                persian_fa
                                                                            }

                                                                            placeholder="انتخاب کنید.."
                                                                            calendarPosition="bottom-right"
                                                                            inputClass={`appearance-none block w-full px-3 py-2 border ${errors['startDate'] ? "border-red-300" : "border-gray-300"}  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                                                                            containerStyle={{
                                                                                width: "100%",
                                                                            }}
                                                                        />
                                                                        <p className="text-red-500 text-sm ">{errors['endDate']}</p>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <>
                                                                {errors ? (
                                                                    <p className="text-sm text-red-500 pt-1">
                                                                        {errors["master"]}
                                                                    </p>
                                                                ) : null}
                                                            </>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-shrink-0 justify-end px-4 py-4">
                                                    <button
                                                        type="submit"
                                                        className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                                                    >
                                                        ثبت
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

export default InitialData;
