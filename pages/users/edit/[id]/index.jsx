import SidebarDesktop from "../../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../../components/layout/sidebarMobile";
import StickyHeader from "../../../../components/layout/stickyHeader";
import navigationList from "../../../../components/layout/navigationList";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../../hooks/auth";
import { useUser } from "../../../../hooks/user";
import Link from "next/link";
import { useRouter } from "next/router";
import Textarea from "../../../../components/forms/textarea";
import Image from "next/image";
import { loadImageFromServer } from "../../../../lib/helper";
import { loadImageFromLocal } from "../../../../lib/helper";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "../../../../lib/axios";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import moment from "jalali-moment";
import Forbidden from "../../../../components/forms/forbidden";

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
const contractTypes = [
    { id: "0", title: "دائم" },
    { id: "1", title: "موقت" },
    { id: "2", title: "معین" },
];
const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
export default function ViewUser() {
    const [gender, setGender] = useState("");
    const [marriageStatus, setMarriageStatus] = useState(-1);
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
    const [personelCode, setPersonelCode] = useState("");
    const [entryDate, setEntryDate] = useState("");
    const [leavingDate, setLeavingDate] = useState("");
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
    const [selectedEducation, setselectedEducation] = useState();
    const [selectedContractType, setSelectedContractType] = useState();
    const [educationQuery, setEducationQuery] = useState("");
    const [contractQuery, setContractQuery] = useState("");
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    useEffect(() => {
        if (router.isReady) {
            getUser(router.query.id);
        }
    }, [router.isReady]);
    const { getUser, userData, isUserLoading } = useUser();

    useEffect(() => {
        setselectedDepartment(userData.department);
        setAvatar(userData.avatar);
        setSignature(userData.signature);
        setResume(userData.resume);
        setTelephone(userData.mobile);
        setBirthDate(userData.birthdate);
        setFatherName(userData.father_name);
        setSelectedPost(userData.post_array);
        setselectedRole(userData.role)
        setSelectedContractType(userData.contract_type)
    }, [userData]);

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

    const TSBirthDate = moment(userData.birthday, "jYYYY-jMM-jDD");
    const TSEntryDate = moment(userData.entry_date, "jYYYY-jMM-jDD");

    const onSubmit = async (event) => {
        event.preventDefault();
        const UserFormData = new FormData();
        UserFormData.append("uuid", userData.uuid),
            UserFormData.append(
                "first_name",
                name != "" ? name : userData.first_name
            ),
            UserFormData.append(
                "last_name",
                family != "" ? family : userData.last_name
            ),
            UserFormData.append(
                "national_code",
                ncode != "" ? ncode : userData.national_code
            ),
            UserFormData.append("father_name", fatherName != "" ? fatherName : ""),
            UserFormData.append("birthday", birthdate ? birthdate.unix : null),
            UserFormData.append("mobile", telephone),
            UserFormData.append(
                "post_uuid",
                selectedPost != "" ? selectedPost.map(({ uuid }) => uuid) : ""
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
                "contract_type",
                selectedContractType ? selectedContractType.title : null
            ),
            UserFormData.append(
                "department_uuid",
                selectedDepartment
                    ? selectedDepartment.uuid
                    : userData.department_uuid
            ),
            selectedRole ?
                UserFormData.append(
                    "role_uuid",
                    selectedRole
                        ? selectedRole.uuid
                        : null
                ) : null
        UserFormData.append("email", email != "" ? email : userData.email);
        UserFormData.append("gmail", gmail != "" ? gmail : userData.gmail);
        UserFormData.append("personel_code", personelCode != "" ? personelCode : userData.personel_code);
        UserFormData.append("avatar", avatar != "" ? avatar : userData.avatar);
        UserFormData.append(
            "entry_date",
            entryDate != "" ? entryDate.unix : null
        );
        UserFormData.append(
            "leaving_date",
            leavingDate != "" && leavingDate ? leavingDate.unix : null
        ),
            UserFormData.append(
                "resume",
                resume != "" ? resume : userData.resume
            );
        UserFormData.append(
            "signature",
            signature != "" ? signature : userData.signature
        );

        try {
            const response = await axios({
                method: "post",
                url: "/api/v1/user/update",
                data: UserFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {
                // return false;
                window.location.assign("/users");
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

    const filteredContractType =
    contractQuery === ""
        ? contractTypes
        : contractTypes.filter((contract) => {
            return contract.title.includes(
                contractQuery.toLowerCase()
            );
        });

    const filteredEducation =
        educationQuery === ""
            ? educations
            : educations.filter((education) => {
                return education.title.includes(
                    educationQuery.toLowerCase()
                );
            });

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
                {!currentUserActions ? null : CheckIfAccessToPage(`/${window.location.pathname.split("/")[1]}/${window.location.pathname.split("/")[2]}`) ?
                    <main>
                        <div className="py-6">
                            {isUserLoading ? null : (
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
                                                            {userData.title}
                                                        </h2>
                                                    </div>

                                                    <div className="sm:col-span-2">
                                                        <Textarea
                                                            title="نام *"
                                                            name={name}
                                                            rows="1"
                                                            defaultValue={
                                                                userData.first_name
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
                                                                userData.last_name
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
                                                                userData.father_name && userData.fatherName != "null"
                                                                    ? userData.father_name
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
                                                    <div className="col-span-1">
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
                                                                                    defaultChecked={userData ? userData.gender === genderTypeMethods.id : false}
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
                                                    <div className="col-span-1"> {/*typeMethod */}
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
                                                                                    defaultChecked={userData ? userData.marriage_status === marriageStatusTypeMethods.id : false}
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
                                                                userData.national_code
                                                                    ? userData.national_code
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
                                                                userData.birthday
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
                                                                userData.mobile && userData.mobile != "null"
                                                                    ? userData.mobile
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
                                                                    userData.education ??
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
                                                                userData.email && userData.email != "null"
                                                                    ? userData.email
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
                                                            title="آدرس جیمیل (جهت دریافت تقویم جلسات)"
                                                            name={gmail}
                                                            rows="1"
                                                            defaultValue={
                                                                userData.gmail && userData.gmail != "null"
                                                                    ? userData.gmail
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
                                                        <Textarea
                                                            title="کد پرسنلی"
                                                            name={personelCode}
                                                            rows="1"
                                                            defaultValue={
                                                                userData.personel_code && userData.personel_code != "null"
                                                                    ? userData.personel_code
                                                                    : ""
                                                            }
                                                            onChange={(event) =>
                                                                setPersonelCode(
                                                                    event.target
                                                                        .value
                                                                )
                                                            }
                                                            error={errors["personelCode"]}
                                                            type="text"
                                                            isrequired="true"
                                                        />
                                                    </div>
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
                                                            defaultValue={{
                                                                title:
                                                                    userData.contract_type ??
                                                                    "",
                                                                id:

                                                                    "",
                                                            }}
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
                                                                {userData.company_name ==
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
                                                                            title: userData.company_name,
                                                                            uuid: userData.company_uuid,
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
                                                                                    userData.company_name
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
                                                                userData.entry_date
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
                                                    <div className="sm:col-span-2">
                                                        <label
                                                            htmlFor="leavingDate"
                                                            className="block text-sm font-medium  text-gray-700 mb-1"
                                                        >
                                                            تاریخ ترک کار
                                                        </label>

                                                        <DatePicker
                                                            format="YYYY/MM/DD"
                                                            value={
                                                                userData.leaving_date
                                                            }
                                                            onChange={(
                                                                dateObject
                                                            ) => {
                                                                setLeavingDate(
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

                                                    <div className={CheckIfAccess("edit_role") ? "sm:col-span-2" : "sm:col-span-3"}>
                                                        <label
                                                            htmlFor="email"
                                                            className="block text-sm font-medium  text-gray-700"
                                                        >
                                                            انتخاب واحد
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
                                                            defaultValue={{
                                                                title:
                                                                    userData.department_name ??
                                                                    "",
                                                                uuid:
                                                                    userData.department_uuid ??
                                                                    "",
                                                            }}
                                                            getOptionLabel={(
                                                                department
                                                            ) =>
                                                                department.title
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
                                                                        userData.department_name
                                                                    }
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
                                                    <div className={CheckIfAccess("edit_role") ? "sm:col-span-2" : "sm:col-span-3"}>
                                                        <label
                                                            htmlFor="email"
                                                            className="block text-sm font-medium  text-gray-700"
                                                        >
                                                            سمت فعالیت
                                                        </label>
                                                        {selectedPost ? (
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
                                                        ) : null}

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

                                                    {CheckIfAccess("edit_role") ?
                                                        <div className="sm:col-span-2">
                                                            <label
                                                                htmlFor="email"
                                                                className="block text-sm font-medium  text-gray-700"
                                                            >
                                                                انتخاب دسترسی
                                                            </label>
                                                            <Autocomplete
                                                                id="tags-standard"
                                                                className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                                options={
                                                                    filteredRole
                                                                }
                                                                defaultValue={{
                                                                    title:
                                                                        userData.role_name ??
                                                                        "",
                                                                    uuid:
                                                                        userData.role_uuid ??
                                                                        "",
                                                                }}
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
                                                        </div> : null}


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
                            )}
                        </div>
                    </main> : <Forbidden />}
            </div>
        </div>
    );
}
