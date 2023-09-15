import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import Textarea from "../../../components/forms/textarea";
import navigationList from "../../../components/layout/navigationList";
import { useState, useRef, useEffect } from "react";
import { PlusIcon, XIcon } from "@heroicons/react/solid";
import { Editor } from "@tinymce/tinymce-react";
import { useAuth } from "../../../hooks/auth";
import axios from "../../../lib/axios";
import { useRouter } from "next/router";
import RecieversDialog from "../../../components/forms/recieversDialog";
import CopiesDialog from "../../../components/forms/recieversDialog";
import MailsDialog from "../../../components/forms/mailsDialog";
import Forbidden from "../../../components/forms/forbidden";
import InputBox from "../../../components/forms/inputBox";
import RegisterIssuedMail from "../../../components/forms/registerIssuedMail";

import Link from "next/link";
import LinearProgress from "@mui/material/LinearProgress";
import { Close } from "@material-ui/icons";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { CircularProgress } from "@mui/material";

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
  const [mailSubject, setMailSubject] = useState();
  const [mailSender, setMailSender] = useState();
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState([]);
  const [recipient, setRecipient] = useState([]);
  const [isCopy, setIsCopy] = useState([]);
  const [regarding, setRegarding] = useState({ indic: "", subj: "" });
  const [people, setPeople] = useState([]);
  const [attachements, setAttachments] = useState([]);
  const [fileNames, setFileNames] = useState([]);
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
  const [uploading, setUploading] = useState(false);
  const [sendingForm, setSendingForm] = useState(false);
  const [imageContent, setImageContent] = useState();
  const [pdfContent, setPdfContent] = useState();
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [registeredMaildata, setRegisteredMaildata] = useState();
  const [receiptOpen, setReceiptOpen] = useState(false);

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

  const deleteFile = (value, index) => {
    axios.delete(`/api/v1/file/delete`, {
      data: {
        file_uuid: value,
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
    axios.get(`/api/v1/group/list/users?group_uuid=${val}`).then((response) => {
      if (recipient === undefined || recipient.length == 0) {
        setRecipient(response.data.data);
      } else {
        const difference = [...getDifference(response.data.data, recipient)];
        difference.forEach((element) => {
          setRecipient((currentArray) => [...currentArray, element]);
        });
      }
    });
  };

  const onCopiesGroupSelect = (val) => {
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
  const closeDialog = () => {
    window.location.assign("/mailRoom/issued");
  };

  function getDifference(array1, array2) {
    return array1.filter((object1) => {
      return !array2.some((object2) => {
        return object1.id === object2.id;
      });
    });
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setSendingForm(true);
    const mailFormData = new FormData();
    var hasError = false;
    var object = {};
    if (
      editorRef.current.getContent() == null ||
      editorRef.current.getContent() == ""
    ) {
      object["body"] = "متن نامه الزامی است";
      hasError = true;
    }
    if (!mailSender) {
      object["mail_Sender"] = "گیرنده نامه الزامی است";
      hasError = true;
    }
    if (!mailSubject) {
      object["mailSubject"] = "موضوع نامه الزامی است";
      hasError = true;
    }

    if (hasError) {
      setErrors(object);
      setSendingForm(false);
      return;
    }
    mailFormData.append("type", "1");
    mailFormData.append("subject", mailSubject);
    mailFormData.append("to_company", mailSender);
    mailFormData.append(
      "body",
      editorRef.current.getContent() != null
        ? editorRef.current.getContent()
        : ""
    );
    mailFormData.append("regarding", regarding.indic),
      mailFormData.append("description", description);
    mailFormData.append("attachments", attachements);

    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/mailroom/issued/add_and_Issuance",
        data: mailFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status == 200) {
        setRegisteredMaildata(response.data.data);
        setReceiptOpen(true);
        setSendingForm(true);
      }
    } catch (error) {
      object["master"] = error.response.data.message;
      setErrors(object);
      setSendingForm(false);
    }
  };

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
                        <div className="sm:col-span-5">
                          {" "}
                          {/*typeMethod */}
                          <p
                            htmlFor="cover-photo"
                            className="block text-sm font-medium text-gray-700"
                          >
                            نوع نامه *
                          </p>
                          <fieldset className="mt-4">
                            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                              {typeMethods.map((typeMethods) => (
                                <div
                                  key={typeMethods.id}
                                  className="flex items-center"
                                >
                                  <label
                                    htmlFor={typeMethods.id}
                                    className="ml-3 block text-sm font-medium text-gray-700"
                                  >
                                    <input
                                      id={typeMethods.id}
                                      name="confidentialityMethod"
                                      type="radio"
                                      disabled="true"
                                      defaultChecked={typeMethods.id === "1"}
                                      className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                      onChange={(e) => {
                                        setTypeMethod(e.target.id);
                                      }}
                                    />
                                    {typeMethods.title}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </fieldset>
                        </div>
                        <div className="sm:col-span-6">
                          {" "}
                          {/*mailNo*/}
                          <InputBox
                            title="موضوع نامه *"
                            name={mailSubject}
                            value={mailSubject}
                            onChange={(event) =>
                              setMailSubject(event.target.value)
                            }
                            error={errors["mailSubject"]}
                            type="text"
                            isrequired="true"
                          />
                        </div>

                        <div className="sm:col-span-6">
                          {" "}
                          {/*sender*/}
                          <InputBox
                            title="گیرندگان نامه *"
                            name={mailSender}
                            value={mailSender}
                            onChange={(event) =>
                              setMailSender(event.target.value)
                            }
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
                            متن نامه *
                          </label>
                          <Editor
                            tinymceScriptSrc={
                              process.env.NEXT_PUBLIC_FRONT_URL +
                              "/tinymce/tinymce.min.js"
                            }
                            onInit={(evt, editor) =>
                              (editorRef.current = editor)
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
                            <p className="mt-4">
                              {regarding.subj + " (" + regarding.indic + ")"}
                            </p>
                          )}
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
                                    type="button"
                                    onClick={() =>
                                      ShowPreview(
                                        attachements[index],
                                        file,
                                        attachements[index].name
                                      )
                                    }
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
                        </div>

                        <div className="sm:col-span-6">
                          <Textarea
                            title="توضیحات"
                            name="Description"
                            onChange={(e) => {
                              setDescription(e.target.value);
                            }}
                            defaultValue={description}
                            rows="5"
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
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
                          sendingForm ? "در حال دریاف " : "دریافت شماه نامه"
                        }`}</span>
                      </button>
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
                className="relative w-80 h-80 border border-gray-200 bg-gray-100 rounded-md overflow-hidden"
              >
                {previewLoading ? (
                  <div
                    style={{ height: "80vh", width: "80vh" }}
                    className="flex justify-center items-center"
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
      <RegisterIssuedMail
        indicator={
          registeredMaildata ? registeredMaildata.secretariat_number : ""
        }
        mailDate={
          registeredMaildata ? registeredMaildata.issuance_timestamp : ""
        }
        dialogOpen={receiptOpen}
        setDialog={(par) => closeDialog(par)}
        // setSelect={(props) => {
        //     isRegistered(true)
        // }}
      />
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
