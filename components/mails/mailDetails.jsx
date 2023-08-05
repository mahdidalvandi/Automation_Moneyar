import { Editor } from "@tinymce/tinymce-react";
import Image from "next/image";
import TextWithLabel from "../../components/forms/textWithLabel";
import { useRef } from "react";
import { CloudDownloadIcon } from "@heroicons/react/solid";
import axios from "../../lib/axios";
import Textarea from "../../components/forms/textarea";
import fileDownload from "js-file-download";
import { useState, } from "react";
import { Dialog } from "@headlessui/react";
import CircularProgress from '@mui/material/CircularProgress';
import dynamic from "next/dynamic";
import { Close } from "@material-ui/icons";

const ReferenceTree = dynamic(
    () => import("../../components/tree/ReferenceTree"),
    {
        ssr: false,
    }
);
const confidentialityMethods = [
    { id: "0", title: "" },
    { id: "1", title: "عادی" },
    { id: "2", title: "محرمانه" },
    { id: "3", title: "خیلی محرمانه" },
];

const priorityMethods = [
    { id: "0", title: "" },
    { id: "1", title: "عادی" },
    { id: "2", title: "فوری" },
    { id: "3", title: "خیلی فوری" },
];

const categoryMethods = [
    { id: "0", title: "" },
    { id: "1", title: "اداری" },
    { id: "2", title: "شخصی" },
];

const actionMethods = [
    { id: "0", title: "" },
    { id: "1", title: "استحضار" },
    { id: "2", title: "اقدام" },
];

