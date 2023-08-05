import SidebarDesktop from "../../components/layout/sidebarDesktop";
import SidebarMobile from "../../components/layout/sidebarMobile";
import StickyHeader from "../../components/layout/stickyHeader";
import InputBox from "../../components/forms/inputBox";
import navigationList from "../../components/layout/navigationList";
import { useAuth } from "../../hooks/auth";
import TextField from "@mui/material/TextField";
import { useState, useEffect, forwardRef } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "../../lib/axios";
import { loadImageFromServer } from "../../lib/helper";
import Image from "next/image";
import Link from "next/link";
import AuthValidationErrors from "../../components/validations/AuthValidationErrors";
import Forbidden from "../../components/forms/forbidden";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
import { XIcon } from "@heroicons/react/outline";
const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
const roleOptions = [
    { value: "1", label: "انتخاب کنید.." },
    { value: "1", label: "مدیر کل" },
    { value: "2", label: "مدیر سیستم" },
    { value: "3", label: "کاربر عادی" },
];
const marriageStatusTypeMethods = [
    { id: "0", title: "متاهل" },
    { id: "1", title: "مجرد" },
];
const genderTypeMethods = [
    { id: "0", title: "زن" },
    { id: "1", title: "مرد" },
];
const educations = [
    { id: "0", title: "زیر‌ دیپلم" },
    { id: "1", title: "دیپلم" },
    { id: "2", title: "فوق دیپلم" },
    { id: "3", title: "کارشناسی" },
    { id: "4", title: "کارشناسی ارشد" },
    { id: "5", title: "دکتری" },
];
const contractTypes = [
    { id: "0", title: "دائم" },
    { id: "1", title: "موقت" },
    { id: "2", title: "معین" },
];
const tabs = [
    { name: "اطلاعات کارمند", href: "/users/addInformation", current: true },
];


