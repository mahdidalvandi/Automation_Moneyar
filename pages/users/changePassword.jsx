import SidebarDesktop from "../../components/layout/sidebarDesktop";
import SidebarMobile from "../../components/layout/sidebarMobile";
import StickyHeader from "../../components/layout/stickyHeader";
import navigationList from "../../components/layout/navigationList";
import { useState, useRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../hooks/auth";
import { useGroup } from "../../hooks/group";
import Link from "next/link";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import InputBox from "../../components/forms/inputBox";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "../../lib/axios";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Forbidden from "../../components/forms/forbidden";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function EditPost() {
  const { asPath } = useRouter();

  const [currentPassowrd, setCurrentPassword] = useState("");
  const [newPassowrd, setNewPassword] = useState("");
  const [newPassowrdRepeat, setNewPassowrdRepeat] = useState("");

  const [errors, setErrors] = useState([]);

  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    const mailFormData = new FormData();
    var hasError = false;
    var object = {};
    if (!currentPassowrd) {
      object["currentPassword"] = "رمز عبور فعلی الزامی است";
      hasError = true;
    }
    if (!newPassowrd) {
      object["newPassword"] = "رمز عبور جدید الزامی است";
      hasError = true;
    }
    if (newPassowrd && newPassowrd.length < 6) {
      object["newPassword"] = "حداقل ۶ کاراکتر الزامی است";
      hasError = true;
    }
    if (!newPassowrdRepeat) {
      object["newPasswordRepeat"] = "تکرار رمز عبور جدید الزامی است";
      hasError = true;
    }
    if (newPassowrd && newPassowrdRepeat && newPassowrd != newPassowrdRepeat) {
      object["newPasswordRepeat"] =
        "رمز عبور جدید و تکرار رمز عبور جدید یکسان نیست";
      hasError = true;
    }

    if (hasError) {
      setErrors(object);
      return;
    }
    mailFormData.append("old_password", currentPassowrd),
      mailFormData.append("new_password", newPassowrd);

    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/user/change_pwd",
        data: mailFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status == 200) {
        window.location.assign("/dashboard");
      }
    } catch (error) {
      object["master"] = error.response.data.message;
      setErrors(object);
    }
  };
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
        <main>
          <div className="py-6">
            <div className="w-full px-4 sm:px-6 md:px-8">
              <form className="space-y-8 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200">
                  <div>
                    <div className="mt-2 mb-2 grid grid-cols-1 gap-y-5 gap-x-2 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <h2 className="text-xl">تغییر رمز عبور</h2>
                      </div>

                      <div className="sm:col-span-2">
                        <InputBox
                          placeholder="رمز فعلی *"
                          name={"currentPassowrd"}
                          rows="1"
                          onChange={(event) =>
                            setCurrentPassword(event.target.value)
                          }
                          error={errors["currentPassword"]}
                          autoComplete="current-password"
                          type="password"
                          isrequired="true"
                        />
                      </div>
                      <div className="sm:col-span-4"></div>
                      <div className="sm:col-span-2">
                        <InputBox
                          placeholder="رمز جدید *"
                          name={"newPassowrd"}
                          rows="1"
                          onChange={(event) =>
                            setNewPassword(event.target.value)
                          }
                          error={errors["newPassword"]}
                          type="password"
                          isrequired="true"
                        />
                      </div>
                      <div className="sm:col-span-4"></div>
                      <div className="sm:col-span-2">
                        <InputBox
                          placeholder="تکرار رمز جدید *"
                          name={"newPassowrdRepeat"}
                          rows="1"
                          onChange={(event) =>
                            setNewPassowrdRepeat(event.target.value)
                          }
                          error={errors["newPasswordRepeat"]}
                          type="password"
                          isrequired="true"
                        />
                      </div>
                    </div>

                    {errors["master"] ? (
                      <span className="text-sm text-red-500">
                        {errors["master"]}
                      </span>
                    ) : null}
                  </div>
                </div>
              </form>
            </div>
            <div className="pt-3 pb-2 px-10 border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={onSubmit}
                  type="button"
                  className="inline-flex justify-center py-2 px-10 ml-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#7ACC9D] hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <span>تغییر رمز</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    className="mr-2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="white"
                      d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8l-1.41-1.42Z"
                    />
                  </svg>
                </button>

                <Link href="/dashboard">
                  <button
                    type="button"
                    className="bg-transparen flex items-center text-[#22AA5B] font-semibold py-2 px-6 border-[#22AA5B] border rounded"
                  >
                    <span>انصراف</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.293 5.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 11-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 111.414-1.414L10 8.586l4.293-4.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
