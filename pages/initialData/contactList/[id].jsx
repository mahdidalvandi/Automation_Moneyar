import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import { useState, useRef, useEffect, forwardRef } from "react";
import { useAuth } from "../../../hooks/auth";
import { useContactList } from "../../../hooks/contactList";
import Link from "next/link";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Textarea from "../../../components/forms/textarea";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "../../../lib/axios";
import Forbidden from "../../../components/forms/forbidden";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
var isCompanyLoading = false;
export default function EditContactList() {
    const { asPath } = useRouter();

    const [title, setTitle] = useState("");

    const [errors, setErrors] = useState([]);
    const [people, setPeople] = useState([]);
    const [headPeople, setHeadPeople] = useState([]);
    const [managerPeople, setManagerPeople] = useState([]);
    const [headQuery, setHeadQuery] = useState("");
    const [managerQuery, setManagerQuery] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [head, setHead] = useState([]);
    const [selectedHead, setSelectedHead] = useState([]);
    const [manager, setManager] = useState([]);
    const [selectedManager, setSelectedManager] = useState([]);
    const [open, setOpen] = useState(false);

    const handleToClose = (event, reason) => {
        window.location.assign("/initialData/contactList");
    };

    function getCompanyEmpList(val) {
        if (!isCompanyLoading) {
            isCompanyLoading = true;
            axios
                .get(`/api/v1/company/list/uuid`, {
                    params: {
                        uuid: val
                    }
                })
                .then((res) => {
                    setManagerPeople(res.data.data.users)
                })
                .catch((error) => {
                    if (error.response.status != 409) throw error;
                });
        }
    }
    const DeleteContactList = async () => {
        const mailFormData = new FormData();

        mailFormData.append("uuid", router.query.id);

        try {
            const response = await axios({
                method: "post",
                url: "/api/v1/company/contactlist/delete",
                data: mailFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {
                setOpen(true);
            }
        } catch (error) {
            setErrors(error.response.data.message);
        }
    };
    const filteredHeadPeople =
        headQuery === ""
            ? headPeople
            : headPeople.filter((person) => {
                return person.full.includes(headQuery.toLowerCase());
            });
    const filteredManagerPeople =
        managerQuery === ""
            ? managerPeople
            : managerPeople.filter((person) => {
                return person.full.includes(managerQuery.toLowerCase());
            });
    useEffect(() => {
        axios
            .get("/api/v1/cartable/employeelist")
            .then((res) => setHeadPeople(res.data.data.users))
            .catch((error) => {
                if (error.response.status != 409) throw error;
            });
    }, []);

    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            getContactList(router.query.id);
        }
    }, [router.isReady]);

    const { getContactList, contactListData, setIsContactListostLoading } = useContactList();

    const onSubmit = async (event) => {
        event.preventDefault();
        const postFormData = new FormData();

        postFormData.append("uuid", router.query.id);
        postFormData.append("holding_employee_uuid", selectedHead.map(({ uuid }) => uuid));
        postFormData.append("company_employee_uuid", selectedManager.map(({ uuid }) => uuid));

        try {
            const response = await axios({
                method: "post",
                url: "/api/v1/company/contactlist/update",
                data: postFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {
                setOpen(true);
            }
        } catch (error) {
            setErrors(error.response.data.message);
        }
    };

    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });

    if (isLoading || !user) {
        return null;
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
                {!currentUserActions ? null : CheckIfAccessToPage(`/${window.location.pathname.split("/")[1]}/${window.location.pathname.split("/")[2]}`) ?
                    <main>
                        <div className="py-6">
                            <div className="w-full px-4 sm:px-6 md:px-8">
                                <form className="space-y-8 divide-y divide-gray-200">
                                    <div className="space-y-8 divide-y divide-gray-200">
                                        <div>
                                            <div className="mt-2 mb-2 grid grid-cols-1 gap-y-5 gap-x-2 sm:grid-cols-6">
                                                <div className="sm:col-span-6">
                                                    <h2 className="text-xl">
                                                        تغییر نماینده شرکت <span>{contactListData ? contactListData.company_title : ""}</span>
                                                    </h2>
                                                </div>

                                                <div className="sm:col-span-4">
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium  text-gray-700"
                                                    >
                                                        نماینده
                                                    </label>

                                                    <>
                                                        {contactListData.length != 0 && contactListData.company_uuid && managerPeople.length == 0 ? getCompanyEmpList(contactListData.company_uuid) : null}
                                                        {contactListData.length != 0 && contactListData.head.length != 0 && selectedHead.length == 0 ? setSelectedHead(contactListData.head) : null}
                                                        {contactListData.length != 0 && contactListData.managers.length != 0 && selectedManager.length == 0 ? setSelectedManager(contactListData.managers) : null}

                                                        <Autocomplete
                                                            multiple
                                                            id="tags-standard"
                                                            className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                            options={
                                                                filteredHeadPeople
                                                            }
                                                            noOptionsText="یافت نشد!"
                                                            value={selectedHead}
                                                            onChange={(
                                                                event,
                                                                newValue
                                                            ) => {
                                                                setSelectedHead(
                                                                    newValue
                                                                );
                                                            }}
                                                            getOptionLabel={
                                                                (person
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
                                                                        setHeadQuery(
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        />

                                                    </>

                                                    {errors["department_uuid"] ? (
                                                        <span className="text-sm text-red-500">
                                                            {
                                                                errors[
                                                                "department_uuid"
                                                                ]
                                                            }
                                                        </span>
                                                    ) : null}
                                                </div>


                                                <div className="sm:col-span-4">
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium  text-gray-700"
                                                    >
                                                        مدیران
                                                    </label>

                                                    <>


                                                        <Autocomplete
                                                            multiple
                                                            id="tags-standard"
                                                            className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                            options={
                                                                filteredManagerPeople
                                                            }
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
                                                                        setManagerQuery(
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        />

                                                    </>

                                                    {errors["department_uuid"] ? (
                                                        <span className="text-sm text-red-500">
                                                            {
                                                                errors[
                                                                "department_uuid"
                                                                ]
                                                            }
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="pt-3 pb-2 px-10 border-t border-gray-200">
                                <div className="flex justify-end">
                                    <button
                                        onClick={onSubmit}
                                        type="button"
                                        className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                                    >
                                        <span>ثبت</span>
                                    </button>
                                    <button
                                        onClick={DeleteContactList}
                                        type="button"
                                        className="rounded-md  bg-[#eb5757] py-2 ml-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                                    >
                                        <span>حذف</span>
                                    </button>
                                    <Link href="/initialData/contactList">
                                        <button
                                            type="button"
                                            className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                                        >
                                            <span>انصراف</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main> : <Forbidden />}
            </div>
            <Snackbar
                anchorOrigin={{
                    horizontal: "center",
                    vertical: "bottom",
                }}
                open={open}
                autoHideDuration={1500}
                onClose={handleToClose}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    عملیات با موفقیت انجام شد
                </Alert>
            </Snackbar>
        </div>
    );
}
