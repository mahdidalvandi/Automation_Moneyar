// BY @A
import { useState } from "react";

// NAVIGATION
import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import Link from "next/link";
import navigationList from "../../../components/layout/navigationList";
import { useRouter } from "next/router";
import Autocomplete from "@mui/material/Autocomplete";
import { useAuth } from "../../../hooks/auth";
import { useEffect, forwardRef } from "react";

// ELEMENTS
import InputBox from "../../../components/forms/inputBox";
import Textarea from "../../../components/forms/textarea";
import TextField from "@mui/material/TextField";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// CALENDAR
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";

// LIB
import axios from "../../../lib/axios";
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function StoreCalendar() {
    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });
    useEffect(() => {
        axios
            .get("/api/v1/cartable/init")
            .then((res) => setPeople(res.data.data.users))
            .catch((error) => {
                if (error.response.status != 409) throw error;
            });
    }, []);

    const { asPath } = useRouter();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [date2, setDate2] = useState("");
    const [errors, setErrors] = useState([]);
    const [sendingForm, setSendingForm] = useState(false);
    const [sendSMS, setSendSMS] = useState(false);
    const [success, setSuccess] = useState("");
    const [place, setPlace] = useState("");
    const [duration, setDuration] = useState("60");
    const [agenda, setAgenda] = useState("");
    const [query, setQuery] = useState("");
    const [people, setPeople] = useState([]);
    const [recipient, setRecipient] = useState([]);

    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [open, setOpen] = useState(false);
    const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))

    const handleToClose = (event, reason) => {
        window.location.href = "/proceedingMenu/proceedingsCalendar";
    };

    function onSubmit(e) {
        e.preventDefault();
        setSendingForm(true);
        var object = {};
        var hasError = false;
        if (recipient == "") {
            object['recipient'] = 'حاضرین جلسه الزامی است';
            hasError = true;
        }
        if (title == "") {
            object['title'] = 'عنوان جلسه الزامی است';
            hasError = true;
        }
        if (!date) {
            object['date'] = 'تاریخ جلسه الزامی است';
            hasError = true;
        }
        if (hasError) {
            setErrors(object);
            setSendingForm(false);
            return;
        }
        axios
            .post('/api/v1/calendar/add',
                {
                    title,
                    timestamp: String(date.unix),
                    place,
                    agenda,
                    send_sms: sendSMS,
                    duration: duration,
                    attends: strimer(recipient)
                })
            .then((res) => {
                setOpen(true);
            })
            .catch((err) => {
                setSendingForm(false)
                setErrors(err.response.data.message)
            });
    }
    const filteredPeople =
        query === ""
            ? people
            : people.filter((person) => {
                return person.full.includes(query.toLowerCase());
            });


    function strimer(data) {
        let tdata = String(data.map(dd => dd.uuid));
        tdata = tdata.replace('[', '');
        return tdata.replace(']', '');
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
                <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
                    <form
                        autoComplete="off"
                        onSubmit={e => onSubmit(e)}
                        className="space-y-8 divide-y divide-gray-200"
                    >
                        <div className="space-y-8 divide-y divide-gray-200">
                            <div>
                                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-2">
                                        <InputBox
                                            title="عنوان جلسه  *"
                                            name={title}
                                            value={title}
                                            onChange={(event) =>
                                                setTitle(
                                                    event.target.value
                                                )
                                            }
                                            error={errors["title"]}
                                            type="text"
                                            isrequired="true"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputBox
                                            title="مکان جلسه "
                                            name={place}
                                            value={place}
                                            onChange={(event) =>
                                                setPlace(
                                                    event.target.value
                                                )
                                            }
                                            error={errors["place"]}
                                            type="text"
                                            isrequired="true"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="date"
                                            className="block text-sm font-medium  text-gray-700 mb-1"
                                        >
                                            تاریخ جلسه*
                                        </label>
                                        <DatePicker
                                            id="321"

                                            format="YYYY/MM/DD HH:mm:ss"
                                            value={
                                                date
                                            }
                                            onChange={(
                                                date
                                            ) => {
                                                setDate(
                                                    date
                                                );
                                            }}
                                            calendar={
                                                persian
                                            }
                                            locale={
                                                persian_fa
                                            }
                                            plugins={[
                                                <TimePicker
                                                    key="01"
                                                    position="bottom"
                                                />,
                                            ]}
                                            placeholder="انتخاب کنید.."
                                            calendarPosition="bottom-right"
                                            inputClass={`appearance-none block w-full px-3 py-2 border ${errors['date'] ? "border-red-300" : "border-gray-300"}  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                                            containerStyle={{
                                                width: "100%",
                                            }}
                                        />
                                        <p className="text-red-500 text-sm ">{errors['date']}</p>
                                    </div>
                                     <div className="sm:col-span-1">
                                        <InputBox
                                            title="مدت زمان جلسه (دقیقه)"
                                            name={duration}
                                            value={duration}
                                            onChange={(event) =>
                                                setDuration(
                                                    p2e(event.target.value)
                                                )
                                            }
                                            error={errors["duration"]}
                                            type="text"
                                            isrequired="true"
                                        />
                                    </div>
                                    <div className="sm:col-span-6 mb-2">
                                        <div className="sm:col-span-6">
                                            <label
                                                htmlFor="cover-photo"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                حاضرین جلسه *
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <Autocomplete
                                                    multiple
                                                    id="tags-standard"
                                                    className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                    options={filteredPeople}
                                                    noOptionsText="یافت نشد!"
                                                    value={recipient}
                                                    onChange={(
                                                        event,
                                                        newValue
                                                    ) => {
                                                        setRecipient(
                                                            newValue
                                                        );
                                                    }}
                                                    getOptionLabel={(
                                                        person
                                                    ) => person.full}
                                                    renderInput={(
                                                        params
                                                    ) => (
                                                        <TextField
                                                            className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                            {...params}
                                                            variant="standard"
                                                            placeholder="افزودن .."
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                setQuery(
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    )}
                                                />
                                            </div>

                                            {errors["recipient"] ? (
                                                <span className="text-sm text-red-500">
                                                    {errors["recipient"]}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className="sm:col-span-6 mb-2">
                                        <Textarea
                                            title="دستور جلسه"
                                            name={agenda}
                                            value={agenda}
                                            rows="5"
                                            onChange={(event) =>
                                                setAgenda(
                                                    event.target.value
                                                )
                                            }
                                            error={errors["agenda"]}
                                            type="text"
                                            isrequired="false"
                                        />
                                    </div>
                                    <div className="sm:col-span-6 mb-2">

                                        <span className="flex items-center mr-2">
                                            <input
                                                id="/dashboard"
                                                name="/dashboard"
                                                type="checkbox"
                                                checked={sendSMS}
                                                onClick={(e) => setSendSMS(e.target.checked)}
                                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                                            />
                                            <label
                                                htmlFor="/dashboard"
                                                className="mr-2 block text-sm text-gray-900"
                                            >
                                                اطلاع رسانی از طریق پیامک
                                            </label>
                                        </span>
                                    </div>
                                    <div className="sm:col-span-6 mb-2">
                                        {/* <p className="text-sm text-red-500 ">
                                            تکمیل تمامی فیلدهای ستاره
                                            دار (*) اجباری است.
                                        </p> */}
                                    </div>
                                </div>
                                <div className="pt-5 border-t">
                                    <div>
                                        <p className="text-green-500 text-sm font-bold">{success}</p>
                                    </div>
                                    <div className="flex mb-4 justify-end">
                                       
                                        <button
                                            type="submit"
                                            disabled={sendingForm}
                                            className={`ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm ${sendingForm ? " bg-gray-500 hover:bg-gray-500 " : " bg-[#43a047] hover:bg-[#2d592f] "}  focus:outline-none`}
                                        >
                                            <span>{`${sendingForm ? "در حال ثبت " : "ثبت"}`}</span>
                                        </button>
                                        <Link
                                            href={{
                                                pathname: "/proceedingMenu/proceedingsCalendar",
                                            }}
                                        >
                                            <button
                                                type="button"
                                                className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none ">

                                                <span>انصراف</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Snackbar
                anchorOrigin={{
                    horizontal: "center",
                    vertical: "bottom",
                }}
                open={open}
                autoHideDuration={1500}
                onClose={handleToClose}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    عملیات با موفقیت انجام شد
                </Alert>
            </Snackbar>            
        </div>
    )
}