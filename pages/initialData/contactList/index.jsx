import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import ContactListTable from "../../../components/table/contactListTable";
import navigationList from "../../../components/layout/navigationList";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/auth";
import { PlusIcon } from "@heroicons/react/outline";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Textarea from "../../../components/forms/textarea";
import { useState, useEffect } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "../../../lib/axios";
import Forbidden from "../../../components/forms/forbidden";
import TextField from "@mui/material/TextField";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
function strimer(data) {

    let tdata = String(data.map(dd => dd.uuid));
    tdata = tdata.replace('[', '');
    return tdata.replace(']', '');
}



function InitialData() {
    const [Access, setAccess] = useState("");
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState("");
    const [people, setPeople] = useState([]);
    const [company, setCompany] = useState([]);
    const [query, setQuery] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [head, setHead] = useState([]);
    const [manager, setManager] = useState([]);
    const [selectedManager, setSelectedManager] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState();
    const [AccessData, setAccessData] = useState();
    const [loadingAccessData, setLoadingAccessData] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [isSuperUser, setIsSuperUser] = useState();
    const { asPath } = useRouter();
    const [companyEmployeeIsLoading, setCompanyEmployeeIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [noAccess, setNoAccess] = useState(false);

    function setSelectedCompanys(newValue) {
        if (newValue != null) {
            setCompanyEmployeeIsLoading(true);
            setSelectedCompany(newValue);
            axios
                .get(`/api/v1/company/list/uuid`, {
                    params: {
                        uuid: newValue.uuid
                    }
                })
                .then((res) => {
                    setCompanyEmployeeIsLoading(false);
                    setManager(res.data.data.users)
                })
                .catch((error) => {
                    if (error.response.status != 409) throw error;
                });
        }
        else{
            setManager([]);
        }
    }


    useEffect(() => {
        async function getData() {
            await axios.get("api/v1/company/contactlist/list").then((response) => {
                setData(response.data.data);
                setIsDataLoading(false);
            }).catch((error) => {
                if (error.response.status != 403) setNoAccess(true);
            });
        }
        if (loadingData) {
            getData();
        }
    }, []);
    useEffect(() => {
        axios
            .get("/api/v1/cartable/employeelist")
            .then((res) => setPeople(res.data.data.users))
            .catch((error) => {
                if (error.response.status != 409) throw error;
            });
    }, []);
    const filteredPeople =
        query === ""
            ? people
            : people.filter((person) => {
                return person.full.includes(query.toLowerCase());
            });

    useEffect(() => {
        axios
            .get("/api/v1/company/list")
            .then((res) => setCompany(res.data.data))
            .catch((error) => {
                if (error.response.status != 409) throw error;
            });
    }, []);
    const filteredCompany =
        query === ""
            ? company
            : company.filter((company) => {
                return company.title.includes(query.toLowerCase());
            });

    const filteredManager =
        query === ""
            ? manager
            : manager.filter((person) => {
                return person.full.includes(query.toLowerCase());
            });

    const onSubmit = async (event) => {
        event.preventDefault();
        const postFormData = new FormData();
        postFormData.append("company_uuid", selectedCompany.uuid);
        postFormData.append("holding_employee_uuid", head.map(({ uuid }) => uuid));
        postFormData.append("company_employee_uuid", selectedManager.map(({ uuid }) => uuid));

        try {
            setLoadingData(true);
            const response = await axios({
                method: "post",
                url: "/api/v1/company/contactlist/add",
                data: postFormData,
            });

            if (response.data.status == 200) {
                window.location.reload();
                setOpen(false);
                // setErrors("");
            } else {
                var object = {};
                object['master'] = response.data.message;
                setErrors(object);
            }
        } catch (error) {
            var object = {};
            object['master'] = error.response.data.message;
            setErrors(object);
            //  setErrors(response.data.message);
        }
    };

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
                {noAccess ?
                    <Forbidden />
                    : !currentUserActions ? null : CheckIfAccessToPage(window.location.pathname) ?
                        <main>
                            <div className="py-6">
                                <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                                    <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                            <div className="ml-4 mt-2">
                                                <h2 className="text-lg leading-6 font-large text-gray-900">
                                                    نمایندگان
                                                </h2>
                                            </div>

                                            <div className="ml-4 mt-2 flex-shrink-0">
                                                {CheckIfAccess("add_contact_list") ?
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpen(true)}
                                                        className="relative inline-flex items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#1f2937] hover:bg-[#11151b] "
                                                    >
                                                        <PlusIcon
                                                            className="ml-2 h-5 w-5 text-white"
                                                            aria-hidden="true"
                                                        />
                                                        <span>ثبت نماینده جدید</span>
                                                    </button> : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full px-4 sm:px-6 md:px-8">
                                    {currentUserRole ?
                                        <ContactListTable loadingData={isDataLoading} roleData={currentUserRole} data={data} /> : null}
                                </div>
                            </div>
                            <Transition.Root show={open} as={Fragment}>
                                <Dialog
                                    as="div"
                                    className="fixed inset-0 overflow-hidden z-50"
                                    onClose={setOpen}
                                >
                                    <div className="absolute inset-0 overflow-hidden ">
                                        <Dialog.Overlay className="absolute inset-0" />

                                        <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10 sm:pr-16">
                                            {/* <Transition.Child
                                        as={Fragment}
                                        enter="transform transition ease-in-out duration-10 sm:duration-10"
                                        enterFrom="translate-x-full"
                                        enterTo="translate-x-0"
                                        leave="transform transition ease-in-out duration-10 sm:duration-10"
                                        leaveFrom="translate-x-0"
                                        leaveTo="translate-x-full"
                                    > */}
                                            <div className="pointer-events-auto w-screen max-w-md">
                                                <form
                                                    onSubmit={onSubmit}
                                                    className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                                                >
                                                    <div className="h-0 flex-1 overflow-y-auto">
                                                        <div className="bg-[#1f2937] py-6 px-4 sm:px-6">

                                                            <div className="mt-1">
                                                                <p className="text-lg text-white">
                                                                    ثبت نماینده جدید
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-1 flex-col justify-between">
                                                            <div className="divide-y divide-gray-200 px-4 sm:px-6">
                                                                <div className="space-y-6 pt-6 pb-5">
                                                                    <div>
                                                                        <div>
                                                                            <label
                                                                                htmlFor="email"
                                                                                className="block text-sm font-medium  text-gray-700"
                                                                            >
                                                                                سر گروه
                                                                            </label>
                                                                            <Autocomplete
                                                                                multiple
                                                                                id="tags-standard"
                                                                                className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                                                options={filteredPeople}
                                                                                noOptionsText="یافت نشد!"
                                                                                value={head}
                                                                                onChange={(
                                                                                    event,
                                                                                    newValue
                                                                                ) => {
                                                                                    setHead(
                                                                                        newValue
                                                                                    );
                                                                                }}
                                                                                getOptionLabel={(
                                                                                    person
                                                                                ) => person.full}
                                                                                renderInput={(
                                                                                    params
                                                                                ) => (
                                                                                    <TextField
                                                                                        className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                                        {...params}
                                                                                        variant="standard"
                                                                                        placeholder="افزودن .."
                                                                                        onChange={(
                                                                                            event
                                                                                        ) =>
                                                                                            setQuery(
                                                                                                event
                                                                                                    .target
                                                                                                    .value
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </div>

                                                                        <div className="pt-10">
                                                                            <label
                                                                                htmlFor="email"
                                                                                className="block text-sm font-medium  text-gray-700"
                                                                            >
                                                                                سازمان
                                                                            </label>
                                                                            <Autocomplete
                                                                                id="tags-standard"
                                                                                className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                                                options={filteredCompany}
                                                                                noOptionsText="یافت نشد!"
                                                                                value={selectedCompany}
                                                                                onChange={(
                                                                                    event,
                                                                                    newValue
                                                                                ) => {
                                                                                    setSelectedCompanys(
                                                                                        newValue
                                                                                    );
                                                                                }}
                                                                                getOptionLabel={(
                                                                                    company
                                                                                ) => company.title}
                                                                                renderInput={(
                                                                                    params
                                                                                ) => (
                                                                                    <TextField
                                                                                        className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                                        {...params}
                                                                                        variant="standard"
                                                                                        placeholder="افزودن .."
                                                                                        onChange={(
                                                                                            event
                                                                                        ) =>
                                                                                            setQuery(
                                                                                                event
                                                                                                    .target
                                                                                                    .value
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </div>

                                                                        <div>
                                                                            <label
                                                                                htmlFor="email"
                                                                                className="block text-sm font-medium  text-gray-700"
                                                                            >
                                                                                انتخاب مدیران شرکت
                                                                            </label>
                                                                            {manager && companyEmployeeIsLoading ?
                                                                                (
                                                                                    <SkeletonTheme
                                                                                        highlightColor="#fb923c"
                                                                                        height={20}
                                                                                    >
                                                                                        <p>
                                                                                            <Skeleton
                                                                                                count={1}
                                                                                            />
                                                                                        </p>
                                                                                    </SkeletonTheme>
                                                                                ) : (
                                                                                    <Autocomplete
                                                                                        multiple
                                                                                        id="tags-standard"
                                                                                        className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                                                        options={filteredManager}
                                                                                        noOptionsText="یافت نشد!"
                                                                                        value={selectedManager}
                                                                                        onChange={(
                                                                                            event,
                                                                                            newValue
                                                                                        ) => {
                                                                                            setSelectedManager(
                                                                                                newValue
                                                                                            );
                                                                                        }}
                                                                                        getOptionLabel={(
                                                                                            manager
                                                                                        ) => manager.full}
                                                                                        renderInput={(
                                                                                            params
                                                                                        ) => (
                                                                                            <TextField
                                                                                                className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                                                {...params}
                                                                                                variant="standard"
                                                                                                placeholder="افزودن .."
                                                                                                onChange={(
                                                                                                    event
                                                                                                ) =>
                                                                                                    setQuery(
                                                                                                        event
                                                                                                            .target
                                                                                                            .value
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                        )}
                                                                                    />)}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <>
                                                                    {errors ? (
                                                                        <p className="text-sm text-red-500 pt-1">
                                                                            {errors["master"]}
                                                                        </p>
                                                                    ) : null}
                                                                </>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                                                        <button
                                                            type="submit"
                                                            className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                                                        >
                                                            ثبت
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                                                            onClick={() =>
                                                                setOpen(false)
                                                            }
                                                        >
                                                            انصراف
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                            {/* </Transition.Child> */}
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition.Root>
                        </main> : <Forbidden />}
            </div>
        </div>
    );
}

export default InitialData;
