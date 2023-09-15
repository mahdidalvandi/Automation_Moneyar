import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/auth";
import Moneyarbg from "../public/images/moneyarbg.png";
import InputBox from "../components/forms/inputBox";
import AuthValidationErrors from "../components/validations/AuthValidationErrors";
import Image from "next/image";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import Link from "next/link";
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
    if (errors.message && errors.message.length > 0) setLoading(false);
  }, [errors]);
  const submitForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    login({ ncode, password, setErrors, setStatus });
  };

  return (
    <div className="h-screen w-screen flex">
      {/* RightSide */}
      <div className="h-full w-1/2 items-center ">
        <div className="h-1/2 w-1/2 mt-60 mr-52 ">
          <Image alt="image" className="" src={Moneyarbg} />
        </div>
      </div>

      {/* LeftSide */}
      <div className="h-full w-1/2 bg-[#333333]">
        <div className="mt-72 sm:mx-auto sm:w-full sm:max-w-md">
          <form
            onSubmit={submitForm}
            className=" py-4 px-4 sm:rounded-lg sm:px-10"
          >
            <p className="text-center text-white text-lg mb-6">وارد شوید</p>
            <div className="space-y-6">
              <AuthValidationErrors className="mb-4" errors={errors} />

              <InputBox
                name={"ncode"}
                placeholder={"کد ملی"}
                value={ncode}
                onChange={(event) => setNcode(event.target.value.slice(0, 10))}
                error={errors["کد ملی"]}
                type="text"
                isrequired="true"
              />

              <InputBox
                placeholder={"رمز عبور"}
                name={"password"}
                value={password}
                error={errors["رمز عبور"]}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                type="password"
                isrequired="true"
              />

              <div className="flex flex-col items-center justify-between">
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
                            ${
                              loading
                                ? "bg-gray-500 hover:bg-gray-500"
                                : "bg-[#7ACC9D] hover:bg-[#63a780]"
                            }                                                    
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                           w-full`}
                >
                  {!loading && <ArrowCircleLeftIcon />}
                  {`${loading ? "در حال ارسال اطلاعات" : `ورود `}`}
                </button>
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
                <div className="text-sm py-3 ">
                  <Link
                    href="/forgotPassword"
                    className="font-medium text-[#2E8BFF] hover:text-[#406a9e]"
                  >
                    فراموشی رمز عبور
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
