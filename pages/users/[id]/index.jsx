import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../hooks/auth";
import { useUser } from "../../../hooks/user";
import Link from "next/link";
import { useRouter } from "next/router";
import TextWithLabel from "../../../components/forms/textWithLabel";
import Image from "next/image";
import { loadImageFromServer } from "../../../lib/helper";
import { loadImageFromLocal } from "../../../lib/helper";
import { saveAs } from "file-saver";
import Forbidden from "../../../components/forms/forbidden";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const myLoader = ({ src, width, quality }) => {
    return loadImageFromServer(`${src}?w=${width}&q=${quality || 75}`);
};
const myLocalLoader = ({ src, width, quality }) => {
    return loadImageFromLocal(`${src}?w=${width}&q=${quality || 75}`);
};

export default function ViewUser() {
    const { asPath } = useRouter();
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            getUser(router.query.id);
        }
    }, [router.isReady]);

    const { getUser, userData, isUserLoading } = useUser();

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
            <SidebarMobile menu={navigationList()} loc={asPath} />
            <SidebarDesktop menu={navigationList()} loc={asPath}
                setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
                setActions={(props) => setCurrentUserActions(props.currentUserActions)}
                setIsHolding={(props) => { }}
                setSuperUser={(props) => { }} />
            <div className="md:pr-52 flex flex-col flex-1">
                <StickyHeader />
                {!currentUserActions ? null : CheckIfAccessToPage(`/${window.location.pathname.split("/")[1]}`) ?
                    <main>
                        <div className="py-6">
                            <div className="w-full px-4 sm:px-6 md:px-8">
                                <form className="space-y-8 divide-y divide-gray-200">
                                    <div className="space-y-8 divide-y divide-gray-200">
                                        <div>
                                            <div className="mt-2 mb-2 grid grid-cols-1 gap-y-5 gap-x-2 sm:grid-cols-6">
                                                <div className="sm:col-span-6">
                                                    <h2 className="text-xl">
                                                        اطلاعات کاربر{" "}
                                                        {userData.title}
                                                    </h2>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="نام"
                                                        text={userData.first_name}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="نام خانوادگی"
                                                        text={userData.last_name}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="نام پدر"
                                                        text={
                                                            userData.father_name && userData.father_name != "null"
                                                                ? userData.father_name
                                                                : "ثبت نشده است"
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="جنسیت"
                                                        text={
                                                            userData.gender == "0" ? "زن"
                                                                : userData.gender == "1" ? "مرد" : "ثبت نشده است"
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="وضعیت تاهل"
                                                        text={
                                                            userData.marriage_status === "0" ? "متاهل"
                                                                : userData.marriage_status === "1" ? "مجرد" : "ثبت نشده است"
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="تحصیلات"
                                                        text={
                                                            userData.education && userData.education != "null"
                                                                ? userData.education
                                                                : "ثبت نشده است"
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="کد ملی"
                                                        text={
                                                            userData.national_code
                                                                ? userData.national_code
                                                                : "ثبت نشده است"
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="تاریخ تولد"
                                                        text={
                                                            userData.birthday
                                                                ? userData.birthday
                                                                : "ثبت نشده است"
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="شماره موبایل"
                                                        text={
                                                            userData.mobile == null || userData.mobile == "null"
                                                                ? "ثبت نشده است"
                                                                : userData.mobile
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="آدرس ایمیل سازمانی"
                                                        text={
                                                            userData.email == null || userData.email == "null"
                                                                ? "ثبت نشده است"
                                                                : userData.email
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="آدرس جیمیل (جهت دریافت تقویم جلسات)"
                                                        text={
                                                            userData.gmail == null || userData.gmail == "null"
                                                                ? "ثبت نشده است"
                                                                : userData.gmail
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="کد پرسنلی"
                                                        text={
                                                            userData.personel_code == null || userData.personel_code == "null"
                                                                ? "ثبت نشده است"
                                                                : userData.personel_code
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="نوع قرارداد"
                                                        text={
                                                            userData.contract_type == null || userData.contract_type == "null"
                                                                ? "ثبت نشده است"
                                                                : userData.contract_type
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="تاریخ ورود به سازمان"
                                                        text={
                                                            userData.entry_date == null || userData.entry_date == "null"
                                                                ? "ثبت نشده است"
                                                                : userData.entry_date
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="تاریخ ترک کار"
                                                        text={
                                                            userData.leaving_date ?
                                                            userData.leaving_date == null || userData.leaving_date == "null"
                                                                ? "ثبت نشده است"
                                                                : userData.leaving_date : "در حال خدمت"
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="واحد فعالیت"
                                                        text={
                                                            userData.department_name
                                                                ? userData.department_name
                                                                : "ثبت نشده است"
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="سمت فعالیت"
                                                        text={
                                                            userData && userData.post_array ?
                                                                userData.post_array.length > 0
                                                                    ?
                                                                    (userData.post_array.map(({ title }) => " " + title))
                                                                    : userData.post_name ? userData.post_name : "ثبت نشده است" : null
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <TextWithLabel
                                                        title="دسترسی"
                                                        text={
                                                            userData.role_name
                                                                ? userData.role_name
                                                                : "ثبت نشده است"
                                                        }
                                                    />
                                                </div>
                                                <div className="sm:col-span-6"></div>
                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="avater"
                                                        className={
                                                            "block text-sm font-medium  text-gray-700 mb-2"
                                                        }
                                                    >
                                                        عکس پرسنلی
                                                    </label>
                                                    {userData.avatar ? (
                                                        <Image
                                                            loader={myLoader}
                                                            src={userData.avatar}
                                                            alt="عکس پرسنلی"
                                                            width={200}
                                                            height={200}
                                                        />
                                                    ) : (
                                                        <Image
                                                            loader={
                                                                myLocalLoader
                                                            }
                                                            src="noImage.png"
                                                            alt="عکس پرسنلی"
                                                            width={200}
                                                            height={200}
                                                        />)}
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="avater"
                                                        className={
                                                            "block text-sm font-medium  text-gray-700 mb-2"
                                                        }
                                                    >
                                                        امضا
                                                    </label>
                                                    {userData.signature ? (
                                                        <Image
                                                            loader={myLoader}
                                                            src={userData.signature}
                                                            alt="تصویر امضا"
                                                            width={200}
                                                            height={200}
                                                        />
                                                    ) : (
                                                        <Image
                                                            loader={
                                                                myLocalLoader
                                                            }
                                                            src="noImage.png"
                                                            alt="تصویر امضا"
                                                            width={200}
                                                            height={200}
                                                        />)}
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="avater"
                                                        className={
                                                            "block text-sm font-medium  text-gray-700 mb-2"
                                                        }
                                                    >
                                                        رزومه
                                                    </label>
                                                    <div className="mb-2">
                                                        {userData.resume != "" ? (
                                                            <span className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2">
                                                                <button
                                                                    type="button"
                                                                    disabled
                                                                    className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                                >
                                                                    فایل رزومه
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        saveAs(
                                                                            loadImageFromServer(
                                                                                userData.resume
                                                                            ),
                                                                            userData.resume
                                                                        )
                                                                    }
                                                                    type="button"
                                                                    className="-mr-px relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-green-500 text-sm font-medium text-white hover:bg-gray-50 hover:text-green-500 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                                >
                                                                    دانلود
                                                                </button>
                                                            </span>
                                                        ) : (
                                                            <Image
                                                                loader={
                                                                    myLocalLoader
                                                                }
                                                                src="noFile.png"
                                                                alt="فایل رزومه"
                                                                width={200}
                                                                height={200}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
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

                                    <Link href="/users">
                                        <button
                                            type="button"
                                            className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                                        >
                                            انصراف
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main> : <Forbidden />}
            </div>
        </div>
    );
}
