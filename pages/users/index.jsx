import SidebarDesktop from "../../components/layout/sidebarDesktop";
import SidebarMobile from "../../components/layout/sidebarMobile";
import StickyHeader from "../../components/layout/stickyHeader";
import UsersTable from "../../components/table/usersTable";
import Link from "next/link";
import axios from "../../lib/axios";
import navigationList from "../../components/layout/navigationList";
import Forbidden from "../../components/forms/forbidden";
import { useRouter } from "next/router";
import { useState, useRef, useEffect, SetStateAction } from "react";

import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import Image from "next/image";

export default function Dashboard() {
  const { asPath } = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchHasValue, setSearchHasValue] = useState(false);
  const [searchValue, setSearchValue] = useState(false);
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    async function getData() {
      await axios.get("api/v1/user/list").then((response) => {
        setData(response.data.data);
        setLoadingData(false);
      });
    }
    if (loadingData) {
      getData();
    }
  }, []);
  function search(val) {
    if (data) {
      var metingBuf = [];
      if (val.length > 2) {
        setSearchHasValue(true);
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].first_name.includes(val) ||
            data[i].last_name.includes(val)
          ) {
            metingBuf = [...metingBuf, data[i]];
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
            window.location.pathname
          ) ? (
          <main>
            <div className="py-6">
              <div className="max-w-8xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                  <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <div className="ml-4 mt-2">
                      <h2 className="text-lg leading-6 font-large text-gray-900">
                        کاربران
                      </h2>
                    </div>

                    <div className="ml-4 mt-2 flex-shrink-0">
                      {/* <Button text="افزودن کاربر جدید" color="emerald" /> */}
                      {CheckIfAccess("add_user") ? (
                        <Link href="/users/addInformation">
                          <button
                            type="button"
                            className="relative mr-2 inline-flex items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md border  text-[#22AA5B] border-[#22AA5B] hover:bg-[#dcffea] "
                          >
                            <span className="px-2 font-semibold">
                              ثبت کاربر جدید
                            </span>
                            <Image
                              src="/images/useradd.png"
                              height={17}
                              width={17}
                            />
                          </button>
                        </Link>
                      ) : null}
                      {CheckIfAccess("add_user") ? (
                        <Link href="/users/addBatchInformation">
                          <button
                            type="button"
                            className="relative mr-2 inline-flex items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md border  text-[#22AA5B] border-[#22AA5B] hover:bg-[#dcffea] "
                          >
                            <span className="px-2 font-semibold">
                              ثبت کاربر گروهی
                            </span>
                            <Image
                              src="/images/userg.png"
                              height={15}
                              width={18}
                            />
                          </button>
                        </Link>
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
                {currentUserRole ? (
                  <UsersTable
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
