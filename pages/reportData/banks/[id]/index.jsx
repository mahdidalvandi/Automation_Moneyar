import SidebarDesktop from "../../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../../components/layout/sidebarMobile";
import StickyHeader from "../../../../components/layout/stickyHeader";
import navigationList from "../../../../components/layout/navigationList";
import InputBox from "../../../../components/forms/inputBox";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../../../hooks/auth";
import { forwardRef } from "react";
import { useState, useEffect, useRef } from "react";
import Forbidden from "../../../../components/forms/forbidden";
import axios from "../../../../lib/axios";
import moment from "jalali-moment";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

moment.locale("fa");
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function ForeCastData() {

    const [errors, setErrors] = useState([]);
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [banksValue, setBanksValue] = useState();
    const [responseData, setResponseData] = useState();
    const { asPath } = useRouter();
    const [open, setOpen] = useState(false);
    const [sendingForm, setSendingForm] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(moment().format("jM"));
    // const [selectedMonth, setSelectedMonth] = useState(7);
    const listItems = useRef(null);
    const handleToClose = (event, reason) => {
        window.location.href = "/reportData/banks";
    };

    function checkMonth(month) {
        if (selectedMonth == 1 && month == 11) return false;
        else {
            if (selectedMonth == 1) return true;
            if (selectedMonth - 2 == month) return false;
            return true;
        }
    }

    const router = useRouter();
    const handleFocus = (event) => event.target.select();
    useEffect(() => {
        if (router.isReady) {
            axios
                .post('/api/v1/bank_balance/get',
                    {
                        year: router.query.id
                    })
                .then((response) => {
                    setBanksValue(response.data.data.bank);
                })
                .catch((err) => {
                }
                );
        }
    }, [router.isReady]);

    // useEffect(() => {
    //     if (listItems.current && listItems.current.children.lenght > 0) {
    //         console.log(listItems.current.children)
    //         const lastItem = listItems.current.children[6];
    //         lastItem.scrollIntoView({ behavior: "smooth", block: "center" });
    //     }
    // }, [listItems.current]);
    // console.log('list:', listItems.current)
    const onSubmit = async (event) => {
        event.preventDefault();
        var object = {};
        setSendingForm(true);
        axios
            .post('/api/v1/bank_balance/add',
                {
                    year: router.query.id,
                    bank: banksValue
                })
            .then((res) => {
                setResponseData(res.data.data)
                setSendingForm(false);

                //  setOpen(true);
            })
            .catch((err) => {
                if (err.response.data.message == "no permission") {
                    object['master'] = "شما دسترسی جهت انجام عملیات را ندارید";
                    setErrors(object)
                }
                else {
                    object['master'] = err.response.data.message;
                    setErrors(object)
                }
                setSendingForm(false);
            }
            );
    };
    const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");

    const setTotalValue = (month, uuid, value) => {
        setBanksValue(
            banksValue.map((item, index) =>
                item.map(subItem =>
                    subItem.uuid === uuid && index === month - 1
                        ? { ...subItem, totalValue: value }
                        : subItem
                )
            ))
    }

    const setWithdrawalValue = (month, uuid, value) => {
        setBanksValue(
            banksValue.map((item, index) =>
                item.map(subItem =>
                    subItem.uuid === uuid && index === month - 1
                        ? { ...subItem, withdrawalValue: value }
                        : subItem
                )
            ))
    }

    const monthsArray = [
        {
            id: 1, value: 'فروردین'
        },
        {
            id: 2, value: 'اردیبهشت'
        },
        {
            id: 3, value: 'خرداد'
        },
        {
            id: 4, value: 'تیر'
        },
        {
            id: 5, value: 'مرداد'
        },
        {
            id: 6, value: 'شهریور'
        },
        {
            id: 7, value: 'مهر'
        },
        {
            id: 8, value: 'آبان'
        },
        {
            id: 9, value: 'آذر'
        },
        {
            id: 10, value: 'دی'
        },
        {
            id: 11, value: 'بهمن'
        },
        {
            id: 12, value: 'اسفند'
        }
    ]

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
                {!currentUserActions ? null : CheckIfAccessToPage("/reportData/banks") ?
                    <main>
                        <div className="py-6">
                            <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                    <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                        <div>
                                            <h2 className="text-lg leading-6 font-large text-gray-900">
                                                {`موجودی بانک سال  ${router.query.id}`}
                                            </h2>
                                        </div>
                                        <div>
                                            <Link href="/reportData/banks">
                                                <button
                                                    type="button"
                                                    className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                                                >
                                                    <span>بازگشت</span>
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div ref={listItems} className="grid lg:grid-cols-6 sx:grid-cols-1 gap-10 col-span-6 rounded-md p-3">
                                {monthsArray.map((cell, i) => {
                                    return (
                                        banksValue ?
                                            <div className="col-span-6">
                                                <div className="grid grid-cols-6 gap-4 col-span-6 rounded-md bg-gray-100 p-3">
                                                    <div className="col-span-6 flex justify-between">
                                                        <p>{cell.value}</p>
                                                        {!checkMonth(i) ? <button
                                                            onClick={onSubmit}
                                                            disabled={sendingForm}
                                                            type="button"
                                                            className={`ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm ${sendingForm ? " bg-gray-500 hover:bg-gray-500 " : " bg-[#43a047] hover:bg-[#2d592f] "}  focus:outline-none`}
                                                        >
                                                            <span>{`${sendingForm ? "در حال ثبت اطلاعات" : "ثبت"}`}</span>
                                                        </button> : null}
                                                    </div>
                                                    <div className="col-span-6 grid grid-cols-6 gap-2">
                                                        {banksValue[i].map((bank, j) => {
                                                            return (
                                                                <div className="col-span-1 bg-gray-200 p-2 rounded-md">
                                                                    <p>{bank.title}</p>
                                                                    <InputBox
                                                                        title='موجودی کل'
                                                                        name='موجودی کل'
                                                                        onFocus={handleFocus}
                                                                        disabled={checkMonth(i) || bank.hasValue}
                                                                        value={bank.totalValue ? addCommas(removeNonNumeric(bank.totalValue)) : addCommas(removeNonNumeric(0))}
                                                                        onChange={(event) =>
                                                                            setTotalValue(cell.id, bank.uuid,
                                                                                removeNonNumeric(event.target.value))
                                                                        }
                                                                    />
                                                                    <InputBox
                                                                        title='موجودی قابل برداشت'
                                                                        name='موجودی قابل برداشت'
                                                                        onFocus={handleFocus}
                                                                        disabled={checkMonth(i) || bank.hasValue}
                                                                        value={bank.withdrawalValue ? addCommas(removeNonNumeric(bank.withdrawalValue)) : addCommas(removeNonNumeric(0))}
                                                                        onChange={(event) =>
                                                                            setWithdrawalValue(cell.id, bank.uuid,
                                                                                removeNonNumeric(event.target.value))
                                                                        }
                                                                    />
                                                                    {!checkMonth(i) && responseData ?
                                                                        responseData[j] ? responseData[j].success == 1 ? <span className="text-sm text-green-700">با موفقیت ثبت شد</span> : responseData[j].success == 0 ?
                                                                            // <span className="text-sm text-red-700">امکان تغییر اطلاعات وجود ندارد</span> 
                                                                            <span>&nbsp;</span>
                                                                            : <span>&nbsp;</span> : <span>&nbsp;</span> : <span>&nbsp;</span>}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div> : null
                                    );
                                })}
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

export default ForeCastData;
