import SidebarDesktop from "../../components/layout/sidebarDesktop";
import SidebarMobile from "../../components/layout/sidebarMobile";
import StickyHeader from "../../components/layout/stickyHeader";
import navigationList from "../../components/layout/navigationList";
import { useState, useRef, useEffect } from "react";
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
        var hasError=false;
        var object = {};        
        if (!currentPassowrd) {
            object['currentPassword'] = 'رمز عبور فعلی الزامی است';
            hasError=true;
        }
        if (!newPassowrd) {
            object['newPassword'] = 'رمز عبور جدید الزامی است';
            hasError=true;
        }
        if (newPassowrd && newPassowrd.length<6) {
            object['newPassword'] = 'حداقل ۶ کاراکتر الزامی است';
            hasError=true;
        }
        if (!newPassowrdRepeat) {
            object['newPasswordRepeat'] = 'تکرار رمز عبور جدید الزامی است';
            hasError=true;
        }
        if(newPassowrd && newPassowrdRepeat && newPassowrd!=newPassowrdRepeat){
            object['newPasswordRepeat'] = 'رمز عبور جدید و تکرار رمز عبور جدید یکسان نیست';
            hasError=true;
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
            object['master'] = error.response.data.message;
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
            <SidebarDesktop menu={navigationList()} loc={asPath}
                setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
                setActions={(props) => setCurrentUserActions(props.currentUserActions)}
                setIsHolding={(props) => { }}
                setSuperUser={(props) => { }} />
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
                                                        تغییر رمز عبور
                                                    </h2>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="رمز فعلی *"
                                                        name={"currentPassowrd"}
                                                        rows="1"                                                    
                                                        onChange={(event) =>
                                                            setCurrentPassword(
                                                                event.target.value
                                                            )
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
                                                        title="رمز جدید *"
                                                        name={"newPassowrd"}
                                                        rows="1"    
                                                        onChange={(event) =>
                                                            setNewPassword(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["newPassword"]}
                                                        type="password"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                <div className="sm:col-span-4"></div>
                                                 <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="تکرار رمز جدید *"
                                                        name={"newPassowrdRepeat"}
                                                        rows="1"                                                       
                                                        onChange={(event) =>
                                                            setNewPassowrdRepeat(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["newPasswordRepeat"]}
                                                        type="password"
                                                        isrequired="true"
                                                    />
                                                </div>                                             
                                            </div>
                                            
                                            {errors["master"] ? (
                                                        <span className="text-sm text-red-500">
                                                            {
                                                                errors[
                                                                "master"
                                                                ]
                                                            }
                                                        </span>
                                                    ) : null}
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="pt-3 pb-2 px-10 border-t border-gray-200">
                                <div className="flex justify-end">
                                    <button
                                        onClick={onSubmit}
                                        type="button"
                                        className="inline-flex justify-center py-2 px-4 ml-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <span>تغییر رمز</span>
                                    </button>
                                   
                                    <Link href="/dashboard">
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
        </div>
    );
}
