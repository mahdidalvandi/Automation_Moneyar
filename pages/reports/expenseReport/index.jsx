import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import CompanyReportTable from "../../../components/table/companyReportTable";
import axios from "../../../lib/axios";
import Forbidden from "../../../components/forms/forbidden";
import navigationList from "../../../components/layout/navigationList";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/auth";
import { useState, useRef, useEffect, SetStateAction } from "react";

import { PlusIcon, SearchIcon } from "@heroicons/react/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Login() {
  const { asPath } = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const [isHolding, setIsHolding] = useState(false);
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchHasValue, setSearchHasValue] = useState(false);
  const [searchValue, setSearchValue] = useState(false);
  const [searchData, setSearchData] = useState([]);

  const { user, isLoading } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/",
  });
  function CheckIfAccess(val) {
    if (currentUserRole && currentUserRole.indexOf(val) > -1) return true;
    return false;
  }
  function CheckIfAccessToPage(val) {
    if (currentUserActions && currentUserActions.indexOf(val) > -1) return true;
    return false;
  }
  function search(val) {
    if (data) {
      var metingBuf = [];
      if (val.length > 2) {
        setSearchHasValue(true);
        for (let i = 0; i < data.length; i++) {
          if (data[i].title.includes(val)) {
            metingBuf = [...metingBuf, data[i]];
          }
        }
      } else setSearchHasValue(false);
      setSearchData(metingBuf);
    }
  }

  useEffect(() => {
    async function getData() {
      await axios.get("api/v1/company/list").then((response) => {
        // check if the data is populated
        setData(response.data.data);
        setLoadingData(false);
        // you tell it that you had the result
      });
    }
    if (loadingData) {
      // if the result is not ready so you make the axios call
      getData();
    }
  }, []);

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
        setIsHolding={(props) => setIsHolding(props.isHolding)}
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
                        شرکت‌ها
                      </h2>
                    </div>
                  </div>
                </div>
                {isHolding ? (
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
                          placeholder="جستجو نام شرکت"
                          type="text"
                          name="search"
                        />
                      </div>
                    </form>
                  </div>
                ) : null}
              </div>
              <div className="w-full px-4 sm:px-6 md:px-8">
                {currentUserRole ? (
                  <CompanyReportTable
                    loadingData={false}
                    data={searchHasValue ? searchData : data}
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
