import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/auth";
import InputBox from "../components/forms/inputBox";
import AuthValidationErrors from "../components/validations/AuthValidationErrors";
export default function Index() {
    const router = useRouter();

    const { login } = useAuth({
        middleware: "guest",
        redirectIfAuthenticated: "/dashboard",
    });
    const [ncode, setNcode] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (router.query.reset?.length > 0 && errors.length == 0) {
            setStatus(atob(router.query.reset));
        } else {
            setStatus(null);
        }
    });

    useEffect(() => {
        if (errors.message && errors.message.length > 0)
            setLoading(false);
    }, [errors]);
    const submitForm = async (event) => {
        event.preventDefault();
        setLoading(true);
        login({ ncode, password, setErrors, setStatus });
    };

    return (
        <div
            className="h-screen min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8"
            style={{
                //    background: `url(https://my.bmi.ir/portalserver/static/ibank/widgets/bmi-change-background-random/data/images/11.jpg)`,
                background: `url(/images/Background.png)`,
                backgroundSize: "cover",
            }}
        >
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <form
                    onSubmit={submitForm}
                    className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
                >
                    <p className="text-center text-lg mb-6">ورود به سیستم</p>
                    <div className="space-y-6">
                        <AuthValidationErrors
                            className="mb-4"
                            errors={errors}
                        />

                        <InputBox
                            title="کد ملی"
                            name={"ncode"}
                            value={ncode}
                            onChange={(event) => setNcode(event.target.value.slice(0, 10))}
                            error={errors["کد ملی"]}
                            type="text"
                            isrequired="true"
                        />
                        
                        <InputBox
                            title="رمز عبور"
                            name={"password"}
                            value={password}
                            error={errors["رمز عبور"]}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            autoComplete="current-password"
                            type="password"
                            isrequired="true"
                        />

                        <div className="flex items-center justify-between">
                            {/* <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="mr-2 block text-sm text-gray-900"
                                >
                                    به خاطر بسپار
                                </label>
                            </div> */}
                            <div></div>
                            <div className="text-sm">
                                <a
                                    href="/forgotPassword"
                                    className="font-medium text-amber-500 hover:text-amber-600"
                                >
                                    فراموشی رمز عبور
                                </a>
                            </div>
                        </div>

                        <div>{/* <Button text="ورود" color="amber" /> */}</div>
                        <button
                            onClick={submitForm}
                            disabled={loading}
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
                            ${loading ? "bg-gray-500 hover:bg-gray-500" : "bg-amber-500 hover:bg-amber-600"}                                                    
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                            focus:ring-amber-500 w-full`}>
                            {`${loading ? 'در حال ارسال اطلاعات' : 'ورود'}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
