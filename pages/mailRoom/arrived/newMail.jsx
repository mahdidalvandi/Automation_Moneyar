import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import { useState, useRef, useEffect, Fragment } from "react";
import { PlusIcon, XIcon, SearchIcon } from "@heroicons/react/solid";
import { Editor } from "@tinymce/tinymce-react";
import { useAuth } from "../../../hooks/auth";
import axios from "../../../lib/axios";
import { useRouter } from "next/router";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import RecieversDialog from "../../../components/forms/recieversDialog";
import CopiesDialog from "../../../components/forms/recieversDialog";
import RegisterMailreceipt from "../../../components/forms/registerMailreceipt"
import MailsDialog from "../../../components/forms/mailsDialog";
import Forbidden from "../../../components/forms/forbidden";
import InputBox from "../../../components/forms/inputBox";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import LinearProgress from '@mui/material/LinearProgress';
import Image from "next/image";
import { Close } from "@material-ui/icons";
import { Dialog } from "@headlessui/react";
import { CircularProgress } from "@mui/material";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const typeMethods = [

    { id: "0", title: "وارده" },
    { id: "1", title: "صادره" },
];

const priorityMethods = [
    { id: "1", title: "عادی" },
    { id: "2", title: "فوری" },
    { id: "3", title: "خیلی فوری" },
];

const categoryMethods = [
    { id: "1", title: "اداری" },
    { id: "2", title: "شخصی" },
];

const actionMethods = [
    { id: "1", title: "استحضار" },
    { id: "2", title: "اقدام" },
];

