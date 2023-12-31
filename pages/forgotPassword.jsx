import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/auth";
import InputBox from "../components/forms/inputBox";
import AuthValidationErrors from "../components/validations/AuthValidationErrors";
import axios from "../lib/axios";
import Button from "../components/forms/button";
import background from '../public/images/Background.png';
export default function Index() {
    const router = useRouter();

    const [ncode, setNcode] = useState("");

    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);
    const [newPassowrd, setNewPassword] = useState("");
    const [newPassowrdRepeat, setNewPassowrdRepeat] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSend, setOtpSend] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [gtp , setGtp]= useState(false);

    const [minutes, setMinutes] = useState(2);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if(seconds == 1 && minutes == 0) setOtpSend(false);
            if (seconds === 0) {
                if (minutes === 0) {
                    
                    clearInterval(myInterval)
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    });

    const getOtp = async (event) => {
        event.preventDefault();
        const mailFormData = new FormData();
        var hasError = false;
        var object = {};
        if (!ncode) {
            object['ncode'] = 'کد ملی خود را وارد کنید';
            hasError = true;
        }
        if (ncode && ncode.length < 10) {
            object['ncode'] = 'کد ملی معتبر نمی‌باشد';
            hasError = true;
        }
        if (hasError) {
            setErrors(object);
            return;
        }
        mailFormData.append("national_code", ncode);

        try {
            const response = await axios({
                method: "post",
                url: "/api/v1/user/send_otp",
                data: mailFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {
                setOtpSend(true);
                setShowReset(true);
                setMinutes(2);
                setSeconds(0);
                object = {};
                setErrors(object);
                setGtp(true)
            }
        } catch (error) {
            object['master'] = error.response.data.message;
            setErrors(object);
        }
    }
    const changePassword = async (event) => {
        event.preventDefault();
        const mailFormData = new FormData();
        var hasError = false;
        var object = {};
        if (!otp) {
            object['otpCode'] = 'کد یکبار مصرف الزامی است';
            hasError = true;
        }
        if (otp.length != 6) {
            object['otpCode'] = 'کد یکبار مصرف معتبر نمی باشد';
            hasError = true;
        }
        if (!newPassowrd) {
            object['newPassword'] = 'رمز عبور جدید الزامی است';
            hasError = true;
        }
        if (newPassowrd && newPassowrd.length < 6) {
            object['newPassword'] = 'حداقل ۶ کاراکتر الزامی است';
            hasError = true;
        }
        if (!newPassowrdRepeat) {
            object['newPasswordRepeat'] = 'تکرار رمز عبور جدید الزامی است';
            hasError = true;
        }
        if (newPassowrd && newPassowrdRepeat && newPassowrd != newPassowrdRepeat) {
            object['newPasswordRepeat'] = 'رمز عبور جدید و تکرار رمز عبور جدید یکسان نیست';
            hasError = true;
        }
        if (hasError) {
            setErrors(object);
            return;
        }
        mailFormData.append("otp_code", otp);
        mailFormData.append("new_password", newPassowrd);

        try {
            const response = await axios({
                method: "post",
                url: "/api/v1/user/verify_otp",
                data: mailFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {
                window.location.assign("/");
            }
        } catch (error) {
            object['master'] = error.response.data.message;
            setErrors(object);
        }
    }
    const submitForm = async (event) => {

    };

    return (
        <div
            className="h-screen bg-[#ECECEC] min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8"
        >
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <form
                    onSubmit={submitForm}
                    className="py-8 px-4 sm:rounded-lg sm:px-10"
                >
                    {!gtp ?<>
                    <p className="text-center text-lg mb-4">بازیابی رمز عبور</p>
                    <p className="text-center text-[#666666]">کد بازیابی به موبایل شما فرستاده خواهد شد</p>
                        <InputBox
                            placeholder={"کد ملی"}
                            name={"ncode"}
                            value={ncode}
                            diabled={otpSend ? "true" : "false"}
                            onChange={(event) => setNcode(event.target.value.slice(0, 10))}
                            error={errors["ncode"]}
                            type="text"
                            isrequired="true"
                        
                        />
                  
                        <button
                            onClick={getOtp}
                            disabled={otpSend}
                            className={`flex
                            justify-center
                            py-2
                            px-4
                            border
                            border-transparent
                            rounded-md
                            shadow-sm
                            text-sm
                            font-medium
                            text-white
                            ${!otpSend? `bg-[#7ACC9D]`: `bg-gray-500`}
                            ${!otpSend? `hover:bg-[#65aa83]`: `hover:bg-gray-600`}                            
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                            focus:ring-amber-500 w-full`}
                        >
                            {!otpSend ? " دریافت کد" : minutes === 0 && seconds === 0
                                ? " دریافت کد "
                                : <h1>دریافت مجدد کد {`0${minutes}`}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                            }
                        </button> 
                        </>:null}
                    
                        {showReset ?
                            <>
                                 <p className="text-center text-lg mb-4">بازیابی رمز عبور</p>
                                <InputBox
                                    placeholder="کد بازیابی"
                                    name={"otpCode"}
                                    error={errors["otpCode"]}
                                    onChange={(event) =>
                                        setOtp(event.target.value)
                                    }
                                    isrequired="true"
                                />
                                <InputBox
                                    placeholder="رمز عبور جدید"
                                    name={"newPassword"}
                                    error={errors["newPassword"]}
                                    onChange={(event) =>
                                        setNewPassword(event.target.value)
                                    }
                                    type="password"
                                    isrequired="true"
                                />
                                <InputBox
                                    placeholder="تکرار رمز عبور جدید"
                                    name={"newPasswordRepeat"}
                                    error={errors["newPasswordRepeat"]}
                                    onChange={(event) =>
                                        setNewPassowrdRepeat(event.target.value)
                                    }
                                    autoComplete="current-password"
                                    type="password"
                                    isrequired="true"
                                    
                                />
                                <div>{/* <Button text="ورود" color="amber" /> */}</div>
                                
                                <button
                                    onClick={changePassword}
                                    className="flex   
                            justify-center
                            mt-4
                            py-2
                            px-4
                            border
                            border-transparent
                            rounded-md
                            shadow-sm
                            text-sm
                            font-medium
                            text-white
                            bg-[#7ACC9D]
                            hover:bg-[#5ca17a]
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                            focus:ring-amber-500 w-full"
                                >
                            تایید
                                </button>
                                <button
                               onClick={getOtp}
                               disabled={otpSend}
                               className={`flex
                               justify-center
                               mt-8
                               py-2
                               px-4
                               border
                               border-transparent
                               rounded-md
                               shadow-sm
                               text-sm
                               font-medium
                               text-white
                               ${!otpSend? `bg-[#7ACC9D]`: `bg-gray-500`}
                               ${!otpSend? `hover:bg-[#65aa83]`: `hover:bg-gray-600 cursor-not-allowed`}                            
                               focus:outline-none
                               focus:ring-2
                               focus:ring-offset-2
                               focus:ring-amber-500 w-full`}
                           >
                               {!otpSend ? " دریافت مجدد کد" : minutes === 0 && seconds === 0
                                         ? " دریافت کد "
                                        : <h1>ارسال مجدد کد بعد از {`0${minutes}`}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                                      } 
                                 
                                      </button>
                               </> : null}
                       
                        {errors["master"] ? (
                            <span className="text-sm text-red-500">
                                {
                                    errors[
                                    "master"
                                    ]
                                }
                            </span>
                        ) : null}
                    

                </form>
            </div>
        </div>
    );
}
