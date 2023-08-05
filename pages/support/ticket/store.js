// BY @A
import { useState } from "react";

// NAVIGATION
import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import Link from "next/link";
import navigationList from "../../../components/layout/navigationList";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/auth";
import { forwardRef } from "react";
import { XIcon } from "@heroicons/react/solid";

// ELEMENTS
import InputBox from "../../../components/forms/inputBox";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

// LIB
import axios from "../../../lib/axios";
import Textarea from "../../../components/forms/textarea";
import LinearProgress from '@mui/material/LinearProgress';
import { Close } from "@material-ui/icons";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { CircularProgress } from "@mui/material";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function StoreCalendar() {
    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });

    const { asPath } = useRouter();
    const [ticket, setTicket] = useState("");
    const [title, setTitle] = useState("");
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
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

    const handleToClose = (event, reason) => {
        window.location.href = "/support/ticket";
    };

    const deleteFile = (value, index) => {
        axios.delete(`/api/v1/file/delete`, {
            data: {
                file_uuid: attachments[index],
                type: "docs",
            },
        });
        setFileNames([
            ...fileNames.slice(0, index),
            ...fileNames.slice(index + 1),
        ]);
        setAttachments([
            ...attachments.slice(0, index),
            ...attachments.slice(index + 1),
        ]);
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

    function onSubmit(e) {
        e.preventDefault();
        var object = {};
        var hasError = false;
        if (title == "") {
            object['title'] = 'موضوع تیکت الزامی است';
            hasError = true;
        }
        if (ticket == "") {
            object['ticket'] = 'متن تیکت الزامی است';
            hasError = true;
        }
        if (hasError) {
            setErrors(object);
            return;
        }
        axios
            .post('/api/v1/ticket/add',
                {
                    subject: title,
                    body: ticket,
                    attachments: strimer(attachments)
                })
            .then((res) => {
                setOpen(true);
            })
            .catch((err) => setErrors(err.response.data.message));
    }

    function strimer(data) {
        let tdata = String(data.map(dd => dd));
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
                                    <div className="sm:col-span-6">
                                        <h2 className="text-xl">
                                            ثبت تیکت جدید
                                        </h2>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <InputBox
                                            title="موضوع *"
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
                                    <div className="sm:col-span-6">
                                        <Textarea
                                            title="متن پیام *"
                                            name={
                                                ticket
                                            }
                                            rows="5"
                                            onChange={(
                                                event
                                            ) =>
                                                setTicket(
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            error={errors["ticket"]}
                                            type="text"
                                            isrequired="true"
                                        />
                                    </div>

                                </div>
                                <div className="sm:col-span-4">
                                    <label
                                        htmlFor="cover-photo"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        افزودن ضمیمه
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
                                                        multiple={true}
                                                        className="sr-only"
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
                                                        onClick={() => ShowPreview(attachments[index],
                                                            file,
                                                            attachments[index].name)}
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
                                <div className="pt-5 border-t mt-5">
                                    <div>
                                        <p className="text-green-500 text-sm font-bold">{success}</p>
                                    </div>
                                    <div className="flex mb-4 justify-end">

                                        <button
                                            type="submit"
                                            className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none ">
                                            ثبت
                                        </button>
                                        <Link
                                            href={{
                                                pathname: "/support/ticket",
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