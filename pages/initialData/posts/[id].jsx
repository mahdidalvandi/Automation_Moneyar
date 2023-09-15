import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../hooks/auth";
import { usePost } from "../../../hooks/post";
import Link from "next/link";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Textarea from "../../../components/forms/textarea";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "../../../lib/axios";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
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
    const [open, setOpen] = useState(false);
    const [people, setPeople] = useState([]);
    const [query, setQuery] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [selectedperson, setSelectedPerson] = useState("");
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleConfirm = () => {

        axios.post('/api/v1/company/post/delete',
            {
                uuid: postData.uuid
            }).then((res) => {
                setOpen(false);
                window.location.assign("/initialData/posts");
            }).catch((error) => {
                var object = {};
                object['delete'] = error.response.data.message;
                setErrors(object);
            })

    };
    
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            getPost(router.query.id);
        }
    }, [router.isReady]);

    const { getPost, postData, isPostLoading } = usePost();

    const onSubmit = async (event) => {
        event.preventDefault();
        const mailFormData = new FormData();

        mailFormData.append("title", title ? title : postData.title);
        selectedperson ?
            mailFormData.append("admin_uuid", selectedperson.uuid) : null;
        mailFormData.append("uuid", postData.uuid);

        try {
            const response = await axios({
                method: "post",
                url: "/api/v1/company/post/update",
                data: mailFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {
                window.location.assign("/initialData/posts");
            }
        } catch (error) {
            setErrors(error.response.data.message);
        }
    };
    useEffect(() => {
        async function getData() {
            await axios.get("api/v1/company/post/list").then((response) => {
                setPeople(response.data.data);
                setLoadingData(false);
            });
        }
        if (loadingData) {
            getData();
        }
    }, []);

    const filteredPeople =
        query === ""
            ? people
            : people.filter((person) => {
                return person.title.includes(query.toLowerCase());
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
                                                        تغییر اطلاعات سمت
                                                    </h2>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="نام سمت *"
                                                        name={title}
                                                        rows="1"
                                                        defaultValue={
                                                            postData.title
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

                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium  text-gray-700"
                                                    >
                                                        مدیر مستقیم
                                                    </label>

                                                    <>
                                                        {postData.admin_name ==
                                                            undefined ? (
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
                                                                id="tags-standard"
                                                                className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                                options={
                                                                    filteredPeople
                                                                }
                                                                noOptionsText="یافت نشد!"
                                                                onChange={(
                                                                    event,
                                                                    newValue
                                                                ) => {
                                                                    setSelectedPerson(
                                                                        newValue
                                                                    );
                                                                }}
                                                                defaultValue={{
                                                                    title: postData.admin_name,
                                                                    uuid: postData.admine_uuid,
                                                                }}
                                                                getOptionLabel={(
                                                                    department
                                                                ) =>
                                                                    department.title
                                                                }
                                                                renderInput={(
                                                                    params
                                                                ) => (
                                                                    <TextField
                                                                        className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                        {...params}
                                                                        variant="standard"
                                                                        placeholder="افزودن .."
                                                                        defaultValue={
                                                                            postData.post_name
                                                                        }
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
                                                        )}
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
                                        className="rounded-md ml-2 bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                                    >
                                        <span>حذف سمت</span>
                                    </button>
                                    <Link href="/initialData/posts">
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
                                    onClick={handleConfirm} >
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
