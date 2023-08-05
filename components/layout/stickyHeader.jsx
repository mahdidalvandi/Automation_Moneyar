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
import WeatherWidget_Ip from "../../components/forms/weather"


function StickyHeader() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { asPath } = useRouter();
    const [selectedCompany, setCompany] = useState(null);
    const [companyArray, setCompantArray] = useState(null);

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
            data: { "company_uuid": e },
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
                <div className="flex-1 flex">
                    <WeatherWidget_Ip />
                    {/* <form
                        className="w-full flex md:ml-0"
                        action="#"
                        method="GET"
                    >
                        <label htmlFor="search-field" className="sr-only">
                            جستجو
                        </label>
                        <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                <SearchIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </div>
                            <input
                                id="search-field"
                                className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                                placeholder="جستجو"
                                type="search"
                                name="search"
                            />
                        </div>
                    </form> */}
                </div>
                <div className="ml-1 flex items-center md:ml-3 ">
                    {user ?
                        asPath == "/dashboard" ? (
                            <p className="text-sm ml-3 text-gray-500">
                                {`${user.first_name}  ${user.last_name}`} عزیز
                                خوش آمدی!
                            </p>
                        ) :
                            <p className="text-sm ml-3 text-gray-500">
                                {`${user.first_name} ${user.last_name} `}
                            </p>
                        : null}
                    {user ?
                        <select
                            value={user.company_uuid}
                            onChange={(company) => {
                                setCurrentCompany(
                                    company.currentTarget.value
                                );
                            }}
                            className="pr-10 relative items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                        >
                            {user.employees_items.map(
                                (item, i) => {
                                    return (

                                        <option
                                            key={i}
                                            value={item.company_uuid}
                                        >
                                            {item.company_title}
                                        </option>
                                    );
                                }
                            )}
                        </select>
                        : null}
                    {user ? (
                        <>
                            <Link href={`/users/profile`}>
                                <button
                                    type="button"
                                    className="bg-white p-1 ml-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600"
                                >
                                    {user.avatar && user.avatar != "null" ?
                                    <div className="h-6 w-6">
                                        <Image
                                            
                                            
                                            loader={
                                                myLoader
                                            }
                                            src={user.avatar}
                                            alt="عکس پرسنلی"
                                            width={25}
                                            height={25}
                                            style={{
                                                borderRadius: "50%",
                                                background: "gray",
                                                display: "block"
                                            }}
                                        /></div>
                                        :
                                        <UserCircleIcon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />}
                                </button>
                            </Link>
                        </>
                    ) : (
                        ""
                    )}

                    {user ? (
                        <>
                            <Link href={`/users/changePassword`}>
                                <button
                                    type="button"
                                    className="bg-white p-1 ml-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600"
                                >
                                    <KeyIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </button>
                            </Link>
                        </>
                    ) : (
                        ""
                    )}

                    <button
                        onClick={logoutHandler}
                        type="button"
                        className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600"
                    >
                        <LogoutIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* 
          <Menu as="div" className="ml-3 relative">
            <div>
              <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <a
                        href={item.href}
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        {item.name}
                      </a>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu> */}
                </div>
            </div>
        </div>
    );
}

export default StickyHeader;
