import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import TicketTable from "../../../components/table/ticketTable";
import TicketSupportTable from "../../../components/table/supportTicketTable";
import navigationList from "../../../components/layout/navigationList";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/auth";
import { PlusIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useState, useEffect } from "react";
import Forbidden from "../../../components/forms/forbidden";
import axios from "../../../lib/axios";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function InitialData() {
    const [data, setData] = useState();
    const [ticketData, setTicketData] = useState();
    const [ticketSupportData, setTicketSupportData] = useState();
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const { asPath } = useRouter();


    useEffect(() => {
        GetData();
    }, []);

    const GetData = () => {
        axios
            .get("api/v1/ticket/list")
            .then((res) => {
                setLoadingData(false);
                res.data.data.support_user ?
                    setTicketSupportData(res.data.data.data)
                    :
                    setTicketData(res.data.data)
            })
    }

    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });

    if (isLoading || !user) {
        return null;
    }
    function CheckIfAccess(val) {
        if (currentUserRole && currentUserRole.indexOf(val) > -1) return true;
        return false;
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
                {!currentUserActions ? null : CheckIfAccessToPage(window.location.pathname) ?
                    <main>
                        <div className="py-6">
                            <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                    <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                        <div className="ml-4 mt-2">
                                            <h2 className="text-lg leading-6 font-large text-gray-900">
                                                پیام ها
                                            </h2>
                                        </div>
                                        <div className="ml-4 mt-2 flex-shrink-0">
                                            {ticketData ?
                                                <Link href="/support/ticket/store">
                                                    <button
                                                        type="button"
                                                        className="relative inline-flex items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#1f2937] hover:bg-[#11151b] "
                                                    >
                                                        <PlusIcon
                                                            className="ml-2 h-5 w-5 text-white"
                                                            aria-hidden="true"
                                                        />
                                                        <span>ثبت تیکت جدید</span>
                                                    </button>
                                                </Link> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-4 sm:px-6 md:px-8">
                                {currentUserRole ?
                                    ticketData ?
                                        <TicketTable
                                            roleData={currentUserRole}
                                            data={ticketData}
                                            loadingData={loadingData}
                                        /> :
                                        <TicketSupportTable
                                            roleData={currentUserRole}
                                            data={ticketSupportData}
                                            loadingData={loadingData}
                                        />
                                    : null}
                            </div>
                        </div>
                    </main> : <Forbidden />}
            </div>
        </div>
    );
}

export default InitialData;
