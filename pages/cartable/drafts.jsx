import SidebarDesktop from "../../components/layout/sidebarDesktop";
import SidebarMobile from "../../components/layout/sidebarMobile";
import StickyHeader from "../../components/layout/stickyHeader";
import TablePage from "../../components/table/cartableDraft";
import navigationList from "../../components/layout/navigationList";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/auth";
import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/outline";
import React from "react";
import Forbidden from "../../components/forms/forbidden";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const { asPath } = useRouter();
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [sender, setSender] = useState("");
  const [primarySender, setPrimarySender] = useState("");
  const [primaryRecipient, setPrimaryRecipient] = useState("");
  const [errors, setErrors] = useState("");
  const [defaultData, setDefaultData] = useState({});
  const [searchDate, setSearchDate] = useState();
  const [startDate, setStartDate] = useState({});
  const [endDate, setEndDate] = useState({});
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();

  const { user, isLoading } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/",
  });

  const handleDate = (date) => {
    setStartDate(date[0]);
    setEndDate(date[1]);
  };

  useEffect(() => {
    if (loadingData) {
      getData();
    }
  }, [loadingData]);

  async function getData() {
    await axios.get(`/api/v1/letter/draft/list`).then((response) => {
      setData(response.data.data);
      setDefaultData(response.data.data);
      setLoadingData(false);
    });
  }
  const GetData = () => {
    axios.get(`/api/v1/letter/draft/list`).then((response) => {
      setData(response.data.data);
      setDefaultData(response.data.data);
      setLoadingData(false);
    });
  };
  function CheckIfAccessToPage(val) {
    if (currentUserActions && currentUserActions.indexOf(val) > -1) return true;
    return false;
  }

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
        {!currentUserActions ? null : CheckIfAccessToPage(
            window.location.pathname
          ) ? (
          <main>
            <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
              <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                  <div className="ml-4 mt-2">
                    <h2 className="text-lg leading-6 font-large text-gray-900">
                      نامه‌های پیش نویس
                    </h2>
                  </div>

                  <div className="ml-4 mt-2 flex-shrink-0">
                    {/* <Link href="/cartable/newMail?send=1">
                                            <button
                                                type="button"
                                                className="relative inline-flex items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#1f2937] hover:bg-[#11151b] "
                                            >
                                                <PlusIcon
                                                    className="ml-2 h-5 w-5 text-white"
                                                    aria-hidden="true"
                                                />
                                                <span>ثبت نامه جدید</span>
                                            </button>
                                        </Link> */}
                  </div>
                </div>
              </div>
            </div>
            <TablePage
              data={data}
              loadingData={loadingData}
              setClicked={(per) => {
                getData(per);
              }}
              source="sendList"
            />
          </main>
        ) : (
          <Forbidden />
        )}
      </div>
    </div>
  );
}
