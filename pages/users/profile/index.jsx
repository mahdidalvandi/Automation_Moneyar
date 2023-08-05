import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import { useState, useRef, useEffect, forwardRef } from "react";
import { useAuth } from "../../../hooks/auth";
import { useProfile } from "../../../hooks/profile";
import Link from "next/link";
import { useRouter } from "next/router";
import { Editor } from "@tinymce/tinymce-react";
import Textarea from "../../../components/forms/textarea";
import Image from "next/image";
import { loadImageFromServer } from "../../../lib/helper";
import { loadImageFromLocal } from "../../../lib/helper";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "../../../lib/axios";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import moment from "jalali-moment";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Resizer from "react-image-file-resizer";

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const myLoader = ({ src, width, quality }) => {
    return loadImageFromServer(`${src}?w=${width}&q=${quality || 75}`);
};
const myLocalLoader = ({ src, width, quality }) => {
    return loadImageFromLocal(`${src}?w=${width}&q=${quality || 75}`);
};
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
const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
export default function ViewUser() {

    const editorRef = useRef(null);
    const [gender, setGender] = useState("");
    const [marriageStatus, setMarriageStatus] = useState(-1);
    const [selectedEducation, setselectedEducation] = useState();
    const [educationQuery, setEducationQuery] = useState("");
    const { asPath } = useRouter();
    const [ncode, setNcode] = useState("");
    const [name, setName] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [errors, setErrors] = useState([]);
    const [family, setFamily] = useState("");
    const [birthdate, setBirthDate] = useState("");
    const [telephone, setTelephone] = useState();
    const [email, setEmail] = useState("");
    const [gmail, setGmail] = useState("");
    const [entryDate, setEntryDate] = useState("");
    const [posts, setPosts] = useState([]);
    const [query, setQuery] = useState("");
    const [loadingData, setLoadingData] = useState(true);
    const [selectedPost, setSelectedPost] = useState();
    const [companies, setCompanies] = useState([]);
    const [companiesQuery, setCompaniesQuery] = useState("");
    const [loadingCompanyData, setLoadingCompanyData] = useState(true);
    const [selectedCompany, setselectedCompany] = useState();
    const [departments, setDepartments] = useState([]);
    const [departmentsQuery, setDepartmentsQuery] = useState("");
    const [loadingDepartmentData, setLoadingDepartmentData] = useState(true);
    const [selectedDepartment, setselectedDepartment] = useState();
    const [resume, setResume] = useState("");
    const [signature, setSignature] = useState("");
    const [avatar, setAvatar] = useState("");
    const [role, setRole] = useState("");
    const [roleQuery, setRoleQuery] = useState("");
    const [selectedRole, setselectedRole] = useState();
    const [loadingRoleData, setLoadingRoleData] = useState(true);
    const router = useRouter();
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [open, setOpen] = useState(false);
    const [cartableSignature, setCartableSignature] = useState();


    const handleToClose = (event, reason) => {
        window.location.href = "/dashboard";
    };

    useEffect(() => {
        getProfile();
    }, []);
    const { getProfile, profileData, isProfileLoading } = useProfile();

    useEffect(() => {
        setselectedDepartment(profileData.department);
        setAvatar(profileData.avatar);
        setSignature(profileData.signature);
        setResume(profileData.resume);
        setTelephone(profileData.mobile);
        setBirthDate(profileData.birthdate);
        setFatherName(profileData.father_name);
        setSelectedPost(profileData.post_array);
        setselectedRole(profileData.role)
        setCartableSignature(profileData.cartable_signature)
    }, [profileData]);

    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });

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

    const uploadSignatureChange = (event) => {
        try {
            const fileUpload = axios({
                method: "post",
                url: "/api/v1/file/upload",
                data: { attach: event.target.files[0], type: "signature" },
                headers: { "Content-Type": "multipart/form-data" },
            }).then(function (response) {
                setSignature(response.data.data.file_path);
            }).catch((err) => {
                setUploading(false);
                var object = {};
                object['upload'] = 'خطا در آپلود فایل';
                setErrors(object);
            });
        } catch (error) { }
    };
    const uploadResumeChange = (event) => {
        try {
            const fileUpload = axios({
                method: "post",
                url: "/api/v1/file/upload",
                data: { attach: event.target.files[0], type: "resume" },
                headers: { "Content-Type": "multipart/form-data" },
            }).then(function (response) {
                setResume(response.data.data.file_path);
            }).catch((err) => {
                setUploading(false);
                var object = {};
                object['upload'] = 'خطا در آپلود فایل';
                setErrors(object);
            });
        } catch (error) { }
    };

    const TSBirthDate = moment(profileData.birthday, "jYYYY-jMM-jDD");
    const TSEntryDate = moment(profileData.entry_date, "jYYYY-jMM-jDD");

    const onSubmit = async (event) => {
        event.preventDefault();
        const UserFormData = new FormData();
        UserFormData.append("uuid", profileData.uuid),
            UserFormData.append(
                "first_name",
                name != "" ? name : profileData.first_name
            ),
            UserFormData.append(
                "last_name",
                family != "" ? family : profileData.last_name
            ),
            UserFormData.append(
                "marriage_status",
                marriageStatus !== -1 ? marriageStatus : ""
            ),
            UserFormData.append(
                "gender",
                gender != "" ? gender : ""
            ),
            UserFormData.append(
                "education",
                selectedEducation ? selectedEducation.title : ""
            ),
            UserFormData.append(
                "national_code",
                ncode != "" ? ncode : profileData.national_code
            ),
            UserFormData.append("father_name", fatherName),
            UserFormData.append("birthday", birthdate ? birthdate.unix : null),
            UserFormData.append("mobile", telephone),
            UserFormData.append(
                "post_uuid",
                selectedPost != "" ? selectedPost.map(({ uuid }) => uuid) : ""
            ),
            UserFormData.append(
                "department_uuid",
                selectedDepartment
                    ? selectedDepartment.uuid
                    : profileData.department_uuid
            ),
            selectedRole ?
                UserFormData.append(
                    "role_uuid",
                    selectedRole
                        ? selectedRole.uuid
                        : null
                ) : null
        UserFormData.append("email", email != "" ? email : profileData.email);
        UserFormData.append("gmail", gmail != "" ? gmail : profileData.gmail);
        UserFormData.append("avatar", avatar != "" ? avatar : profileData.avatar);
        UserFormData.append(
            "entry_date",
            entryDate != "" ? entryDate.unix : null
        ),
            UserFormData.append(
                "resume",
                resume != "" ? resume : profileData.resume
            );
        UserFormData.append(
            "signature",
            signature != "" ? signature : profileData.signature
        );
        UserFormData.append(
            "cartable_signature",
            editorRef.current.getContent() != null
                ? editorRef.current.getContent()
                : ""
        );

        try {
            const response = await axios({
                method: "post",
                url: "/api/v1/user/profile/update",
                data: UserFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {
                setOpen(true);
            }
        } catch (error) {
            setErrors(error.response.data.message);
        }
    };

    useEffect(() => {
        async function getCompanyData() {
            await axios.get("api/v1/company/list").then((response) => {
                setCompanies(response.data.data);
                setLoadingCompanyData(false);
            });
        }
        if (loadingCompanyData) {
            getCompanyData();
        }
    }, []);

    const filteredCompanies =
        companiesQuery === ""
            ? companies
            : companies.filter((company) => {
                return company.title.includes(companiesQuery.toLowerCase());
            });

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
    const filteredEducation =
        educationQuery === ""
            ? educations
            : educations.filter((education) => {
                return education.title.includes(
                    educationQuery.toLowerCase()
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
    const filteredRole =
        roleQuery === ""
            ? role
            : departments.filter((role) => {
                return role.title.includes(
                    roleQuery.toLowerCase()
                );
            });

    const filteredPosts =
        query === ""
            ? posts
            : posts.filter((post) => {
                return post.title.includes(query.toLowerCase());
            });

    if (isLoading || !user) {
        return null;
    }
    // function CheckIfAccess(val) {
    //     if (currentUserRole && currentUserRole.indexOf(val) > -1) return true;
    //     return false;
    // }
    // function CheckIfAccessToPage(val) {
    //     if (currentUserActions && currentUserActions.indexOf(val) > -1) return true;
    //     return false;
    // }
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
                {/* {!currentUserActions ? null : CheckIfAccessToPage(`/${window.location.pathname.split("/")[1]}/${window.location.pathname.split("/")[2]}`) ? */}
                <main>
                    <div className="py-6">
                        {isProfileLoading ? null : (
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
                                                        ویرایش کاربر{" "}
                                                        {profileData.title}
                                                    </h2>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="نام *"
                                                        name={name}
                                                        rows="1"
                                                        defaultValue={
                                                            profileData.first_name
                                                        }
                                                        onChange={(event) =>
                                                            setName(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                        error={
                                                            errors["first_name"]
                                                        }
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="نام خانوادگی *"
                                                        name={family}
                                                        rows="1"
                                                        defaultValue={
                                                            profileData.last_name
                                                        }
                                                        onChange={(event) =>
                                                            setFamily(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                        error={
                                                            errors["last_name"]
                                                        }
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="نام پدر"
                                                        name={fatherName}
                                                        rows="1"
                                                        defaultValue={
                                                            profileData.father_name && profileData.fatherName != "null"
                                                                ? profileData.father_name
                                                                : ""
                                                        }
                                                        onChange={(event) =>
                                                            setFatherName(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                        error={
                                                            errors[
                                                            "father_name"
                                                            ]
                                                        }
                                                        type="text"
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
                                                                                defaultChecked={profileData ? profileData.gender === genderTypeMethods.id : false}
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
                                                                                defaultChecked={profileData ? profileData.marriage_status === marriageStatusTypeMethods.id : false}
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
                                                    <Textarea
                                                        title="کد ملی"
                                                        name={ncode}
                                                        rows="1"
                                                        readOnly="true"
                                                        defaultValue={
                                                            profileData.national_code
                                                                ? profileData.national_code
                                                                : ""
                                                        }
                                                        onChange={(event) =>
                                                            setNcode(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                        error={
                                                            errors[
                                                            "national_code"
                                                            ]
                                                        }
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
                                                        value={
                                                            profileData.birthday
                                                        }
                                                        onChange={(
                                                            dateObject
                                                        ) => {
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
                                                    <Textarea
                                                        title="شماره موبایل"
                                                        name={telephone}
                                                        rows="1"
                                                        defaultValue={
                                                            profileData.mobile && profileData.mobile != "null"
                                                                ? profileData.mobile
                                                                : ""
                                                        }
                                                        onChange={(event) =>
                                                            setTelephone(
                                                                p2e(event.target
                                                                    .value)
                                                            )
                                                        }
                                                        error={
                                                            errors["birthday"]
                                                        }
                                                        type="text"
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
                                                        defaultValue={{
                                                            title:
                                                                profileData.education ??
                                                                "",
                                                            id:

                                                                "",
                                                        }}
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
                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="آدرس ایمیل سازمانی"
                                                        name={email}
                                                        rows="1"
                                                        defaultValue={
                                                            profileData.email && profileData.email != "null"
                                                                ? profileData.email
                                                                : ""
                                                        }
                                                        onChange={(event) =>
                                                            setEmail(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                        error={errors["email"]}
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <Textarea
                                                        title="آدرس جیمیل (برای دریافت تقویم جلسات)"
                                                        name={gmail}
                                                        rows="1"
                                                        defaultValue={
                                                            profileData.gmail && profileData.gmail != "null"
                                                                ? profileData.gmail
                                                                : ""
                                                        }
                                                        onChange={(event) =>
                                                            setGmail(
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                        error={errors["gmail"]}
                                                        type="text"
                                                        isrequired="true"
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <div className="sm:col-span-3">
                                                        <label
                                                            htmlFor="email"
                                                            className="block text-sm font-medium  text-gray-700"
                                                        >
                                                            انتخاب شرکت
                                                        </label>

                                                        <>
                                                            {profileData.company_name ==
                                                                undefined ? (
                                                                <SkeletonTheme
                                                                    highlightColor="#fb923c"
                                                                    height={20}
                                                                >
                                                                    <p>
                                                                        <Skeleton
                                                                            count={
                                                                                1
                                                                            }
                                                                        />
                                                                    </p>
                                                                </SkeletonTheme>
                                                            ) : (
                                                                <Autocomplete
                                                                    disabled
                                                                    id="tags-standard"
                                                                    className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                                    options={
                                                                        filteredCompanies
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
                                                                    defaultValue={{
                                                                        title: profileData.company_name,
                                                                        uuid: profileData.company_uuid,
                                                                    }}
                                                                    getOptionLabel={(
                                                                        company
                                                                    ) =>
                                                                        company.title
                                                                    }
                                                                    renderInput={(
                                                                        params
                                                                    ) => (
                                                                        <TextField
                                                                            className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                            {...params}
                                                                            variant="standard"
                                                                            placeholder="افزودن .."
                                                                            defaultValue={
                                                                                profileData.company_name
                                                                            }
                                                                            onChange={(
                                                                                event
                                                                            ) =>
                                                                                setCompaniesQuery(
                                                                                    event
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                        />
                                                                    )}
                                                                />
                                                            )}
                                                        </>

                                                        {errors[
                                                            "department_uuid"
                                                        ] ? (
                                                            <span className="text-sm text-red-500">
                                                                {
                                                                    errors[
                                                                    "department_uuid"
                                                                    ]
                                                                }
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="date"
                                                        className="block text-sm font-medium  text-gray-700 mb-1"
                                                    >
                                                        تاریخ ورود به شرکت
                                                    </label>

                                                    <DatePicker
                                                        format="YYYY/MM/DD"
                                                        value={
                                                            profileData.entry_date
                                                        }
                                                        onChange={(
                                                            dateObject
                                                        ) => {
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
                                                </div>
                                                <div className="sm:col-span-4">
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="avater"
                                                        className={
                                                            "block text-sm font-medium  text-gray-700 mb-2"
                                                        }
                                                    >
                                                        عکس پرسنلی
                                                    </label>

                                                    <span>
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
                                                                    alt="عکس پرسنلی"
                                                                    width={200}
                                                                    height={200}
                                                                />
                                                            ) : (
                                                                <Image
                                                                    loader={
                                                                        myLocalLoader
                                                                    }
                                                                    src="noImage.png"
                                                                    alt="عکس پرسنلی"
                                                                    width={200}
                                                                    height={200}
                                                                />
                                                            )}
                                                            <input
                                                                id="file-upload2"
                                                                name="file-upload2"
                                                                type="file"
                                                                accept="image/*"
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
                                                    </span>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="file-upload3"
                                                        className={
                                                            "block text-sm font-medium  text-gray-700 mb-2"
                                                        }
                                                    >
                                                        امضا
                                                    </label>

                                                    <span>
                                                        {" "}
                                                        <label
                                                            htmlFor="file-upload3"
                                                            disabled
                                                        >
                                                            {signature ? (
                                                                <Image
                                                                    loader={
                                                                        myLoader
                                                                    }
                                                                    src={
                                                                        signature
                                                                    }
                                                                    alt="تصویر امضا"
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
                                                                id="file-upload3"
                                                                name="file-upload3"
                                                                type="file"
                                                                accept="image/*"
                                                                className="sr-only"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    uploadSignatureChange(
                                                                        e
                                                                    );
                                                                }}
                                                            />
                                                        </label>
                                                    </span>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="avater"
                                                        className={
                                                            "block text-sm font-medium  text-gray-700 mb-2"
                                                        }
                                                    >
                                                        رزومه
                                                    </label>
                                                    <div className="mb-4">
                                                        {resume != "" &&
                                                            resume != undefined ? (
                                                            <span className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2">

                                                                <div className="flex text-sm text-gray-600">
                                                                    <label
                                                                        htmlFor="file-upload4"
                                                                        className="p-2 relative cursor-pointer bg-amber-500 hover:bg-amber-600 rounded-md font-medium text-white hover:text-white "
                                                                    >
                                                                        <span>
                                                                            آپلود
                                                                            فایل
                                                                            جدید
                                                                        </span>
                                                                        <input
                                                                            id="file-upload4"
                                                                            name="file-upload4"
                                                                            type="file"
                                                                            className="sr-only"
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                uploadResumeChange(
                                                                                    e
                                                                                );
                                                                            }}
                                                                        />
                                                                    </label>
                                                                </div>
                                                            </span>
                                                        ) : (
                                                            <span className="relative z-0 inline-flex  rounded-md mr-2">
                                                                <label htmlFor="file-upload4">
                                                                    <Image
                                                                        loader={
                                                                            myLocalLoader
                                                                        }
                                                                        src="noFile.png"
                                                                        alt="فایل رزومه"
                                                                        width={200}
                                                                        height={200}
                                                                    />
                                                                    <input
                                                                        id="file-upload4"
                                                                        name="file-upload4"
                                                                        type="file"
                                                                        className="sr-only"
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            uploadResumeChange(
                                                                                e
                                                                            );
                                                                        }}
                                                                    />
                                                                </label>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="col-span-3 pt-3">
                                                    <label
                                                        htmlFor="cover-photo"
                                                        className="block text-sm font-medium text-gray-700 pb-1"
                                                    >
                                                        امضای کارتابل
                                                    </label>
                                                    <Editor
                                                        tinymceScriptSrc={process.env.NEXT_PUBLIC_FRONT_URL + '/tinymce/tinymce.min.js'}
                                                        onInit={(evt, editor) =>
                                                        (editorRef.current =
                                                            editor)
                                                        }
                                                        initialValue={cartableSignature ? cartableSignature : null}
                                                        init={{
                                                            promotion: false,
                                                            selector: "textarea",
                                                            menubar: 'file edit view insert format tools table',
                                                            plugins: 'image table link emoticons',                                                            
                                                            table_use_colgroups: true,
                                                            directionality: "rtl",
                                                            toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist |  forecolor backcolor |outdent indent | link image | table | emoticons',
                                                            /* enable title field in the Image dialog*/
                                                            image_title: true,
                                                            /* enable automatic uploads of images represented by blob or data URIs*/
                                                            automatic_uploads: true,
                                                            /*
                                                              URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
                                                              images_upload_url: 'postAcceptor.php',
                                                              here we add custom filepicker only to Image dialog
                                                            */
                                                            file_picker_types: 'image',
                                                            /* and here's our custom image picker*/

                                                            file_picker_callback: function (cb, value, meta) {
                                                                var input = document.createElement('input');
                                                                input.setAttribute('type', 'file');
                                                                input.setAttribute('accept', 'image/*');

                                                                /*
                                                                  Note: In modern browsers input[type="file"] is functional without
                                                                  even adding it to the DOM, but that might not be the case in some older
                                                                  or quirky browsers like IE, so you might want to add it to the DOM
                                                                  just in case, and visually hide it. And do not forget do remove it
                                                                  once you do not need it anymore.
                                                                */

                                                                input.onchange = function () {
                                                                    var file = this.files[0];
                                                                    var resized;
                                                                    var re = /(?:\.([^.]+))?$/;
                                                                    Resizer.imageFileResizer(
                                                                        file,
                                                                        300,
                                                                        300,
                                                                        re.exec(file.name)[1],
                                                                        100,
                                                                        0,
                                                                        (uri) => {
                                                                            resized = uri;
                                                                            reader.readAsDataURL(resized);
                                                                        },
                                                                        "blob"
                                                                    );
                                                                    var reader = new FileReader();
                                                                    reader.onload = function () {
                                                                        /*
                                                                          Note: Now we need to register the blob in TinyMCEs image blob
                                                                          registry. In the next release this part hopefully won't be
                                                                          necessary, as we are looking to handle it internally.
                                                                        */                                                                          
                                                                        var id = 'blobid' + (new Date()).getTime();
                                                                        var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                                                                        var base64 = reader.result.split(',')[1];
                                                                        var blobInfo = blobCache.create(id, resized, base64);
                                                                        blobCache.add(blobInfo);

                                                                        /* call the callback and populate the Title field with the file name */
                                                                        cb(blobInfo.blobUri(), { title: resized.name });
                                                                    };
                                                                    
                                                                };

                                                                input.click();
                                                            },
                                                        }}
                                                    />
                                                    {errors["cartableSignature"] ? (
                                                        <span className="text-sm text-red-500">
                                                            {errors["cartableSignature"]}
                                                        </span>
                                                    ) : null}
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                    <div className="pt-5">
                                        {errors.map((err, err_key) => {
                                            return (
                                                <p
                                                    key={err_key}
                                                    className="text-red-500 text-sm font-bold"
                                                >
                                                    {err}
                                                </p>
                                            );
                                        })}
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                                            >
                                                ثبت
                                            </button>
                                            <Link href="/dashboard">
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
                        )}
                    </div>
                </main>
                {/* : <Forbidden />} */}
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