function MailDetails(props) {
    const {
        subject,
        author,
        create_date_time,
        recipient,
        body,
        attachments,
        action,
        confidentiality,
        category,
        priority,
        letterNo,
        isCopy,
        regarding,
        isMailRoomIssued,
        isMailRoom,
        status,
        issuedSubject,
        issuedRecivers,
        issuedDescription,
        uuid,
        type,
        originalUuid,
        according
    } = props;

    const [regardingData, setRegardingData] = useState({});
    const [isRegardingLoading, setIsRegardingLoading] = useState(false);
    const [regardingOpen, setRegardingOpen] = useState(false);
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [referenceTreeOpen, setReferenceTreeOpen] = useState(false);
    const [rejectDescription, setRejectDescription] = useState();
    const [pdfContent, setPdfContent] = useState();
    const [treeReference, setTreeReference] = useState();
    const [imageContent, setImageContent] = useState();
    const [errors, setErrors] = useState([]);
    const [downloading, setDownloading] = useState();
    const [previewLoading, setPreviewLoading] = useState(false);

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
            });
    };

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
    function getTree() {
        setReferenceTreeOpen(true);
    }


    const draftApproval = async (e) => {
        e.preventDefault();
        axios
            .post('/api/v1/mailroom/issued/approved',
                {
                    action_uuid: uuid,
                    body: editorRef.current.getContent() != null ? editorRef.current.getContent() : "",
                    comment: rejectDescription
                })
            .then((res) => {
                window.location.assign("/cartable/inbox");

            })
            .catch((err) => setErrors(err.response.data.message));
    }
    const draftRejection = async (e) => {
        e.preventDefault();
        var object = {};
        if (!rejectDescription) {
            object['reject_description'] = 'متن توضیحات الزامی است';
            setErrors(object);
            return;
        }
        axios
            .post('/api/v1/mailroom/issued/rejected',
                {
                    action_uuid: uuid,
                    comment: rejectDescription
                })
            .then((res) => {
                window.location.assign("/cartable/inbox");

            })
            .catch((err) => setErrors(err.response.data.message));
    }

    function getRegarding(uuid) {
        axios
            .get(`/api/v1/letter/regarding/uuid/${uuid}`)
            .then((res) => {
                setRegardingData(res.data.data[0])
                setRegardingOpen(true)
            })
            .catch((error) => {
            })
    }
    const editorRef = useRef("null");
    return (
        <div className="py-6">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="border-b border-gray-400">
                    <div className="grid grid-cols-1 gap-y-2 gap-x-4 mb-2 sm:grid-cols-11">
                        <div className="sm:col-span-7">
                            <h3 className="text-lg text-gray-900">
                                {subject ? subject : ""}
                            </h3>
                        </div>
                        {action ?
                            <div className="sm:col-span-1">
                                <span className="text-sm text-center">جهت:</span>
                                <h3 className="text-sm text-gray-500 border border-gray-200 rounded-md text-center bg-gray-300 ">
                                    {action ? actionMethods[action].title : ""}
                                </h3>
                            </div> : null}
                        {confidentiality ?
                            <div className="sm:col-span-1">
                                <span className="text-sm text-center">
                                    محرمانگی:
                                </span>
                                <h3 className="text-sm text-gray-500 border border-gray-200 rounded-md text-center bg-gray-300 ">
                                    {confidentiality
                                        ? confidentialityMethods[confidentiality]
                                            .title
                                        : ""}
                                </h3>
                            </div> : null}
                        {priority ?
                            <div className="sm:col-span-1">
                                <span className="text-sm text-center">اولویت:</span>
                                <h3 className="text-sm text-gray-500 border border-gray-200 rounded-md text-center bg-gray-300 ">
                                    {priority
                                        ? priorityMethods[priority].title
                                        : ""}
                                </h3>
                            </div> : null}
                        {letterNo && letterNo != 0 ?
                            <div className="sm:col-span-1">
                                <span className="text-sm text-center"> نامه وارده:</span>
                                <h3 className="text-sm text-gray-500 border border-gray-200 rounded-md text-center bg-gray-300 ">
                                    {letterNo
                                        ? letterNo
                                        : ""}
                                </h3>
                            </div> : null}

                    </div>
                    <div className="flex justify-end mb-2">
                        {isMailRoomIssued || isMailRoom ? null :
                            !according ? <button
                                type="button"
                                onClick={(e) => getTree(uuid)}
                                className="inline-flex justify-center py-2 px-4 ml-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 "
                            >
                                <span>درخت ارجاع</span>
                            </button> : null}
                    </div>
                </div>
            </div>
            <div className="w-full px-4 sm:px-6 md:px-8">
                <form className="space-y-8 divide-y divide-gray-200">
                    <div className="space-y-8 divide-y divide-gray-200">
                        <div>
                            <div className="mt-2 grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    <TextWithLabel
                                        title="فرستنده"
                                        text={author}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <TextWithLabel
                                        title="زمان ایجاد نامه"
                                        text={create_date_time}
                                    />
                                </div>
                                <div className="sm:col-span-4">
                                    <TextWithLabel
                                        title="به"
                                        text={recipient}
                                    />
                                </div>
                                {isMailRoomIssued || isMailRoom ? null :
                                    <div className="sm:col-span-2">
                                        <TextWithLabel
                                            title="موضوع"
                                            text={
                                                category
                                                    ? categoryMethods[category]
                                                        .title
                                                    : ""
                                            }
                                        />
                                    </div>}
                                {isMailRoomIssued || isMailRoom ? null :
                                    <div className="sm:col-span-4">
                                        <TextWithLabel
                                            title="رونوشت"
                                            text={isCopy ? isCopy : "ندارد"}
                                        />
                                    </div>
                                }
                                <div className="sm:col-span-2">

                                    <TextWithLabel
                                        title="عطف"
                                    />
                                    <div className="mb-4">
                                        <span
                                            key={1}
                                            className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                        >
                                            {regarding ?
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        getRegarding(regarding.uuid)
                                                    }
                                                    className="relative inline-flex items-center px-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                >
                                                    {regarding ? regarding.title : ""}
                                                </button> : "ندارد"}


                                        </span>

                                    </div>
                                </div>
                                {isMailRoomIssued ?
                                    <>
                                        <div className="sm:col-span-4">
                                            <TextWithLabel
                                                title="موضوع نامه صادره"
                                                text={issuedSubject ? issuedSubject : "ندارد"}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <TextWithLabel
                                                title="دریافت کننده نامه"
                                                text={issuedRecivers ? issuedRecivers : "ندارد"}
                                            />
                                        </div>
                                        <div className="sm:col-span-6">
                                            <TextWithLabel
                                                title="توضیحات نامه صادره"
                                                text={issuedDescription ? issuedDescription : "ندارد"}
                                            />
                                        </div>
                                    </>

                                    : null}

                                <div className="sm:col-span-6">
                                    <TextWithLabel title="متن نامه" />

                                    <Editor
                                        tinymceScriptSrc={process.env.NEXT_PUBLIC_FRONT_URL + '/tinymce/tinymce.min.js'}
                                        onInit={(evt, editor) =>
                                            (editorRef.current = editor)
                                        }
                                        disabled={isMailRoomIssued && type == 0 && status == 0 ? false : true}
                                        initialValue={body}
                                        init={{
                                            height: 300,
                                            selector: "textarea",
                                            menubar: false,
                                            directionality: "rtl",
                                            readonly: !isMailRoomIssued && type == 0 && status == 0 ? false : true,
                                            toolbar: isMailRoomIssued && type == 0 && status == 0 ? true : false,
                                        }}
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <TextWithLabel title="ضمیمه" />

                                    <div className="mb-4">
                                        {Object.keys(attachments).length != 0
                                            ? attachments.map((file, index) => (
                                                <span
                                                    key={index}
                                                    className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                                >
                                                    <button
                                                        onClick={() => ShowPreview(file.uuid,
                                                            file.type,
                                                            file.name)}
                                                        type="button"
                                                        className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                    >
                                                        {file.name ?
                                                            file.name
                                                            :
                                                            "فایل" +
                                                            "." +
                                                            file.type}
                                                    </button>

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
                                                </span>
                                            ))
                                            : ""}
                                    </div>
                                </div>
                                <div className="sm:col-span-6">
                                    {errors['download'] ? (
                                        <span className="text-sm text-red-500">
                                            {
                                                errors['download']
                                            }
                                        </span>) : null}
                                </div>
                                {isMailRoomIssued && type == 0 && status == 0 ?
                                    <div className="sm:col-span-6 pt-2 pb-2 px-10 border-t border-gray-200">
                                        <div>
                                            <Textarea
                                                title="توضیحات"
                                                name="Description"
                                                onChange={(e) => {
                                                    setRejectDescription(e.target.value);
                                                }}
                                                defaultValue={rejectDescription}
                                                rows="5"
                                                type="text"
                                                error={errors["reject_description"]}
                                            />
                                        </div>
                                        <div className="flex mt-10 justify-end">
                                            <button
                                                onClick={(e) => draftApproval(e)}
                                                className="inline-flex justify-center ml-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#43a047] hover:bg-[#2d592f]"
                                            >
                                                <span>تایید پیش نویس</span>
                                            </button>
                                            <button
                                                onClick={(e) => draftRejection(e)}
                                                className="inline-flex justify-center  py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600"
                                            >
                                                <span>رد پیش نویس</span>
                                            </button>
                                        </div>
                                    </div> : null}
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {regardingOpen ?
                <Dialog
                    open={regardingOpen}
                    onClose={() => setRegardingOpen(false)}
                    className="relative z-50"
                >
                    <div
                        className="fixed inset-0 bg-black/30"
                        aria-hidden="true"
                    />
                    <div className="fixed inset-0 flex items-center justify-center p-2">
                        <div className="w-1/2 flex min-h-full items-center justify-center">
                            <Dialog.Panel className="w-full mx-auto rounded bg-white p-5">
                                <Dialog.Title>
                                    test
                                </Dialog.Title>
                                <div>

                                    <div className="mt-2 grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-4">
                                            <TextWithLabel
                                                title="فرستنده"
                                                text={regardingData.author}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <TextWithLabel
                                                title="زمان ایجاد نامه"
                                                text={regardingData.create_date_time}
                                            />
                                        </div>
                                        <div className="sm:col-span-4">
                                            <TextWithLabel
                                                title="به"
                                                text={regardingData.recipient}
                                            />
                                        </div>

                                        <div className="sm:col-span-2">
                                            <TextWithLabel
                                                title="موضوع"
                                                text={
                                                    regardingData.category
                                                        ? categoryMethods[regardingData.category]
                                                            .title
                                                        : ""
                                                }
                                            />
                                        </div>
                                        <div className="sm:col-span-4">
                                            <TextWithLabel
                                                title="رونوشت"
                                                text={regardingData.isCopy ? regardingData.isCopy : "ندارد"}
                                            />
                                        </div>
                                        <div className="sm:col-span-2">
                                            {/* <TextWithLabel
                                                title="عطف به"
                                            />
                                            <div className="mb-4">

                                                <span
                                                    key={1}
                                                    className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                                >
                                                    {regarding ?
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                getRegarding(regarding.uuid)
                                                            }
                                                            className="relative inline-flex items-center px-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                        >
                                                            {regarding ? regarding.title : ""}
                                                        </button> : "ندارد"}

                                                </span>

                                            </div> */}
                                        </div>

                                        <div className="sm:col-span-6" >
                                            <Editor
                                                tinymceScriptSrc={process.env.NEXT_PUBLIC_FRONT_URL + '/tinymce/tinymce.min.js'}
                                                onInit={(evt, editor) =>
                                                    (editorRef.current = editor)
                                                }
                                                disabled={true}
                                                initialValue={regardingData.body}
                                                init={{
                                                    height: 200,
                                                    selector: "textarea",
                                                    menubar: false,
                                                    directionality: "rtl",
                                                    readonly: true,
                                                    toolbar: false,
                                                }}
                                            />
                                        </div>

                                        <div className="sm:col-span-3">
                                            <TextWithLabel title="ضمیمه" />

                                            <div className="mb-4">
                                                {Object.keys(regardingData.attachments).length != 0
                                                    ? regardingData.attachments.map((file, index) => (
                                                        <span
                                                            key={index}
                                                            className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                                        >
                                                            <button
                                                                type="button"
                                                                disabled
                                                                className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                            >
                                                                {file.name ?
                                                                    file.name
                                                                    :
                                                                    "فایل" + " " + (index + 1) +
                                                                    "." +
                                                                    file.type}
                                                            </button>

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
                                                        </span>
                                                    ))
                                                    : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setRegardingOpen(false)}
                                        className="bg-[#1f2937] text-white px-4 py-2 rounded-md text-sm inline-block mt-2"
                                    >
                                        بستن
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog> : null}

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

            {referenceTreeOpen ? (
                <Dialog
                    open={referenceTreeOpen}
                    onClose={() => setReferenceTreeOpen(false)}
                    className="relative z-50"
                >
                    <div
                        className="fixed inset-0 bg-black/30"
                        aria-hidden="true"
                    />
                    <div className="fixed inset-0 flex items-center  justify-center p-2">
                        <div className=" flex min-h-full items-start rounded-md justify-center">
                            <ReferenceTree uuid={originalUuid} />
                            <button
                                onClick={() => setReferenceTreeOpen(false)}
                                className="text-white mr-2"
                            >
                                <Close className="bg-red-500 rounded-md"></Close>
                            </button>
                        </div>
                    </div>
                </Dialog>
            ) : null}

        </div>



    );
}
export default MailDetails;
