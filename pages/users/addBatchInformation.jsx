import SidebarDesktop from "../../components/layout/sidebarDesktop";
import SidebarMobile from "../../components/layout/sidebarMobile";
import StickyHeader from "../../components/layout/stickyHeader";
import navigationList from "../../components/layout/navigationList";
import BatchUsersTable from "../../components/table/batchUsersTable";
import { useAuth } from "../../hooks/auth";
import fileDownload from "js-file-download";
import { useState, forwardRef } from "react";
import React from "react";
import axios from "../../lib/axios";
import Link from "next/link";
import Forbidden from "../../components/forms/forbidden";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { ExcelRenderer } from "react-excel-renderer";
import moment from "jalali-moment";
moment.locale("fa");

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const p2e = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

export default function AddUser() {
  const [errors, setErrors] = useState([]);

  const [sendingForm, setSendingForm] = useState(false);
  const [userData, setUserData] = useState([]);
  const [userErrors, setUserErrors] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const [superAdmin, setSuperAdmin] = useState();
  const [open, setOpen] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  const handleToClose = (event, reason) => {
    window.location.assign("/users");
  };
  const DownloadFile = () => {
    axios
      .get("/api/v1/file/download_sample", {
        params: {},
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, "اطلاعات کاربران.xlsx");
      });
  };
  const educations = [
    { id: "0", title: "زیر‌ دیپلم" },
    { id: "1", title: "دیپلم" },
    { id: "2", title: "فوق دیپلم" },
    { id: "3", title: "کارشناسی" },
    { id: "4", title: "کارشناسی ارشد" },
    { id: "5", title: "دکتری" },
  ];
  const marriageStatusTypeMethods = [
    { id: "0", title: "متاهل" },
    { id: "1", title: "مجرد" },
  ];
  const genderTypeMethods = [
    { id: "0", title: "زن" },
    { id: "1", title: "مرد" },
  ];
  const contractTypeMethods = [
    { id: "0", title: "دائم" },
    { id: "1", title: "موقت" },
    { id: "2", title: "معین" },
  ];
  function findArrayElementByTitle(array, title) {
    return array.find((element) => {
      return element.title === title;
    });
  }

  const uploadChange = (event) => {
    let fileObj = event.target.files[0];
    event.target.value = null;
    var object = {};
    if (fileObj.name.split(".").pop() == "xlsx") {
      ExcelRenderer(fileObj, (err, resp) => {
        if (err) {
          object["file"] = err;
          setErrors(object);
        } else {
          object["file"] = "";
          setErrors(object);

          var userDataBuf = [];
          for (let j = 1; j < resp.rows.length; j++) {
            var errorObjects = {};
            if (!findArrayElementByTitle(genderTypeMethods, resp.rows[j][3])) {
              errorObjects["gender"] = "خطا در تشششخیص جنسیت";
            }
            if (
              !findArrayElementByTitle(contractTypeMethods, resp.rows[j][11])
            ) {
              errorObjects["contractType"] = "خطا در نوع قرارداد";
            }
            if (
              !findArrayElementByTitle(
                marriageStatusTypeMethods,
                resp.rows[j][4]
              )
            ) {
              errorObjects["marriageStatus"] = "خطا در وضعیت تاهل";
            }
            if (!findArrayElementByTitle(educations, resp.rows[j][8])) {
              errorObjects["education"] = "خطا در مدرک تحصیلی";
            }
            if (!moment(resp.rows[j][10], "YYYY/MM/DD", true).isValid()) {
              errorObjects["entryDate"] = "خطا در تاریخ ورود به شرکت";
            }
            if (!moment(resp.rows[j][6], "YYYY/MM/DD", true).isValid()) {
              errorObjects["birthDate"] = "خطا در تاریخ تولد";
            }
            userDataBuf = [
              ...userDataBuf,
              {
                index: j,
                firstName: resp.rows[j][0],
                lastName: resp.rows[j][1],
                fatherName: resp.rows[j][2] ? resp.rows[j][2] : null,
                gender: resp.rows[j][3] ? resp.rows[j][3] : null,
                marriageStatus: resp.rows[j][4] ? resp.rows[j][4] : null,
                nationalCode: resp.rows[j][5],
                birthDate: resp.rows[j][6] ? resp.rows[j][6] : null,
                mobile: resp.rows[j][7],
                education: resp.rows[j][8] ? resp.rows[j][8] : null,
                email: resp.rows[j][9] ? resp.rows[j][9] : null,
                entryDate: resp.rows[j][10] ? resp.rows[j][10] : null,
                contractType: resp.rows[j][11] ? resp.rows[j][11] : null,
                error: errorObjects,
              },
            ];
          }
          setUserData(userDataBuf);
        }
      });
    } else {
      object["file"] = "فقط فایل های اکسل با پسوند xlsx مجاز می‌باشد";
      setErrors(object);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSendingForm(true);
    var object = {};
    if (userData.length == 0) {
      object["master"] = "اطلاعاتی برای ثبت یافت نشد";
      setErrors(object);
      setSendingForm(false);
      return;
    }
    var hasError = false;
    object["data"] = [];
    for (let i = 0; i < userData.length; i++) {
      if (userData[i].error.gender) {
        object["data"] = [
          ...object["data"],
          `خطای جنسیت در ردیف ${i + 1} `,
          <br key={i} />,
        ];
        hasError = true;
      }
      if (userData[i].error.contractType) {
        object["data"] = [
          ...object["data"],
          `خطای نوع قرارداد در ردیف ${i + 1} `,
          <br key={i} />,
        ];
        hasError = true;
      }
      if (userData[i].error.marriageStatus) {
        object["data"] = [
          ...object["data"],
          `خطای وضعیت تاهل در ردیف ${i + 1} `,
          <br key={i} />,
        ];
        hasError = true;
      }
      if (userData[i].error.educations) {
        object["data"] = [
          ...object["data"],
          `خطای مدرک تحصیلی در ردیف ${i + 1} `,
          <br key={i} />,
        ];
        hasError = true;
      }
      if (userData[i].error.entryDate) {
        object["data"] = [
          ...object["data"],
          `خطای تاریخ ورود به شرکت در ردیف ${i + 1} `,
          <br key={i} />,
        ];
        hasError = true;
      }
      if (userData[i].error.birthDate) {
        object["data"] = [
          ...object["data"],
          `خطای تاریخ تولد در ردیف ${i + 1} `,
          <br key={i} />,
        ];
        hasError = true;
      }
      if (userData[i].error.contractType) {
        object["data"] = [
          ...object["data"],
          `خطای نوع قرارداد در ردیف ${i + 1} `,
          <br key={i} />,
        ];
        hasError = true;
      }
      userData[i].gender = userData[i].gender
        ? findArrayElementByTitle(genderTypeMethods, userData[i].gender)
          ? findArrayElementByTitle(genderTypeMethods, userData[i].gender).id
          : null
        : null;
      userData[i].marriageStatus = userData[i].marriageStatus
        ? findArrayElementByTitle(
            marriageStatusTypeMethods,
            userData[i].marriageStatus
          )
          ? findArrayElementByTitle(
              marriageStatusTypeMethods,
              userData[i].marriageStatus
            ).id
          : null
        : null;
      userData[i].education = userData[i].education;
      userData[i].contractType = userData[i].contractType;
      userData[i].entryDate = userData[i].entryDate.replaceAll("/", "-");
      userData[i].birthDate = userData[i].birthDate.replaceAll("/", "-");
    }
    if (hasError) {
      setErrors(object);
      setSendingForm(false);
      return;
    }
    axios
      .post("/api/v1/user/register_batch", {
        data: userData,
      })
      .then((res) => {
        setOpen(true);
      })
      .catch((err) => {
        object["master"] = "خطا در ثبت اطلاعات";
        setErrors(object);
        setSendingForm(false);
      });
  };

  const { user, isLoading } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/",
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
      <SidebarMobile menu={navigationList()} loc={"/users"} />
      <SidebarDesktop
        menu={navigationList()}
        loc={"/users"}
        setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
        setActions={(props) => setCurrentUserActions(props.currentUserActions)}
        setIsHolding={(props) => setIsHolding(props.isHolding)}
        setSuperUser={(props) => setSuperAdmin(props.superAdmin)}
      />
      <div className="md:pr-52 flex flex-col flex-1">
        <StickyHeader />
        {!currentUserActions ? null : CheckIfAccessToPage(
            window.location.pathname
          ) ? (
          <main>
            <div className="py-6">
              <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                  <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <div className="ml-4 mt-2 flex items-center">
                      <h2 className="text-lg leading-6 font-large text-gray-900">
                        افزودن گروهی کاربران
                      </h2>
                    </div>
                    <div className="mr-10 space-x-3 justify-start ">
                      <div>
                        <label
                          htmlFor="file-upload"
                          className="relative inline-flex items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#1f2937] hover:bg-[#11151b] "
                        >
                          <span>آپلود فایل اکسل</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onInput={(e) => {
                              uploadChange(e);
                            }}
                          />
                        </label>
                        <label
                          htmlFor="file-downl"
                          className="relative inline-flex  mr-2 items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#1f2937] hover:bg-[#11151b] "
                        >
                          <button
                            id="file-download"
                            name="file-download"
                            type="button"
                            onClick={() => DownloadFile()}
                          >
                            دانلود فایل اکسل نمونه
                          </button>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  {errors["file"] ? (
                    <span className="text-sm mr-5 text-red-500">
                      {errors["file"]}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <BatchUsersTable
              loadingData={false}
              data={userData}
              roleData={currentUserRole}
            />
            <div className="pt-3 pb-2 px-10 border-t border-gray-200">
              <div className="flex justify-between">
                <div>
                  {errors["master"] ? (
                    <span className="text-md text-red-500">
                      {errors["master"]}
                    </span>
                  ) : null}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={onSubmit}
                    disabled={sendingForm}
                    type="button"
                    className={`ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm ${
                      sendingForm
                        ? " bg-gray-500 hover:bg-gray-500 "
                        : " bg-[#43a047] hover:bg-[#2d592f] "
                    }  focus:outline-none`}
                  >
                    <span>{`${
                      sendingForm ? "در حال ثبت اطلاعات" : "ثبت"
                    }`}</span>
                  </button>

                  <Link href="/users">
                    <button
                      type="button"
                      className="rounded-md bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                    >
                      <span>انصراف</span>
                    </button>
                  </Link>
                </div>
              </div>
              <div>
                {errors["data"] ? (
                  <p className="text-md text-red-500">{errors["data"]}</p>
                ) : null}
              </div>
            </div>
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
          </main>
        ) : (
          <Forbidden />
        )}
      </div>
    </div>
  );
}
