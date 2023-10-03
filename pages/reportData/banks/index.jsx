import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/auth";
import { useState, useEffect } from "react";
import Forbidden from "../../../components/forms/forbidden";
import BanksTable from "../../../components/table/banksTable";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function InitialData() {
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const { asPath } = useRouter();

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
            <div className="py-6">
              <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                  <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <div className="ml-4 mt-2">
                      <h2 className="text-lg leading-6 font-large text-gray-900">
                        موجودی بانک ها
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full px-4 sm:px-6 md:px-8">
                {currentUserRole ? (
                  <BanksTable roleData={currentUserRole} />
                ) : null}
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

export default InitialData;
