import SidebarDesktop from "../../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../../components/layout/sidebarMobile";
import StickyHeader from "../../../../components/layout/stickyHeader";
import Textarea from "../../../../components/forms/textarea";
import navigationList from "../../../../components/layout/navigationList";
import { useState, useRef, useEffect } from "react";
import { CloudDownloadIcon } from "@heroicons/react/solid";
import { Editor } from "@tinymce/tinymce-react";
import { useAuth } from "../../../../hooks/auth";
import axios from "../../../../lib/axios";
import { useRouter } from "next/router";
import { useIssued } from "../../../../hooks/issued";
import RegisterIssuedMail from "../../../../components/forms/registerIssuedMail"
import Forbidden from "../../../../components/forms/forbidden";
import InputBox from "../../../../components/forms/inputBox";
import Link from "next/link";
import fileDownload from "js-file-download";
import TextWithLabel from "../../../../components/forms/textWithLabel";
import moment from "jalali-moment";
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Close } from "@material-ui/icons";
import Image from "next/image";

moment.locale("fa");
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const typeMethods = [

    { id: "0", title: "وارده" },
    { id: "1", title: "صادره" },
];

export default function NewEmail() {
    const { asPath } = useRouter();
    const router = useRouter();

    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });
    const { getIssued, issuedData, isIssuedLoading } = useIssued();

    useEffect(() => {
        if (router.isReady) {
            getIssued(router.query.id);
        }
    }, [router.isReady]);

    const editorRef = useRef(null);
    const [query, setQuery] = useState("");
    const [mailSubject, setMailSubject] = useState();
    const [mailSender, setMailSender] = useState();
    const [description, setDescription] = useState("");
    const [receiptOpen, setReceiptOpen] = useState(false);

    const [errors, setErrors] = useState([]);
    const [recipient, setRecipient] = useState([]);
    const [isCopy, setIsCopy] = useState([]);
    const [isCarbonCopy, setIsCarbonCopy] = useState([]);
    const [regarding, setRegarding] = useState({ indic: "", subj: "" });
    const [people, setPeople] = useState([]);
    const [attachements, setAttachments] = useState([]);
    const [recieversDialogVisibility, setRecieversDialogVisibility] =
        useState(false);
    const [copiesDialogVisibility, setCopiesDialogVisibility] = useState(false);
    const [mailsDialogVisibility, setMailsDialogVisibility] = useState(false);
    const [defaultMailsData, setDefaultMailsData] = useState({});
    const [mailsData, setMailsData] = useState({});
    const [loadingMailsData, setLoadingMailsData] = useState(false);
    const [groupData, setGroupData] = useState();
    const [loadingGroupData, setLoadingGroupData] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [regardingData, setRegardingData] = useState({});
    const [regardingOpen, setRegardingOpen] = useState(false);
    const [registeredMaildata, setRegisteredMaildata] = useState();
    const [downloading, setDownloading] = useState();
    const [printDialogOpen, setPrintDialogOpen] = useState(false);
    const [dateDirection, setDateDirection] = useState("1");
    const [withHeader, setWithHeader] = useState("1");
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [pdfContent, setPdfContent] = useState();
    const [imageContent, setImageContent] = useState();

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

    const dateDirectionTypeMethods = [
        { id: "0", title: "راست" },
        { id: "1", title: "چپ" },
    ];
    const yesNoTypeMethods = [
        { id: "0", title: "بله" },
        { id: "1", title: "خیر" },
    ];
    const handleClickOpen = (event) => {
        event.preventDefault();
        setPrintDialogOpen(true);
    };

    const handleClose = () => {
        setPrintDialogOpen(false);
    };
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

    const closeDialog = () => {
        window.location.reload();
    }

    const printIssuedMail = async (event) => {
        event.preventDefault();
        axios
            .post('/api/v1/exports/issued',
                {
                    uuid: router.query.id,
                    dd: `${dateDirection == "0" ? "right" : "left"}`,
                })
            .then((res) => {
                window.open(`${res.data.data.url}${withHeader == "0" ? "1" : "0"}`, '_blank', 'noopener,noreferrer');

            })
            .catch();
    }


    const registerIssueddMail = async (event) => {
        event.preventDefault();
        axios
            .post('/api/v1/mailroom/Issuance_of_letter',
                {
                    uuid: router.query.id
                })
            .then((res) => {
                setRegisteredMaildata(res.data.data);
                setReceiptOpen(true);

            })
            .catch();
    }

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
                {!currentUserActions ? null : CheckIfAccessToPage("/mailRoom/issued") ?
                    <main>
                        <div className="py-6">
                            <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                                <div className="border-b border-gray-200">
                                    <div className="sm:flex sm:items-baseline justify-between">
                                        <h3 className="text-lg text-gray-900">
                                            مشاهده نامه صادره
                                        </h3>
                                        {issuedData.issuance_timestamp ?
                                            <h3 className="text-lg text-gray-900">
                                                {`شماره نامه صادره:${issuedData.secretariat_number}`}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`تاریخ صدور نامه:${moment.unix(issuedData.issuance_timestamp).format("hh:mm:ss YYYY/MM/DD")}`}
                                            </h3> : null}
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
                                                                                    "1"
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
                                                <div className="sm:col-span-6"> {/*mailNo*/}
                                                    <InputBox
                                                        title="موضوع نامه"
                                                        name={mailSubject}
                                                        value={issuedData.subject}
                                                        disabled
                                                        error={errors["mailSubject"]}
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>

                                                <div className="sm:col-span-6"> {/*sender*/}
                                                    <InputBox
                                                        title="گیرندگان نامه"
                                                        name={mailSender}
                                                        value={issuedData.to_company}
                                                        disabled
                                                        error={errors["mail_Sender"]}
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                <div className="sm:col-span-6">
                                                    <label
                                                        htmlFor="cover-photo"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        متن نامه
                                                    </label>
                                                    <Editor
                                                        tinymceScriptSrc={process.env.NEXT_PUBLIC_FRONT_URL + '/tinymce/tinymce.min.js'}
                                                        onInit={(evt, editor) =>
                                                        (editorRef.current =
                                                            editor)
                                                        }
                                                        initialValue={issuedData.letter_content}
                                                        disabled={true}
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
                                                <div className="sm:col-span-2">

                                                    <TextWithLabel
                                                        title="عطف"
                                                    />
                                                    <div className="mb-4">

                                                        <span
                                                            key={1}
                                                            className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                                        >
                                                            {issuedData.regarding ?
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        getRegarding(issuedData.regarding.uuid)
                                                                    }
                                                                    className="relative inline-flex items-center px-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                                >
                                                                    {issuedData.regarding ? issuedData.regarding.title : ""}
                                                                </button> : "ندارد"}


                                                        </span>

                                                    </div>
                                                </div>

                                                <div className="sm:col-span-6">
                                                    <TextWithLabel title="ضمیمه" />
                                                    <div className="mb-4">
                                                        {issuedData.attachments ?
                                                            Object.keys(issuedData.attachments).length != 0
                                                                ? issuedData.attachments.map((file, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                                                    >
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
                                                                : "ندارد" : null}
                                                    </div>
                                                    {errors['download'] ? (
                                                        <span className="text-sm text-red-500">
                                                            {
                                                                errors['download']
                                                            }
                                                        </span>) : <span>&nbsp;</span>}
                                                </div>
                                                {issuedData && issuedData.actions ?
                                                    <div className="sm:col-span-6"> {/*reciver*/}
                                                        <label
                                                            htmlFor="cover-photo"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            امضا کنندگان نامه
                                                        </label>
                                                    </div> : null}
                                                {issuedData && issuedData.actions ? issuedData.actions.map((action) => (
                                                    <div className="col-span-3 rounded-md border p-3">
                                                        <div className="flex justify-between">
                                                            <TextWithLabel title={`${action.first_name} ${action.last_name}`} />
                                                            {action.status_timestamp ?
                                                                <TextWithLabel title={`زمان عملیات: ${moment.unix(action.status_timestamp).format("HH:mm:ss YYYY/MM/DD")}`} /> : null}

                                                        </div>
                                                        <span className="text-sm font-medium  text-gray-700">وضعیت: </span>
                                                        {action.status === 0 ?
                                                            <span className="text-sm text-amber-500">در انتظار تایید</span>
                                                            : action.status === 1 ?
                                                                <span className="text-sm text-green-500">تایید شده</span>
                                                                : action.status === 2 ?
                                                                    <span className="text-sm text-red-500">رد شده</span> : null
                                                        }
                                                        <Textarea
                                                            title="توضیحات"
                                                            name="Description"
                                                            disabled
                                                            defaultValue={action.comment}
                                                            rows="5"
                                                            type="text"
                                                        />
                                                    </div>

                                                )) : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-5">
                                        <div className="flex justify-end">
                                            {issuedData && issuedData.isApproved && !issuedData.issuance_timestamp ?
                                                <button
                                                    onClick={(e) => registerIssueddMail(e)}
                                                    className="inline-flex ml-2 justify-center py-2 px-4  shadow-sm text-sm font-medium rounded-md text-white bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                                                >
                                                    صدور نامه‌
                                                </button> :
                                                issuedData && issuedData.isApproved && issuedData.issuance_timestamp ?
                                                    // <button
                                                    //     //onClick={(e) => printIssuedMail(e)}
                                                    //     onClick={(e) => handleClickOpen(e)}
                                                    //     className="inline-flex ml-2 justify-center py-2 px-4  shadow-sm text-sm font-medium rounded-md text-white bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                                                    // >
                                                    //     چاپ نامه‌
                                                    // </button>
                                                    null
                                                    : null
                                            }
                                            <Link
                                                href={{
                                                    pathname: "/mailRoom/issued",
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    className="inline-flex justify-center py-2 px-4 ml-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#eb5757] hover:bg-[#843737] "
                                                >
                                                    <span>انصراف</span>
                                                </button>
                                            </Link>

                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main> : <Forbidden />}
            </div>

            <RegisterIssuedMail
                indicator={registeredMaildata ? registeredMaildata.secretariat_number : ""}
                mailDate={registeredMaildata ? registeredMaildata.issuance_timestamp : ""}
                dialogOpen={receiptOpen}
                setDialog={(par) => closeDialog(par)}
            // setSelect={(props) => {
            //     isRegistered(true)
            // }}
            />
            <Dialog
                open={printDialogOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'تنظیمات چاپ'}
                </DialogTitle>
                <DialogContent>
                    <div>
                        <div className="sm:col-span-2 mb-5">
                            <p
                                htmlFor="cover-photo"
                                className="block text-sm font-medium text-gray-700"
                            >
                                -  چاپ سربرگ:
                            </p>
                            <fieldset className="mt-2">
                                <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-1">
                                    {yesNoTypeMethods.map(
                                        (
                                            yesNoTypeMethods
                                        ) => (
                                            <div
                                                key={
                                                    `yesNo${yesNoTypeMethods.id}`
                                                }
                                                className="flex items-center"
                                            >
                                                <label
                                                    htmlFor={
                                                        `yesNo${yesNoTypeMethods.id}`
                                                    }
                                                    className="ml-3 block text-sm font-medium text-gray-700"
                                                >
                                                    <input
                                                        id={
                                                            yesNoTypeMethods.id
                                                        }
                                                        name="yesNo"
                                                        type="radio"
                                                        defaultChecked={
                                                            yesNoTypeMethods.id ===
                                                            withHeader
                                                        }
                                                        className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                        onChange={(
                                                            e
                                                        ) => {
                                                            setWithHeader(
                                                                e
                                                                    .target
                                                                    .id
                                                            );
                                                        }}
                                                    />
                                                    {
                                                        yesNoTypeMethods.title
                                                    }
                                                </label>
                                            </div>
                                        )
                                    )}
                                </div>
                            </fieldset>
                            {errors["approved"] ? (
                                <span className="text-sm text-red-500">
                                    {
                                        errors["approved"]
                                    }
                                </span>
                            ) : null}
                        </div>
                        <div className="sm:col-span-2">
                            <p
                                htmlFor="cover-photo"
                                className="block text-sm font-medium text-gray-700"
                            >
                                - محل چاپ تاریخ و شماره نامه:
                            </p>
                            <fieldset className="mt-2">
                                <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-1">
                                    {dateDirectionTypeMethods.map(
                                        (
                                            dateDirectionTypeMethods
                                        ) => (
                                            <div
                                                key={
                                                    `genderStatusTypeMethods${dateDirectionTypeMethods.id}`
                                                }
                                                className="flex items-center"
                                            >
                                                <label
                                                    htmlFor={
                                                        `genderStatusTypeMethods${dateDirectionTypeMethods.id}`
                                                    }
                                                    className="ml-3 block text-sm font-medium text-gray-700"
                                                >
                                                    <input
                                                        id={
                                                            dateDirectionTypeMethods.id
                                                        }
                                                        name="GenderStatusMethod"
                                                        type="radio"
                                                        defaultChecked={
                                                            dateDirectionTypeMethods.id ===
                                                            dateDirection
                                                        }
                                                        className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                        onChange={(
                                                            e
                                                        ) => {
                                                            setDateDirection(
                                                                e
                                                                    .target
                                                                    .id
                                                            );
                                                        }}
                                                    />
                                                    {
                                                        dateDirectionTypeMethods.title
                                                    }
                                                </label>
                                            </div>
                                        )
                                    )}
                                </div>
                            </fieldset>
                            {errors["approved"] ? (
                                <span className="text-sm text-red-500">
                                    {
                                        errors["approved"]
                                    }
                                </span>
                            ) : null}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <button
                        className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                        onClick={printIssuedMail} >
                        تایید
                    </button>
                    {/* <button
                        className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                        onClick={handleClose}>لغو</button> */}
                </DialogActions>
            </Dialog>

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
    );
}
