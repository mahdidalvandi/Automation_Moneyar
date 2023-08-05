import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../hooks/auth";
import { useGroup } from "../../../hooks/group";
import Link from "next/link";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Textarea from "../../../components/forms/textarea";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "../../../lib/axios";
import "react-loading-skeleton/dist/skeleton.css";
import Forbidden from "../../../components/forms/forbidden";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function EditPost() {
    const { asPath } = useRouter();

    const [title, setTitle] = useState("");

    const [errors, setErrors] = useState([]);
    const [people, setPeople] = useState([]);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [groupMembers, setGroupMembers] = useState([]);
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            getGroup(router.query.id);

        }
    }, [router.isReady]);

    const { getGroup, groupData, isGroupLoading } = useGroup();


    const DeleteGroup = async () => {
        const mailFormData = new FormData();

        mailFormData.append("uuid", groupData.group_uuid);

        try {
            const response = await axios({
                method: "post",
                url: "/api/v1/group/archive",
                data: mailFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {
                window.location.assign("/initialData/groups");
            }
        } catch (error) {
            setErrors(error.response.data.message);
        }
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        const mailFormData = new FormData();

        mailFormData.append("title", title ? title : groupData.group_name),
            mailFormData.append("uuid", groupData.group_uuid);
        mailFormData.append("members", groupMembers.map(({ uuid }) => uuid));

        try {
            const response = await axios({
                method: "post",
                url: "/api/v1/group/update",
                data: mailFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {
                window.location.assign("/initialData/groups");
            }
        } catch (error) {
            setErrors(error.response.data.message);
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
                                                        ویرایش گروه
                                                    </h2>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="نام گروه *"
                                                        name={title}
                                                        rows="1"
                                                        defaultValue={
                                                            groupData.group_name
                                                        }
                                                        onChange={(event) =>
                                                            setTitle(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["title"]}
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>

                                                <div className="sm:col-span-4">
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium  text-gray-700"
                                                    >
                                                        اعضای گروه
                                                    </label>

                                                    <>

                                                        {groupData.length != 0 && groupData.group_members.length != 0 && groupMembers.length == 0 ? setGroupMembers(groupData.group_members) : null}

                                                        <Autocomplete
                                                            multiple
                                                            id="tags-standard"
                                                            className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                            options={
                                                                filteredPeople
                                                            }
                                                            noOptionsText="یافت نشد!"
                                                            value={groupMembers}
                                                            onChange={(
                                                                event,
                                                                newValue
                                                            ) => {
                                                                setGroupMembers(
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
                                        onClick={handleClickOpen}
                                        type="button"
                                        className="rounded-md  bg-[#eb5757] py-2 ml-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                                    >
                                        <span>حذف گروه</span>
                                    </button>
                                    <Link href="/initialData/groups">
                                        <button
                                            type="button"
                                            className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none ">
                                            <span>انصراف</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {'هشدار'}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    بعد از حذف، امکان بازگردانی اطلاعات وجود ندارد.
                                    از ادامه عملیات مطمئن هستید؟
                                </DialogContentText>
                                {errors["delete"] ? (
                                    <span className="text-sm text-red-500">
                                        {errors["delete"]}
                                    </span>
                                ) : null}
                            </DialogContent>
                            <DialogActions>
                                <button
                                    className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                                    onClick={DeleteGroup} >
                                    تایید
                                </button>
                                <button
                                    className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                                    onClick={handleClose}>لغو</button>
                            </DialogActions>
                        </Dialog>
                    </main> : <Forbidden />}
            </div>
        </div>
    );
}