export default function NewEmail() {
    const { asPath } = useRouter();
    const router = useRouter();
    const { send } = router.query;

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

    const editorRef = useRef(null);
    const [query, setQuery] = useState("");
    const [mailNo, setMailNo] = useState();
    const [mailSubject, setMailSubject] = useState();
    const [receivedType, setReceivedType] = useState("");
    const [mailSender, setMailSender] = useState();
    const [isRegistered, setIsRegistered] = useState(false);
    const [mailIndicator, setMailIndicator] = useState("");
    const [receiptOpen, setReceiptOpen] = useState(false);
    const [mailDate, setMailDate] = useState("");
    const [errors, setErrors] = useState([]);
    const [recipient, setRecipient] = useState([]);
    const [isCopy, setIsCopy] = useState([]);
    const [isCarbonCopy, setIsCarbonCopy] = useState([]);
    const [regarding, setRegarding] = useState({ indic: "", subj: "" });
    const [people, setPeople] = useState([]);
    const [type, setTypeMethod] = useState("0");
    const [attachements, setAttachments] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [recieversDialogVisibility, setRecieversDialogVisibility] = useState(false);
    const [copiesDialogVisibility, setCopiesDialogVisibility] = useState(false);
    const [mailsDialogVisibility, setMailsDialogVisibility] = useState(false);
    const [defaultMailsData, setDefaultMailsData] = useState({});
    const [mailsData, setMailsData] = useState({});
    const [loadingMailsData, setLoadingMailsData] = useState(false);
    const [groupData, setGroupData] = useState();
    const [loadingGroupData, setLoadingGroupData] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [uploading, setUploading] = useState(false);
    const [sendingForm, setSendingForm] = useState(false);
    const [sendingRegisterdForm, setSendingRegisterdForm] = useState(false);
    const [imageContent, setImageContent] = useState();
    const [pdfContent, setPdfContent] = useState();
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);

    const ShowPreview = (value, type, name) => {
        var re = /(?:\.([^.]+))?$/;
        type = re.exec(type)[1];
        if (type == "png" || type == "jpg" || type == "jpeg" || type == "gif" || type == "pdf") {
            setPreviewDialogOpen(true);
            setPreviewLoading(true);
            axios
                .get(`/api/v1/file/download`, {
                    params: {
                        file_uuid: value,
                    },
                    responseType: "blob",
                })
                .then((res) => {
                    console.log(res.data)
                    if (type == "pdf") {
                        setPdfContent(window.URL.createObjectURL(res.data));
                        setImageContent(null);
                    }
                    else if (type == "png" || type == "jpg" || type == "jpeg" || type == "gif") {
                        setImageContent(res.data);
                        setPdfContent(null);
                    }
                    setPreviewLoading(false);
                });
        }
    };

    const uploadChange = (event) => {
        setErrors([]);
        for (let i = 0; i < event.target.files.length; i++) {
            setUploading(true);
            if (event.target.files[i].size > 10e6) {
                var object = {};
                object['upload'] = 'حجم فایل بیشتر از ۱۰ مگابایت می  باشد';
                setErrors(object);
                setUploading(false);
                continue;
            }
            try {
                const fileUpload = axios({
                    method: "post",
                    url: "/api/v1/file/upload",
                    data: { attach: event.target.files[i], type: "docs" },
                    headers: { "Content-Type": "multipart/form-data" },
                }).then(function (response) {
                    setUploading(false);
                    setFileNames((oldArray) => [
                        ...oldArray,
                        event.target.files[i].name,
                    ]);
                    setAttachments((oldArray) => [
                        ...oldArray,
                        response.data.data.file_uuid,
                    ]);
                }).catch((err) => {
                    setUploading(false);
                    var object = {};
                    object['upload'] = 'خطا در آپلود فایل';
                    setErrors(object);
                });
            } catch (error) {
                setUploading(false);
                var object = {};
                object['upload'] = 'خطا در آپلود فایل';
                setErrors(object);
            }
        }
    };

    const deleteFile = (value, index) => {
        axios.delete(`/api/v1/file/delete`, {
            data: {
                file_uuid: value,
                type: "docs",
            },
        });
        setFileNames([
            ...fileNames.slice(0, index),
            ...fileNames.slice(index + 1),
        ]);
        setAttachments([
            ...attachements.slice(0, index),
            ...attachements.slice(index + 1),
        ]);
    };

    useEffect(() => {
        axios.get(`/api/v1/cartable/list`).then((response) => {
            setMailsData(response.data.data);
            setDefaultMailsData(response.data.data);
            setLoadingMailsData(false);
        });
    }, [mailsDialogVisibility]);

    useEffect(() => {
        axios.get(`/api/v1/group/list/all`).then((response) => {
            setGroupData(response.data.data);
            setLoadingGroupData(false);
        });
    }, [recieversDialogVisibility]);

    const onRecepientGroupSelect = (val) => {
        axios
            .get(`/api/v1/group/list/users?group_uuid=${val}`)
            .then((response) => {
                if (recipient === undefined || recipient.length == 0) {
                    setRecipient(response.data.data);
                } else {
                    const difference = [
                        ...getDifference(response.data.data, recipient),
                    ];
                    difference.forEach((element) => {
                        setRecipient((currentArray) => [
                            ...currentArray,
                            element,
                        ]);
                    });
                }
            });
    };

    const onCopiesGroupSelect = (val) => {
        axios
            .get(`/api/v1/group/list/users?group_uuid=${val}`)
            .then((response) => {
                if (isCopy === undefined || isCopy.length == 0) {
                    setIsCopy(response.data.data);
                } else {
                    const difference = [
                        ...getDifference(response.data.data, isCopy),
                    ];
                    difference.forEach((element) => {
                        setIsCopy((currentArray) => [...currentArray, element]);
                    });
                }
            });
    };

    const onCarbonCopiesGroupSelect = (val) => {
        axios
            .get(`/api/v1/group/list/users?group_uuid=${val}`)
            .then((response) => {
                if (isCarbonCopy === undefined || isCarbonCopy.length == 0) {
                    setIsCarbonCopy(response.data.data);
                } else {
                    const difference = [
                        ...getDifference(response.data.data, isCarbonCopy),
                    ];
                    difference.forEach((element) => {
                        setIsCarbonCopy((currentArray) => [
                            ...currentArray,
                            element,
                        ]);
                    });
                }
            });
    };

    function getDifference(array1, array2) {
        return array1.filter((object1) => {
            return !array2.some((object2) => {
                return object1.id === object2.id;
            });
        });
    }


    const registerArrivedMail = async (event) => {
        event.preventDefault();
        setSendingForm(true);
        const mailFormData = new FormData();
        var hasError = false;
        var object = {};
        if (!mailNo) {
            object['mail_no'] = 'شماره نامه وارده الزامی است';
            hasError = true;
        }
        if (!mailDate) {
            object['mail_Date'] = 'تاریخ نامه الزامی است';
            hasError = true;
        }
        // if (!registerDate) {
        //     object['registerDate'] = 'تاریخ ثبت نامه الزامی است';
        //     hasError = true;
        // }
        if (!mailSender) {
            object['mail_Sender'] = 'فرستنده نامه الزامی است';
            hasError = true;
        }
        if (!mailSubject) {
            object['mail_Subject'] = 'موضوع نامه الزامی است';
            hasError = true;
        }

        if (hasError) {
            setErrors(object);
            setSendingForm(false);
            return;
        }
        mailFormData.append("letter_subject", mailSubject);
        mailFormData.append("letter_sender_name", mailSender);
        mailFormData.append("letter_number", mailNo);
        mailFormData.append(
            "letter_timestamp",
            mailDate.unix != undefined ? mailDate.unix : ""
        );
        mailFormData.append("letter_received_type", receivedType);
        mailFormData.append("attachments", attachements);
        mailFormData.append("type", type);


        try {
            const response = await axios({
                method: "post",
                url: "/api/v1/mailroom/add",
                data: mailFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {
                setMailIndicator(response.data.data.indicator);
                setSendingForm(false);
                setReceiptOpen(true);
                setIsRegistered(true);
            }
        } catch (error) {
            object['master'] = error.response.data.message;
            setErrors(object);
            setSendingForm(false);
        }
    }


    const registerMailAndSend = async (event) => {
        event.preventDefault();
        setSendingRegisterdForm(true);
        const mailFormData = new FormData();
        mailFormData.append(
            "body",
            editorRef.current.getContent() != null
                ? editorRef.current.getContent()
                : ""
        );
        mailFormData.append(
            "recipient",
            recipient != "" ? recipient.map(({ id }) => id) : ""
        );

        mailFormData.append("regarding", regarding.indic);
        mailFormData.append("indicator", mailIndicator);


        try {
            const response = await axios({
                method: "post",
                url: "/api/v1/mailroom/letter/add",
                data: mailFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {

                window.location.assign("/mailRoom/arrived");
            }
        } catch (error) {
            setErrors(error.response.data.message);
            setSendingRegisterdForm(false);
        }
    }

    const filteredPeople =
        query === ""
            ? people
            : people.filter((person) => {
                return person.full.includes(query.toLowerCase());
            });

    if (isLoading || !user) {
        return null;
    }
    function CheckIfAccessToPage(val) {
        if (currentUserActions && currentUserActions.indexOf(val) > -1) return true;
        return false;
    }
    // {mailIndicator && !receiptOpen ? setReceiptOpen(true) : null}
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
                            <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                                <div className="border-b border-gray-200">
                                    <div className="sm:flex sm:items-baseline">
                                        <h3 className="text-lg text-gray-900">
                                            ایجاد نامه جدید
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-4 sm:px-6 md:px-8">
                                <form
                                    autoComplete="off"
                                    // onSubmit={onSubmit}
                                    className="space-y-8 divide-y divide-gray-200"
                                >
                                    <div className="space-y-8 divide-y divide-gray-200">
                                        <div>
                                            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                                <div className="sm:col-span-5"> {/*typeMethod */}
                                                    <p
                                                        htmlFor="cover-photo"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        نوع نامه *
                                                    </p>
                                                    <fieldset className="mt-4">
                                                        <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                                            {typeMethods.map(
                                                                (
                                                                    typeMethods
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            typeMethods.id
                                                                        }
                                                                        className="flex items-center"
                                                                    >
                                                                        <label
                                                                            htmlFor={
                                                                                typeMethods.id
                                                                            }
                                                                            className="ml-3 block text-sm font-medium text-gray-700"
                                                                        >
                                                                            <input
                                                                                id={
                                                                                    typeMethods.id
                                                                                }
                                                                                name="confidentialityMethod"
                                                                                type="radio"
                                                                                disabled="true"
                                                                                defaultChecked={
                                                                                    typeMethods.id ===
                                                                                    "0"
                                                                                }
                                                                                className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    setTypeMethod(
                                                                                        e
                                                                                            .target
                                                                                            .id
                                                                                    );
                                                                                }}
                                                                            />
                                                                            {
                                                                                typeMethods.title
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="sm:col-span-4"> {/*mailNo*/}
                                                    <InputBox
                                                        title="شماره نامه وارده *"
                                                        name={mailNo}
                                                        value={mailNo}
                                                        onChange={(event) =>
                                                            setMailNo(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["mail_no"]}
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2"> {/*mailDate*/}
                                                    <label
                                                        htmlFor="date"
                                                        className="block text-sm font-medium  text-gray-700 mb-1"
                                                    >
                                                        * تاریخ نامه
                                                    </label>
                                                    <DatePicker
                                                        id="321"

                                                        format="YYYY/MM/DD"
                                                        value={
                                                            mailDate
                                                        }
                                                        onChange={(
                                                            date
                                                        ) => {
                                                            setMailDate(
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
                                                        inputClass={`appearance-none block w-full px-3 py-2 border ${errors && errors["mail_Date"] ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                                                        containerStyle={{
                                                            width: "100%",
                                                        }}
                                                        required="true"
                                                    />
                                                    {errors && errors["mail_Date"] ?
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors["mail_Date"]}
                                                        </p> : null}
                                                </div>
                                                <div className="sm:col-span-6"> {/*sender*/}
                                                    <InputBox
                                                        title="فرستنده نامه *"
                                                        name={mailSender}
                                                        value={mailSender}
                                                        onChange={(event) =>
                                                            setMailSender(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["mail_Sender"]}
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>

                                                <div className="sm:col-span-3"> {/*mailSubject*/}
                                                    <InputBox
                                                        title="موضوع نامه *"
                                                        name={mailSubject}
                                                        value={mailSubject}
                                                        onChange={(event) =>
                                                            setMailSubject(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["mail_Subject"]}
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                <div className="sm:col-span-3"> {/*receivedType*/}
                                                    <InputBox
                                                        title="نحوه ارسال "
                                                        name={receivedType}
                                                        value={receivedType}
                                                        onChange={(event) =>
                                                            setReceivedType(
                                                                event.target.value
                                                            )
                                                        }
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                <div className="sm:col-span-4">
                                                    <label
                                                        htmlFor="cover-photo"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        افزودن نامه و ضمایم
                                                    </label>
                                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                        <div className="space-y-1 text-center">
                                                            <svg
                                                                className="mx-auto h-12 w-12 text-gray-400"
                                                                stroke="currentColor"
                                                                fill="none"
                                                                viewBox="0 0 48 48"
                                                                aria-hidden="true"
                                                            >
                                                                <path
                                                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                                    strokeWidth={2}
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                            <div className=" text-sm text-gray-600">
                                                                <label
                                                                    htmlFor="file-upload"
                                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
                                                                >
                                                                    <span>
                                                                        آپلود فایل
                                                                    </span>
                                                                    <input
                                                                        id="file-upload"
                                                                        name="file-upload"
                                                                        type="file"
                                                                        className="sr-only"
                                                                        multiple={true}
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            uploadChange(
                                                                                e
                                                                            );
                                                                        }}
                                                                    />
                                                                </label>

                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                کمتر از ۱۰ مگابایت
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {uploading ? <LinearProgress className="mt-2 mr-2" />
                                                        : null}
                                                    {Object.keys(fileNames)
                                                        .length != 0
                                                        ? fileNames.map(
                                                            (file, index) => (
                                                                <span
                                                                    key={index}
                                                                    className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => ShowPreview(attachements[index],
                                                                            file,
                                                                            attachements[index].name)}
                                                                        className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                                    >
                                                                        {file}
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            deleteFile(
                                                                                file,
                                                                                index
                                                                            )
                                                                        }
                                                                        type="button"
                                                                        className="-mr-px relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                                    >
                                                                        <XIcon
                                                                            className="-ml-1 ml-1 h-5 w-5"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </button>
                                                                </span>
                                                            )
                                                        )
                                                        : ""}
                                                </div>
                                                <div className="sm:col-span-6">
                                                    {errors["upload"] ? (
                                                        <span className="text-sm text-red-500">
                                                            {
                                                                errors["upload"]
                                                            }
                                                        </span>) : null}
                                                </div>
                                                <div className="sm:col-span-6"> {/*registerButton*/}
                                                    <button
                                                        onClick={registerArrivedMail}
                                                        disabled={isRegistered || sendingForm}
                                                        className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${isRegistered || sendingForm ? "bg-gray-600" : "bg-amber-600"} ${isRegistered || sendingForm ? "hover:bg-gray-600" : "hover:bg-amber-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                                    >
                                                        {isRegistered ? "ثبت شده" : sendingForm ? "در حال ثبت" : "ثبت"}

                                                    </button>
                                                    {/* {mailIndicator ?
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {`نامه وارده با موفقیت ثبت شد. شماره دبیرخانه:${mailIndicator}`}
                                                        </p> : null} */}
                                                </div>
                                                {/* {mailIndicator?
                                                <div className="sm:col-span-5"> {/*registerMessage}
                                                            <p className="text-sm text-red-500 ">
                                                               {`نامه وارده با موفقیت ثبت شد. شماره دبیرخانه:${mailIndicator}`}
                                                            </p>
                                                </div> : null} */}



                                                {isRegistered ?
                                                    <>
                                                        <div className="sm:col-span-6"> {/*reciver*/}
                                                            <label
                                                                htmlFor="cover-photo"
                                                                className="block text-sm font-medium text-gray-700"
                                                            >
                                                                گیرنده نامه *
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

                                                                <button
                                                                    onClick={(_) => {
                                                                        setRecieversDialogVisibility(
                                                                            true
                                                                        );
                                                                    }}
                                                                    type="button"
                                                                    className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium  text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                                                                >
                                                                    <PlusIcon
                                                                        className="h-5 w-5 text-gray-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <span>
                                                                        گروه دریافت کننده
                                                                    </span>
                                                                </button>
                                                            </div>

                                                            {errors["recipient"] ? (
                                                                <span className="text-sm text-red-500">
                                                                    {errors["recipient"]}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                        <div className="sm:col-span-6">
                                                            <label
                                                                htmlFor="cover-photo"
                                                                className="block text-sm font-medium text-gray-700"
                                                            >
                                                                متن ارجاع
                                                            </label>
                                                            <Editor
                                                                tinymceScriptSrc={process.env.NEXT_PUBLIC_FRONT_URL + '/tinymce/tinymce.min.js'}
                                                                onInit={(evt, editor) =>
                                                                (editorRef.current =
                                                                    editor)
                                                                }
                                                                init={{
                                                                    selector: "textarea",
                                                                    menubar: false,
                                                                    directionality: "rtl",
                                                                }}
                                                            />
                                                            {errors["body"] ? (
                                                                <span className="text-sm text-red-500">
                                                                    {errors["body"]}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                        <div className="sm:col-span-4">
                                                            <label
                                                                htmlFor="cover-photo"
                                                                className="block text-sm font-medium text-gray-700"
                                                            >
                                                                عطف به نامه
                                                            </label>
                                                            {regarding.subj == "" ? (
                                                                <button
                                                                    onClick={(_) => {
                                                                        setMailsDialogVisibility(
                                                                            true
                                                                        );
                                                                    }}
                                                                    type="button"
                                                                    className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium  text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                                                                >
                                                                    <PlusIcon
                                                                        className="h-5 w-5 text-gray-400"
                                                                        aria-hidden="true"
                                                                    />
                                                                    <span>
                                                                        افزودن نامه از لیست
                                                                    </span>
                                                                </button>
                                                            ) : (
                                                                <p className="mt-4">
                                                                    {regarding.subj +
                                                                        " (" +
                                                                        regarding.indic +
                                                                        ")"}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="sm:col-span-6">
                                                            {/* <p className="text-sm text-red-500 ">
                                                                تکمیل تمامی فیلدهای ستاره
                                                                دار (*) اجباری است.
                                                            </p> */}
                                                        </div>
                                                        <div className="sm:col-span-6"> {/*registerButton*/}
                                                            <button
                                                                onClick={registerMailAndSend}
                                                                disabled={sendingRegisterdForm}
                                                                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${sendingRegisterdForm ? "bg-gray-600" : "bg-amber-600"} ${sendingRegisterdForm ? "hover:bg-gray-600" : "hover:bg-amber-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                                            >
                                                                {sendingRegisterdForm ? "در حال ثبت" : "ثبت و ارجاع"}

                                                            </button>
                                                        </div>

                                                    </> : null}
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="pt-5">
                                        <div className="flex justify-end">
                                            <Link
                                                href={{
                                                    pathname: "/mailRoom/arrived",
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center py-2 px-4 ml-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    <span>بازگشت</span>
                                                </button>
                                            </Link>
                                           
                                        </div>
                                    </div> */}
                                </form>
                            </div>
                        </div>
                    </main> : <Forbidden />}
                {previewDialogOpen ? (
                    <Dialog
                        open={previewDialogOpen}
                        onClose={() => setPreviewDialogOpen(false)}
                        className="relative z-50"
                    >
                        <div
                            className="fixed inset-0 bg-black/30"
                            aria-hidden="true"
                        />
                        <div className="fixed inset-0  flex items-start justify-center p-2">
                            <div style={{ height: "80vh", width: "80vh" }} className="relative w-80 h-80  border border-gray-200 bg-gray-100 rounded-md overflow-hidden">
                                {previewLoading ?
                                    <div style={{ height: "80vh", width: "80vh" }} className="flex justify-center items-center ">
                                        <CircularProgress style={{ height: "10vh", width: "10vh" }} />  </div> :
                                    imageContent ?
                                        <Image
                                            src={URL.createObjectURL(imageContent)}
                                            layout="fill"
                                            objectFit="contain"
                                            quality={100}
                                        /> : pdfContent ?
                                            <embed
                                                src={pdfContent}
                                                type="application/pdf"
                                                width="100%"
                                                height="100%"
                                            />
                                            : null}
                            </div>
                            <button
                                onClick={() => setPreviewDialogOpen(false)}
                                className="text-white mr-2"
                            >
                                <Close className="bg-red-500 rounded-md"></Close>
                            </button>
                        </div>
                    </Dialog>
                ) : null}
            </div>
            <RecieversDialog
                data={groupData}
                dialogOpen={recieversDialogVisibility}
                setDialog={(par) => setRecieversDialogVisibility(par)}
                setSelect={(receivers) => onRecepientGroupSelect(receivers)}
            />
            <CopiesDialog
                data={groupData}
                dialogOpen={copiesDialogVisibility}
                setDialog={(par) => setCopiesDialogVisibility(par)}
                setSelect={(receivers) => onCopiesGroupSelect(receivers)}
            />
            <RegisterMailreceipt
                indicator={mailIndicator}
                mailNo={mailNo}
                mailSubject={mailSubject}
                mailDate={mailDate.unix}
                dialogOpen={receiptOpen}
                setDialog={(par) => setReceiptOpen(par)}
                setSelect={(props) => {
                    isRegistered(true)
                }}
            />
            <MailsDialog
                data={mailsData}
                dialogOpen={mailsDialogVisibility}
                setDialog={(par) => setMailsDialogVisibility(par)}
                setSelect={(props) =>
                    setRegarding({ indic: props.indic, subj: props.subj })
                }
            />
        </div>
    );
}
