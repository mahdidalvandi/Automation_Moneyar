import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import GroupsTable from "../../../components/table/groupTable";
import navigationList from "../../../components/layout/navigationList";
import { useRouter } from "next/router";
import { useAuth } from "../../../hooks/auth";
import { PlusIcon } from "@heroicons/react/outline";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Textarea from "../../../components/forms/textarea";
import { useState, useEffect } from "react";
import Forbidden from "../../../components/forms/forbidden";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "../../../lib/axios";
import TextField from "@mui/material/TextField";
import { title } from "process";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
function strimer(data) {

    let tdata = String(data.map(dd => dd.uuid));
    tdata = tdata.replace('[', '');
    return tdata.replace(']', '');
}

function InitialData() {
    const [group, setGroup] = useState("");
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState([]);
    const [people, setPeople] = useState([]);
    const [query, setQuery] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [recipient, setRecipient] = useState([]);
    const [groupData, setGroupData] = useState();
    const [loadingGroupData, setLoadingGroupData] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const { asPath } = useRouter();

    const onSubmit = async (event) => {
        event.preventDefault();
        const postFormData = new FormData();
        var object = {};
        if (!group) {
            object['title'] = 'نام گروه الزامی است';
            setErrors(object);
            return;
        }
        postFormData.append("title", group);
        postFormData.append("members", strimer(recipient));
        try {
            setLoadingData(true);
            const response = await axios({
                method: "post",
                url: "/api/v1/group/add",
                data: postFormData,
            });
            if (response.data.status == 200) {
                window.location.reload();
                setOpen(false);
                // setErrors("");
            } else {
                setErrors("یک مشکل پیش آمده است");
            }
        } catch (error) {
            var object = {};
            object['master'] = error.response.data.message;
            setErrors(object);
        }
    };

    useEffect(() => {
        axios
            .get("/api/v1/cartable/init")
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
                                                گروه‌ها
                                            </h2>
                                        </div>

                                        <div className="ml-4 mt-2 flex-shrink-0">
                                            {CheckIfAccess("add_group") ?
                                                <button
                                                    type="button"
                                                    onClick={() => setOpen(true)}
                                                    className="relative inline-flex items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#1f2937] hover:bg-[#11151b] "
                                                >
                                                    <PlusIcon
                                                        className="ml-2 h-5 w-5 text-white"
                                                        aria-hidden="true"
                                                    />
                                                    <span>ثبت گروه جدید</span>
                                                </button> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-4 sm:px-6 md:px-8">
                                {currentUserRole ?
                                    <GroupsTable roleData={currentUserRole} /> : null}
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
                                                        <div className="flex items-center justify-between">
                                                            <div className="ml-3 flex h-1 items-center">
                                                                {/* <button
                                                                type="button"
                                                                className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                                onClick={() =>
                                                                    setOpen(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                <span className="sr-only">
                                                                    Close panel
                                                                </span>
                                                                <XIcon
                                                                    className="h-6 w-6"
                                                                    aria-hidden="true"
                                                                />
                                                            </button> */}
                                                            </div>
                                                        </div>
                                                        <div className="mt-1">
                                                            <p className="text-lg text-white">
                                                                ثبت گروه جدید
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-1 flex-col justify-between">
                                                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                                                            <div className="space-y-6 pt-6 pb-5">
                                                                <div>
                                                                    <Textarea
                                                                        title="نام گروه"
                                                                        name={group}
                                                                        rows="1"
                                                                        onChange={(
                                                                            event
                                                                        ) =>
                                                                            setGroup(
                                                                                event
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        error={errors["title"]}
                                                                        type="text"
                                                                        isrequired="true"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label
                                                                        htmlFor="email"
                                                                        className="block text-sm font-medium  text-gray-700"
                                                                    >
                                                                        اعضای گروه
                                                                    </label>
                                                                    <Autocomplete
                                                                        multiple
                                                                        id="tags-standard"
                                                                        className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                                        options={filteredPeople}
                                                                        noOptionsText="یافت نشد!"
                                                                        value={recipient}
                                                                        onChange={(
                                                                            event,
                                                                            newValue
                                                                        ) => {
                                                                            setRecipient(
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
