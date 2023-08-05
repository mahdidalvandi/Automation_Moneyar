import { useEffect, useState } from "react";
import Link from "next/link";
import axios2 from '../../lib/axios';

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function SidebarDesktop(props) {
    const [isActive, setIsActive] = useState(false);
    const [unreadCount, setUnreadCount] = useState(-1);
    const [mailRoomCount, setMailRoomCount] = useState(-1);
    const [ticketUnreadCount, setTicketUnreadCount] = useState(-1);
    const [userRole, setUserRole] = useState(null);
    const [superAdmin, setSuperAdmin] = useState(null);
    const [isHolding, setIsHolding] = useState(null);

    const onClickHandler = (i, href) => {
        isActive == i ? setIsActive(false) :
            setIsActive(i);
    };
    function CheckIfAccess(val) {
        if (val == '/initialData/access' && superAdmin == 1) return true;
        else if (val == '/initialData/access' && superAdmin == 0) return false;
        if (val == '/initialData/contactList' && isHolding == 1) {
            if (userRole && userRole.indexOf(val) > -1) return true;
        }
        if (val == '/announcements' && isHolding == 1) {
            if (userRole && userRole.indexOf(val) > -1) return true;
        }
        if (val == '/reports/stockReport' && isHolding == 1) {
            if (userRole && userRole.indexOf(val) > -1) return true;
        }
        else if (val == '/initialData/contactList' && isHolding == 0) return false;
        else if (val == '/announcements' && isHolding == 0) return false;
        else if (val == '/reports/stockReport' && isHolding == 0) return false;
        else if (val == '/initialData/costHeadings' && isHolding == 0) return false;
        else if (val == '/initialData/incomeHeadings' && isHolding == 0) return false;
        else if (userRole && userRole.indexOf(val) > -1) return true;
        return false;
    }
    function handleGetRole(user_role) {
        props.setSelect({ currentUserRole: user_role })
    }
    function handleGetActions(user_actions) {
        props.setActions({ currentUserActions: user_actions })
    }
    function handleSuperAdmin(superAdmin) {
        props.setSuperUser({ superAdmin: superAdmin })
    }
    function handleIsHolding(isHolding) {
        props.setIsHolding({ isHolding: isHolding })
    }
    useEffect(() => {
        axios2.get("/api/v1/dashboard").then(res => {
            setUserRole(res.data.data.user_role)
            setUnreadCount(res.data.data.unread_letter_count)
            setMailRoomCount(res.data.data.mailRoom_count)
            handleGetRole(res.data.data.user_functions)
            handleGetActions(res.data.data.user_role)
            handleSuperAdmin(res.data.data.is_super_admin)
            setSuperAdmin(res.data.data.is_super_admin)
            handleIsHolding(res.data.data.is_holding)
            setIsHolding(res.data.data.is_holding)
            setTicketUnreadCount(res.data.data.ticket_unread_count)
        })

    }, [])
    return (
        <div className="hidden md:flex md:w-52 md:flex-col md:fixed md:inset-y-0">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex flex-col flex-grow pt-5 bg-[#1f2937] overflow-y-auto">
                <div className="flex items-center flex-shrink-0 px-4">
                    {/* <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-logo-amber-300-mark-white-text.svg"
                alt="Workflow"
              /> */}
                    {/* <h3 className={"text-lg text-white"}>سیستم مدیریت مجامع</h3> */}
                </div>
                {userRole ?
                    <div className="mt-5 flex-1 flex flex-col">
                        <nav className="flex-1 px-2 pb-4 space-y-1">
                            {props.menu.map((item, i) => {
                                return (
                                    <>
                                        {item.href ? (
                                            CheckIfAccess(item.href) ?
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    className={classNames(
                                                        props.loc.includes(item.href)
                                                            ? "bg-amber-500 text-white"
                                                            : "text-white hover:bg-[#374151]",
                                                        "w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                                    )}
                                                >
                                                    <item.icon
                                                        className="ml-3 flex-shrink-0 h-6 w-6 text-white"
                                                        aria-hidden="true"
                                                    />
                                                    {(item.name == "کارتابل" ?
                                                        <table className="w-full">
                                                            <tbody>
                                                                <tr id="tr0">
                                                                    <td id="td0" align="right">{item.name}</td>
                                                                    {(unreadCount > 0 ? <td id="td2"><span className="numberCircle">{unreadCount}</span></td> : null)}
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        : item.name == "پشتیبانی" ?
                                                            <table className="w-full">
                                                                <tbody>
                                                                    <tr id="tr0">
                                                                        <td id="td0" align="right">{item.name}</td>
                                                                        {(ticketUnreadCount > 0 ? <td id="td2"><span className="numberCircle">{ticketUnreadCount}</span></td> : null)}
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            : item.name == "دبیرخانه" ?
                                                                <table className="w-full">
                                                                    <tbody>
                                                                        <tr id="tr0">
                                                                            <td id="td0" align="right">{item.name}</td>
                                                                            {(mailRoomCount > 0 ? <td id="td2"><span className="numberCircle">{mailRoomCount}</span></td> : null)}
                                                                        </tr>
                                                                    </tbody>
                                                                </table>

                                                                : item.name)}
                                                </a> : null
                                        ) : (
                                            CheckIfAccess(item.master) ?
                                                <button
                                                    key={item.name}
                                                    onClick={(e) => onClickHandler(i)}
                                                    className={classNames(
                                                        props.loc.includes(item.master)
                                                            ? "bg-amber-500 text-white"
                                                            : "text-white hover:bg-[#374151]",
                                                        "w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                                    )}
                                                >
                                                    <item.icon
                                                        className="ml-3 flex-shrink-0 h-6 w-6 text-white"
                                                        aria-hidden="true"
                                                    />
                                                    {(item.name == "کارتابل" ?
                                                        <table className="w-full">
                                                            <tbody>
                                                                <tr id="tr0">
                                                                    <td id="td0" align="right">{item.name}</td>
                                                                    {(unreadCount > 0 ? <td id="td2"><span className="numberCircle">{unreadCount}</span></td> : null)}
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        : item.name == "پشتیبانی" ?
                                                            <table className="w-full">
                                                                <tbody>
                                                                    <tr id="tr0">
                                                                        <td id="td0" align="right">{item.name}</td>
                                                                        {(ticketUnreadCount > 0 ? <td id="td2"><span className="numberCircle">{ticketUnreadCount}</span></td> : null)}
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            : item.name == "دبیرخانه" ?
                                                                <table className="w-full">
                                                                    <tbody>
                                                                        <tr id="tr0">
                                                                            <td id="td0" align="right">{item.name}</td>
                                                                            {(mailRoomCount > 0 ? <td id="td2"><span className="numberCircle">{mailRoomCount}</span></td> : null)}
                                                                        </tr>
                                                                    </tbody>
                                                                </table>

                                                                : item.name)}
                                                </button> : null
                                        )}
                                        {(isActive == i ||
                                            props.loc.includes(item.master)) &&
                                            item.subList ? (
                                            <div
                                                id={item.name}
                                                className={classNames(
                                                    isActive == i ||
                                                        props.loc.includes(
                                                            item.master
                                                        )
                                                        ? "mr-3"
                                                        : "hidden",
                                                    "space-y-1"
                                                )}
                                            >
                                                {item.subList.map(
                                                    (subListItem, subListKey) => (
                                                        CheckIfAccess(subListItem.href) ?
                                                            <div key={subListKey}>
                                                                <a
                                                                    key={subListItem.name}
                                                                    href={subListItem.href}
                                                                    className={classNames(
                                                                        props.loc.includes(subListItem.href)
                                                                            ? "bg-amber-500 text-white"
                                                                            : "text-white hover:bg-[#374151]",
                                                                        "w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                                                                    )}
                                                                >
                                                                    <subListItem.icon
                                                                        className="ml-3 flex-shrink-0 h-6 w-6 text-white"
                                                                        aria-hidden="true"
                                                                    />
                                                                    {(subListItem.name == "دریافتی" ?
                                                                        <table className="w-full">
                                                                            <tbody>
                                                                                <tr id="tr0">
                                                                                    <td id="td0" align="right">{subListItem.name}</td>
                                                                                    {(unreadCount > 0 ? <td id="td2"><span className="numberCircle">{unreadCount}</span></td> : null)}
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                        : subListItem.name == "تیکت" ?
                                                                            <table className="w-full">
                                                                                <tbody>
                                                                                    <tr id="tr0">
                                                                                        <td id="td0" align="right">{subListItem.name}</td>
                                                                                        {(ticketUnreadCount > 0 ? <td id="td2"><span className="numberCircle">{ticketUnreadCount}</span></td> : null)}
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                            : subListItem.name == "صادره" ?
                                                                                <table className="w-full">
                                                                                    <tbody>
                                                                                        <tr id="tr0">
                                                                                            <td id="td0" align="right">{subListItem.name}</td>
                                                                                            {(mailRoomCount > 0 ? <td id="td2"><span className="numberCircle">{mailRoomCount}</span></td> : null)}
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                                : subListItem.name)}
                                                                </a>
                                                            </div> : null
                                                    )
                                                )}
                                            </div>
                                        ) : null}
                                    </>
                                );
                            })}
                        </nav>
                    </div> : null}
            </div>
        </div>
    );
}

export default SidebarDesktop;
