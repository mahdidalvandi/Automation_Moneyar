import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../hooks/auth";
import { useCostHeadings } from "../../../hooks/costHeadings";
import Link from "next/link";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Textarea from "../../../components/forms/textarea";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "../../../lib/axios";
import Forbidden from "../../../components/forms/forbidden";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function EditPost() {
    const { asPath } = useRouter();

    const [title, setTitle] = useState("");

    const [errors, setErrors] = useState([]);
    const [people, setPeople] = useState([]);
    const [query, setQuery] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            getCostHeadings(router.query.id);
        }
    }, [router.isReady]);

    const { getCostHeadings, costHeadingsData, isPostLoading } = useCostHeadings();

    const onSubmit = async (event) => {
        event.preventDefault();
        const mailFormData = new FormData();

        mailFormData.append("title", title ? title : costHeadingsData.title),
            mailFormData.append("uuid", costHeadingsData.uuid);

        try {
            const response = await axios({
                method: "post",
                url: "/api/v1/company/cost_headings/update",
                data: mailFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {
                window.location.assign("/initialData/costHeadings");
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
                                                        تغییر سرفصل مصارف 
                                                    </h2>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="سرفصل مصارف *"
                                                        name={title}
                                                        rows="1"
                                                        defaultValue={
                                                            costHeadingsData.title
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

                                    <Link href="/initialData/costHeadings">
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
        </div>
    );
}
