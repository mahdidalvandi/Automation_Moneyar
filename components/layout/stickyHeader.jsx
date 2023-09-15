import {
  BellIcon,
  MenuAlt2Icon,
  LogoutIcon,
  UserCircleIcon,
  KeyIcon,
} from "@heroicons/react/outline";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../hooks/auth";
import { useState } from "react";
import { loadImageFromServer } from "../../lib/helper";
import { useRouter } from "next/router";
import axios from "../../lib/axios";
import WeatherWidget_Ip from "../../components/forms/weather";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import avatar from "../../public/images/avatar.png";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
function StickyHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { asPath } = useRouter();
  const [selectedCompany, setCompany] = useState(null);
  const [companyArray, setCompantArray] = useState(null);
  const [opened, setOpened] = useState(false);
  const openDrop = () => {
    setOpened(!opened);
  };

  const myLoader = ({ src, width, quality }) => {
    return loadImageFromServer(`${src}?w=${width}&q=${quality || 75}`);
  };

  const { user, logout } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/dashboard",
  });

  function logoutHandler() {
    logout();
  }
  function setCurrentCompany(e) {
    const response = axios({
      method: "post",
      url: "api/v1/user/company/current",
      data: { company_uuid: e },
    }).then((response) => {
      window.location.assign("/dashboard/");
    });
  }

  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-12 bg-white shadow">
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only"></span>
        <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">{/* <WeatherWidget_Ip /> */}</div>
        <div className="ml-1 flex items-center md:ml-3 ">
          {user ? (
            <select
              value={user.company_uuid}
              onChange={(company) => {
                setCurrentCompany(company.currentTarget.value);
              }}
              className="bg-left pr-3 left-4 bg-[#F0F0F0] relative items-center px-4 py-2 border
             border-[#F0F0F0] shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50"
            >
              {user.employees_items?.map((item, i) => {
                return (
                  <option key={i} value={item.company_uuid}>
                    {item.company_title}
                  </option>
                );
              })}
            </select>
          ) : null}
          {user ? (
            asPath == "/dashboard" ? (
              <div
                className="bg-[#F0F0F0] ml-4 rounded-md
                cursor-pointer flex justify-center 
                items-center"
              >
                <div
                  onClick={openDrop}
                  className="w-42 h-9 rounded-md bg-[#F0F0F0] relative shadow flex justify-center items-center"
                >
                  <div className="relative w-full py-3 transform transition">
                    <div className="flex w-full justify-center items-center space-x-3 cursor-pointer">
                      <div className="dark:text-white w-full text-gray-900 ">
                        <div className="flex w-full items-center">
                          <div className="cursor-pointer flex w-full">
                            <div className="w-full px-3 flex items-center">
                              {user.first_name} {user.last_name}
                              <AccountCircleIcon className="text-[#666666] mr-1" />
                            </div>
                          </div>
                          <div className="flex px-1 text-[#666666]">
                            <KeyboardArrowDownIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                    {opened && (
                      <div className="absolute w-full rounded-md border-t-2 border-gray-200 px-2 py-3 bg-[#F0F0F0] shadow mt-">
                        <ul className="space-y-2">
                          <li className="font-medium">
                            <a
                              href={`/users/profile`}
                              className="flex items-center transform hover:border-[#22aa5b] transition-colors duration-200 border-r-4 border-transparent"
                            >
                              <div className="mr-3 p-1">
                                <AccountCircleIcon className="text-[#666666]" />
                              </div>
                              پروفایل
                            </a>
                          </li>
                          <li className="font-medium">
                            <a
                              onClick={logoutHandler}
                              className="flex items-center transform transition-colors duration-200
                              border-r-4 border-transparent 
                            hover:border-[#22aa5b]"
                            >
                              <div className="mr-3 p-1">
                                <ExitToAppIcon className="text-[#666666]" />
                              </div>
                              خروج
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm ml-3 text-gray-500">
                {`${user.first_name} ${user.last_name} `}
              </p>
            )
          ) : null}

          {/* {user ? (
            <>
              <Link href={`/users/changePassword`}>
                <button
                  type="button"
                  className="bg-white p-1 ml-1 rounded-full text-gray-400
                hover:text-gray-500 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-amber-600"
                >
                  <KeyIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </Link>
            </>
          ) : (
            ""
          )} */}

          {/* <button
            onClick={logoutHandler}
            type="button"
            className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600"
          >
            <LogoutIcon className="h-6 w-6" aria-hidden="true" />
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default StickyHeader;
