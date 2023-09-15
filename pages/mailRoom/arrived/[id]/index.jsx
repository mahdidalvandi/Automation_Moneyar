import SidebarDesktop from "../../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../../components/layout/sidebarMobile";
import StickyHeader from "../../../../components/layout/stickyHeader";
import navigationList from "../../../../components/layout/navigationList";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../../hooks/auth";
import { useMailRoom } from "../../../../hooks/mailRoomArrived";
import { PlusIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import TextWithLabel from "../../../../components/forms/textWithLabel";
import { loadImageFromServer } from "../../../../lib/helper";
import moment from "jalali-moment";
import RegisterMailreceipt from "../../../../components/forms/registerMailreceipt";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "../../../../lib/axios";
import { Editor } from "@tinymce/tinymce-react";
import RecieversDialog from "../../../../components/forms/recieversDialog";
import MailsDialog from "../../../../components/forms/mailsDialog";
import { CloudDownloadIcon } from "@heroicons/react/solid";
import fileDownload from "js-file-download";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";

moment.locale("fa");

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const myLoader = ({ src, width, quality }) => {
  return loadImageFromServer(`${src}?w=${width}&q=${quality || 75}`);
};

export default function ViewEmail() {
  const editorRef = useRef(null);
  const { asPath } = useRouter();
  const [mailsData, setMailsData] = useState({});
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [recipient, setRecipient] = useState([]);
  const [regarding, setRegarding] = useState({ indic: "", subj: "" });
  const [attachements, setAttachments] = useState([]);
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState([]);
  const [errors, setErrors] = useState([]);
  const [recieversDialogVisibility, setRecieversDialogVisibility] =
    useState(false);
  const [groupData, setGroupData] = useState();
  const [loadingGroupData, setLoadingGroupData] = useState(false);
  const [mailsDialogVisibility, setMailsDialogVisibility] = useState(false);
  const [defaultMailsData, setDefaultMailsData] = useState({});
  const [loadingMailsData, setLoadingMailsData] = useState(false);
  const [downloading, setDownloading] = useState();

  const router = useRouter();
  useEffect(() => {
    axios
      .get("/api/v1/cartable/init")
      .then((res) => setPeople(res.data.data.users))
      .catch((error) => {
        if (error.response.status != 409) throw error;
      });
  }, []);
  useEffect(() => {
    axios.get(`/api/v1/group/list/all`).then((response) => {
      setGroupData(response.data.data);
      setLoadingGroupData(false);
    });
  }, [recieversDialogVisibility]);
  useEffect(() => {
    axios.get(`/api/v1/cartable/list`).then((response) => {
      setMailsData(response.data.data);
      setDefaultMailsData(response.data.data);
      setLoadingMailsData(false);
    });
  }, [mailsDialogVisibility]);

  useEffect(() => {
    if (router.isReady) {
      getMailRoom(router.query.id);
    }
  }, [router.isReady]);

  const { getMailRoom, mailRoomData, letterContetn, isMailRoomLoading } =
    useMailRoom();

  const { user, isLoading } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/",
  });
  const openRecipt = async (event) => {
    event.preventDefault();
    setReceiptOpen(true);
  };
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
  function blobToString(b) {
    var u, x;
    u = URL.createObjectURL(b);
    x = new XMLHttpRequest();
    x.open("GET", u, false); // although sync, you're not fetching over internet
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
        } else {
          fileDownload(res.data, value + "." + type);
        }
      })
      .catch((err) => {
        setDownloading();
        var object = {};
        object["download"] = JSON.parse(
          blobToString(err.response.data)
        ).message;
        setErrors(object);
      });
  };
  const registerMailAndSend = async (event) => {
    event.preventDefault();
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
    mailFormData.append("attachments", attachements);
    mailFormData.append("indicator", mailRoomData.indicator);

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
    }
  };
  function getRegarding(uuid) {
    axios
      .get(`/api/v1/letter/regarding/uuid/${uuid}`)
      .then((res) => {
        setRegardingData(res.data.data[0]);
        setRegardingOpen(true);
      })
      .catch((error) => {});
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
              <form className="space-y-8 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200">
                  <div>
                    <div className="mt-2 mb-2 grid grid-cols-1 gap-y-5 gap-x-2 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <h2 className="text-xl">
                          اطلاعات نامه وارده {/* {companyData.title} */}
                        </h2>
                      </div>

                      <div className="sm:col-span-2">
                        <TextWithLabel title="نوع نامه" text={"نامه وارده"} />
                      </div>
                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="شماره دبیرخانه"
                          text={mailRoomData.indicator}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="تاریخ ثبت "
                          text={
                            mailRoomData.add_timestamp
                              ? moment
                                  .unix(mailRoomData.add_timestamp)
                                  .format("YYYY/MM/DD HH:mm:ss")
                              : null
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="تاریخ نامه"
                          text={
                            mailRoomData.letter_timestamp
                              ? moment
                                  .unix(mailRoomData.letter_timestamp)
                                  .format("YYYY/MM/DD")
                              : null
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="فرستنده نامه"
                          text={mailRoomData.letter_sender_name}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="موضوع نامه"
                          text={mailRoomData.letter_subject}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="نحوه ارسال"
                          text={
                            mailRoomData.letter_received_type
                              ? mailRoomData.letter_received_type
                              : "-"
                          }
                        />
                      </div>
                      <div className="sm:col-span-6">
                        <TextWithLabel title="ضمیمه" />

                        <div className="mb-4">
                          {mailRoomData.attachments
                            ? Object.keys(mailRoomData.attachments).length != 0
                              ? mailRoomData.attachments.map((file, index) => (
                                  <span
                                    key={index}
                                    className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                  >
                                    <button
                                      type="button"
                                      disabled
                                      className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                    >
                                      {file.name
                                        ? file.name
                                        : "فایل" +
                                          " " +
                                          (index + 1) +
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
                                      {downloading == file.uuid ? (
                                        <Image
                                          alt="image"
                                          src="/images/dots.svg"
                                          height={22}
                                          width={22}
                                        />
                                      ) : (
                                        <CloudDownloadIcon
                                          className="-ml-1 h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      )}
                                    </button>
                                  </span>
                                ))
                              : "ندارد"
                            : null}
                        </div>
                        {errors["download"] ? (
                          <span className="text-sm text-red-500">
                            {errors["download"]}
                          </span>
                        ) : (
                          <span>&nbsp;</span>
                        )}
                      </div>
                      <div className="sm:col-span-6">
                        {" "}
                        {/*registerButton*/}
                        <button
                          onClick={openRecipt}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white  bg-gray-600 hover:bg-gray-700  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          چاپ رسید
                        </button>
                      </div>

                      <div className="sm:col-span-6">
                        <h2 className="text-xl">اطلاعات ارجاع </h2>
                      </div>
                      {mailRoomData &&
                      mailRoomData.letter_content &&
                      mailRoomData.letter_content.length == 2 ? (
                        <>
                          <div className="sm:col-span-6">
                            {" "}
                            {/*reciver*/}
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
                                onChange={(event, newValue) => {
                                  setRecipient(newValue);
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
                              متن ارجاع
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

                          <div className="sm:col-span-6">
                            {/* <p className="text-sm text-red-500 ">
                                                            تکمیل تمامی فیلدهای ستاره
                                                            دار (*) اجباری است.
                                                        </p> */}
                          </div>
                          <div className="sm:col-span-6">
                            {" "}
                            {/*registerButton*/}
                            <button
                              onClick={registerMailAndSend}
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-abmer-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              ثبت و ارجاع
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="sm:col-span-4">
                            <TextWithLabel
                              title="به"
                              text={letterContetn.recipient_names}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <TextWithLabel title="عطف به" />
                            <div className="mb-4">
                              <span
                                key={1}
                                className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                              >
                                {letterContetn.regarding ? (
                                  <button
                                    type="button"
                                    onClick={() => getRegarding(regarding.uuid)}
                                    className="relative inline-flex items-center px-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                  >
                                    {letterContetn.regarding
                                      ? letterContetn.regarding.title
                                      : ""}
                                  </button>
                                ) : (
                                  "ندارد"
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="sm:col-span-5">
                            <Editor
                              tinymceScriptSrc={
                                process.env.NEXT_PUBLIC_FRONT_URL +
                                "/tinymce/tinymce.min.js"
                              }
                              onInit={(evt, editor) =>
                                (editorRef.current = editor)
                              }
                              disabled={true}
                              initialValue={letterContetn.body}
                              init={{
                                selector: "textarea",
                                menubar: false,
                                directionality: "rtl",
                                readonly: true,
                                toolbar: false,
                              }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="pt-3 pb-2 px-10 border-t border-gray-200">
              <div className="flex justify-end">
                {/* <Link href={`${router.query.id}/edit`}>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center py-2 px-4 ml-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <span>ویرایش</span>
                                    </button>
                                </Link> */}

                <Link href="/mailRoom/arrived">
                  <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <span>بازگشت</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
      <RecieversDialog
        data={groupData}
        dialogOpen={recieversDialogVisibility}
        setDialog={(par) => setRecieversDialogVisibility(par)}
        setSelect={(receivers) => onRecepientGroupSelect(receivers)}
      />
      <RegisterMailreceipt
        indicator={mailRoomData.indicator}
        mailNo={mailRoomData.letter_no}
        mailSubject={mailRoomData.letter_subject}
        mailDate={mailRoomData.letter_timestamp}
        dialogOpen={receiptOpen}
        setDialog={(par) => setReceiptOpen(par)}
        setSelect={(props) => {}}
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
