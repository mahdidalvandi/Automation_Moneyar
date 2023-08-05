import SidebarDesktop from "../../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../../components/layout/sidebarMobile";
import StickyHeader from "../../../../components/layout/stickyHeader";
import navigationList from "../../../../components/layout/navigationList";
import InputBox from "../../../../components/forms/inputBox";
import Link from "next/link";
import fileDownload from "js-file-download";
import { useRouter } from "next/router";
import { useAuth } from "../../../../hooks/auth";
import { forwardRef } from "react";
import { useState, useEffect } from "react";
import Forbidden from "../../../../components/forms/forbidden";
import axios from "../../../../lib/axios";
import moment from "jalali-moment";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { ExcelRenderer } from 'react-excel-renderer';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

moment.locale("fa");
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
const DownloadFile = () => {
    axios
        .get(`/api/v1/budget/sample/excel`, {
            params: {
            },
            responseType: "blob",
        })
        .then((res) => {
            if (name) {
                fileDownload(res.data, name);
            }
            else {
                fileDownload(res.data, "sample.xlsx");
            }
        });
};

function ForeCastData() {

    const [errors, setErrors] = useState([]);

    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [values, setValues] = useState();
    const [incomeValues, setIncomeValues] = useState();
    const [costValues, setCostValues] = useState();
    const { asPath } = useRouter();
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [final, setFinal] = useState(false);
    const [sendingForm, setSendingForm] = useState(false);
    const [sendingFinalForm, setSendingFinalForm] = useState(false);

    const handleToClose = (event, reason) => {
        window.location.href = "/reportData/forecast";
    };

    const router = useRouter();
    const handleFocus = (event) => event.target.select();
    useEffect(() => {
        if (router.isReady) {
            axios
                .post('/api/v1/budget/forecast/get',
                    {
                        year: router.query.id
                    })
                .then((response) => {
                    setFinal(response.data.data.final);
                    setCostValues(response.data.data.cost);
                    setIncomeValues(response.data.data.income)
                })
                .catch((err) => {
                }
                );
        }
    }, [router.isReady]);

    const handleClickOpen = () => {
        setDialogOpen(true);
    };
    const handleClose = () => {
        setDialogOpen(false);
    };
    const handleConfirm = () => {
        setDialogOpen(false);
        onSubmit(1);
    };

    const onSubmit = async (final) => {
        var object = {};
        if (final == 1) {
            setSendingFinalForm(true);
        }
        else {
            setSendingForm(true);
        }
        axios
            .post('/api/v1/budget/forecast/add',
                {
                    year: router.query.id,
                    income: incomeValues,
                    cost: costValues,
                    final: final
                })
            .then((res) => {
                setOpen(true);
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

    const setValue = (month, uuid, value) => {
        setValues({ [month + uuid]: value })
        setIncomeValues(
            incomeValues.map((item, index) =>
                item.map(subItem =>
                    subItem.uuid === uuid && index === month - 1
                        ? { ...subItem, value: value }
                        : subItem
                )
            ))
    }
    const setExcelValue = (month, itemIndex, value) => {
        setIncomeValues(
            incomeValues.map((item, index) =>
                item.map((subItem, subIndex) =>
                    subIndex === itemIndex && index === month - 1
                        ? { ...subItem, value: value }
                        : subItem
                )
            ))
    }
    const setCostValue = (month, uuid, value) => {
        setValues({ [month + uuid]: value })
        setCostValues(
            costValues.map((item, index) =>
                item.map(subItem =>
                    subItem.uuid === uuid && index === month - 1
                        ? { ...subItem, value: value }
                        : subItem
                )
            ))
    }
    const setCostExcelValue = (month, itemIndex, value) => {
        setCostValues(
            costValues.map((item, index) =>
                item.map((subItem, subIndex) =>
                    subIndex === itemIndex && index === month - 1
                        ? { ...subItem, value: value }
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

    const uploadChange = (event) => {
        let fileObj = event.target.files[0];
        event.target.value = null;
        var object = {};
        if (fileObj.name.split('.').pop() == 'xlsx') {
            ExcelRenderer(fileObj, (err, resp) => {
                if (err) {
                    object['file'] = err;
                    setErrors(object)
                }
                else {
                    object['file'] = "";
                    setErrors(object)
                    let incomeIndex = incomeValues[0].length;
                    let costIndex = costValues[0].length;
                    let incomeBuf = [...incomeValues];
                    let costBuf = [...costValues];
                    for (let j = 0; j < 12; j++) {
                        for (let i = 0; i < incomeIndex; i++) {
                            incomeBuf[j][i].value =
                                resp.rows[2 + i][j + 1] ? resp.rows[2 + i][j + 1] : 0;
                        }
                        for (let i = 0; i < costIndex; i++) {
                            costBuf[j][i].value =
                                resp.rows[4 + incomeIndex + i][j + 1] ? resp.rows[4 + incomeIndex + i][j + 1] : 0;

                        }
                    }
                    setIncomeValues(incomeBuf);
                    setCostValues(costBuf);
                }
            });
        }
        else {
            object['file'] = "فقط فایل های اکسل با پسوند xlsx مجاز می‌باشد";
            setErrors(object)
        }
    };
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
                {!currentUserActions ? null : CheckIfAccessToPage("/reportData/forecast") ?
                    <main>
                        <div className="py-6">
                            <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                    <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                        <div className="ml-4 mt-2 flex items-center">
                                            <h2 className="text-lg leading-6 font-large text-gray-900">
                                                {`پیش‌بینی جریان وجوه نقدی سال ${router.query.id}`}
                                            </h2>


                                        </div>
                                        <div className="mr-10 space-x-3  justify-start ">
                                            <div>
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative inline-flex items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#1f2937] hover:bg-[#11151b] "
                                                >
                                                    <span>
                                                        آپلود فایل اکسل
                                                    </span>
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        onInput={(e) => { uploadChange(e); }}
                                                    />
                                                </label>
                                                <label
                                                    htmlFor="file-downl"
                                                    className="relative mr-5 cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
                                                >
                                                    <button
                                                        id="file-download"
                                                        name="file-download"
                                                        type="button"
                                                        onClick={() =>
                                                            DownloadFile(
                                                            )
                                                        }
                                                    > دانلود فایل اکسل نمونه</button>
                                                </label>
                                            </div>

                                        </div>

                                    </div>

                                </div>
                                <div className="flex justify-end">
                                    {errors["file"] ? (
                                        <span className="text-sm mr-5 text-red-500">
                                            {
                                                errors[
                                                "file"
                                                ]
                                            }
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="grid lg:grid-cols-6 sx:grid-cols-1 gap-4 col-span-6 rounded-md p-3">
                                {monthsArray.map((cell, i) => {
                                    return (
                                        incomeValues && costValues ?
                                            <div className="col-span-2">
                                                <div className="grid grid-cols-6 gap-4 col-span-6 rounded-md bg-gray-100 p-3">
                                                    <div className="col-span-6 flex justify-start">
                                                        <p>{cell.value}</p>
                                                    </div>
                                                    <div className="col-span-6 grid grid-cols-2 gap-2">
                                                        <div className="col-span-1 bg-gray-200 p-2 rounded-md">
                                                            <p>منابع</p>
                                                            {incomeValues[i].map((incomeCell, j) => {
                                                                return (
                                                                    <InputBox
                                                                        title={incomeCell.title}
                                                                        name={incomeCell.title}
                                                                        onFocus={handleFocus}
                                                                        disabled={final}
                                                                        value={incomeCell.value ? addCommas(removeNonNumeric(incomeCell.value)) : addCommas(removeNonNumeric(0))}
                                                                        onChange={(event) =>
                                                                            setValue(cell.id, incomeCell.uuid,
                                                                                removeNonNumeric(event.target.value))
                                                                        }
                                                                    />)
                                                            })}
                                                        </div>
                                                        <div className="col-span-1 bg-gray-200 p-2 rounded-md">
                                                            <p>مصارف</p>
                                                            {costValues[i].map((costCell, i) => {
                                                                return (
                                                                    <InputBox
                                                                        title={costCell.title}
                                                                        name={costCell.title}
                                                                        onFocus={handleFocus}
                                                                        disabled={final}
                                                                        value={costCell.value ? addCommas(removeNonNumeric(costCell.value)) : addCommas(removeNonNumeric(0))}
                                                                        onChange={(event) =>
                                                                            setCostValue(cell.id, costCell.uuid,
                                                                                removeNonNumeric(event.target.value))
                                                                        }
                                                                    />)
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> : null
                                    );
                                })}
                            </div>

                        </div>
                        {errors["master"] ? (
                            <span className="text-lg mr-5 text-red-500">
                                {
                                    errors[
                                    "master"
                                    ]
                                }
                            </span>
                        ) : null}
                        <div className="pt-3 pb-2 px-10 border-t border-gray-200">
                            <div className="flex justify-end">
                                {!final ?
                                    <>
                                        <button
                                            onClick={handleClickOpen}
                                            disabled={sendingForm || sendingFinalForm}
                                            type="button"
                                            className={`ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm ${sendingFinalForm ? " bg-gray-500 hover:bg-gray-500 " : " bg-[#43a047] hover:bg-[#2d592f] "}  focus:outline-none`}
                                        >
                                            <span>{`${sendingFinalForm ? "در حال ثبت اطلاعات" : "ثبت نهایی"}`}</span>
                                        </button>
                                        <button
                                            onClick={(event) => onSubmit(0)}
                                            disabled={sendingForm || sendingFinalForm}
                                            type="button"
                                            className={`ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm ${sendingForm ? " bg-gray-500 hover:bg-gray-500 " : " bg-[#43a047] hover:bg-[#2d592f] "}  focus:outline-none`}
                                        >
                                            <span>{`${sendingForm ? "در حال ذخیره اطلاعات" : "ذخیره پیش نویس"}`}</span>
                                        </button>
                                    </> : null}

                                <Link href="/reportData/forecast">
                                    <button
                                        type="button"
                                        className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                                    >
                                        <span>انصراف</span>
                                    </button>
                                </Link>
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
            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'هشدار'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        پس از ثبت نهایی، امکان تغییر اطلاعات وجود ندارد.
                        آیا از ادامه عملیات اطمینان دارید؟
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button
                        className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                        onClick={handleConfirm}>
                        تایید
                    </button>
                    <button
                        className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                        onClick={handleClose}>لغو</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ForeCastData;
