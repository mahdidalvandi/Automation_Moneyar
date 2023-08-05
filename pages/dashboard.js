import SidebarDesktop from "../components/layout/sidebarDesktop";
import SidebarMobile from "../components/layout/sidebarMobile";
import StickyHeader from "../components/layout/stickyHeader";
import StickyFooter from "../components/layout/stickyFooter";
import WeatherWidget_Ip from "../components/forms/weather"
import TopMenu from "../components/layout/topMenu";
import navigationList from "../components/layout/navigationList";
import { useRouter } from 'next/router';
import { useAuth } from "../hooks/auth";
import { Dialog } from '@headlessui/react'
import axios2 from "../lib/axios";
import moment from "jalali-moment";
import Link from "next/link";
import Marquee, { Motion, randomIntFromInterval } from "react-marquee-slider";

moment.locale("fa");

import {
  ClipboardCopyIcon,
  ClipboardIcon,
  ClipboardCheckIcon
} from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import axios from 'axios';

export default function Dashboard() {
  const router = useRouter()
  const { asPath } = useRouter();
  const stats = [
    { id: 0, name: 'نامه‌های دریافتی امروز', icon: ClipboardCheckIcon, link: '/cartable/inbox', key: 'today_letter_count' },
    { id: 1, name: 'نامه های خوانده نشده', icon: ClipboardIcon, link: '/cartable/inbox', key: 'unread_letter_count' },
    { id: 2, name: 'نامه‌های ارسالی', icon: ClipboardCopyIcon, link: '/cartable/sendList', key: 'sent_letter_count' },
    { id: 3, name: 'جلسات امروز', icon: ClipboardCopyIcon, onClick: openEventList, link: '/cartable/sendList', key: 'events_count' }

  ]

  function openEventList() {
    setOwghatDialogVisibility(true);
  }
  const [hafez, setHafez] = useState({
    TITLE: '',
    RHYME: '',
    MEANING: ''
  });
  const [hafezDialogVisibility, setHafezDialogVisibility] = useState(false);
  const [jalasat, setJalasat] = useState([]);
  const [owghat, setOwghat] = useState({
    month: '',
    day: ''
  });
  const [owghatDialogVisibility, setOwghatDialogVisibility] = useState(false);
  const [currentUserActions, setCurrentUserActions] = useState();
  const [dashboard, setDashboard] = useState([]);
  const { user, isLoading } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/",
  })
  const [currentUserRole, setCurrentUserRole] = useState();
  useEffect(() => {
    axios.get('https://one-api.ir/hafez/?token=960732:62e77972c209e3.67417481').then(res => setHafez(res.data.result))
    axios.get('https://one-api.ir/owghat/?token=960732:62e77972c209e3.67417481&city=تهران').then(res => setOwghat(res.data.result))

    axios2.get("/api/v1/calendar/listActive?timestamp=" + moment().unix()).then(res => setJalasat(res.data.data))
    axios2.get("/api/v1/dashboard").then(res => {
      setDashboard(res.data.data)
    })

  }, [])

  if (isLoading || !user) {
    return null
  }
  function CheckIfAccess(val) {
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
        {dashboard && dashboard.announcements ?
          <div style={{ height: "40px" }} className="pt-2 bg-amber-500">
            <Marquee
              velocity={40}
              minScale={1}
              height={"100px"}
              resetAfterTries={200}
              direction="ltr"
            >
              {dashboard.announcements.map((item) => (
                <ul>
                  <li className="ml-20 mr-20 ">&#9679;{` ${item}`}</li>
                </ul>
              ))}
            </Marquee>
          </div> : null}
        <main className="py-10 space-y-6 ">
          <div>
            <div className="w-full px-4 sm:px-6 md:px-8">
              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item, index) => (

                  CheckIfAccess(item.link) ?
                    item.onClick ?
                      <a
                        onClick={item.onClick}
                        key={item.id}
                      >
                        <div className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
                          <dt>
                            <div className="absolute bg-amber-500 rounded-md p-3">
                              <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <p className="mr-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
                          </dt>
                          <dd className="mr-16 pb-6 flex items-baseline sm:pb-7">
                            <p className="text-2xl font-semibold text-gray-900">{dashboard[item.key] ?? 0}</p>
                            <div className="absolute bottom-0 inset-x-0 bg-[#1f2937] px-4 py-4 sm:px-6">
                              <div className="text-sm">
                                <a href="#" className="font-medium text-white hover:text-amber-500">
                                  مشاهده جلسات ماه
                                </a>
                              </div>
                            </div>
                          </dd>
                        </div>
                      </a> :
                      <Link
                        href={`/${item.link}`}
                        key={item.id}
                      >
                        <div className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden">
                          <dt>
                            <div className="absolute bg-amber-500 rounded-md p-3">
                              <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                            <p className="mr-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
                          </dt>
                          <dd className="mr-16 pb-6 flex items-baseline sm:pb-7">
                            <p className="text-2xl font-semibold text-gray-900">{dashboard[item.key] ?? 0}</p>
                            <div className="absolute bottom-0 inset-x-0 bg-[#1f2937] px-4 py-4 sm:px-6">
                              <div className="text-sm">
                                <a href="#" className="font-medium text-white hover:text-amber-500">
                                  مشاهده
                                </a>
                              </div>
                            </div>
                          </dd>
                        </div>
                      </Link>
                    : null
                ))}
              </dl>
            </div>
          </div>
          {/* {CheckIfAccess("/proceedingMenu") ?
            <div className="w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative bg-white shadow rounded-lg overflow-hidden cursor-pointer border-2 border-[#1f2937]">
                <div className="py-5 px-4 sm:pt-4 sm:px-6">
                  <p className="text-sm text-[#1f2937] font-bold">لیست جلسات برگزار نشده ماه</p>
                  <div className="divide-y text-xs mt-1 h-20 overflow-auto">
                    {
                      dashboard.events.map((jl, index) => {
                        return (
                          <Link key={index} href={jl.hast_minutes ? `/proceedingMenu/proceedingsCalendar/minutes/${jl.uuid}` : '#'}>
                            <div className="p-2 hover:bg-gray-50 flex justify-between">
                              {jl.title}
                              <span>
                                {`${jl.year}/${jl.month}/${jl.day_of_month}`}
                              </span>
                            </div>
                          </Link>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div> : null} */}
        </main>
        {/* <StickyFooter /> */}
      </div>
      <MyEventDialog
        dialog={owghat}
        data={dashboard}
        dialogOpen={owghatDialogVisibility}
        setDialog={par => setOwghatDialogVisibility(par)}
      />

    </div>
  );
}

function MyEventDialog(props) {
  return (
    <Dialog open={props.dialogOpen} onClose={() => props.setDialog(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* Container to center the panel */}
        <div className="flex min-h-full items-center justify-center">
          <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-4 w-72">
            <Dialog.Title>جلسات ماه: </Dialog.Title>
            <div className="py-5 px-4 sm:pt-4 sm:px-6">
              <p className="text-sm text-[#1f2937] font-bold">لیست جلسات برگزار نشده ماه</p>
              <div className="divide-y text-xs mt-1 ">
                {
                  props.data.events ? props.data.events.map((jl, index) => {
                    return (
                      <Link key={index} href={jl.hast_minutes ? `/proceedingMenu/proceedingsCalendar/minutes/${jl.uuid}` : '#'}>
                        <div className="p-2 hover:bg-gray-50 flex justify-between">
                          {jl.title}
                          <span>
                            {`${jl.year}/${jl.month}/${jl.day_of_month}`}
                          </span>
                        </div>
                      </Link>
                    )
                  }) : null
                }
              </div>
            </div>

            <button onClick={() => props.setDialog(false)} className="bg-[#1f2937] text-white px-4 py-2 rounded-md text-sm inline-block mt-2">بستن</button>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}
