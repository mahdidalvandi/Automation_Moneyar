import SidebarDesktop from "../../components/layout/sidebarDesktop";
import SidebarMobile from "../../components/layout/sidebarMobile";
import StickyHeader from "../../components/layout/stickyHeader";
import Textarea from "../../components/forms/textarea";
import navigationList from "../../components/layout/navigationList";
import { useState, useRef, useEffect, forwardRef } from "react";
import { PlusIcon, XIcon } from "@heroicons/react/solid";
import { Editor } from "@tinymce/tinymce-react";
import { useAuth } from "../../hooks/auth";
import axios from "../../lib/axios";
import { useRouter } from "next/router";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import RecieversDialog from "../../components/forms/recieversDialog";
import CarbonCopiesDialog from "../../components/forms/recieversDialog";
import CopiesDialog from "../../components/forms/recieversDialog";
import MailsDialog from "../../components/forms/mailsDialog";
import Forbidden from "../../components/forms/forbidden";
import Link from "next/link";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import { useDraft } from "../../hooks/draft";
import Resizer from "react-image-file-resizer";
import { Close } from "@material-ui/icons";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { CircularProgress } from "@mui/material";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const confidentialityMethods = [
  { id: "1", title: "عادی" },
  { id: "2", title: "محرمانه" },
  { id: "3", title: "خیلی محرمانه" },
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
  const [draftId, setDraftId] = useState();
  const { send, draft } = router.query;
  const { user, isLoading } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/",
  });

  useEffect(() => {
    if (router.isReady && draft) {
      setDraftId(draft);
      getDraft(draft);
    }
  }, [router.isReady]);
  const { getDraft, draftData, isDraftLoading } = useDraft();

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
  const [errors, setErrors] = useState([]);
  const [recipient, setRecipient] = useState([]);
  const [subject, setSubject] = useState("");
  const [isCopy, setIsCopy] = useState([]);
  const [isCarbonCopy, setIsCarbonCopy] = useState([]);
  const [regarding, setRegarding] = useState({ indic: "", subj: "" });
  const [referTo, setReferTo] = useState("");
  const [sendingForm, setSendingForm] = useState(false);
  const [sendingDraft, setSendingDraft] = useState(false);
  const [people, setPeople] = useState([]);
  const [confidentiality, setConfidentiality] = useState("1");
  const [priority, setPriority] = useState("1");
  const [category, setCategory] = useState("1");
  const [action, setAction] = useState("1");
  const [attachements, setAttachments] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [recieversDialogVisibility, setRecieversDialogVisibility] =
    useState(false);
  const [copiesDialogVisibility, setCopiesDialogVisibility] = useState(false);
  const [carbonCopiesDialogVisibility, setCarbonCopiesDialogVisibility] =
    useState(false);
  const [mailsDialogVisibility, setMailsDialogVisibility] = useState(false);
  const [defaultMailsData, setDefaultMailsData] = useState({});
  const [mailsData, setMailsData] = useState({});
  const [loadingMailsData, setLoadingMailsData] = useState(false);
  const [groupData, setGroupData] = useState();
  const [loadingGroupData, setLoadingGroupData] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const [open, setOpen] = useState(false);
  const [openDraft, setOpenDraft] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [body, setBody] = useState(draftData ? draftData.body : null);
  const [uploading, setUploading] = useState(false);
  const [imageContent, setImageContent] = useState();
  const [pdfContent, setPdfContent] = useState();
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (draftData) {
      if (draftData.copies && draftData.copies != "")
        setIsCopy(JSON.parse(draftData.copies));
      if (draftData.recipient && draftData.recipient != "")
        setRecipient(JSON.parse(draftData.recipient));
      if (draftData.carbon_copies && draftData.carbon_copies != "")
        setIsCarbonCopy(JSON.parse(draftData.carbon_copies));
      setSubject(draftData.subject);
      setBody(draftData.body);
      setConfidentiality(draftData.confidentiality);
      setPriority(draftData.priority_id);
      setCategory(draftData.category_id);
      setAction(draftData.action_id);
      setAttachments(draftData.attachments);
      setFileNames(draftData.fileNames);
      setRegarding(JSON.parse(draftData.regarding));
    }
  }, [draftData]);

  const handleToClose = (event, reason) => {
    if (draft && draft != "") {
      window.location.assign("/cartable/drafts");
    } else if (!send) {
      window.location.assign("/cartable/");
    } else {
      window.location.assign("/cartable/sendList");
    }
  };
  const handleToCloseDraft = (event, reason) => {
    setOpenDraft(false);
  };

  const sendDraft = async (event) => {
    event.preventDefault();
    setSendingDraft(true);
    const mailFormData = new FormData();
    var hasError = false;
    var object = {};
    if (!subject) {
      object["subject"] = "موضوع نامه الزامی است";
      hasError = true;
    }
    if (hasError) {
      setErrors(object);
      setSendingDraft(false);
      return;
    }

    mailFormData.append(
      "body",
      editorRef.current.getContent() != null
        ? editorRef.current.getContent()
        : ""
    );
    mailFormData.append("subject", subject);
    mailFormData.append(
      "recipient",
      recipient != "" && recipient.length > 0 ? JSON.stringify(recipient) : ""
    );
    mailFormData.append(
      "copies",
      isCopy != "" && isCopy.length > 0 ? JSON.stringify(isCopy) : ""
    );
    mailFormData.append(
      "carbon_copies",
      isCarbonCopy != "" && isCarbonCopy.length > 0
        ? JSON.stringify(isCarbonCopy)
        : ""
    );
    mailFormData.append("regarding", JSON.stringify(regarding));
    mailFormData.append("refer_to", referTo);
    mailFormData.append("confidentiality", confidentiality);
    mailFormData.append("priority_id", priority);
    mailFormData.append("category_id", category);
    mailFormData.append("action_id", action);
    mailFormData.append("attachments", attachements);
    mailFormData.append("fileNames", fileNames);
    mailFormData.append("draftId", draftId ? draftId : "");

    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/letter/draft/add",
        data: mailFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status == 200) {
        object = {};
        setErrors(object);
        setSendingDraft(false);
        setOpenDraft(true);
        setDraftId(response.data.data.draftId);
      }
    } catch (error) {
      object["master"] = error.response.data.message;
      setErrors(object);
      setOpenError(true);
      setSendingDraft(false);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSendingForm(true);
    const mailFormData = new FormData();
    mailFormData.append("parent_id", 0),
      mailFormData.append(
        "body",
        editorRef.current.getContent() != null
          ? editorRef.current.getContent()
          : ""
      ),
      mailFormData.append("subject", subject),
      mailFormData.append(
        "recipient",
        recipient != "" ? recipient.map(({ id }) => id) : ""
      ),
      mailFormData.append(
        "copies",
        isCopy != "" ? isCopy.map(({ id }) => id) : ""
      ),
      mailFormData.append(
        "carbon_copies",
        isCarbonCopy != "" ? isCarbonCopy.map(({ id }) => id) : ""
      ),
      mailFormData.append("regarding", regarding.indic),
      mailFormData.append("refer_to", referTo),
      mailFormData.append("confidentiality", confidentiality),
      mailFormData.append("priority_id", priority),
      mailFormData.append("category_id", category),
      mailFormData.append("action_id", action),
      mailFormData.append("attachments", attachements);
    mailFormData.append("project_id", "1");
    mailFormData.append("draftId", draftId);

    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/letter/send",
        data: mailFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status == 200) {
        setOpen(true);
      }
    } catch (error) {
      setErrors(error.response.data.message);
      setOpenError(true);
      setSendingForm(false);
    }
  };

  const uploadChange = (event) => {
    setErrors([]);
    for (let i = 0; i < event.target.files.length; i++) {
      setUploading(true);
      if (event.target.files[i].size > 10e6) {
        var object = {};
        object["upload"] = "حجم فایل بیشتر از ۱۰ مگابایت می  باشد";
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
        })
          .then(function (response) {
            setUploading(false);
            setFileNames((oldArray) => [
              ...oldArray,
              event.target.files[i].name,
            ]);
            setAttachments((oldArray) => [
              ...oldArray,
              response.data.data.file_uuid,
            ]);
          })
          .catch((err) => {
            setUploading(false);
            var object = {};
            object["upload"] = "خطا در آپلود فایل";
            setErrors(object);
          });
      } catch (error) {
        setUploading(false);
        var object = {};
        object["upload"] = "خطا در آپلود فایل";
        setErrors(object);
      }
    }
  };

  const setRecipients = (value) => {
    setRecipient(value);
    setQuery("");
  };
  const setIsCopys = (value) => {
    setIsCopy(value);
    setQuery("");
  };
  const setIsCarbonCopys = (value) => {
    setIsCarbonCopy(value);
    setQuery("");
  };
  const crossHandler = () => {
    setRegarding({ indic: "", subj: "" });
  };
  const deleteFile = (value, index) => {
    axios.delete(`/api/v1/file/delete`, {
      data: {
        file_uuid: attachements[index],
        type: "docs",
      },
    });
    setFileNames([...fileNames.slice(0, index), ...fileNames.slice(index + 1)]);
    setAttachments([
      ...attachements.slice(0, index),
      ...attachements.slice(index + 1),
    ]);
  };

  useEffect(() => {
    axios.get(`/api/v1/cartable/signature`).then((response) => {
      setBody(response.data.data.cartable_signature);
    });
  }, []);

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
    setQuery("");
    axios.get(`/api/v1/group/list/users?group_uuid=${val}`).then((response) => {
      if (recipient === undefined || recipient.length == 0) {
        setRecipient(response.data.data);
        setQuery("");
      } else {
        const difference = [...getDifference(response.data.data, recipient)];
        difference.forEach((element) => {
          setRecipient((currentArray) => [...currentArray, element]);
        });
      }
    });
  };

  const onCopiesGroupSelect = (val) => {
    setQuery("");
    axios.get(`/api/v1/group/list/users?group_uuid=${val}`).then((response) => {
      if (isCopy === undefined || isCopy.length == 0) {
        setIsCopy(response.data.data);
      } else {
        const difference = [...getDifference(response.data.data, isCopy)];
        difference.forEach((element) => {
          setIsCopy((currentArray) => [...currentArray, element]);
        });
      }
    });
  };

  const onCarbonCopiesGroupSelect = (val) => {
    setQuery("");
    axios.get(`/api/v1/group/list/users?group_uuid=${val}`).then((response) => {
      if (isCarbonCopy === undefined || isCarbonCopy.length == 0) {
        setIsCarbonCopy(response.data.data);
      } else {
        const difference = [...getDifference(response.data.data, isCarbonCopy)];
        difference.forEach((element) => {
          setIsCarbonCopy((currentArray) => [...currentArray, element]);
        });
      }
    });
  };

  const ShowPreview = (value, type, name) => {
    var re = /(?:\.([^.]+))?$/;
    type = re.exec(type)[1];
    if (
      type == "png" ||
      type == "jpg" ||
      type == "jpeg" ||
      type == "gif" ||
      type == "pdf"
    ) {
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
          } else if (
            type == "png" ||
            type == "jpg" ||
            type == "jpeg" ||
            type == "gif"
          ) {
            setImageContent(res.data);
            setPdfContent(null);
          }
          setPreviewLoading(false);
        });
    }
  };

  function getDifference(array1, array2) {
    return array1.filter((object1) => {
      return !array2.some((object2) => {
        return object1.id === object2.id;
      });
    });
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
  return (
    <div>
      <SidebarMobile menu={navigationList()} loc={asPath} />
      <SidebarDesktop
        menu={navigationList()}
        loc={asPath}
        setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
        setActions={(props) => setCurrentUserActions(props.currentUserActions)}
        setIsHolding={(props) => {}}
        setSuperUser={(props) => {}}
      />
      <div className="md:pr-52 flex flex-col flex-1">
        <StickyHeader />
        {!currentUserActions ? null : CheckIfAccessToPage(
            window.location.pathname
          ) ? (
          <main>
            <div className="py-6">
              <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                <div className="border-b border-gray-200">
                  <div className="sm:flex sm:items-baseline">
                    <h3 className="text-lg text-gray-900">ایجاد نامه جدید</h3>
                  </div>
                </div>
              </div>
              <div className="w-full px-4 sm:px-6 md:px-8">
                <form
                  autoComplete="off"
                  onSubmit={onSubmit}
                  className="space-y-8 divide-y divide-gray-200"
                >
                  <div className="space-y-8 divide-y divide-gray-200">
                    <div>
                      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        {/* <div className="sm:col-span-3">
                                                <Menu
                                                    as="div"
                                                    className="relative inline-block text-left"
                                                >
                                                    <div>
                                                        <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-amber-500">
                                                            انتخاب قالب نامه
                                                        </Menu.Button>
                                                    </div>

                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                            <div className="py-1">
                                                                <Menu.Item>
                                                                    {({
                                                                        active,
                                                                    }) => (
                                                                        <a
                                                                            href="#"
                                                                            className={classNames(
                                                                                active
                                                                                    ? "bg-gray-100 text-gray-900"
                                                                                    : "text-gray-700",
                                                                                "block px-4 py-2 text-sm text-right"
                                                                            )}
                                                                        >
                                                                            قالب
                                                                            ۲
                                                                        </a>
                                                                    )}
                                                                </Menu.Item>

                                                                <Menu.Item>
                                                                    {({
                                                                        active,
                                                                    }) => (
                                                                        <a
                                                                            href="#"
                                                                            className={classNames(
                                                                                active
                                                                                    ? "bg-gray-100 text-gray-900"
                                                                                    : "text-gray-700",
                                                                                "block px-4 py-2 text-sm text-right"
                                                                            )}
                                                                        >
                                                                            قالب
                                                                            ۱
                                                                        </a>
                                                                    )}
                                                                </Menu.Item>
                                                            </div>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            </div> */}

                        <div className="sm:col-span-4">
                          <label
                            htmlFor="cover-photo"
                            className="block text-sm font-medium text-gray-700"
                          >
                            فرستنده:
                          </label>
                          <p> {`${user.first_name} ${user.last_name}`} </p>
                        </div>
                        <div className="sm:col-span-4">
                          <Textarea
                            title="موضوع *"
                            name={subject}
                            value={subject}
                            rows="3"
                            onChange={(event) => setSubject(event.target.value)}
                            error={errors["subject"]}
                            type="text"
                            isrequired="true"
                          />
                        </div>
                        <div className="sm:col-span-6">
                          <label
                            htmlFor="cover-photo"
                            className="block text-sm font-medium text-gray-700"
                          >
                            به *
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <Autocomplete
                              multiple
                              id="tags-standard"
                              className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                              options={filteredPeople}
                              noOptionsText="یافت نشد!"
                              value={recipient}
                              onChange={(event, newValue) => {
                                setRecipients(newValue);
                              }}
                              getOptionLabel={(person) => person.full}
                              renderInput={(params) => (
                                <TextField
                                  className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                  {...params}
                                  variant="standard"
                                  placeholder="افزودن .."
                                  onChange={(event) =>
                                    setQuery(event.target.value)
                                  }
                                />
                              )}
                            />

                            <button
                              onClick={(_) => {
                                setRecieversDialogVisibility(true);
                              }}
                              type="button"
                              className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium  text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                            >
                              <PlusIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              <span>گروه دریافت کننده</span>
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
                            رونوشت
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <Autocomplete
                              multiple
                              id="tags-standard"
                              className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                              options={filteredPeople}
                              noOptionsText="یافت نشد!"
                              value={isCopy}
                              onChange={(event, newValue) => {
                                setIsCopys(newValue);
                              }}
                              getOptionLabel={(person) => person.full}
                              renderInput={(params) => (
                                <TextField
                                  className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                  {...params}
                                  variant="standard"
                                  placeholder="افزودن .."
                                  onChange={(event) =>
                                    setQuery(event.target.value)
                                  }
                                />
                              )}
                            />
                            <button
                              type="button"
                              onClick={(_) => {
                                setCopiesDialogVisibility(true);
                              }}
                              className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium  text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                            >
                              <PlusIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              <span>گروه دریافت کننده</span>
                            </button>
                          </div>
                          {errors["is_Copy"] ? (
                            <span className="text-sm text-red-500">
                              {errors["is_Copy"]}
                            </span>
                          ) : null}
                        </div>
                        <div className="sm:col-span-6">
                          <label
                            htmlFor="cover-photo"
                            className="block text-sm font-medium text-gray-700"
                          >
                            رونوشت مخفی
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <Autocomplete
                              multiple
                              id="tags-standard"
                              className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                              options={filteredPeople}
                              noOptionsText="یافت نشد!"
                              value={isCarbonCopy}
                              onChange={(event, newValue) => {
                                setIsCarbonCopys(newValue);
                              }}
                              getOptionLabel={(person) => person.full}
                              renderInput={(params) => (
                                <TextField
                                  className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                  {...params}
                                  variant="standard"
                                  placeholder="افزودن .."
                                  onChange={(event) =>
                                    setQuery(event.target.value)
                                  }
                                />
                              )}
                            />
                            <button
                              type="button"
                              onClick={(_) => {
                                setCarbonCopiesDialogVisibility(true);
                              }}
                              className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium  text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                            >
                              <PlusIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              <span>گروه دریافت کننده</span>
                            </button>
                          </div>
                          {errors["is_CarbonCopy"] ? (
                            <span className="text-sm text-red-500">
                              {errors["isCarbonCopy"]}
                            </span>
                          ) : null}
                        </div>
                        <div className="sm:col-span-6">
                          <label
                            htmlFor="cover-photo"
                            className="block text-sm font-medium text-gray-700"
                          >
                            متن نامه
                          </label>
                          <Editor
                            tinymceScriptSrc={
                              process.env.NEXT_PUBLIC_FRONT_URL +
                              "/tinymce/tinymce.min.js"
                            }
                            onInit={(evt, editor) =>
                              (editorRef.current = editor)
                            }
                            initialValue={
                              draftData ? draftData.body : body ? body : null
                            }
                            init={{
                              promotion: false,
                              selector: "textarea",
                              menubar:
                                "file edit view insert format tools table",
                              plugins: "image table link emoticons",
                              table_use_colgroups: true,
                              directionality: "rtl",
                              toolbar:
                                "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist |  forecolor backcolor |outdent indent | link image | table | emoticons",
                              /* enable title field in the Image dialog*/
                              image_title: true,
                              /* enable automatic uploads of images represented by blob or data URIs*/
                              automatic_uploads: true,
                              /*
                                                              URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
                                                              images_upload_url: 'postAcceptor.php',
                                                              here we add custom filepicker only to Image dialog
                                                            */
                              file_picker_types: "image",
                              /* and here's our custom image picker*/
                              file_picker_callback: function (cb, value, meta) {
                                var input = document.createElement("input");
                                input.setAttribute("type", "file");
                                input.setAttribute("accept", "image/*");

                                /*
                                                                  Note: In modern browsers input[type="file"] is functional without
                                                                  even adding it to the DOM, but that might not be the case in some older
                                                                  or quirky browsers like IE, so you might want to add it to the DOM
                                                                  just in case, and visually hide it. And do not forget do remove it
                                                                  once you do not need it anymore.
                                                                */

                                input.onchange = function () {
                                  var file = this.files[0];
                                  var resized;
                                  var re = /(?:\.([^.]+))?$/;
                                  Resizer.imageFileResizer(
                                    file,
                                    1024,
                                    1024,
                                    re.exec(file.name)[1],
                                    100,
                                    0,
                                    (uri) => {
                                      resized = uri;
                                      reader.readAsDataURL(resized);
                                    },
                                    "blob"
                                  );
                                  var reader = new FileReader();
                                  reader.onload = function () {
                                    /*
                                                                          Note: Now we need to register the blob in TinyMCEs image blob
                                                                          registry. In the next release this part hopefully won't be
                                                                          necessary, as we are looking to handle it internally.
                                                                        */
                                    var id = "blobid" + new Date().getTime();
                                    var blobCache =
                                      tinymce.activeEditor.editorUpload
                                        .blobCache;
                                    var base64 = reader.result.split(",")[1];
                                    var blobInfo = blobCache.create(
                                      id,
                                      resized,
                                      base64
                                    );
                                    blobCache.add(blobInfo);

                                    /* call the callback and populate the Title field with the file name */
                                    cb(blobInfo.blobUri(), {
                                      title: resized.name,
                                    });
                                  };
                                };

                                input.click();
                              },
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
                                setMailsDialogVisibility(true);
                              }}
                              type="button"
                              className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium  text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                            >
                              <PlusIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              <span>افزودن نامه از لیست</span>
                            </button>
                          ) : (
                            <div className="flex items-center text-center">
                              <p className="mt-4">
                                {regarding.subj + " (" + regarding.indic + ")"}
                              </p>
                              <button
                                onClick={crossHandler}
                                className="inline-flex text-center items-center mt-4 ml-1"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fill="red"
                                    d="M18.36 19.78L12 13.41l-6.36 6.37l-1.42-1.42L10.59 12L4.22 5.64l1.42-1.42L12 10.59l6.36-6.36l1.41 1.41L13.41 12l6.36 6.36z"
                                  />
                                </svg>
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="sm:col-span-5">
                          <p
                            htmlFor="cover-photo"
                            className="block text-sm font-medium text-gray-700"
                          >
                            سطح محرمانگی *
                          </p>
                          <fieldset className="mt-4">
                            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                              {confidentialityMethods.map(
                                (confidentialityMethod) => (
                                  <div
                                    key={confidentialityMethod.id}
                                    className="flex items-center"
                                  >
                                    <label
                                      htmlFor={"c" + confidentialityMethod.id}
                                      className="ml-3 block text-sm font-medium text-gray-700"
                                    >
                                      <input
                                        id={"c" + confidentialityMethod.id}
                                        name="confidentialityMethod"
                                        type="radio"
                                        defaultChecked={
                                          confidentialityMethod.id ===
                                          (draftData
                                            ? draftData.confidentiality
                                            : "1")
                                        }
                                        className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                        onChange={(e) => {
                                          setConfidentiality(e.target.id);
                                        }}
                                      />
                                      {confidentialityMethod.title}
                                    </label>
                                  </div>
                                )
                              )}
                            </div>
                          </fieldset>
                        </div>
                        <div className="sm:col-span-5">
                          <p
                            htmlFor="cover2-photo"
                            className="block text-sm font-medium text-gray-700"
                          >
                            اولویت *
                          </p>
                          <fieldset className="mt-4">
                            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                              {priorityMethods.map((priorityMethod) => (
                                <div
                                  key={priorityMethod.id}
                                  className="flex items-center"
                                >
                                  <label
                                    htmlFor={"p" + priorityMethod.id}
                                    className="ml-3 block text-sm font-medium text-gray-700"
                                  >
                                    <input
                                      id={"p" + priorityMethod.id}
                                      name="priorityMethod"
                                      type="radio"
                                      defaultChecked={
                                        priorityMethod.id ===
                                        (draftData
                                          ? draftData.priority_id
                                          : "1")
                                      }
                                      value={priorityMethod.id}
                                      onChange={(e) => {
                                        setPriority(e.target.id);
                                      }}
                                      className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                    />
                                    {priorityMethod.title}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </fieldset>
                        </div>
                        <div className="sm:col-span-5">
                          <p
                            htmlFor="cover3-photo"
                            className="block text-sm font-medium text-gray-700"
                          >
                            دسته بندی *
                          </p>
                          <fieldset className="mt-4">
                            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                              {categoryMethods.map((categoryMethod) => (
                                <div
                                  key={categoryMethod.id}
                                  className="flex items-center"
                                >
                                  <label
                                    htmlFor={"ca" + categoryMethod.id}
                                    className="ml-3 block text-sm font-medium text-gray-700"
                                  >
                                    <input
                                      id={"ca" + categoryMethod.id}
                                      name="categoryMethod"
                                      type="radio"
                                      defaultChecked={
                                        categoryMethod.id ===
                                        (draftData
                                          ? draftData.category_id
                                          : "1")
                                      }
                                      onChange={(e) => {
                                        setCategory(e.target.id);
                                      }}
                                      className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                    />
                                    {categoryMethod.title}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </fieldset>
                        </div>
                        <div className="sm:col-span-5">
                          <p
                            htmlFor="cover4photo"
                            className="block text-sm font-medium text-gray-700"
                          >
                            جهت *
                          </p>
                          <fieldset className="mt-4">
                            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                              {actionMethods.map((actionMethod) => (
                                <div
                                  key={actionMethod.id}
                                  className="flex items-center"
                                >
                                  <label
                                    htmlFor={"a" + actionMethod.id}
                                    className="ml-3 block text-sm font-medium text-gray-700"
                                  >
                                    <input
                                      id={"a" + actionMethod.id}
                                      name="notification-method"
                                      type="radio"
                                      defaultChecked={
                                        actionMethod.id ===
                                        (draftData ? draftData.action_id : "1")
                                      }
                                      onChange={(e) => {
                                        setAction(e.target.id);
                                      }}
                                      className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                    />
                                    {actionMethod.title}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </fieldset>
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
                                  <span>آپلود فایل</span>
                                  <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    multiple={true}
                                    className="sr-only"
                                    onChange={(e) => {
                                      uploadChange(e);
                                    }}
                                  />
                                </label>
                              </div>
                              <p className="text-xs text-gray-500">
                                کمتر از ۱۰ مگابایت
                              </p>
                            </div>
                          </div>
                          {uploading ? (
                            <LinearProgress className="mt-2 mr-2" />
                          ) : null}
                          {Object.keys(fileNames).length != 0
                            ? fileNames.map((file, index) => (
                                <span
                                  key={index}
                                  className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                >
                                  <button
                                    onClick={() =>
                                      ShowPreview(
                                        attachements[index],
                                        file,
                                        attachements[index].name
                                      )
                                    }
                                    type="button"
                                    className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                  >
                                    {file}
                                  </button>
                                  <button
                                    onClick={() => deleteFile(file, index)}
                                    type="button"
                                    className="-mr-px relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                  >
                                    <XIcon
                                      className="-ml-1 ml-1 h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </span>
                              ))
                            : ""}
                        </div>
                        <div className="sm:col-span-6">
                          {errors["upload"] ? (
                            <span className="text-sm text-red-500">
                              {errors["upload"]}
                            </span>
                          ) : null}
                          {/* <p className="text-sm text-red-500 ">
                                                        تکمیل تمامی فیلدهای ستاره
                                                        دار (*) اجباری است.
                                                    </p> */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      {draft ? null : (
                        <button
                          onClick={sendDraft}
                          disabled={sendingDraft}
                          className={`ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm ${
                            sendingDraft
                              ? " bg-gray-500 hover:bg-gray-500 "
                              : " bg-[#43a047] hover:bg-[#2d592f] "
                          }  focus:outline-none`}
                        >
                          <span>{`${
                            sendingDraft ? "در حال ارسال " : "ذخیره پیش نویس"
                          }`}</span>
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={sendingForm}
                        className={`ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm ${
                          sendingForm
                            ? " bg-gray-500 hover:bg-gray-500 "
                            : " bg-[#43a047] hover:bg-[#2d592f] "
                        }  focus:outline-none`}
                      >
                        <span>{`${
                          sendingForm ? "در حال ارسال " : "ارسال"
                        }`}</span>
                      </button>

                      <Link
                        href={{
                          pathname: `${
                            draft ? "/cartable/drafts" : "/cartable/sendList"
                          }`,
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
          </main>
        ) : (
          <Forbidden />
        )}
        {previewDialogOpen ? (
          <Dialog
            open={previewDialogOpen}
            onClose={() => setPreviewDialogOpen(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0  flex items-start justify-center p-2">
              <div
                style={{ height: "80vh", width: "80vh" }}
                className="relative w-80 h-80  border border-gray-200 bg-gray-100 rounded-md overflow-hidden"
              >
                {previewLoading ? (
                  <div
                    style={{ height: "80vh", width: "80vh" }}
                    className="flex justify-center items-center "
                  >
                    <Image
                      alt="image"
                      src="/images/dots.svg"
                      height={120}
                      width={120}
                    />
                  </div>
                ) : imageContent ? (
                  <Image
                    alt="image"
                    src={URL.createObjectURL(imageContent)}
                    layout="fill"
                    objectFit="contain"
                    quality={100}
                  />
                ) : pdfContent ? (
                  <embed
                    src={pdfContent}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                  />
                ) : null}
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
      <CarbonCopiesDialog
        data={groupData}
        dialogOpen={carbonCopiesDialogVisibility}
        setDialog={(par) => setCarbonCopiesDialogVisibility(par)}
        setSelect={(receivers) => onCarbonCopiesGroupSelect(receivers)}
      />
      <MailsDialog
        data={mailsData}
        dialogOpen={mailsDialogVisibility}
        setDialog={(par) => setMailsDialogVisibility(par)}
        setSelect={(props) =>
          setRegarding({ indic: props.indic, subj: props.subj })
        }
      />
      {console.log(regarding)}

      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        open={open}
        autoHideDuration={1500}
        onClose={handleToClose}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          عملیات با موفقیت انجام شد
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        open={openDraft}
        autoHideDuration={1000}
        onClose={handleToCloseDraft}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          با موفقت ذخیره شد
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        open={openError}
        autoHideDuration={1000}
        onClose={handleToCloseDraft}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          خطا در انجام عملیات
        </Alert>
      </Snackbar>
    </div>
  );
}
