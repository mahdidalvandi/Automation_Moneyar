import SidebarDesktop from "../../components/layout/sidebarDesktop";
import SidebarMobile from "../../components/layout/sidebarMobile";
import StickyHeader from "../../components/layout/stickyHeader";
import InputBox from "../../components/forms/inputBox";
import navigationList from "../../components/layout/navigationList";
import { useState, forwardRef } from "react";
import Link from "next/link";
import axios from "../../lib/axios";
import Image from "next/image";
import { loadImageFromServer } from "../../lib/helper";
import Forbidden from "../../components/forms/forbidden";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
const myLoader = ({ src, width, quality }) => {
    return loadImageFromServer(`${src}?w=${width}&q=${quality || 75}`);
};

const tabs = [
    { name: "اطلاعات شرکت", href: "/companies/addInformation", current: true },
    // { name: "ثبت نقش", href: "/users/addRole", current: false },
    // {
    //     name: "اطلاعات کاربری",
    //     href: "/users/addUserInformation",
    //     current: false,
    // },
];
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AddUser() {

    const [companyName, setCompanyName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [address, setAddress] = useState("");
    const [currentAddress, setCurrentAddress] = useState("");
    const [ceo, setCeo] = useState("");
    const [finYear, setFinYear] = useState("");
    const [registerDate, setRegisterDate] = useState();
    const [companyType, setCompanyType] = useState();
    const [auditInst, setAuditInst] = useState("");
    const [activityType, setActivityType] = useState();
    const [daneshBonyanStatus, setDaneshBonyanStatus] = useState();
    const [registeredCapital, setRegisteredCapital] = useState("");
    const [products, setProducts] = useState([]);
    const [shareHolder, setShareHolder] = useState([]);
    const [board, setBoard] = useState([]);
    const [shareHolderNPDate, setShareHolderNPDate] = useState();
    const [shareHolderNPNo, setShareHolderNPaperNo] = useState("");
    const [boardMemberNPDate, setBoardMemberNPDate] = useState();
    const [boardMemberNPNo, setBoardMemberNPNo] = useState("");
    const [superAdmin, setSuperAdmin] = useState();

    const [nationalID, setNationalID] = useState("");
    const [indicator, setIndicator] = useState();
    const [registrationID, setRegistrationID] = useState("");
    const [fax, setFax] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState([]);
    const [avatar, setAvatar] = useState("");
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [open, setOpen] = useState(false);

    function addProduct() {
        setProducts([...products, { product: "", description: "" }]);
    }
    function removeMosavabat(index) {
        let temp = [...products];
        temp.splice(index, 1);
        setProducts(temp);
    }
    function changeProduct(index, value) {
        let temp = [...products];
        temp[index].product = value;
        setProducts(temp);
    }
    function changeDescription(index, value) {
        let temp = [...products];
        temp[index].description = value;
        setProducts(temp);
    }

    function addShareHolder() {
        setShareHolder([...shareHolder, { name: "", percent: "", value: "", description: "" }]);
    }
    function removeShareHolder(index) {
        let temp = [...shareHolder];
        temp.splice(index, 1);
        setShareHolder(temp);
    }
    function changeShareHoldeName(index, value) {
        let temp = [...shareHolder];
        temp[index].name = value;
        setShareHolder(temp);
    }
    function changeShareHolderPercent(index, value) {
        let temp = [...shareHolder];
        temp[index].percent = removeNonNumericWithDot(value);
        setShareHolder(temp);
    }
    function changeSHareHolderAmount(index, value) {
        let temp = [...shareHolder];
        temp[index].value = addCommas(removeNonNumeric(value));
        setShareHolder(temp);
    }
    function changeShareHolderDescription(index, value) {
        let temp = [...shareHolder];
        temp[index].description = value;
        setShareHolder(temp);
    }

    function addBoard() {
        setBoard([...board, { name: "", position: "", sign: "", description: "" }]);
    }
    function removeBoard(index) {
        let temp = [...board];
        temp.splice(index, 1);
        setBoard(temp);
    }
    function changeBoardName(index, value) {
        let temp = [...board];
        temp[index].name = value;
        setBoard(temp);
    }
    function changeBoardPosition(index, value) {
        let temp = [...board];
        temp[index].position = value;
        setBoard(temp);
    }
    function changeBoardSign(index, value) {
        let temp = [...board];
        temp[index].sign = value;
        setBoard(temp);
    }
    function changeBoardDescription(index, value) {
        let temp = [...board];
        temp[index].description = value;
        setBoard(temp);
    }


    const handleToClose = (event, reason) => {
        window.location.assign("/companies");
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        var object = {};
        if (!companyName) {
            object['title'] = 'نام شرکت الزامی است';
        }
        if (!nationalID) {
            object['national_id'] = 'شناسه ملی شرکت الزامی است';
        }
        if (!telephone) {
            object['telephone'] = 'شماره تماس شرکت الزامی است';
        }
        if (!address) {
            object['address'] = 'آدرس ثبتی شرکت الزامی است';
        }
        if (nationalID.length != 11) {
            object['national_id'] = 'شناسه ملی شرکت 11 رقم است';
        }
        if (!registrationID) {
            object['registration_id'] = 'شماره ثبت شرکت الزامی است';
        }
        if (!companyName || !nationalID || !registrationID || !address || !telephone || nationalID.length != 11) {
            setErrors(object);
            return;
        }

        axios
            .post('/api/v1/company/add',
                {
                    title: companyName,
                    address: address,
                    tel: telephone,
                    national_id: nationalID,
                    registration_id: registrationID,
                    email: email,
                    fax: fax,
                    logo: avatar,
                    registration_date: registerDate ? String(registerDate.unix) : "",
                    current_address: currentAddress,
                    ceo: ceo,
                    indicator_prefix: indicator,
                    fin_year: finYear,
                    company_type: companyType,
                    audit_inst: auditInst,
                    activity_type: activityType,
                    daneshBonyan_status: daneshBonyanStatus,
                    registered_capital: registeredCapital,
                    products: products,
                    share_holder: shareHolder,
                    board: board,
                    share_holder_np_date: shareHolderNPDate ? String(shareHolderNPDate.unix) : "",
                    share_holder_np_no: shareHolderNPNo,
                    board_member_np_date: boardMemberNPDate ? String(boardMemberNPDate.unix) : "",
                    board_member_np_no: boardMemberNPNo
                })
            .then((res) => {
                setOpen(true);
                
            })
            .catch((err) => {
                object = err.response.data.message;
                setErrors(object)
            }
            );
    };
    const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");
    const removeNonNumericWithDot = num => num.toString().replace(/[^0-9,.]/g, "");

    const uploadChange = (event) => {
        try {
            const fileUpload = axios({
                method: "post",
                url: "/api/v1/file/upload",
                data: { attach: event.target.files[0], type: "avatar" },
                headers: { "Content-Type": "multipart/form-data" },
            }).then(function (response) {
                setAvatar(response.data.data.file_path);
            }).catch((err) => {
                setUploading(false);
                var object = {};
                object['upload'] = 'خطا در آپلود فایل';
                setErrors(object);
            });
        } catch (error) { }
    };
    function CheckIfAccessToPage(val) {
        if (currentUserActions && currentUserActions.indexOf(val) > -1) return true;
        return false;
    }

    return (
        <div>
            <SidebarMobile menu={navigationList()} loc={"/companies"} />
            <SidebarDesktop menu={navigationList()} loc={"/companies"}
                setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
                setActions={(props) => setCurrentUserActions(props.currentUserActions)}
                setIsHolding={(props) => { }}
                setSuperUser={(props) => setSuperAdmin(props.superAdmin)} />
            <div className="md:pr-52 flex flex-col flex-1">
                <StickyHeader />
                {!currentUserActions ? null : CheckIfAccessToPage(window.location.pathname) ?
                    <main>
                        <div className="py-6">
                            <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                                <div className="border-b border-gray-200">
                                    <div className="sm:flex sm:items-baseline">
                                        {/* <h3 className="text-lg text-gray-900">
                                        افزودن کاربر جدید
                                    </h3> */}
                                        <div className="mt-4 sm:mt-0">
                                            <nav className="flex space-x-8 sm:mr-5">
                                                {tabs.map((tab) => (
                                                    <a
                                                        key={tab.name}
                                                        href={tab.href}
                                                        className={classNames(
                                                            tab.current
                                                                ? "border-amber-500 text-amber-600"
                                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                                            ' " pb-4 px-7 border-b-2 text-md "'
                                                        )}
                                                    >
                                                        {tab.name}
                                                    </a>
                                                ))}
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-4 sm:px-6 md:px-8">
                                <form
                                    autoComplete="off"
                                    onSubmit={onSubmit}
                                    className="space-y-8 divide-y divide-gray-200"
                                >
                                    <div className="space-y-8 divide-y divide-gray-200">
                                        <div>
                                            <div className="mt-6 mb-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="نام شرکت *"
                                                        name={companyName}
                                                        value={companyName}
                                                        onChange={(event) =>
                                                            setCompanyName(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["title"]}
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="شناسه ملی *"
                                                        name={nationalID}
                                                        value={nationalID}
                                                        onChange={(event) =>
                                                            setNationalID(
                                                                event.target.value.slice(0, 11)
                                                            )
                                                        }
                                                        error={
                                                            errors["national_id"]
                                                        }
                                                        type="number"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="شماره ثبت *"
                                                        name={registrationID}
                                                        value={registrationID}
                                                        onChange={(event) =>
                                                            setRegistrationID(
                                                                event.target.value.slice(0, 10)
                                                            )
                                                        }
                                                        error={
                                                            errors[
                                                            "registration_id"
                                                            ]
                                                        }
                                                        type="number"
                                                        isrequired="true"
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="شماره تماس* "
                                                        name={telephone}
                                                        value={telephone}
                                                        onChange={(event) =>
                                                            setTelephone(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["telephone"]}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="فکس"
                                                        name={fax}
                                                        value={fax}
                                                        onChange={(event) =>
                                                            setFax(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["fax"]}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="ایمیل"
                                                        name={email}
                                                        value={email}
                                                        onChange={(event) =>
                                                            setEmail(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["email"]}
                                                    />
                                                </div>
                                                <div className={`${superAdmin ? "sm:col-span-2" : "sm:col-span-4"}`}>
                                                    <InputBox
                                                        title="آدرس ثبتی *"
                                                        name={address}
                                                        value={address}
                                                        onChange={(event) =>
                                                            setAddress(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["address"]}
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="مدیر عامل"
                                                        name={ceo}
                                                        value={ceo}
                                                        onChange={(event) =>
                                                            setCeo(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["ceo"]}
                                                    />
                                                </div>
                                                {superAdmin ?
                                                    <div className="sm:col-span-2">
                                                        <InputBox
                                                            title="اندیکاتور *"
                                                            name={indicator}
                                                            value={indicator}
                                                            onChange={(event) =>
                                                                setIndicator(
                                                                    event.target.value.slice(0, 3)
                                                                )
                                                            }
                                                            error={errors["indicator_prefix"]}
                                                        />
                                                    </div> : null}

                                                <div className="sm:col-span-4">
                                                    <InputBox
                                                        title="آدرس فعلی "
                                                        name={currentAddress}
                                                        value={currentAddress}
                                                        onChange={(event) =>
                                                            setCurrentAddress(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["currentAddress"]}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="سال مالی"
                                                        name={finYear}
                                                        value={finYear}
                                                        onChange={(event) =>
                                                            setFinYear(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["finYear"]}
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="date"
                                                        className="block text-sm font-medium  text-gray-700 mb-1"
                                                    >
                                                        تاریخ تاسیس
                                                    </label>
                                                    <DatePicker
                                                        id="321"

                                                        format="YYYY/MM/DD"
                                                        value={
                                                            registerDate
                                                        }
                                                        onChange={(
                                                            date
                                                        ) => {
                                                            setRegisterDate(
                                                                date
                                                            );
                                                        }}
                                                        calendar={
                                                            persian
                                                        }
                                                        locale={
                                                            persian_fa
                                                        }

                                                        placeholder="انتخاب کنید.."
                                                        calendarPosition="bottom-right"
                                                        inputClass="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                        containerStyle={{
                                                            width: "100%",
                                                        }}
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="موسسه حسابرسی"
                                                        name={auditInst}
                                                        value={auditInst}
                                                        onChange={(event) =>
                                                            setAuditInst(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["auditInst"]}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="آخرین سرمایه ثبتی شرکت"
                                                        name={registeredCapital}
                                                        value={registeredCapital}
                                                        type="text"
                                                        onChange={(event) =>
                                                            setRegisteredCapital(addCommas(removeNonNumeric(
                                                                event.target.value))
                                                            )
                                                        }
                                                        error={errors["registeredCapital"]}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium  text-gray-700"
                                                    >
                                                        نوع شخصیت حقوقی
                                                    </label>
                                                    <FormControl fullWidth variant="standard" sx={{ m: 1 }}>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={companyType}
                                                            onChange={(event) =>
                                                                setCompanyType(
                                                                    event.target.value
                                                                )
                                                            }
                                                        >
                                                            <MenuItem value={0}>سهامی عام</MenuItem>
                                                            <MenuItem value={1}>سهامی خاص</MenuItem>
                                                            <MenuItem value={2}>مسئولیت محدود</MenuItem>
                                                            <MenuItem value={3}>تعاونی</MenuItem>
                                                            <MenuItem value={4}>تضامنی</MenuItem>

                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium  text-gray-700"
                                                    >
                                                        نوع فعالیت
                                                    </label>
                                                    <FormControl fullWidth variant="standard" sx={{ m: 1 }}>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={activityType}
                                                            onChange={(event) =>
                                                                setActivityType(
                                                                    event.target.value
                                                                )
                                                            }
                                                        >
                                                            <MenuItem value={0}>خدماتی</MenuItem>
                                                            <MenuItem value={1}>تولیدی</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium  text-gray-700"
                                                    >
                                                        وضعیت دانش بنیان
                                                    </label>
                                                    <FormControl fullWidth variant="standard" sx={{ m: 1 }}>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={daneshBonyanStatus}
                                                            onChange={(event) =>
                                                                setDaneshBonyanStatus(
                                                                    event.target.value
                                                                )
                                                            }
                                                        >
                                                            <MenuItem value={0}>ندارد</MenuItem>
                                                            <MenuItem value={1}>نوپا نوع ۱</MenuItem>
                                                            <MenuItem value={2}>نوپا نوع ۲</MenuItem>
                                                            <MenuItem value={3}> تولیدی نوع ۱</MenuItem>
                                                            <MenuItem value={4}> تولیدی نوع ۲</MenuItem>

                                                        </Select>
                                                    </FormControl>
                                                </div>

                                            </div>

                                            <div className="sm:col-span-6 border-t border-gray-300 py-5">
                                                <div className="flex justify-between">
                                                    <p>محصولات</p>
                                                    <div className="flex">
                                                        <div className="ml-2">

                                                        </div>

                                                    </div>
                                                </div>
                                                <button type="button" onClick={_ => addProduct()} className="hover:bg-gray-50 transition duration-150 shadow p-2 px-4 rounded-md text-sm flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 ml-1"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                    اضافه کردن محصول جدید
                                                </button>
                                                <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            <th className="p-2">
                                                                ردیف
                                                            </th>
                                                            <th className="text-right">
                                                                محصول
                                                            </th>
                                                            <th>
                                                                توضیحات
                                                            </th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            products.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center">
                                                                            {index + 1}
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" value={item.sharhEghdam} onChange={e => changeProduct(index, e.target.value)} className="text-sm w-full border-0 p-2" placeholder="محصول" />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" value={item.eghdamKonande} onChange={e => changeDescription(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="توضیحات" />
                                                                        </td>

                                                                        <td>
                                                                            <button type="button" onClick={_ => removeMosavabat(index)} className="hover:bg-gray-50 transition duration-150 text-sm flex items-center">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                                </svg>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="sm:col-span-6 border-t border-gray-300 py-5">
                                                <div className="flex justify-between">
                                                    <p>آخرین ترکیب سهامداری</p>
                                                    <div className="flex">
                                                        <div className="ml-2">
                                                            <InputBox
                                                                title="شماره روزنامه"
                                                                name={shareHolderNPNo}
                                                                value={shareHolderNPNo}
                                                                onChange={(event) =>
                                                                    setShareHolderNPaperNo(
                                                                        event.target.value
                                                                    )
                                                                }
                                                                error={errors["shareHolderNPNo"]}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="date"
                                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                            >
                                                                تاریخ
                                                            </label>
                                                            <DatePicker
                                                                id="321"
                                                                format="YYYY/MM/DD"
                                                                value={
                                                                    shareHolderNPDate
                                                                }
                                                                onChange={(
                                                                    date
                                                                ) => {
                                                                    setShareHolderNPDate(
                                                                        date
                                                                    );
                                                                }}
                                                                calendar={
                                                                    persian
                                                                }
                                                                locale={
                                                                    persian_fa
                                                                }

                                                                placeholder="انتخاب کنید.."
                                                                calendarPosition="bottom-right"
                                                                inputClass="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                containerStyle={{
                                                                    width: "100%",
                                                                }}
                                                            />
                                                        </div>

                                                    </div>
                                                </div>
                                                <button type="button" onClick={_ => addShareHolder()} className="hover:bg-gray-50 mb-2 mt-2 transition duration-150 shadow p-2 px-4 rounded-md text-sm flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 ml-1"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                    اضافه کردن سهامدار جدید
                                                </button>

                                                <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            <th className="p-2">
                                                                ردیف
                                                            </th>
                                                            <th className="text-right">
                                                                نام سهامدار
                                                            </th>
                                                            <th>
                                                                درصد سهام
                                                            </th>
                                                            <th>
                                                                ارزش سهام
                                                            </th>
                                                            <th>
                                                                توضیحات
                                                            </th>

                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            shareHolder.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center">
                                                                            {index + 1}
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" value={item.name} onChange={e => changeShareHoldeName(index, e.target.value)} className="text-sm w-full border-0 p-2" placeholder="نام سهامدار" />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" value={item.percent} onChange={e => changeShareHolderPercent(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="درصد سهام" />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" value={item.value} onChange={e => changeSHareHolderAmount(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="ارزش سهام" />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" value={item.description} onChange={e => changeShareHolderDescription(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="توضیحات" />
                                                                        </td>

                                                                        <td>
                                                                            <button type="button" onClick={_ => removeShareHolder(index)} className="hover:bg-gray-50 transition duration-150 text-sm flex items-center">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                                </svg>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="sm:col-span-6 border-t border-gray-300 py-5">
                                                <div className="flex justify-between ">
                                                    <p>آخرین ترکیب اعضای هیئت مدیره</p>
                                                    <div className="flex">
                                                        <div className="ml-2">
                                                            <InputBox
                                                                title="شماره روزنامه"
                                                                name={boardMemberNPNo}
                                                                value={boardMemberNPNo}
                                                                onChange={(event) =>
                                                                    setBoardMemberNPNo(
                                                                        event.target.value
                                                                    )
                                                                }
                                                                error={errors["boardMemberNPNo"]}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                htmlFor="date"
                                                                className="block text-sm font-medium text-gray-700 mb-1"
                                                            >
                                                                تاریخ
                                                            </label>
                                                            <DatePicker
                                                                id="321"

                                                                format="YYYY/MM/DD"
                                                                value={
                                                                    boardMemberNPDate
                                                                }
                                                                onChange={(
                                                                    date
                                                                ) => {
                                                                    setBoardMemberNPDate(
                                                                        date
                                                                    );
                                                                }}
                                                                calendar={
                                                                    persian
                                                                }
                                                                locale={
                                                                    persian_fa
                                                                }

                                                                placeholder="انتخاب کنید.."
                                                                calendarPosition="bottom-right"
                                                                inputClass="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                containerStyle={{
                                                                    width: "100%",
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={_ => addBoard()} className="hover:bg-gray-50 mt-2 mb-2 transition duration-150 shadow p-2 px-4 rounded-md text-sm flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 ml-1"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                    اضافه کردن عضو جدید
                                                </button>
                                                <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            <th className="p-2">
                                                                ردیف
                                                            </th>
                                                            <th className="text-right">
                                                                نام و نام خانوادگی
                                                            </th>
                                                            <th>
                                                                سمت
                                                            </th>
                                                            <th>
                                                                امضای مجاز
                                                            </th>
                                                            <th>
                                                                توضیحات
                                                            </th>

                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            board.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center">
                                                                            {index + 1}
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" value={item.sharhEghdam} onChange={e => changeBoardName(index, e.target.value)} className="text-sm w-full border-0 p-2" placeholder="نام و نام خانوادگی" />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" value={item.eghdamKonande} onChange={e => changeBoardPosition(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="سمت" />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" value={item.eghdamKonande} onChange={e => changeBoardSign(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="امضای مجاز" />
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" value={item.eghdamKonande} onChange={e => changeBoardDescription(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="توضیحات" />
                                                                        </td>
                                                                        <td>
                                                                            <button type="button" onClick={_ => removeBoard(index)} className="hover:bg-gray-50 transition duration-150 text-sm flex items-center">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                                </svg>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 border-t border-gray-300 py-5">
                                                <div className="sm:col-span-4">
                                                    <label
                                                        htmlFor="cover-photo"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        آپلود لوگو شرکت
                                                    </label>
                                                    {avatar == "" ? (
                                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                            <div className="space-y-1 text-center">
                                                                <svg
                                                                    className="mx-auto h-12 w-12 text-gray-400"
                                                                    stroke="currentColor"
                                                                    fill="none"
                                                                    viewBox="0 0 48 48"
                                                                    aria-hidden="true"
                                                                >
                                                                    <path
                                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <div className="flex text-sm text-gray-600">
                                                                    <label
                                                                        htmlFor="file-upload"
                                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
                                                                    >
                                                                        <span>
                                                                            آپلود
                                                                            تصویر
                                                                        </span>
                                                                        <input
                                                                            id="file-upload"
                                                                            name="file-upload"
                                                                            type="file"
                                                                            className="sr-only"
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                uploadChange(
                                                                                    e
                                                                                );
                                                                            }}
                                                                        />
                                                                    </label>
                                                                    <p className="pr-1">
                                                                        یا تصویر را
                                                                        اینجا بکشید
                                                                    </p>
                                                                </div>
                                                                <p className="text-xs text-gray-500">
                                                                    PNG, JPG, GIF
                                                                    کمتر از ۱۰
                                                                    مگابایت
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Image
                                                            loader={myLoader}
                                                            src={avatar}
                                                            alt="تصویر لوگو"
                                                            width={250}
                                                            height={250}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:col-span-6 mb-2">
                                                {/* <p className="text-sm text-red-500 ">
                                                    تکمیل تمامی فیلدهای ستاره
                                                    دار (*) اجباری است.
                                                </p> */}
                                            </div>
                                            {errors["master"] ? (
                                                <span className="text-sm text-red-500">
                                                    {
                                                        errors[
                                                        "master"
                                                        ]
                                                    }
                                                </span>
                                            ) : null}
                                            <div className="pt-5 border-t">
                                                <div className="flex justify-end">
                                                    <button
                                                        type="submit"
                                                        className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                                                    >
                                                        ثبت
                                                    </button>
                                                    <Link
                                                        href={{
                                                            pathname: "/companies",
                                                        }}
                                                    >
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
                                    </div>
                                </form>
                            </div>
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
                    </main> : <Forbidden />}
            </div>
        </div>
    );
}
