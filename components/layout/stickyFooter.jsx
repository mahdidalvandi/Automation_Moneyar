import {
    BellIcon,
    MenuAlt2Icon,
    LogoutIcon,
    UserCircleIcon,
    KeyIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import { useAuth } from "../../hooks/auth";
import { useRouter } from "next/router";
import axios from 'axios';
import WeatherWidget_Ip from "../../components/forms/weather"
import { useEffect, useState } from "react";
import { Dialog } from '@headlessui/react'


function StickyFooter() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { asPath } = useRouter();
    const [owghatDialogVisibility, setOwghatDialogVisibility] = useState(false);
    const [hafezDialogVisibility, setHafezDialogVisibility] = useState(false);
    const [hafez, setHafez] = useState({
        TITLE: '',
        RHYME: '',
        MEANING: ''
    });
    const [owghat, setOwghat] = useState({
        month: '',
        day: ''
    });
    const { user, logout } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/dashboard",
    });

    useEffect(() => {
        axios.get('https://one-api.ir/owghat/?token=960732:62e77972c209e3.67417481&city=تهران').then(res => setOwghat(res.data.result))
        axios.get('https://one-api.ir/hafez/?token=960732:62e77972c209e3.67417481').then(res => setHafez(res.data.result))

    }, [])

    return (
        <div className="sticky buttom-0 z-10 flex-shrink-0 flex h-12 bg-gray-100 podbar shadow ">

            <div className="flex-1 px-4 flex justify-between">

                <div onClick={_ => {
                    setHafezDialogVisibility(true);
                }} className="flex-1 flex ">
                    {
                        !hafez ?
                            (
                                <div></div>
                            ) :
                            (
                                <p className="text-md pt-2 cursor-pointer text-gray-500 ">حافظ: {hafez.TITLE}</p>
                            )
                    }
                </div>
                <div className="flex-1 flex "></div>
                <div className="flex-1 flex "></div>
                <div className="flex-1 flex">
                    {
                        !owghat ?
                            (
                                <div ></div>
                            ) :
                            (
                                <div onClick={_ => {
                                    setOwghatDialogVisibility(true);
                                }} className="text-md pt-2 cursor-pointer text-gray-500 ">تاریخ امروز: <span>{owghat.day}-{owghat.month}-۱۴۰۱</span></div>

                            )
                    }
                </div>
            </div>
            <MyHafezDialog
                dialog={hafez}
                dialogOpen={hafezDialogVisibility}
                setDialog={par => setHafezDialogVisibility(par)}
            />
            <MyOwghatDialog
                dialog={owghat}
                dialogOpen={owghatDialogVisibility}
                setDialog={par => setOwghatDialogVisibility(par)}
            />
        </div>
    );
}
function MyHafezDialog(props) {
    return (
        <Dialog open={props.dialogOpen} onClose={() => props.setDialog(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                {/* Container to center the panel */}
                <div className="flex min-h-full items-center justify-center">
                    <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-4">
                        <Dialog.Title>{props.dialog.TITLE}</Dialog.Title>
                        <div className="my-4">
                            <p className="text-xs text-gray-500 mb-1">فال:</p>
                            <p className="text-sm text-justify " style={{ whiteSpace: "pre-line" }}>{props.dialog.RHYME}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">معنی:</p>
                            <p className="text-sm text-justify">{props.dialog.MEANING}</p>
                        </div>
                        <button onClick={() => props.setDialog(false)} className="bg-[#eb5757] hover:bg-[#843737] text-white px-4 py-2 rounded-md text-sm inline-block mt-2">بستن</button>
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    )
}

function MyOwghatDialog(props) {
    return (
        <Dialog open={props.dialogOpen} onClose={() => props.setDialog(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                {/* Container to center the panel */}
                <div className="flex min-h-full items-center justify-center">
                    <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-4 w-72">
                        <Dialog.Title>تاریخ امروز: <p className="text-lg mt-1">۱۴۰۱-{props.dialog.month}-{props.dialog.day}</p></Dialog.Title>
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">اذان صبح:</p>
                            <p className="text-sm text-justify">{props.dialog.azan_sobh}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">طلوع آفتاب:</p>
                            <p className="text-sm text-justify">{props.dialog.toloe_aftab}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">اذان ظهر:</p>
                            <p className="text-sm text-justify">{props.dialog.azan_zohre}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">غروب آفتاب:</p>
                            <p className="text-sm text-justify">{props.dialog.ghorob_aftab}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-1">اذان مغرب:</p>
                            <p className="text-sm text-justify">{props.dialog.azan_maghreb}</p>
                        </div>

                        <button onClick={() => props.setDialog(false)} className="bg-[#eb5757] hover:bg-[#843737] text-white px-4 py-2 rounded-md text-sm inline-block mt-2">بستن</button>
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    )
}

export default StickyFooter;
