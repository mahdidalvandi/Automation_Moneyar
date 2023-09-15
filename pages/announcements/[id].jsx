import SidebarDesktop from "../../components/layout/sidebarDesktop";
import SidebarMobile from "../../components/layout/sidebarMobile";
import StickyHeader from "../../components/layout/stickyHeader";
import navigationList from "../../components/layout/navigationList";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/auth";
import { useAnnouncements } from "../../hooks/announcements";
import Link from "next/link";
import { useRouter } from "next/router";
import Textarea from "../../components/forms/textarea";
import axios from "../../lib/axios";
import Forbidden from "../../components/forms/forbidden";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import moment from "jalali-moment";
moment.locale("fa");

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function EditPost() {
  const { asPath } = useRouter();

  const [data, setData] = useState();
  const [startTimestamp, setStartTimestamp] = useState();
  const [endTimestamp, setEndtimestamp] = useState();

  const [errors, setErrors] = useState([]);
  const [currentUserActions, setCurrentUserActions] = useState();
  const [currentUserRole, setCurrentUserRole] = useState();
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      getAnnouncements(router.query.id);
    }
  }, [router.isReady]);

  const { getAnnouncements, announcementsData, isPostLoading } =
    useAnnouncements();

  const onSubmit = async (event) => {
    event.preventDefault();
    const mailFormData = new FormData();
    var object = {};
    var hasError = false;
    if (data == "") {
      object["data"] = "متن اطلاعیه الزامی است";
      setErrors(object);
      hasError = true;
    }
    if (startTimestamp == "") {
      object["startDate"] = "زمان شروع معتبر نمیباشد";
      setErrors(object);
      hasError = true;
    }
    if (endTimestamp == "") {
      object["endDate"] = "زمان پایان معتبر نمیباشد";
      setErrors(object);
      hasError = true;
    }
    if (startTimestamp >= endTimestamp) {
      object["endDate"] = "زمان پایان معتبر نمی باشد";
      setErrors(object);
      hasError = true;
    }
    if (hasError) {
      setErrors(object);
      return;
    }
    mailFormData.append("data", data ? data : announcementsData.data);
    mailFormData.append(
      "start_timestamp",
      startTimestamp
        ? String(startTimestamp.unix)
        : announcementsData.start_timestamp
    );
    mailFormData.append(
      "end_timestamp",
      endTimestamp ? String(endTimestamp.unix) : announcementsData.end_timestamp
    );
    mailFormData.append("uuid", announcementsData.uuid);

    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/announcements/update",
        data: mailFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status == 200) {
        window.location.assign("/announcements");
      }
    } catch (error) {
      setErrors(error.response.data.message);
    }
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
            `/${window.location.pathname.split("/")[1]}`
          ) ? (
          <main>
            <div className="py-6">
              <div className="w-full px-4 sm:px-6 md:px-8">
                <form className="space-y-8 divide-y divide-gray-200">
                  <div className="space-y-8 divide-y divide-gray-200">
                    <div>
                      <div className="mt-2 mb-2 grid grid-cols-5 gap-y-5 gap-x-2 ">
                        <div className="sm:col-span-5">
                          <h2 className="text-xl">تغییر اطلاعات واحد</h2>
                        </div>

                        <div className="sm:col-span-3">
                          <Textarea
                            title="متن اطلاعیه *"
                            name={data}
                            rows="5"
                            defaultValue={announcementsData.data}
                            onChange={(event) => setData(event.target.value)}
                            error={errors["data"]}
                            type="text"
                            isrequired="true"
                          />
                        </div>
                        <div className="grid grid-cols-4 gap-2 col-span-3">
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="date"
                              className="block text-sm font-medium  text-gray-700 mb-1"
                            >
                              تاریخ شروع *
                            </label>
                            <DatePicker
                              id="321"
                              format="YYYY/MM/DD"
                              value={
                                announcementsData.start_timestamp
                                  ? moment
                                      .unix(announcementsData.start_timestamp)
                                      .format("YYYY/MM/DD")
                                  : null
                              }
                              onChange={(date) => {
                                setStartTimestamp(date);
                              }}
                              calendar={persian}
                              locale={persian_fa}
                              placeholder="انتخاب کنید.."
                              calendarPosition="bottom-right"
                              inputClass={`appearance-none block w-full px-3 py-2 border ${
                                errors["startDate"]
                                  ? "border-red-300"
                                  : "border-gray-300"
                              }  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                              containerStyle={{
                                width: "100%",
                              }}
                            />
                            <p className="text-red-500 text-sm ">
                              {errors["startDate"]}
                            </p>
                          </div>
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="date"
                              className="block text-sm font-medium  text-gray-700 mb-1"
                            >
                              تاریخ پایان *
                            </label>
                            <DatePicker
                              id="321"
                              format="YYYY/MM/DD"
                              value={
                                announcementsData.end_timestamp
                                  ? moment
                                      .unix(announcementsData.end_timestamp)
                                      .format("YYYY/MM/DD")
                                  : null
                              }
                              onChange={(date) => {
                                setEndtimestamp(date);
                              }}
                              calendar={persian}
                              locale={persian_fa}
                              placeholder="انتخاب کنید.."
                              calendarPosition="bottom-right"
                              inputClass={`appearance-none block w-full px-3 py-2 border ${
                                errors["startDate"]
                                  ? "border-red-300"
                                  : "border-gray-300"
                              }  rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm`}
                              containerStyle={{
                                width: "100%",
                              }}
                            />
                            <p className="text-red-500 text-sm ">
                              {errors["endDate"]}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="pt-3 pb-2 px-10 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={onSubmit}
                    type="button"
                    className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                  >
                    <span>ثبت</span>
                  </button>

                  <Link href="/announcements">
                    <button
                      type="button"
                      className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                    >
                      <span>انصراف</span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </main>
        ) : (
          <Forbidden />
        )}
      </div>
    </div>
  );
}
