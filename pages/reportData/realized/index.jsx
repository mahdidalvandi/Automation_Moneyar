import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import RealizedTable from "../../../components/table/realizedTable";
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
                return person.title.includes(query.toLowerCase());
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
                                                 جریان وجوه نقدی
                                            </h2>
                                        </div>                                        
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-4 sm:px-6 md:px-8">
                                {currentUserRole ?
                                    <RealizedTable roleData={currentUserRole} /> : null}
                            </div>
                        </div>
                    </main> : <Forbidden />}
            </div>
        </div>
    );
}

export default InitialData;
