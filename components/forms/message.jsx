import moment from "jalali-moment";
import fileDownload from "js-file-download";
import { CloudDownloadIcon } from "@heroicons/react/solid";
import axios from "../../lib/axios";
import { useState } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { Close } from "@material-ui/icons";
import Image from "next/image";
import { Dialog } from "@headlessui/react";

moment.locale('fa');

export default function Archive(props) {
    const { recived, message, timeSpan, attachments } = props;
    const [downloading, setDownloading] = useState();
    const [errors, setErrors] = useState([]);
    const [imageContent, setImageContent] = useState();
    const [pdfContent, setPdfContent] = useState();
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);

    const ShowPreview = (value, type, name) => {
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

    function blobToString(b) {
        var u, x;
        u = URL.createObjectURL(b);
        x = new XMLHttpRequest();
        x.open('GET', u, false); // although sync, you're not fetching over internet
        x.send();
        URL.revokeObjectURL(u);
        return x.responseText;
    }
    const DownloadFile = (value, type, name) => {
        setDownloading(value);
        setErrors([]);
        axios
            .get(`/api/v1/file/download`, {
                params: {
                    file_uuid: value,
                },
                responseType: "blob",
            })
            .then((res) => {
                setDownloading();
                if (name) {
                    fileDownload(res.data, name);
                }
                else {
                    fileDownload(res.data, value + "." + type);
                }
            }).catch((err) => {
                setDownloading()
                var object = {};
                object['download'] = JSON.parse(blobToString(err.response.data)).message;
                setErrors(object);
            });;
    };
    return (
        <>
            <div className="grid grid-cols-3">
                <div className="col-span-1">
                    <div className={`w-auto ${!recived ? "bg-white" : "bg-blue-200"} rounded-md flex justify-start mt-3 p-3`} >
                        {recived ? <h1>{message}</h1> : null}
                    </div>
                    {recived ? <div className="flex justify-between">
                        <p className="text-sm text-gray-500 font-light">
                            {moment.unix(timeSpan).format("HH:mm YYYY/MM/DD")}
                        </p>
                        <div className="grid grid-cols-2 gap-1" style={{ direction: "ltr" }}>
                            {Object.keys(attachments).length != 0
                                ? attachments.map((file, index) => (
                                    <span
                                        key={index}
                                        className="relative z-0 col-span-1 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                    >
                                        <button
                                            onClick={() =>
                                                DownloadFile(
                                                    file.uuid,
                                                    file.type,
                                                    file.name
                                                )
                                            }
                                            type="button"
                                            className="-mr-px relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                        >
                                            {downloading == file.uuid ?
                                                <CircularProgress className="-ml-1 ml-1 h-5 w-5" size={20} /> :
                                                <CloudDownloadIcon
                                                    className="-ml-1 ml-1 h-5 w-5"
                                                    aria-hidden="true"
                                                />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => ShowPreview(file.uuid,
                                                file.type,
                                                file.name)}
                                            className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                        >
                                            {file.name ?
                                                file.name
                                                :
                                                "فایل" + " " + (index + 1) +
                                                "." +
                                                file.type}
                                        </button>

                                    </span>
                                ))
                                : ""}

                        </div>
                        {errors['download'] ? (
                            <span className="text-sm text-red-500">
                                {
                                    errors['download']
                                }
                            </span>) : null}
                    </div> : null}
                </div>
                <div className="col-span-1 " >
                </div>
                <div className="col-span-1">
                    <div className={`col-span-1 w-auto ${recived ? "bg-white" : "bg-gray-200"} rounded-md flex justify-start mt-3 p-3`} >
                        {!recived ? <h1>{message}</h1> : null}
                    </div>
                    {!recived ? <div className="flex justify-between">
                        <p className="text-sm text-gray-500 font-light">
                            {moment.unix(timeSpan).format("HH:mm YYYY/MM/DD")}
                        </p>
                        <div className="grid grid-cols-2 gap-1" style={{ direction: "ltr" }}>
                            {Object.keys(attachments).length != 0
                                ? attachments.map((file, index) => (
                                    <span
                                        key={index}
                                        className="relative z-0 col-span-1 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                    >
                                        <button
                                            onClick={() =>
                                                DownloadFile(
                                                    file.uuid,
                                                    file.type,
                                                    file.name
                                                )
                                            }
                                            type="button"
                                            className="-mr-px relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                        >
                                            {downloading == file.uuid ?
                                                <CircularProgress className="-ml-1 ml-1 h-5 w-5" size={20} /> :
                                                <CloudDownloadIcon
                                                    className="-ml-1 ml-1 h-5 w-5"
                                                    aria-hidden="true"
                                                />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => ShowPreview(file.uuid,
                                                file.type,
                                                file.name)}
                                            className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                        >
                                            {file.name ?
                                                file.name
                                                :
                                                "فایل" + " " + (index + 1) +
                                                "." +
                                                file.type}
                                        </button>

                                    </span>
                                ))
                                : ""}
                        </div>
                    </div> : null}


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

        </>
    );
}
