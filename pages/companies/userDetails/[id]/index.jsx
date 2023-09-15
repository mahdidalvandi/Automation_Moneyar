import SidebarDesktop from "../../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../../components/layout/sidebarMobile";
import StickyHeader from "../../../../components/layout/stickyHeader";
import UserDetailsTable from "../../../../components/table/usersDetailsTable";
import navigationList from "../../../../components/layout/navigationList";
import axios from "../../../../lib/axios";
import Forbidden from "../../../../components/forms/forbidden";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { SearchIcon } from "@heroicons/react/outline";
import { useUserDetails } from "../../../../hooks/userDetails";

export default function UserDetails() {
  const { asPath } = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchHasValue, setSearchHasValue] = useState(false);
  const [searchValue, setSearchValue] = useState(false);
  const [searchData, setSearchData] = useState([]);

  function getPrintLink() {
    axios
      .post("/api/v1/exports/usr", {
        uuid: router.query.id,
      })
      .then((res) => {
        window.open(res.data.data.url, "_blank", "noopener,noreferrer");
      });
  }
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      getUserDetails(router.query.id);
    }
  }, [router.isReady]);

  const { getUserDetails, userDetailsData, isUserDetailsLoading } =
    useUserDetails();

  function search(val) {
    if (userDetailsData && userDetailsData.users) {
      var metingBuf = [];
      if (val.length > 2) {
        setSearchHasValue(true);
        for (let i = 0; i < userDetailsData.users.length; i++) {
          if (
            userDetailsData.users[i].first_name.includes(val) ||
            userDetailsData.users[i].last_name.includes(val)
          ) {
            metingBuf = [...metingBuf, userDetailsData.users[i]];
          }
        }
      } else setSearchHasValue(false);
      setSearchData(metingBuf);
    }
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
            `/${window.location.pathname.split("/")[1]}/${
              window.location.pathname.split("/")[2]
            }`
          ) ? (
          <main>
            <div className="py-6">
              <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                  <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <div className="ml-4 mt-2">
                      <h2 className="text-lg leading-6 font-large text-gray-900">
                        لیست کاربران شرکت{" "}
                        {isUserDetailsLoading
                          ? ""
                          : userDetailsData.company_name}
                      </h2>
                    </div>

                    <div className="ml-4 mt-2 flex-shrink-0">
                      {CheckIfAccess("see_company_user_details") ? (
                        <button
                          onClick={() => getPrintLink()}
                          type="button"
                          className=" inline-flex mb-4 justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#1f2937] hover:bg-[#1f2937] focus:outline-none "
                        >
                          <span>چاپ اطلاعات</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-y-2 gap-x-4 mb-2 ">
                  <form
                    className="w-full flex md:ml-0 mb-2 mt-4 col-span-4"
                    action="#"
                    method="GET"
                  >
                    <label htmlFor="search-field" className="sr-only">
                      جستجو
                    </label>
                    <div className="relative w-1/4 text-gray-400  focus-within:text-gray-600">
                      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                        <SearchIcon
                          className="h-5 w-5 ml-2"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        onChange={(e) => {
                          setSearchValue(e.target.value);
                          search(e.target.value);
                        }}
                        id="search-field"
                        className="block w-full h-full pl-8 pr-3 py-2border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-gray-300 sm:text-sm"
                        placeholder="جستجوی نام کاربر"
                        type="text"
                        name="search"
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div className="w-full px-4 sm:px-6 md:px-8">
                {currentUserRole && !isUserDetailsLoading ? (
                  <UserDetailsTable
                    loadingData={false}
                    data={searchHasValue ? searchData : userDetailsData.users}
                    roleData={currentUserRole}
                  />
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