export default function AddUser() {

    const [gender, setGender] = useState("");
    const [marriageStatus, setMarriageStatus] = useState(-1);
    const [ncode, setNcode] = useState("");
    const [name, setName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [errors, setErrors] = useState([]);
    const [family, setFamily] = useState("");
    const [birthdate, setBirthDate] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [entryDate, setEntryDate] = useState("");
    const [posts, setPosts] = useState([]);
    const [query, setQuery] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [selectedPost, setSelectedPost] = useState();
    const [departments, setDepartments] = useState([]);
    const [companys, setCompanys] = useState([]);
    const [departmentsQuery, setDepartmentsQuery] = useState("");
    const [role, setRole] = useState("");
    const [roleQuery, setRoleQuery] = useState("");
    const [selectedRole, setselectedRole] = useState();
    const [selectedEducation, setselectedEducation] = useState();
    const [educationQuery, setEducationQuery] = useState("");
    const [loadingRoleData, setLoadingRoleData] = useState(true);
    const [companysQuery, setCompanysQuery] = useState("");
    const [loadingDepartmentData, setLoadingDepartmentData] = useState(true);
    const [loadingCompanyData, setLoadingCompanyData] = useState(true);
    const [selectedDepartment, setselectedDepartment] = useState();
    const [selectedCompany, setselectedCompany] = useState();
    const [resume, setResume] = useState("");
    const [personelCode, setPersonelCode] = useState();
    const [signature, setSignature] = useState("");
    const [avatar, setAvatar] = useState("");
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [superAdmin, setSuperAdmin] = useState();
    const [open, setOpen] = useState(false);
    const [isHolding, setIsHolding] = useState(false);
    const [sendingForm, setSendingForm] = useState(false);
    const [contractQuery, setContractQuery] = useState("");
    const [selectedContractType, setSelectedContractType] = useState();

    const handleToClose = (event, reason) => {
        window.location.assign("/users");
    };

    const myLoader = ({ src, width, quality }) => {
        return loadImageFromServer(`${src}?w=${width}&q=${quality || 75}`);
    };

    const uploadChange = (event, file) => {
        try {
            const fileUpload = axios({
                method: "post",
                url: "/api/v1/file/upload",
                data: { attach: event.target.files[0], type: file },
                headers: { "Content-Type": "multipart/form-data" },
            }).then(function (response) {
                file == "resume"
                    ? setResume(response.data.data.file_path)
                    : setSignature(response.data.data.file_path);
            }).catch((err) => {
                setUploading(false);
                var object = {};
                object['upload'] = 'خطا در آپلود فایل';
                setErrors(object);
            });
        } catch (error) { }
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

    const deleteFile = (value, file) => {
        axios.delete(`/api/v1/file/delete`, {
            data: {
                file_uuid: value,
                type: "docs",
            },
        });
        file == "resume" ? setResume("") : setSignature("");
    };

    useEffect(() => {
        async function getData() {
            await axios.get("api/v1/company/post/list").then((response) => {
                setPosts(response.data.data);
                setLoadingData(false);
            });
        }
        if (loadingData) {
            getData();
        }
    }, []);

    const filteredContractType =
    contractQuery === ""
        ? contractTypes
        : contractTypes.filter((contract) => {
            return contract.title.includes(
                contractQuery.toLowerCase()
            );
        });

    const filteredPosts =
        query === ""
            ? posts
            : posts.filter((post) => {
                return post.title.includes(query.toLowerCase());
            });

    const onSubmit = async (event) => {
        event.preventDefault();
        setSendingForm(true);
        var object = {};
        var hasError = false;
        if (!name) {
            object['first_name'] = 'نام الزامی است';
            hasError = true;
        }
        if (!family) {
            object['last_name'] = 'نام خانوادگی الزامی است';
            hasError = true;
        }
        if (!ncode) {
            object['national_code'] = 'کد ملی الزامی است';
            hasError = true;
        }
        if (!selectedDepartment && !isHolding) {
            object['department'] = 'انتخاب واحد الزامی است';
            hasError = true;
        }
        if (!selectedRole) {
            object['role'] = 'انتخاب دسترسی الزامی است';
            hasError = true;
        }
        if (!telephone) {
            object['telephne'] = 'شماره موبایل الزامی است';
            hasError = true;
        }
        if (!selectedPost && !isHolding) {
            object['post'] = 'انتخاب سمت الزامی است';
            hasError = true;
        }

        if (hasError) {
            setSendingForm(false);
            setErrors(object);
            return;
        }


        const UserFormData = new FormData();
        UserFormData.append("first_name", name);
        UserFormData.append("last_name", family);
        UserFormData.append("national_code", ncode);
        UserFormData.append("father_name", fatherName);
        UserFormData.append("birthday", birthdate.unix);
        UserFormData.append("mobile", telephone);
        UserFormData.append("marriage_status", marriageStatus);
        UserFormData.append("gender", gender);
        UserFormData.append("personel_code", personelCode ? personelCode : "");
        UserFormData.append("education", selectedEducation ? selectedEducation.title : "");

        UserFormData.append("post_uuid", selectedPost ? selectedPost.map(({ uuid }) => uuid) : "");
        UserFormData.append(
            "department_uuid",
            selectedDepartment ? selectedDepartment.uuid : ""
        );
        UserFormData.append(
            "company_uuid",
            selectedCompany ? selectedCompany.uuid : ""
        );
        UserFormData.append(
            "role_uuid",
            selectedRole ? selectedRole.uuid : ""
        );
        UserFormData.append(
            "contract_type",
            selectedContractType ? selectedContractType.title : ""
        ),
        UserFormData.append("email", email);
        UserFormData.append("avatar", avatar);
        UserFormData.append("entry_date", entryDate.unix);
        UserFormData.append("resume", resume);
        UserFormData.append("signature", signature);
        if (superAdmin) {
            if (selectedCompany == null) {
                setSendingForm(false);
                const err = { "company": ['انتخاب شرکت الزامی است'] }
                setErrors(err)
                return
            }
        }
        try {

            const response = await axios({
                method: "post",
                url: "/api/v1/user/register_all",
                data: UserFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {
                setOpen(true);
            }
        } catch (error) {
            setSendingForm(false);
            setErrors(error.response.data.message);
        }

    };

    useEffect(() => {
        async function getDepartmentData() {
            await axios
                .get("api/v1/company/department/list")
                .then((response) => {
                    setDepartments(response.data.data);
                    setLoadingDepartmentData(false);
                });
        }
        if (loadingDepartmentData) {
            getDepartmentData();
        }
    }, []);

    useEffect(() => {
        async function getRoleData() {
            await axios
                .get("api/v1/user/role/list")
                .then((response) => {
                    setRole(response.data.data);
                    setLoadingRoleData(false);
                });
        }
        if (loadingRoleData) {
            getRoleData();
        }
    }, []);

    useEffect(() => {
        async function getCompanyData() {
            await axios
                .get("api/v1/company/list")
                .then((response) => {
                    setCompanys(response.data.data);
                    setLoadingCompanyData(false);
                });
        }
        if (loadingCompanyData) {
            getCompanyData();
        }
    }, []);

    const filteredEducation =
        educationQuery === ""
            ? educations
            : educations.filter((education) => {
                return education.title.includes(
                    educationQuery.toLowerCase()
                );
            });

    const filteredRole =
        roleQuery === ""
            ? role
            : role.filter((role) => {
                return role.title.includes(
                    roleQuery.toLowerCase()
                );
            });

    const filteredDepartments =
        departmentsQuery === ""
            ? departments
            : departments.filter((department) => {
                return department.title.includes(
                    departmentsQuery.toLowerCase()
                );
            });

    const filteredCompanys =
        companysQuery === ""
            ? companys
            : companys.filter((company) => {
                return company.title.includes(
                    companysQuery.toLowerCase()
                );
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
            <SidebarMobile menu={navigationList()} loc={"/users"} />
            <SidebarDesktop menu={navigationList()} loc={"/users"}
                setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
                setActions={(props) => setCurrentUserActions(props.currentUserActions)}
                setIsHolding={(props) => setIsHolding(props.isHolding)}
                setSuperUser={(props) => setSuperAdmin(props.superAdmin)} />
            <div className="md:pr-52 flex flex-col flex-1">
                <StickyHeader />
                {!currentUserActions ? null : CheckIfAccessToPage(window.location.pathname) ?
                    <main>
                        <div className="py-6">
                            <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                                <div className="border-b border-gray-200">
                                    <div className="sm:flex sm:items-baseline">
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
                                    onSubmit={onSubmit}
                                    className="space-y-8 divide-y divide-gray-200"
                                >
                                    <div className="space-y-8 divide-y divide-gray-200">
                                        <div>
                                            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="نام *"
                                                        name={name}
                                                        value={name}
                                                        onChange={(event) =>
                                                            setName(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["first_name"]}
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="نام خانوادگی *"
                                                        name={family}
                                                        value={family}
                                                        onChange={(event) =>
                                                            setFamily(
                                                                event.target.value
                                                            )
                                                        }
                                                        error={errors["last_name"]}
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="کد ملی *"
                                                        name={ncode}
                                                        value={ncode}
                                                        onChange={(event) =>
                                                            setNcode(
                                                                event.target.value.slice(0, 10)
                                                            )
                                                        }
                                                        error={
                                                            errors["national_code"]
                                                        }
                                                        type="number"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <p
                                                        htmlFor="cover-photo"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        جنسیت
                                                    </p>
                                                    <fieldset className="mt-4">
                                                        <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-1">
                                                            {genderTypeMethods.map(
                                                                (
                                                                    genderTypeMethods
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            `genderStatusTypeMethods${genderTypeMethods.id}`
                                                                        }
                                                                        className="flex items-center"
                                                                    >
                                                                        <label
                                                                            htmlFor={
                                                                                `genderStatusTypeMethods${genderTypeMethods.id}`
                                                                            }
                                                                            className="ml-3 block text-sm font-medium text-gray-700"
                                                                        >
                                                                            <input
                                                                                id={
                                                                                    genderTypeMethods.id
                                                                                }
                                                                                name="GenderStatusMethod"
                                                                                type="radio"
                                                                                className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    setGender(
                                                                                        e
                                                                                            .target
                                                                                            .id
                                                                                    );
                                                                                }}
                                                                            />
                                                                            {
                                                                                genderTypeMethods.title
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="col-span-2"> {/*typeMethod */}
                                                    <p
                                                        htmlFor="cover-photo"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        وضعیت تاهل
                                                    </p>
                                                    <fieldset className="mt-4">
                                                        <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-1">
                                                            {marriageStatusTypeMethods.map(
                                                                (
                                                                    marriageStatusTypeMethods
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            `marriageStatusTypeMethods${marriageStatusTypeMethods.id}`}
                                                                        className="flex items-center"
                                                                    >
                                                                        <label
                                                                            htmlFor={
                                                                                `marriageStatusTypeMethods${marriageStatusTypeMethods.id}`}
                                                                            className="ml-3 block text-sm font-medium text-gray-700"
                                                                        >
                                                                            <input
                                                                                id={marriageStatusTypeMethods.id}
                                                                                name="marriageMethod"
                                                                                type="radio"
                                                                                className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    setMarriageStatus(
                                                                                        e
                                                                                            .target
                                                                                            .id
                                                                                    );
                                                                                }}
                                                                            />
                                                                            {
                                                                                marriageStatusTypeMethods.title
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="نام پدر "
                                                        name={fatherName}
                                                        value={fatherName}
                                                        onChange={(event) =>
                                                            setFatherName(
                                                                event.target.value
                                                            )
                                                        }
                                                        // error={errors["ncode"]}
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="date"
                                                        className="block text-sm font-medium  text-gray-700 mb-1"
                                                    >
                                                        تاریخ تولد
                                                    </label>
                                                    <DatePicker
                                                        format="YYYY/MM/DD"
                                                        value={birthdate}
                                                        onChange={(dateObject) => {
                                                            setBirthDate(
                                                                dateObject
                                                            );
                                                        }}
                                                        calendar={persian}
                                                        locale={persian_fa}
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
                                                        title="شماره موبایل *"
                                                        name={telephone}
                                                        value={telephone}
                                                        onChange={(event) =>
                                                            setTelephone(
                                                                p2e(event.target.value).slice(0, 11)
                                                            )
                                                        }
                                                        error={errors["telephne"]}
                                                        type="number"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium  text-gray-700"
                                                    >
                                                        انتخاب مدرک تحصیلی
                                                    </label>
                                                    <Autocomplete
                                                        id="tags-standard"
                                                        className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                        options={
                                                            filteredEducation
                                                        }
                                                        noOptionsText="یافت نشد!"
                                                        onChange={(
                                                            event,
                                                            newValue
                                                        ) => {
                                                            setselectedEducation(
                                                                newValue
                                                            );
                                                        }}
                                                        getOptionLabel={(
                                                            education
                                                        ) => education.title}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                {...params}
                                                                variant="standard"
                                                                placeholder="افزودن .."
                                                                onChange={(event) =>
                                                                    setEducationQuery(
                                                                        event.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    />
                                                    {errors["education"] ? (
                                                        <span className="text-sm text-red-500">
                                                            {
                                                                errors[
                                                                "education"
                                                                ]
                                                            }
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <InputBox
                                                        title="آدرس ایمیل سازمانی "
                                                        name={email}
                                                        value={email}
                                                        onChange={(event) =>
                                                            setEmail(
                                                                event.target.value
                                                            )
                                                        }
                                                        // error={errors["ncode"]}
                                                        type="email"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                {superAdmin ?
                                                    <div className="sm:col-span-2">
                                                        <label
                                                            htmlFor="email"
                                                            className="block text-sm font-medium  text-gray-700"
                                                        >
                                                            انتخاب سازمان
                                                        </label>
                                                        <Autocomplete
                                                            id="tags-standard"
                                                            className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                            options={
                                                                filteredCompanys
                                                            }
                                                            noOptionsText="یافت نشد!"
                                                            onChange={(
                                                                event,
                                                                newValue
                                                            ) => {
                                                                setselectedCompany(
                                                                    newValue
                                                                );
                                                            }}
                                                            getOptionLabel={(
                                                                company
                                                            ) => company.title}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                    {...params}
                                                                    variant="standard"
                                                                    placeholder="افزودن .."
                                                                    onChange={(event) =>
                                                                        setCompanysQuery(
                                                                            event.target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        />
                                                        {errors["company"] ? (
                                                            <span className="text-sm text-red-500">
                                                                {
                                                                    errors[
                                                                    "company"
                                                                    ]
                                                                }
                                                            </span>
                                                        ) : null}
                                                    </div> : null}
                                                {superAdmin == 0 ?
                                                    <div className="sm:col-span-2">
                                                        <label
                                                            htmlFor="date"
                                                            className="block text-sm font-medium  text-gray-700 mb-1"
                                                        >
                                                            تاریخ ورود به سازمان
                                                        </label>
                                                        <DatePicker
                                                            format="YYYY/MM/DD"
                                                            value={entryDate}
                                                            onChange={(dateObject) => {
                                                                setEntryDate(
                                                                    dateObject
                                                                );
                                                            }}
                                                            calendar={persian}
                                                            locale={persian_fa}
                                                            placeholder="انتخاب کنید.."
                                                            calendarPosition="bottom-right"
                                                            inputClass="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                            containerStyle={{
                                                                width: "100%",
                                                            }}
                                                        />
                                                    </div> : null}
                                                {superAdmin == 0 ?
                                                    <div className="sm:col-span-2">
                                                        <InputBox
                                                            title="کد پرسنلی"
                                                            name={personelCode}
                                                            value={personelCode}
                                                            onChange={(event) =>
                                                                setPersonelCode(
                                                                    event.target.value
                                                                )
                                                            }
                                                            // error={errors["ncode"]}
                                                            type="number"
                                                            isrequired="true"
                                                        />
                                                    </div> : null}
                                                {superAdmin == 0 ?
                                                    <div className="sm:col-span-2">
                                                        <label
                                                            htmlFor="email"
                                                            className="block text-sm font-medium  text-gray-700"
                                                        >
                                                            نوع قرارداد
                                                        </label>
                                                        <Autocomplete
                                                            id="tags-standard"
                                                            className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                            options={
                                                                filteredContractType
                                                            }
                                                            noOptionsText="یافت نشد!"                                                            
                                                            onChange={(
                                                                event,
                                                                newValue
                                                            ) => {
                                                                setSelectedContractType(
                                                                    newValue
                                                                );
                                                            }}
                                                            getOptionLabel={(
                                                                contractType
                                                            ) => contractType.title}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                    {...params}
                                                                    variant="standard"
                                                                    placeholder="افزودن .."
                                                                    onChange={(event) =>
                                                                        setContractQuery(
                                                                            event.target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        />
                                                        {errors["contract"] ? (
                                                            <span className="text-sm text-red-500">
                                                                {
                                                                    errors[
                                                                    "contract"
                                                                    ]
                                                                }
                                                            </span>
                                                        ) : null}
                                                    </div> : null}

                                                {superAdmin == 0 ?
                                                    <div className="sm:col-span-2">
                                                        <label
                                                            htmlFor="email"
                                                            className="block text-sm font-medium  text-gray-700"
                                                        >
                                                            انتخاب واحد *
                                                        </label>
                                                        <Autocomplete
                                                            id="tags-standard"
                                                            className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                            options={
                                                                filteredDepartments
                                                            }
                                                            noOptionsText="یافت نشد!"
                                                            onChange={(
                                                                event,
                                                                newValue
                                                            ) => {
                                                                setselectedDepartment(
                                                                    newValue
                                                                );
                                                            }}
                                                            getOptionLabel={(
                                                                department
                                                            ) => department.title}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                    {...params}
                                                                    variant="standard"
                                                                    placeholder="افزودن .."
                                                                    onChange={(event) =>
                                                                        setDepartmentsQuery(
                                                                            event.target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        />
                                                        {errors["department"] ? (
                                                            <span className="text-sm text-red-500">
                                                                {
                                                                    errors[
                                                                    "department"
                                                                    ]
                                                                }
                                                            </span>
                                                        ) : null}
                                                    </div> : null}
                                                {superAdmin == 0 ?
                                                    <div className="sm:col-span-2">
                                                        <label
                                                            htmlFor="email"
                                                            className="block text-sm font-medium  text-gray-700"
                                                        >
                                                            سمت فعالیت *
                                                        </label>

                                                        <Autocomplete
                                                            multiple
                                                            id="tags-standard"
                                                            className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                            options={
                                                                filteredPosts
                                                            }
                                                            value={
                                                                selectedPost
                                                            }
                                                            noOptionsText="یافت نشد!"
                                                            onChange={(
                                                                event,
                                                                newValue
                                                            ) => {
                                                                setSelectedPost(
                                                                    newValue
                                                                );
                                                            }}
                                                            getOptionLabel={(
                                                                post
                                                            ) => post.title}
                                                            renderInput={(
                                                                params
                                                            ) => (
                                                                <TextField
                                                                    className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                    {...params}
                                                                    variant="standard"
                                                                    placeholder="انتخاب کنید"
                                                                    onChange={(
                                                                        event
                                                                    ) =>
                                                                        setDepartmentsQuery(
                                                                            event
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        />
                                                        {errors[
                                                            "post"
                                                        ] ? (
                                                            <span className="text-sm text-red-500">
                                                                {
                                                                    errors[
                                                                    "post"
                                                                    ]
                                                                }
                                                            </span>
                                                        ) : null}
                                                    </div> : null}

                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium  text-gray-700"
                                                    >
                                                        انتخاب دسترسی *
                                                    </label>
                                                    <Autocomplete
                                                        id="tags-standard"
                                                        className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                        options={
                                                            filteredRole
                                                        }
                                                        noOptionsText="یافت نشد!"
                                                        onChange={(
                                                            event,
                                                            newValue
                                                        ) => {
                                                            setselectedRole(
                                                                newValue
                                                            );
                                                        }}
                                                        getOptionLabel={(
                                                            role
                                                        ) => role.title}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                {...params}
                                                                variant="standard"
                                                                placeholder="افزودن .."
                                                                onChange={(event) =>
                                                                    setRoleQuery(
                                                                        event.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    />
                                                    {errors["role"] ? (
                                                        <span className="text-sm text-red-500">
                                                            {
                                                                errors[
                                                                "role"
                                                                ]
                                                            }
                                                        </span>
                                                    ) : null}
                                                </div>
                                                <div className="sm:col-span-2"/>
                                                <div className="sm:col-span-2"/>
                                                {superAdmin == 0 ?
                                                    <div className="sm:col-span-2">
                                                        <label
                                                            htmlFor="cover-photo"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            افزودن رزومه
                                                        </label>
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
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <div className=" text-sm text-gray-600">
                                                                    <label
                                                                        htmlFor="file-upload"
                                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
                                                                    >
                                                                        <span>
                                                                            آپلود فایل
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
                                                                                    e,
                                                                                    "resume"
                                                                                );
                                                                            }}
                                                                        />
                                                                    </label>

                                                                </div>
                                                                <p className="text-xs text-gray-500">
                                                                    کمتر از ۱۰ مگابایت
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {resume != "" ? (
                                                            <span className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2">
                                                                <button
                                                                    type="button"
                                                                    disabled
                                                                    className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                                >
                                                                    فایل رزومه
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        deleteFile(
                                                                            resume,
                                                                            "resume"
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
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div> : null}
                                                {superAdmin == 0 ?
                                                    <div className="sm:col-span-2">
                                                        <label
                                                            htmlFor="cover-photo"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            افزودن امضا
                                                        </label>
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
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                                <div className=" text-sm text-gray-600">
                                                                    <label
                                                                        htmlFor="file-upload3"
                                                                        className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
                                                                    >
                                                                        <span>
                                                                            آپلود فایل
                                                                        </span>
                                                                        <input
                                                                            id="file-upload3"
                                                                            name="file-upload3"
                                                                            type="file"
                                                                            className="sr-only"
                                                                            accept="image/*"
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                uploadChange(
                                                                                    e,
                                                                                    "signature"
                                                                                );
                                                                            }}
                                                                        />
                                                                    </label>
                                                                </div>
                                                                <p className="text-xs text-gray-500">
                                                                    کمتر از ۱۰ مگابایت
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {signature != "" ? (
                                                            <span className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2">
                                                                <button
                                                                    type="button"
                                                                    disabled
                                                                    className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                                >
                                                                    فایل امضا
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        deleteFile(
                                                                            signature,
                                                                            "signature"
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
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div> : null}
                                                {superAdmin == 0 ?
                                                    <div className="sm:col-span-2">
                                                        <label
                                                            htmlFor="cover-photo"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            اپلود عکس پرسنلی
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
                                                                            htmlFor="file-upload2"
                                                                            className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
                                                                        >
                                                                            <span>
                                                                                آپلود
                                                                                تصویر
                                                                            </span>
                                                                            <input
                                                                                id="file-upload2"
                                                                                name="file-upload2"
                                                                                type="file"
                                                                                className="sr-only"
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    uploadAvaterChange(
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
                                                                width={180}
                                                                height={180}
                                                            />
                                                        )}
                                                    </div> : null}
                                                <div className="sm:col-span-6">
                                                    {/* <p className="text-sm text-red-500 ">
                                                        تکمیل تمامی فیلدهای ستاره
                                                        دار (*) اجباری است.
                                                    </p> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-5">
                                        <div className="flex justify-end">

                                            <button
                                                type="submit"
                                                disabled={sendingForm}
                                                className={`ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm ${sendingForm ? " bg-gray-500 hover:bg-gray-500 " : " bg-[#43a047] hover:bg-[#2d592f] "}  focus:outline-none`}
                                            >
                                                <span>{`${sendingForm ? "در حال ثبت " : "ثبت"}`}</span>
                                            </button>
                                            <Link href="/users">
                                                <button
                                                    type="button"
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
                    </main> : <Forbidden />}
            </div>
        </div>
    );
}
