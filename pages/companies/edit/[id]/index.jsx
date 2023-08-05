import SidebarDesktop from "../../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../../components/layout/sidebarMobile";
import StickyHeader from "../../../../components/layout/stickyHeader";
import navigationList from "../../../../components/layout/navigationList";
import { useState, forwardRef, useEffect } from "react";
import { useAuth } from "../../../../hooks/auth";
import { useCompany } from "../../../../hooks/company";
import Link from "next/link";
import { useRouter } from "next/router";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Textarea from "../../../../components/forms/textarea";
import Image from "next/image";
import { loadImageFromServer } from "../../../../lib/helper";
import { loadImageFromLocal } from "../../../../lib/helper";
import { XIcon } from "@heroicons/react/outline";
import axios from "../../../../lib/axios";
import "react-loading-skeleton/dist/skeleton.css";
import Forbidden from "../../../../components/forms/forbidden";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import moment from "jalali-moment";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
moment.locale('fa');
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const myLoader = ({ src, width, quality }) => {
    return loadImageFromServer(`${src}?w=${width}&q=${quality || 75}`);
};
const myLocalLoader = ({ src, width, quality }) => {
    return loadImageFromLocal(`${src}?w=${width}&q=${quality || 75}`);
};
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function ViewUser() {
    const { asPath } = useRouter();
    const router = useRouter();
    const [companyName, setCompanyName] = useState("");
    const [telephone, setTelephone] = useState("");
    const [address, setAddress] = useState("");
    const [nationalID, setNationalID] = useState("");
    const [registrationID, setRegistrationID] = useState("");
    const [fax, setFax] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState([]);
    const [avatar, setAvatar] = useState("");
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const { getCompany, companyData, isCompanyLoading } = useCompany();
    const [shareHolderAttachements, setShareHolderAttachments] = useState([]);
    const [boardAttachements, setBoardAttachments] = useState([]);
    const [currentAddress, setCurrentAddress] = useState("");
    const [ceo, setCeo] = useState("");
    const [finYear, setFinYear] = useState("");
    const [registerDate, setRegisterDate] = useState();
    const [companyType, setCompanyType] = useState("");
    const [auditInst, setAuditInst] = useState("");
    const [subjectOfActivity, setSubjectOfActivity] = useState("");
    const [activityType, setActivityType] = useState("");
    const [daneshBonyanStatus, setDaneshBonyanStatus] = useState("");
    const [registeredCapital, setRegisteredCapital] = useState("");
    const [products, setProducts] = useState([]);
    const [shareHolder, setShareHolder] = useState([]);
    const [board, setBoard] = useState([]);
    const [banks, setBanks] = useState([]);
    const [banksList, setBanksList] = useState([]);
    const [query, setQuery] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [shareHolderNPDate, setShareHolderNPDate] = useState();
    const [shareHolderNPNo, setShareHolderNPaperNo] = useState("");
    const [boardMemberNPDate, setBoardMemberNPDate] = useState();
    const [boardMemberNPNo, setBoardMemberNPNo] = useState("");
    const [open, setOpen] = useState(false);

    const handleToClose = (event, reason) => {
        window.location.assign("/companies");
    };
    useEffect(() => {
        async function getData() {
            await axios.get("api/v1/company/bank_list").then((response) => {
                setBanksList(response.data.data);
                setLoadingData(false);
            });
        }
        if (loadingData) {
            getData();
        }
    }, []);
    const filteredBanks =
        query === ""
            ? banksList
            : banksList.filter((person) => {
                return person.title.includes(query.toLowerCase());
            });

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
        temp[index].percent = value;
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

    function addBank() {
        setBanks([...banks, { title: "", deposit: "", iban: "" }]);
    }
    function removeBank(index) {
        let temp = [...banks];
        temp.splice(index, 1);
        setBanks(temp);
    }
    function changeBankName(index, value) {
        let temp = [...banks];
        temp[index].title = value.title;
        setBanks(temp);
    }
    function changeBankDeposit(index, value) {
        let temp = [...banks];
        temp[index].deposit = value;
        setBanks(temp);
    }
    function changeBankIban(index, value) {
        let temp = [...banks];
        temp[index].iban = value;
        setBanks(temp);
    }

    const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");
    const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))

    useEffect(() => {
        if (router.isReady) {
            getCompany(router.query.id);

        }
    }, [router.isReady]);


    useEffect(() => {
        companyData.products ? setProducts(companyData.products) : setProducts([])
        companyData.board ? setBoard(companyData.board) : setBoard([])
        companyData.banks ? setBanks(companyData.banks) : setBanks([])
        companyData.share_holder ? setShareHolder(companyData.share_holder) : setShareHolder([])

        setAddress(companyData.address)
        setCeo(companyData.ceo)
        setTelephone(companyData.tel)
        setCompanyName(companyData.title)
        setNationalID(companyData.national_id)
        setRegistrationID(companyData.registration_id)
        setAvatar(companyData.logo);
        setCurrentAddress(companyData.current_address)
        setEmail(companyData.email)
        setFinYear(companyData.fin_year)
        setFax(companyData.fax)
        setAuditInst(companyData.audit_inst)
        setRegisteredCapital(companyData.registered_capital)
        setActivityType(companyData.activity_type)
        setSubjectOfActivity(companyData.subject_of_activity)
        setDaneshBonyanStatus(companyData.daneshBonyan_status)
        setCompanyType(companyData.company_type)
        setBoardAttachments(companyData.board_attachment ? companyData.board_attachment : [])
        setShareHolderAttachments(companyData.share_holder_attachment ? companyData.share_holder_attachment : [])
    }, [companyData]);

    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });
    const uploadBoardChange = (event) => {
        if (boardAttachements.length == 0) {
            try {
                const fileUpload = axios({
                    method: "post",
                    url: "/api/v1/file/upload",
                    data: { attach: event.target.files[0], type: "docs" },
                    headers: { "Content-Type": "multipart/form-data" },
                }).then(function (response) {
                    setBoardAttachments((oldArray) => [
                        ...oldArray,
                        response.data.data.file_uuid,
                    ]);
                }).catch((err) => {
                    setUploading(false);
                    var object = {};
                    object['upload'] = 'خطا در آپلود فایل';
                    setErrors(object);
                });
            } catch (error) { }
        }
    };
    const deleteBoardFile = (value, index) => {
        axios.delete(`/api/v1/file/delete`, {
            data: {
                file_uuid: boardAttachements[index],
                type: "docs",
            },
        });
        setBoardAttachments([
            ...boardAttachements.slice(0, index),
            ...boardAttachements.slice(index + 1),
        ]);
    };
    const uploadShareHolderChange = (event) => {
        if (shareHolderAttachements.length == 0) {
            try {
                const fileUpload = axios({
                    method: "post",
                    url: "/api/v1/file/upload",
                    data: { attach: event.target.files[0], type: "docs" },
                    headers: { "Content-Type": "multipart/form-data" },
                }).then(function (response) {
                    setShareHolderAttachments((oldArray) => [
                        ...oldArray,
                        response.data.data.file_uuid,
                    ]);
                }).catch((err) => {
                    setUploading(false);
                    var object = {};
                    object['upload'] = 'خطا در آپلود فایل';
                    setErrors(object);
                });
            } catch (error) { }
        }
    };
    const deleteShareHolderFile = (value, index) => {
        axios.delete(`/api/v1/file/delete`, {
            data: {
                file_uuid: shareHolderAttachements[index],
                type: "docs",
            },
        });
        setShareHolderAttachments([
            ...shareHolderAttachements.slice(0, index),
            ...shareHolderAttachements.slice(index + 1),
        ]);
    };

    const uploadAvaterChange = (event) => {
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

        // const CompanyFormData = new FormData();
        // CompanyFormData.append("uuid", companyData.uuid);
        // CompanyFormData.append("title", companyName);
        // CompanyFormData.append("address", address);
        // CompanyFormData.append("tel", telephone);
        // CompanyFormData.append("national_id", nationalID);
        // CompanyFormData.append("registration_id", registrationID);
        // CompanyFormData.append("email", email);
        // CompanyFormData.append("fax", fax);
        // CompanyFormData.append("logo", avatar);

        // try {
        //     const response = await axios({
        //         method: "post",
        //         url: "/api/v1/company/update",
        //         data: CompanyFormData,
        //         headers: { "Content-Type": "multipart/form-data" },
        //     });
        //     if (response.data.status == 200) {
        //         window.location.assign("/companies");
        //     }
        // } catch (error) {
        //     setErrors(error.response.data.message);
        // }
        axios
            .post('/api/v1/company/update',
                {
                    uuid: companyData.uuid,
                    title: companyName,
                    address: address,
                    tel: telephone,
                    national_id: nationalID,
                    registration_id: registrationID,
                    email: email,
                    fax: fax,
                    logo: avatar,
                    registration_date: registerDate ? String(registerDate.unix) : null,
                    current_address: currentAddress,
                    ceo: ceo,
                    fin_year: finYear,
                    company_type: companyType,
                    audit_inst: auditInst,
                    activity_type: activityType,
                    daneshBonyan_status: daneshBonyanStatus,
                    registered_capital: registeredCapital,
                    products: products,
                    share_holder: shareHolder,
                    board: board,
                    banks: banks,
                    share_holder_np_date: shareHolderNPDate ? String(shareHolderNPDate.unix) : null,
                    share_holder_np_no: shareHolderNPNo,
                    board_member_np_date: boardMemberNPDate ? String(boardMemberNPDate.unix) : null,
                    board_member_np_no: boardMemberNPNo,
                    board_attachment: boardAttachements.length > 0 ? boardAttachements[0] : "",
                    share_holder_attachment: shareHolderAttachements.length > 0 ? shareHolderAttachements[0] : "",
                    subject_of_activity: subjectOfActivity
                })
            .then((res) => {
                setOpen(true);
            })
            .catch((err) => {
                object['master'] = err.response.data.message;
                setErrors(object)
            }
            );
    };

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
                                <form
                                    onSubmit={onSubmit}
                                    className="space-y-8 divide-y divide-gray-200"
                                >
                                    <div className="space-y-8 divide-y divide-gray-200">
                                        <div>
                                            <div className="mt-2 mb-2 grid grid-cols-1 gap-y-5 gap-x-2 sm:grid-cols-6">
                                                <div className="sm:col-span-6">
                                                    <h2 className="text-xl">
                                                        ویرایش {" "}
                                                    </h2>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="نام شرکت *"
                                                        name={companyName}
                                                        value={companyName}
                                                        defaultValue={
                                                            companyData.title
                                                        }
                                                        onChange={(event) =>
                                                            setCompanyName(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["title"]}
                                                        type="text"
                                                        isrequired="true"
                                                        rows="1"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="شناسه ملی *"
                                                        name={nationalID}
                                                        value={nationalID}
                                                        defaultValue={
                                                            companyData.national_id
                                                        }
                                                        onChange={(event) =>
                                                            setNationalID(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={
                                                            errors["national_id"]
                                                        }
                                                        type="text"
                                                        isrequired="true"
                                                        rows="1"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="شماره ثبت *"
                                                        name={registrationID}
                                                        value={registrationID}
                                                        defaultValue={
                                                            companyData.registration_id
                                                        }
                                                        onChange={(event) =>
                                                            setRegistrationID(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={
                                                            errors[
                                                            "registration_id"
                                                            ]
                                                        }
                                                        type="text"
                                                        isrequired="true"
                                                        rows="1"
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="شماره تماس* "
                                                        name={telephone}
                                                        value={telephone}
                                                        defaultValue={
                                                            companyData.tel
                                                        }
                                                        onChange={(event) =>
                                                            setTelephone(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["telephone"]}
                                                        type="number"
                                                        isrequired="true"
                                                        rows="1"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="فکس"
                                                        name={fax}
                                                        value={fax}
                                                        defaultValue={
                                                            companyData.fax
                                                        }
                                                        onChange={(event) =>
                                                            setFax(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["fax"]}
                                                        rows="1"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="ایمیل"
                                                        name={email}
                                                        value={email}
                                                        defaultValue={
                                                            companyData.email
                                                        }
                                                        onChange={(event) =>
                                                            setEmail(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["fax"]}
                                                        rows="1"
                                                    />
                                                </div>
                                                <div className="sm:col-span-4">
                                                    <Textarea
                                                        title="آدرس ثبتی "
                                                        name={address}
                                                        value={address}
                                                        defaultValue={
                                                            companyData.address
                                                        }
                                                        onChange={(event) =>
                                                            setAddress(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["address"]}
                                                        rows="1"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="مدیر عامل"
                                                        name={ceo}
                                                        value={ceo}
                                                        defaultValue={
                                                            companyData.ceo
                                                        }
                                                        onChange={(event) =>
                                                            setCeo(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["ceo"]}
                                                        rows="1"
                                                    />
                                                </div>
                                                <div className="sm:col-span-4">
                                                    <Textarea
                                                        title="آدرس فعلی "
                                                        name={currentAddress}
                                                        value={currentAddress}
                                                        defaultValue={
                                                            companyData.current_address
                                                        }
                                                        onChange={(event) =>
                                                            setCurrentAddress(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["currentAddress"]}
                                                        rows="1"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="سال مالی"
                                                        name={finYear}
                                                        value={finYear}
                                                        defaultValue={
                                                            companyData.fin_year
                                                        }
                                                        onChange={(event) =>
                                                            setFinYear(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["finYear"]}
                                                        rows="1"
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
                                                        value=
                                                        {companyData.registration_date ?
                                                            moment
                                                                .unix(
                                                                    companyData.registration_date
                                                                )
                                                                .format(
                                                                    "YYYY/MM/DD"
                                                                ) : null
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
                                                    <Textarea
                                                        title="موسسه حسابرسی"
                                                        name={auditInst}
                                                        value={auditInst}
                                                        defaultValue={
                                                            companyData.audit_inst
                                                        }
                                                        onChange={(event) =>
                                                            setAuditInst(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["auditInst"]}
                                                        rows="1"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="آخرین سرمایه ثبتی شرکت"
                                                        name={registeredCapital}
                                                        value={registeredCapital}
                                                        defaultValue={
                                                            companyData.registered_capital
                                                        }
                                                        onChange={(event) =>
                                                            setRegisteredCapital(addCommas(removeNonNumeric(
                                                                event.target.value))
                                                            )
                                                        }
                                                        error={errors["registeredCapital"]}
                                                        rows="1"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium  text-gray-700"
                                                    >
                                                        نوع شخصیت حقوقی
                                                    </label>
                                                    <FormControl fullWidth variant="standard" sx={{ m: 1 }} >
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
                                                <div className="sm:col-span-2 ml-3">
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium  text-gray-700"
                                                    >
                                                        نوع فعالیت
                                                    </label>
                                                    <FormControl fullWidth variant="standard" sx={{ m: 1 }} >
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
                                                    <FormControl fullWidth variant="standard" sx={{ m: 1 }} >
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
                                                <div className="sm:col-span-6">
                                                    <Textarea
                                                        title="موضوع فعالیت"
                                                        name='subjectOfActivity'
                                                        value={subjectOfActivity}
                                                        defaultValue={
                                                            companyData.subject_of_activity
                                                        }
                                                        onChange={(event) =>
                                                            setSubjectOfActivity(
                                                                event.target.value
                                                            )
                                                        }
                                                        rows="1"
                                                    />
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
                                                                products ? products.map((item, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td className="text-center">
                                                                                {index + 1}
                                                                            </td>
                                                                            <td>
                                                                                <input type="text" value={item.product} onChange={e => changeProduct(index, e.target.value)} className="text-sm w-full border-0 p-2" placeholder="محصول" />
                                                                            </td>
                                                                            <td>
                                                                                <input type="text" value={item.description} onChange={e => changeDescription(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="توضیحات" />
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
                                                                }) : null
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="sm:col-span-6 border-t border-gray-300 py-5">
                                                    <div className="flex justify-between">
                                                        <p>آخرین ترکیب سهامداری</p>
                                                        <div className="flex">
                                                            <div >
                                                                <label className={`${shareHolderAttachements.length == 0 ? "hover:bg-amber-600 bg-amber-500" : "hover:bg-gray-600 bg-gray-500"}  text-white transition ml-2 mt-6 duration-150 shadow p-2 focus-within:outline-none focus-within:ring-2 px-4 rounded-md text-sm flex items-center`}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 ml-1"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                                    </svg>
                                                                    <input
                                                                        id="file-upload"
                                                                        name="file-upload"
                                                                        type="file"
                                                                        disabled={shareHolderAttachements.length == 0 ? false : true}
                                                                        className="sr-only"
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            uploadShareHolderChange(
                                                                                e
                                                                            );
                                                                        }}
                                                                    />
                                                                    فایل تصویر روزنامه
                                                                </label>
                                                                {Object.keys(shareHolderAttachements)
                                                                    .length != 0
                                                                    ? shareHolderAttachements.map(
                                                                        (file, index) => (
                                                                            <span
                                                                                key={index}
                                                                                className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                                                            >
                                                                                <button
                                                                                    type="button"
                                                                                    disabled
                                                                                    className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                                                >
                                                                                    {"فایل"}
                                                                                </button>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        deleteShareHolderFile(
                                                                                            file,
                                                                                            index
                                                                                        )
                                                                                    }
                                                                                    type="button"
                                                                                    className="-mr-px relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                                                >
                                                                                    <XIcon
                                                                                        className="-ml-1 ml-1 h-5 w-5"
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                </button>
                                                                            </span>
                                                                        )
                                                                    )
                                                                    : ""}

                                                            </div>
                                                            <div className="ml-2">
                                                                <Textarea
                                                                    title="شماره روزنامه"
                                                                    name={shareHolderNPNo}
                                                                    value={shareHolderNPNo}
                                                                    defaultValue={
                                                                        companyData.share_holder_np_no
                                                                    }
                                                                    onChange={(event) =>
                                                                        setShareHolderNPaperNo(
                                                                            event.target.value
                                                                        )
                                                                    }
                                                                    error={errors["shareHolderNPNo"]}
                                                                    rows="1"
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
                                                                    value=
                                                                    {companyData.share_holder_np_date ?
                                                                        moment
                                                                            .unix(
                                                                                companyData.share_holder_np_date
                                                                            )
                                                                            .format(
                                                                                "YYYY/MM/DD"
                                                                            ) : null
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
                                                                shareHolder ? shareHolder.map((item, index) => {
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
                                                                }) : null
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="sm:col-span-6 border-t border-gray-300 py-5">
                                                    <div className="flex justify-between ">
                                                        <p>آخرین ترکیب اعضای هیئت مدیره</p>
                                                        <div className="flex">
                                                            <div >
                                                                <label className={`${boardAttachements.length == 0 ? "hover:bg-amber-600 bg-amber-500" : "hover:bg-gray-600 bg-gray-500"}  text-white transition ml-2 mt-6 duration-150 shadow p-2 focus-within:outline-none focus-within:ring-2 px-4 rounded-md text-sm flex items-center`}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 ml-1"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                                    </svg>
                                                                    <input
                                                                        id="file-upload"
                                                                        name="file-upload"
                                                                        type="file"
                                                                        disabled={boardAttachements.length == 0 ? false : true}
                                                                        className="sr-only"
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            uploadBoardChange(
                                                                                e
                                                                            );
                                                                        }}
                                                                    />
                                                                    فایل تصویر روزنامه
                                                                </label>
                                                                {Object.keys(boardAttachements)
                                                                    .length != 0
                                                                    ? boardAttachements.map(
                                                                        (file, index) => (
                                                                            <span
                                                                                key={index}
                                                                                className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                                                            >
                                                                                <button
                                                                                    type="button"
                                                                                    disabled
                                                                                    className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                                                >
                                                                                    {"فایل"}
                                                                                </button>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        deleteBoardFile(
                                                                                            file,
                                                                                            index
                                                                                        )
                                                                                    }
                                                                                    type="button"
                                                                                    className="-mr-px relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                                                >
                                                                                    <XIcon
                                                                                        className="-ml-1 ml-1 h-5 w-5"
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                </button>
                                                                            </span>
                                                                        )
                                                                    )
                                                                    : ""}

                                                            </div>
                                                            <div className="ml-2">
                                                                <Textarea
                                                                    title="شماره روزنامه"
                                                                    name={boardMemberNPNo}
                                                                    value={boardMemberNPNo}
                                                                    defaultValue={
                                                                        companyData.board_member_np_no
                                                                    }
                                                                    onChange={(event) =>
                                                                        setBoardMemberNPNo(
                                                                            event.target.value
                                                                        )
                                                                    }
                                                                    error={errors["boardMemberNPNo"]}
                                                                    rows="1"
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
                                                                    value={companyData.board_member_np_date ?
                                                                        moment
                                                                            .unix(
                                                                                companyData.board_member_np_date
                                                                            )
                                                                            .format(
                                                                                "YYYY/MM/DD"
                                                                            ) : null
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
                                                                board ? board.map((item, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td className="text-center">
                                                                                {index + 1}
                                                                            </td>
                                                                            <td>
                                                                                <input type="text" value={item.name} onChange={e => changeBoardName(index, e.target.value)} className="text-sm w-full border-0 p-2" placeholder="نام و نام خانوادگی" />
                                                                            </td>
                                                                            <td>
                                                                                <input type="text" value={item.position} onChange={e => changeBoardPosition(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="سمت" />
                                                                            </td>
                                                                            <td>
                                                                                <input type="text" value={item.sign} onChange={e => changeBoardSign(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="امضای مجاز" />
                                                                            </td>
                                                                            <td>
                                                                                <input type="text" value={item.description} onChange={e => changeBoardDescription(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="توضیحات" />
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
                                                                }) : null
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="sm:col-span-6 border-t border-gray-300 py-5">
                                                    <div className="flex justify-between ">
                                                        <p>بانک ها</p>

                                                    </div>
                                                    <button type="button" onClick={_ => addBank()} className="hover:bg-gray-50 mt-2 mb-2 transition duration-150 shadow p-2 px-4 rounded-md text-sm flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 ml-1"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                        </svg>
                                                        اضافه کردن بانک جدید
                                                    </button>
                                                    <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                                                        <thead className="bg-gray-100">
                                                            <tr>
                                                                <th className="p-2">
                                                                    ردیف
                                                                </th>
                                                                <th className="text-right">
                                                                    نام بانک
                                                                </th>
                                                                <th>
                                                                    شماره سپرده
                                                                </th>
                                                                <th>
                                                                    شماره شبا
                                                                </th>
                                                                <th></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                banks ? banks.map((item, index) => {
                                                                    return (
                                                                        <tr key={index}>
                                                                            <td className="text-center">
                                                                                {index + 1}
                                                                            </td>
                                                                            <td>
                                                                                {item.title ?
                                                                                    <input type="text" value={item.title} className="text-sm w-full border-0 p-2" placeholder="نام بانک" /> :
                                                                                    <Autocomplete
                                                                                        id="tags-standard"
                                                                                        className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                                                        options={
                                                                                            filteredBanks
                                                                                        }
                                                                                        noOptionsText="یافت نشد!"
                                                                                        onChange={(
                                                                                            event,
                                                                                            newValue
                                                                                        ) => {
                                                                                            changeBankName(
                                                                                                index,
                                                                                                newValue
                                                                                            );
                                                                                        }}
                                                                                        getOptionLabel={(
                                                                                            person
                                                                                        ) =>
                                                                                            person.title
                                                                                        }
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
                                                                                    />}
                                                                            </td>
                                                                            <td>
                                                                                <input type="text" value={item.deposit} onChange={e => changeBankDeposit(index, p2e(e.target.value))} className="text-sm text-center w-full border-0 p-2" placeholder="شماره سپرده" />
                                                                            </td>
                                                                            <td>
                                                                                <input type="text" value={item.iban} onChange={e => changeBankIban(index, p2e(e.target.value))} className="text-sm text-center w-full border-0 p-2" placeholder="شماره شبا" />
                                                                            </td>
                                                                            <td>
                                                                                <button type="button" onClick={_ => removeBank(index)} className="hover:bg-gray-50 transition duration-150 text-sm flex items-center">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                                    </svg>
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                }) : null
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label
                                                htmlFor="avater"
                                                className={
                                                    "block text-sm font-medium mt-5 text-gray-700 mb-2"
                                                }
                                            >
                                                تصویر لوگو
                                            </label>

                                            <span className="-mr-px relative inline-flex items-center px-2 py-1  bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500">
                                                {" "}
                                                <label
                                                    htmlFor="file-upload2"
                                                    disabled
                                                >
                                                    {avatar ? (
                                                        <Image
                                                            loader={
                                                                myLoader
                                                            }
                                                            src={avatar}
                                                            alt="تصویر لوگو"
                                                            width={200}
                                                            height={200}
                                                        />
                                                    ) : (
                                                        <Image
                                                            loader={
                                                                myLocalLoader
                                                            }
                                                            src="noImage.png"
                                                            alt="تصویر امضا"
                                                            width={200}
                                                            height={200}
                                                        />)}
                                                    <input
                                                        id="file-upload2"
                                                        name="file-upload2"
                                                        type="file"
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={(e) => {
                                                            uploadAvaterChange(
                                                                e
                                                            );
                                                        }}
                                                    />
                                                </label>
                                            </span>
                                        </div>

                                    </div>

                                    <div className="pt-5">
                                        <div className="flex justify-end">

                                            <button
                                                type="submit"
                                                className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                                            >
                                                ثبت
                                            </button>
                                            <Link href="/companies">
                                                <button
                                                    type="button "
                                                    className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                                                >
                                                    انصراف
                                                </button>
                                            </Link>
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
                    </main> : <Forbidden />
                }
            </div >
        </div >
    );
}
