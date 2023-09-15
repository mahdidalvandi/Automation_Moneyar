import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../hooks/auth";
import { useRouter } from "next/router";
import axios from "../../../lib/axios";
import moment from "jalali-moment";
import Message from "../../../components/forms/message";
import Textarea from "../../../components/forms/textarea";
import { XIcon } from "@heroicons/react/solid";
import Link from "next/link";
import LinearProgress from "@mui/material/LinearProgress";
import { Close } from "@material-ui/icons";
import Image from "next/image";
import { Dialog } from "@headlessui/react";
import { CircularProgress } from "@mui/material";

moment.locale("fa");

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function EditPost() {
  const { asPath } = useRouter();
  const [errors, setErrors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [ticket, setTicket] = useState("");
  const [ticketTitle, setTicketTitle] = useState("");
  const [senderName, setSenderName] = useState("");
  const [companyTitle, setCompanyTitle] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [ticketStatus, setTicketStatus] = useState();
  const [ticketsData, setTicketsData] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const [currentUserRole, setCurrentUserRole] = useState();
  const [attachments, setAttachments] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [ticketId, setTicketId] = useState();
  const router = useRouter();
  const listItems = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [imageContent, setImageContent] = useState();
  const [pdfContent, setPdfContent] = useState();
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

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

  useEffect(() => {
    if (router.isReady) {
      GetData(router.query.id);
      setTicketId(router.query.id);
    }
  }, [router.isReady]);

  const GetData = (ticketIdParam) => {
    axios
      .post("/api/v1/ticket/get_ticket", {
        ticket_uuid: ticketIdParam,
      })
      .then((res) => {
        setLoadingData(false);
        setTicketTitle(res.data.data.title);
        setSenderName(res.data.data.sender_name);
        setCompanyTitle(res.data.data.company_title);
        setTicketNumber(res.data.data.id);
        setTicketsData(res.data.data.data);
        setTicketStatus(res.data.data.status);
      });
  };

  useEffect(() => {
    if (listItems.current) {
      const lastItem = listItems.current.lastElementChild;
      lastItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [ticketsData]);

  const reply = async (event) => {
    event.preventDefault();
    var object = {};
    var hasError = false;
    if (ticket == "") {
      object["ticket"] = "متن پاسخ الزامی است";
      hasError = true;
    }
    if (hasError) {
      setErrors(object);
      return;
    }
    axios
      .post("/api/v1/ticket/reply", {
        ticket_uuid: ticketId,
        body: ticket,
        attachments: strimer(attachments),
      })
      .then((res) => {
        setTicket("");
        GetData(ticketId);
        setErrors([]);
        setAttachments([]);
        setFileNames([]);
      })
      .catch((err) => {
        var object = {};
        object["master"] = err.response.data.message;
        setErrors(object);
      });
  };
  function strimer(data) {
    let tdata = String(data.map((dd) => dd));
    tdata = tdata.replace("[", "");
    return tdata.replace("]", "");
  }
  const close = async (event) => {
    event.preventDefault();
    axios
      .post("/api/v1/ticket/close", {
        ticket_uuid: ticketId,
      })
      .then((res) => {
        window.location.href = "/support/ticket";
      })
      .catch((err) => {});
  };
  const open = async (event) => {
    event.preventDefault();
    axios
      .post("/api/v1/ticket/open", {
        ticket_uuid: ticketId,
      })
      .then((res) => {
        GetData(ticketId);
      })
      .catch((err) => {});
  };
  const deleteFile = (value, index) => {
    axios.delete(`/api/v1/file/delete`, {
      data: {
        file_uuid: attachments[index],
        type: "docs",
      },
    });
    setFileNames([...fileNames.slice(0, index), ...fileNames.slice(index + 1)]);
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

  const { user, isLoading } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/",
  });

  if (isLoading || !user) {
    return null;
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
        <main>
          <div className="py-6">
            <div className="w-full px-4 sm:px-6 md:px-8">
              <form className="space-y-0">
                <div className="space-y-0 ">
                  <div className="bg-gray-300 p-2 mb-3">
                    <div className="flex justify-between">
                      <h2 className="text-sm leading-6 font-large text-gray-900">
                        موضوع: {ticketTitle}
                      </h2>
                      <h2 className="text-sm leading-6 font-large text-gray-900">
                        شماره تیکت: {ticketNumber}
                      </h2>
                    </div>
                  </div>
                  {senderName ? (
                    <div className="bg-[#1f2937] p-2">
                      <div className="flex justify-between">
                        <h2 className="text-sm text-white leading-6 font-large">
                          ارسال کننده: {senderName}
                        </h2>
                        <h2 className="text-sm leading-6 font-large text-white">
                          شرکت: {companyTitle}
                        </h2>
                      </div>
                    </div>
                  ) : null}
                  <div
                    ref={listItems}
                    className="grid grid-cols-1 border border-gray-300 p-5 shadow-lg"
                    style={{
                      height: `${ticketStatus == 0 ? "50vh" : "70vh"}`,
                      overflowY: "scroll",
                    }}
                  >
                    {!loadingData &&
                      ticketsData.map((data, i) => (
                        <div key={i}>
                          <Message
                            message={data.body}
                            timeSpan={data.send_timestamp}
                            recived={data.my_message}
                            attachments={data.attachments}
                          />
                        </div>
                      ))}
                  </div>
                  {ticketStatus == 0 ? (
                    <div className="mt-6 pt-5 grid grid-cols-6">
                      <div className="sm:col-span-3">
                        <Textarea
                          title="متن پاسخ"
                          value={ticket}
                          name={ticket}
                          rows="3"
                          onChange={(event) => setTicket(event.target.value)}
                          error={errors["ticket"]}
                          type="text"
                          isrequired="true"
                        />
                        <p className="text-red-500 text-sm font-bold">
                          {errors["master"]}
                        </p>
                      </div>
                      <div className="col-span-3"></div>

                      <div className="col-span-3 pt-2">
                        <label
                          htmlFor="cover-photo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          افزودن ضمیمه
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-2 pb-2 border-2 border-gray-300 border-dashed rounded-md">
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
                                      attachments[index],
                                      file,
                                      attachments[index].name
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
                    </div>
                  ) : null}
                  <div className="flex justify-between mt-6 pt-5 ">
                    <div>
                      {ticketStatus == 0 ? (
                        <button
                          onClick={reply}
                          className="ml-2 inline-flexباز justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                        >
                          ارسال
                        </button>
                      ) : null}
                    </div>

                    <div>
                      {ticketStatus == 0 ? (
                        <button
                          onClick={close}
                          className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#1f2937] hover:bg-[#2d592f] focus:outline-none "
                        >
                          بستن تیکت
                        </button>
                      ) : (
                        <button
                          onClick={open}
                          className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#1f2937] hover:bg-[#2d592f] focus:outline-none "
                        >
                          باز کردن تیکت
                        </button>
                      )}
                      <Link href="/support/ticket">
                        <button
                          type="button"
                          className="inline-flex mr-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 "
                        >
                          <span>بازگشت</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
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
                    <Image src="/images/dots.svg" height={120} width={120} />{" "}
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
    </div>
  );
}
