// BY @A
import { useState, useEffect, useRef, forwardRef } from "react";

// NAVIGATION
import SidebarDesktop from "../../../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../../../components/layout/sidebarMobile";
import StickyHeader from "../../../../../components/layout/stickyHeader";
import Link from "next/link";
import navigationList from "../../../../../components/layout/navigationList";
import { useRouter } from "next/router";

// ELEMENTS
import InputBox from "../../../../../components/forms/inputBox";
import Textarea from "../../../../../components/forms/textarea";
import { Dialog } from '@headlessui/react'
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { PlusIcon, XIcon, SearchIcon } from "@heroicons/react/solid";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// CALENDAR
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import moment from "jalali-moment";
moment.locale("fa");
// LIB
import axios from "../../../../../lib/axios";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function SubStoreCalendar() {
    const router = useRouter();
    const { id } = router.query
    const [eventUUID, setEventUUID] = useState(id);
    const [authorUUID, setAuthorUUID] = useState(null);
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [agenda, setAgenda] = useState("");
    const [upcomingAgenda, setUpcomingAgenda] = useState("");
    const [desc, setDesc] = useState("");
    const [sessionDesc, setSessionDesc] = useState("");
    const [query, setQuery] = useState("");
    const [query2, setQuery2] = useState("");
    const [place, setPlace] = useState("");
    const [date, setDate] = useState("");
    const [date2, setDate2] = useState("");
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [people, setPeople] = useState([]);
    const [recipient, setRecipient] = useState([]);
    const [confidentiality, setConfidentiality] = useState(0);

    const [mosavabat, setMosavabat] = useState([]);
    const [hazerin, setHazerin] = useState([]);
    const [currentUserActions, setCurrentUserActions] = useState();
    const [currentUserRole, setCurrentUserRole] = useState();
    const [modal, setModal] = useState(false);
    const [modalDialogVisibility, setModalDialogVisibility] = useState(false);
    const [attachements, setAttachments] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [uploadErrors, setUploadErrors] = useState([]);
    const [open, setOpen] = useState(false);

    const handleToClose = (event, reason) => {
        window.location.href = `/proceedingMenu/proceedingsCalendar/minutes/${eventUUID}`;
    };
    function getBack() {
        handleToClose();
    }
    useEffect(_ => {
        axios
            .get("/api/v1/cartable/init")
            .then((res) => setPeople(res.data.data.users))
            .catch((error) => {
                if (error.response.status != 409) throw error;
            });
    }, []);

    useEffect(_ => {
        axios
            .get(`/api/v1/calendar/minutes/${eventUUID}`)
            .then((res) => {
                setMosavabat(res.data.data.approvals)
                setSelectedEvent(res.data.data)
                setAuthorUUID(res.data.data.author[0])
                setSubject(res.data.data.subject)
                setDate(res.data.data.start_timestamp)
                setDate2(res.data.data.end_timestamp)
                setPlace(res.data.data.place)
                setConfidentiality(res.data.data.confidentiality)
                setSessionDesc(res.data.data.session_desc)
                setUpcomingAgenda(res.data.data.upcoming_agenda)
                setAgenda(res.data.data.agenda)
                setPlace(res.data.data.place)
                setTitle(res.data.data.title)
                setDesc(res.data.data.desc)
                setRecipient(res.data.data.attends)
            })
            .catch((error) => {
                //if (error.response.status != 409) throw error;
            });
    }, []);

    const calendarRef = useRef();

    function update(key, value) {
        let date = calendarRef.current.date;

        calendarRef.current.set(key, date[key] + value);

        setDate(new DateObject(date));
    }

    function addHazerin() {
        setHazerin([...hazerin, { sharhEghdam: "", eghdamKonande: "", nameMasol: "", mohlatZamanBaresi: "" }]);
    }

    function addMosavabat() {
        setMosavabat([...mosavabat, { sharhEghdam: "", eghdamKonande: "", nameMasol: "", mohlatZamanBaresi: "" }]);
    }

    function removeMosavabat(index) {
        let temp = [...mosavabat];
        temp.splice(index, 1);
        setMosavabat(temp);
    }

    function changeSharhEghdam(index, value) {
        let temp = [...mosavabat];
        temp[index].sharhEghdam = value;
        setMosavabat(temp);
    }

    function changeEghdamKonande(index, value) {
        let temp = [...mosavabat];
        temp[index].eghdamKonande = value;
        setMosavabat(temp);
    }

    function changeNameMasol(index, value) {
        let temp = [...mosavabat];
        temp[index].nameMasol = value;
        setMosavabat(temp);
    }

    function changeMohlatZamanBaresi(index, value) {
        let temp = [...mosavabat];
        temp[index].mohlatZamanBaresi = value;
        setMosavabat(temp);
    }

    const filteredPeople =
        query === ""
            ? people
            : people.filter((person) => {
                return person.full.includes(query.toLowerCase());
            });

    function onSubmit() {
        var object = {};
        if (!authorUUID || title == "" || subject == "" || agenda == "" || upcomingAgenda == "" || date == "" || recipient.length == 0 || mosavabat.length == 0) {
            setErrors(["لطفا تمامی فیلد‌ها را پر کنید"]);
            return;
        }
        if (date2 == "") {
            setErrors(["زمان پایان جلسه معتبر نمیباشد"]);
            return;
        }

        if (String(selectedEvent.start_timestamp) >= String(date2.unix)) {
            setErrors(["زمان شروع بیشتر از زمان پایان می‌باشد"]);
            return;
        }
        var end_date = "";
        if (date2.unix != undefined) {
            end_date = String(date2.unix)
        }
        else {
            end_date = date2
        }
        axios
            .post('/api/v1/calendar/minutes/update',
                {
                    minute_uuid: selectedEvent.uuid,
                    event_uuid: eventUUID,
                    author_uuid: authorUUID.uuid,
                    start_at: String(selectedEvent.start_timestamp),
                    end_at: end_date,
                    title,
                    subject,
                    agenda: agenda,
                    upcoming_agenda: upcomingAgenda,
                    approvals: mosavabat,
                    attends: strimer(recipient),
                    desc: desc,
                    session_desc: sessionDesc,
                    confidentiality: confidentiality,
                    attachment: attachements
                })
            .then((res) => {
                setLoading(false);
                setOpen(true);
            })
            .catch((err) => {
                object['master'] = err.response.data.message;
                setErrors(object);
            });
    }

    function strimer(data) {
        let tdata = String(data.map(dd => dd.uuid));
        tdata = tdata.replace('[', '');
        return tdata.replace(']', '');
    }

    return (
        <div>
            <SidebarMobile menu={navigationList()} loc={router.asPath} />
            <SidebarDesktop menu={navigationList()} loc={router.asPath}
                setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
                setActions={(props) => setCurrentUserActions(props.currentUserActions)}
                setIsHolding={(props) => { }}
                setSuperUser={(props) => { }} />
            <div className="md:pr-52 flex flex-col flex-1 mb-20">
                <StickyHeader />
                <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
                    <form
                        autoComplete="off"
                        onSubmit={e => onSubmit(e)}
                        className="space-y-8 divide-y divide-gray-200"
                    >
                        <div className="space-y-8 divide-y divide-gray-200">
                            <div>
                                <div className="flex justify-between py-5 items-center">
                                    <div className="sm:col-span-6">تاریخ تنظیم صورت‌جلسه: {moment().format('jYYYY/jMM/jDD')}</div>
                                </div>
                                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-2">
                                        <InputBox
                                            title="عنوان جلسه*"
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

                                    <div>
                                        <label
                                            htmlFor="date"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            زمان شروع جلسه*
                                        </label>
                                        <DatePicker
                                            id="321"
                                            format="YYYY/MM/DD HH:mm:ss"
                                            value={selectedEvent ?
                                                moment
                                                    .unix(
                                                        selectedEvent
                                                            .start_timestamp
                                                    )
                                                    .format(
                                                        "YYYY/MM/DD HH:mm:ss"
                                                    ) : null
                                            }

                                            // onChange={(
                                            //     date
                                            // ) => {
                                            //     setDate(
                                            //         date
                                            //     );
                                            // }}
                                            disabled=" ture"
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
                                            inputclassName="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                            containerStyle={{
                                                width: "100%",
                                            }}
                                            style={{
                                                padding: 5,
                                                margin: 0,
                                                height: 'initial'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="date"
                                            className="block text-sm font-medium text-gray-700 mb-2"
                                        >
                                            زمان پایان جلسه*
                                        </label>
                                        <DatePicker
                                            disableDayPicker
                                            id="123"
                                            format="YYYY/MM/DD HH:mm:ss"
                                            value={
                                                selectedEvent ?
                                                    moment
                                                        .unix(
                                                            selectedEvent
                                                                .end_timestamp
                                                        )
                                                        .format(
                                                            "YYYY/MM/DD HH:mm:ss"
                                                        ) : null
                                            }
                                            onChange={(
                                                date2
                                            ) => {
                                                setDate2(
                                                    date2
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
                                                    key="02"
                                                    position="bottom"
                                                />,
                                            ]}
                                            placeholder="انتخاب کنید.."
                                            calendarPosition="bottom-right"
                                            inputclassName="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                            containerStyle={{
                                                width: "100%"
                                            }}
                                            style={{
                                                padding: 5,
                                                margin: 0,
                                                height: 'initial'
                                            }}
                                        />
                                    </div>
                                    <div></div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="email"
                                            className={`block text-sm font-medium mb-1 text-gray-700`}
                                        >
                                            دبیرجلسه*
                                        </label>
                                        <Autocomplete
                                            id="tags-standard"
                                            className="border rounded-md iransans relative flex items-stretch flex-grow focus-within:z-10"
                                            options={filteredPeople}
                                            noOptionsText="یافت نشد!"
                                            value={authorUUID}
                                            onChange={(
                                                event,
                                                newValue
                                            ) => {
                                                setAuthorUUID(
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
                                                    className="focus:outeline-none iransans appearance-none block w-full px-3 py-1 border-none rounded-r-md shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-xs"
                                                    {...params}
                                                    variant="standard"
                                                    placeholder="افزودن .."
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setQuery2(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputBox
                                            title="موضوع جلسه  *"
                                            name={subject}
                                            value={subject}
                                            onChange={(event) =>
                                                setSubject(
                                                    event.target.value
                                                )
                                            }
                                            error={errors["subject"]}
                                            type="text"
                                            isrequired="true"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <InputBox
                                            title="محل‌ برگزاری جلسه*"
                                            name={place}
                                            value={place}
                                            disabled
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

                                    <div className="sm:col-span-4" />

                                    <div className="sm:col-span-3">
                                        <Textarea
                                            inputStyle="h-20"
                                            title="دستور جلسه*"
                                            name={
                                                agenda
                                            }
                                            rows="1"
                                            defaultValue={
                                                selectedEvent ? selectedEvent.agenda : null
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setAgenda(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            error={errors["agenda"]}
                                            type="text"
                                            isrequired="true"
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <Textarea
                                            inputStyle="h-20"
                                            title="شرح جلسه"
                                            name={
                                                sessionDesc
                                            }
                                            defaultValue={sessionDesc}
                                            rows="1"
                                            onChange={(
                                                event
                                            ) =>
                                                setSessionDesc(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            error={errors["session_desc"]}
                                            type="text"
                                            isrequired="true"
                                        />
                                    </div>

                                    <div className="sm:col-span-3">
                                        <Textarea
                                            inputStyle="h-20"
                                            title="دستور جلسه آتی*"
                                            name={
                                                upcomingAgenda
                                            }
                                            defaultValue={upcomingAgenda}
                                            rows="1"
                                            onChange={(
                                                event
                                            ) =>
                                                setUpcomingAgenda(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            error={errors["upcoing_agenda"]}
                                            type="text"
                                            isrequired="true"
                                        />
                                    </div>



                                    <div className="sm:col-span-6 border-t border-gray-300 py-5">
                                        <div className="flex justify-between">
                                            <p>مصوبات*</p>
                                            <button type="button" onClick={_ => addMosavabat()} className="hover:bg-gray-50 transition duration-150 shadow p-2 px-4 rounded-md text-sm flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 ml-1"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                                اضافه کردن مصوبه جدید
                                            </button>
                                        </div>
                                        <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="p-2">
                                                        ردیف
                                                    </th>
                                                    <th className="text-right">
                                                        شرح اقدام
                                                    </th>
                                                    <th>
                                                        اقدام کننده
                                                    </th>
                                                    <th>
                                                        نام مسئول
                                                    </th>
                                                    <th>
                                                        مهلت زمان بررسی
                                                    </th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    mosavabat.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td className="text-center">
                                                                    {index + 1}
                                                                </td>
                                                                <td>
                                                                    <input type="text" value={item.sharhEghdam} onChange={e => changeSharhEghdam(index, e.target.value)} className="text-sm w-full border-0 p-2" placeholder="شرح اقدام" />
                                                                </td>
                                                                <td>
                                                                    <input type="text" value={item.eghdamKonande} onChange={e => changeEghdamKonande(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="اقدام کننده" />
                                                                </td>
                                                                <td>
                                                                    <input type="text" value={item.nameMasol} onChange={e => changeNameMasol(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="نام مسئول" />
                                                                </td>
                                                                <td>
                                                                    <input type="text" value={item.mohlatZamanBaresi} onChange={e => changeMohlatZamanBaresi(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="مهلت زمان بررسی" />
                                                                </td>
                                                                <td>
                                                                    <button type="button" onClick={_ => removeMosavabat(index)} className="hover:bg-gray-50 transition duration-150 text-sm flex items-center">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                        </svg>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="sm:col-span-6 border-t border-gray-300 py-5">
                                        <div className="flex justify-between items-center">
                                            <p className="w-40 text-sm ml-3">اسامی و امضای حاضرین*</p>
                                            <div className="w-full mt-1 flex rounded-md shadow-sm">
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
                                                            className="focus:outeline-none iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-xs"
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
                                        </div>
                                        <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="p-2 text-right">
                                                        نام و نام‌خانوادگی
                                                    </th>
                                                    <th className="text-right">
                                                        سمت
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    recipient.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    <p className="p-3">
                                                                        {item.full}
                                                                    </p>
                                                                </td>
                                                                <td>
                                                                    <p>
                                                                        {item.post_name}
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="sm:col-span-3">
                                        <Textarea
                                            inputStyle="h-20"
                                            title="توضیحات"
                                            name={
                                                desc
                                            }
                                            defaultValue={desc}
                                            rows="1"
                                            onChange={(
                                                event
                                            ) =>
                                                setDesc(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            error={errors["desc"]}
                                            type="text"
                                        />
                                    </div>

                                    <div className="sm:col-span-6 text-base">
                                        <p className="text-sm mb-2">
                                            سطح محرمانگی *
                                        </p>
                                        <div className="space-x-5 space-x-reverse ">
                                            <label>
                                                <input type="radio" name="confidentiality" onClick={_ => setConfidentiality(2)} checked={confidentiality == 2} />
                                                <span className="mr-2">خیلی محرمانه</span>
                                            </label>
                                            <label>
                                                <input type="radio" name="confidentiality" onClick={_ => setConfidentiality(1)} checked={confidentiality == 1} />
                                                <span className="mr-2">محرمانه</span>
                                            </label>
                                            <label>
                                                <input type="radio" name="confidentiality" onClick={_ => setConfidentiality(0)} checked={confidentiality == 0} />
                                                <span className="mr-2">عادی</span>
                                            </label>
                                        </div>
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
                                        <p className="text-red-500 text-sm font-bold">{errors['master']}</p>

                                    </div>
                                    <div className="flex mb-4 justify-end space-x-3 space-x-reverse">
                                        <button
                                            type="button"
                                            onClick={_ => onSubmit()}
                                            className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                                        >
                                            ویرایش
                                        </button>
                                        <button
                                            type="button"
                                            onClick={getBack}
                                            className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none ">
                                            <span>انصراف</span>
                                        </button>
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

export async function getServerSideProps(context) {
    const { id } = context.query;
    return { props: { id } };
}