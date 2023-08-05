import InputBox from "../../../components/forms/inputBox";
import { useState, forwardRef, useEffect } from "react";
import axios from "../../../lib/axios";
import Image from "next/image";
import { loadImageFromServer } from "../../../lib/helper";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from "next/router";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { loadImageFromLocal } from "../../../lib/helper";
import * as React from 'react';
import { useInterview } from "../../../hooks/interview";
import { XIcon } from "@heroicons/react/solid";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import moment from "jalali-moment";
moment.locale("fa");

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
const myLoader = ({ src, width, quality }) => {
    return loadImageFromServer(`${src}?w=${width}&q=${quality || 75}`);
};
const myLocalLoader = ({ src, width, quality }) => {
    return loadImageFromLocal(`${src}?w=${width}&q=${quality || 75}`);
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

    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [resume, setResume] = useState([]);
    const [education, setEducation] = useState([]);
    const [language, setLanguage] = useState([]);
    const [skill, setSkill] = useState([]);
    const [training, setTraining] = useState([]);
    const [birthDate, setBirthDate] = useState();
    const [savedBirthDate, setSvaedBirthDate] = useState("");
    const [PrevBirthDate, setPrevBirthDate] = useState();
    const [nameAndFamily, setNameAndFamily] = useState("");
    const [fatherName, setFatherName] = useState("");
    const [registerPlace, setRegisterPlate] = useState("");
    const [birthPlace, setBirthPlace] = useState("");
    const [gender, setGender] = useState(-1);
    const [nationalCode, setNationalCode] = useState("");
    const [religion, setReligion] = useState("");
    const [religionBranch, setReligionBranch] = useState("");
    const [militaryStatus, setMilitaryStatus] = useState(-1);
    const [militaryStatusDesc, setMilitaryStatusDesc] = useState("");
    const [citizenShip, setCitizenShip] = useState("");
    const [doctorStatus, setDoctorStatus] = useState(-1);
    const [doctorStatusPlace, setDoctorStatusPlace] = useState("");
    const [marriageStatus, setMarriageStatus] = useState(-1);
    const [vehicleStatus, setVehicleStatus] = useState(-1);
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [cellPhone, setCellPhone] = useState("");
    const [criminalStatus, setCriminalStatus] = useState(-1);
    const [criminalDescription, setCriminalDescription] = useState("");
    const [surgeryStatus, setSurgeryStatus] = useState(-1);
    const [surgeryDescription, setSurgeryDescription] = useState("");
    const [freeTimeDescription, setFreeTimeDescription] = useState("");
    const [knowing, setKnowing] = useState("");
    const [friendStatus, setFriendStatus] = useState(-1);
    const [friendDescription, setFriendDescription] = useState("");
    const [coOperateStatus, setCoOperateStatus] = useState(-1);
    const [salary, setSalary] = useState("");
    const [insuranceType, setInsuranceType] = useState(-1);
    const [insuranceYear, setInsuranceYear] = useState("");
    const [insuranceMonth, setInsuranceMonth] = useState("");
    const [insuranceNumber, setInsuranceNumber] = useState("");
    const [nationalId, setNationalId] = useState("");
    const [activationCode, setActivationCode] = useState("");
    const [attachement, setAttachment] = useState("");
    const [interviewId, setInterviewId] = useState("");


    const [errors, setErrors] = useState([]);
    const [sendingOtpLoading, setSendingOtpLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpSend, setOtpSend] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [submited, setSubmited] = useState(false);
    const [submitedDraft, setSubmitedDraft] = useState(false);
    const [loadingUpload, setLoadingUpload] = useState(false);

    const [minutes, setMinutes] = useState(2);
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds == 1 && minutes == 0) setOtpSend(false);
            if (seconds === 0) {
                if (minutes === 0) {

                    clearInterval(myInterval)
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    });

    const router = useRouter();
    const { getInterview, interviewData, isInterviewLoading, error } = useInterview();

    useEffect(() => {
        if (router.isReady) {
            getInterview(router.query.id);
            setInterviewId(router.query.id);
            if (interviewData) {
                interviewData.fatherName ? setFatherName(interviewData.fatherName) : null;
                interviewData.birthDate ? setBirthDate(interviewData.birthDate) : null;
            }
        }
    }, [router.isReady]);


    useEffect(() => {

        if (interviewData) {
            interviewData.fatherName ? setFatherName(interviewData.fatherName) : null;
            interviewData.nationalId ? setNationalId(interviewData.nationalId) : null;
            interviewData.birthPlace ? setBirthPlace(interviewData.birthPlace) : null;
            interviewData.registerPlace ? setRegisterPlate(interviewData.registerPlace) : null;
            interviewData.nationalCode ? setNationalCode(interviewData.nationalCode) : null;
            interviewData.gender != null && interviewData.gender != "-1" ? setGender(interviewData.gender) : null;
            interviewData.religion ? setReligion(interviewData.religion) : null;
            interviewData.religionBranch ? setReligionBranch(interviewData.religionBranch) : null;
            interviewData.citizenShip ? setCitizenShip(interviewData.citizenShip) : null;
            interviewData.vehicleStatus != null && interviewData.vehicleStatus != "-1" ? setVehicleStatus(interviewData.vehicleStatus) : null;
            interviewData.militaryStatus != null && interviewData.militaryStatus != "-1" ? setMilitaryStatus(interviewData.militaryStatus) : null;
            interviewData.militaryStatusDesc ? setMilitaryStatusDesc(interviewData.militaryStatusDesc) : null;
            interviewData.marriageStatus != null && interviewData.marriageStatus != "-1" ? setMarriageStatus(interviewData.marriageStatus) : null;
            interviewData.doctorStatus != null && interviewData.doctorStatus != "-1" ? setDoctorStatus(interviewData.doctorStatus) : null;
            interviewData.doctorStatusPlace ? setDoctorStatusPlace(interviewData.doctorStatusPlace) : null;
            interviewData.city ? setCity(interviewData.city) : null;
            interviewData.address ? setAddress(interviewData.address) : null;
            interviewData.telephone ? setTelephone(interviewData.telephone) : null;
            interviewData.cellPhone ? setCellPhone(interviewData.cellPhone) : null;
            interviewData.email ? setEmail(interviewData.email) : null;
            interviewData.resume ? setResume(interviewData.resume) : null;
            interviewData.education ? setEducation(interviewData.education) : null;
            interviewData.language ? setLanguage(interviewData.language) : null;
            interviewData.skill ? setSkill(interviewData.skill) : null;
            interviewData.training ? setTraining(interviewData.training) : null;
            interviewData.criminalStatus != null && interviewData.criminalStatus != "-1" ? setCriminalStatus(interviewData.criminalStatus) : null;
            interviewData.criminalDescription ? setCriminalDescription(interviewData.criminalDescription) : null;
            interviewData.surgeryStatus != null && interviewData.surgeryStatus != "-1" ? setSurgeryStatus(interviewData.surgeryStatus) : null;
            interviewData.surgeryDescription ? setSurgeryDescription(interviewData.surgeryDescription) : null;
            interviewData.freeTimeDescription ? setFreeTimeDescription(interviewData.freeTimeDescription) : null;
            interviewData.knowing ? setKnowing(interviewData.knowing) : null;
            interviewData.friendStatus != null && interviewData.friendStatus != "-1" ? setFriendStatus(interviewData.friendStatus) : null;
            interviewData.friendDescription ? setFriendDescription(interviewData.friendDescription) : null;
            interviewData.insuranceType != null && interviewData.insuranceType != "-1" ? setInsuranceType(interviewData.insuranceType) : null;
            interviewData.coOperateStatus != null && interviewData.coOperateStatus != "-1" ? setCoOperateStatus(interviewData.coOperateStatus) : null;
            interviewData.insuranceMonth ? setInsuranceMonth(interviewData.insuranceMonth) : null;
            interviewData.insuranceNumber ? setInsuranceNumber(interviewData.insuranceNumber) : null;
            interviewData.insuranceYear ? setInsuranceYear(interviewData.insuranceYear) : null;
            interviewData.salary ? setSalary(interviewData.salary) : null;
            interviewData.resumeFile ? setAttachment(interviewData.resumeFile) : null;
            interviewData.birthDate && interviewData.birthDate != "" ? setSvaedBirthDate(interviewData.birthDate) : null;
            interviewData.birthDate && interviewData.birthDate != "" ? setPrevBirthDate(moment
                .unix(
                    interviewData.birthDate
                )
                .format(
                    "YYYY/MM/DD"
                )) : null;
        }

    }, [interviewData]);


    useEffect(() => {
        interviewData ? setNameAndFamily(interviewData.applicant_name) : ""
        interviewData ? setCellPhone(interviewData.applicant_mobile) : ""
        interviewData && email != "" ? setEmail(interviewData.applicant_email) : ""
    }, [interviewData]);

    const militaryTypeMethods = [
        { id: "0", title: "غیر مشمول" },
        { id: "1", title: "پایان خدمت" },
        { id: "2", title: "معاف" },
    ];
    const doctorStatusTypeMethods = [
        { id: "0", title: "طرح انجام شده" },
        { id: "1", title: "طرح انجام نشده" },
    ];
    const marriageStatusTypeMethods = [
        { id: "0", title: "متاهل" },
        { id: "1", title: "مجرد" },
    ];
    const genderTypeMethods = [
        { id: "0", title: "زن" },
        { id: "1", title: "مرد" },
    ];
    const vehicleStatusTypeMethods = [
        { id: "0", title: "دارم" },
        { id: "1", title: "ندارم" },
    ];
    const languageTypeMethods = [
        { id: "0", title: "عالی" },
        { id: "1", title: "خوب" },
        { id: "2", title: "متوسط" },
    ];
    const yesAndNoTypeMethods = [
        { id: "0", title: "بله" },
        { id: "1", title: "خیر" },
    ];
    const coOperateTypeMethods = [
        { id: "0", title: "تمام وقت" },
        { id: "1", title: "نیمه وقت" },
    ];
    const insuranceTypeMethods = [
        { id: "0", title: "تامین اجتماعی" },
        { id: "1", title: "خدمات درمانی" },
    ];

    function addResume() {
        setResume([...resume, { place: "", position: "", startDate: "", endDate: "", manager: "", contact: "", desc: "" }]);
    }
    function removeResume(index) {
        let temp = [...resume];
        temp.splice(index, 1);
        setResume(temp);
    }
    function changePlace(index, value) {
        let temp = [...resume];
        temp[index].place = value;
        setResume(temp);
    }
    function changePosition(index, value) {
        let temp = [...resume];
        temp[index].position = value;
        setResume(temp);
    }
    function changeManager(index, value) {
        let temp = [...resume];
        temp[index].manager = value;
        setResume(temp);
    }
    function changeStartDate(index, value) {
        let temp = [...resume];
        temp[index].startDate = value;
        setResume(temp);
    }
    function changeEndDate(index, value) {
        let temp = [...resume];
        temp[index].endDate = value;
        setResume(temp);
    }
    function changeleavingWorkReason(index, value) {
        let temp = [...resume];
        temp[index].leavingWorkReason = value;
        setResume(temp);
    }
    function changeDesc(index, value) {
        let temp = [...resume];
        temp[index].desc = value;
        setResume(temp);
    }

    function addEducation() {
        setEducation([...education, { grade: "", field: "", orientation: "", institute: "", thesis: "", startDate: "", endDate: "", gpa: "" }]);
    }
    function removeEducation(index) {
        let temp = [...education];
        temp.splice(index, 1);
        setEducation(temp);
    }
    function changeGrade(index, value) {
        let temp = [...education];
        temp[index].grade = value;
        setEducation(temp);
    }
    function changeField(index, value) {
        let temp = [...education];
        temp[index].field = value;
        setEducation(temp);
    }
    function changeOrientation(index, value) {
        let temp = [...education];
        temp[index].orientation = value;
        setEducation(temp);
    }
    function changeInstitute(index, value) {
        let temp = [...education];
        temp[index].institute = value;
        setEducation(temp);
    }
    function changeThesis(index, value) {
        let temp = [...education];
        temp[index].thesis = value;
        setEducation(temp);
    }
    function changeEduStartDate(index, value) {
        let temp = [...education];
        temp[index].startDate = value;
        setEducation(temp);
    }
    function changeEduEndDate(index, value) {
        let temp = [...education];
        temp[index].endDate = value;
        setEducation(temp);
    }
    function changeGpa(index, value) {
        let temp = [...education];
        temp[index].gpa = value;
        setEducation(temp);
    }

    function addLanguage() {
        setLanguage([...language, { name: "", conversation: -1, translate: -1, reading: -1, writing: -1 }]);
    }
    function removeLanguage(index) {
        let temp = [...language];
        temp.splice(index, 1);
        setLanguage(temp);
    }
    function changeLangName(index, value) {
        let temp = [...language];
        temp[index].name = value;
        setLanguage(temp);
    }
    function changeLangConversation(index, value) {
        let temp = [...language];
        temp[index].conversation = value;
        setLanguage(temp);
    }
    function changeLangTranslate(index, value) {
        let temp = [...language];
        temp[index].translate = value;
        setLanguage(temp);
    }
    function changeLangReading(index, value) {
        let temp = [...language];
        temp[index].reading = value;
        setLanguage(temp);
    }
    function changeLangWriting(index, value) {
        let temp = [...language];
        temp[index].writing = value;
        setLanguage(temp);
    }

    function addSkill() {
        setSkill([...skill, { type: "", experience: "", evaluation: -1 }]);
    }
    function removeSkill(index) {
        let temp = [...skill];
        temp.splice(index, 1);
        setSkill(temp);
    }
    function changeSkillType(index, value) {
        let temp = [...skill];
        temp[index].type = value;
        setSkill(temp);
    }
    function changeSkillExperience(index, value) {
        let temp = [...skill];
        temp[index].experience = value;
        setSkill(temp);
    }
    function changeSkillEvaluationMethod(index, value) {
        let temp = [...skill];
        temp[index].evaluation = value;
        setSkill(temp);
    }

    function addTraining() {
        setTraining([...training, { name: "", duration: "", organizer: "", year: "", description: "" }]);
    }
    function removeTraining(index) {
        let temp = [...training];
        temp.splice(index, 1);
        setTraining(temp);
    }
    function changeTrainingName(index, value) {
        let temp = [...training];
        temp[index].name = value;
        setTraining(temp);
    }
    function changeTrainingDuration(index, value) {
        let temp = [...training];
        temp[index].duration = value;
        setTraining(temp);
    }
    function changeTrainingOrganizer(index, value) {
        let temp = [...training];
        temp[index].organizer = value;
        setTraining(temp);
    }
    function changeTrainingYear(index, value) {
        let temp = [...training];
        temp[index].year = value;
        setTraining(temp);
    }
    function changeTrainingDescription(index, value) {
        let temp = [...training];
        temp[index].description = value;
        setTraining(temp);
    }


    const handleToClose = (event, reason) => {
        window.location.assign("/companies");
    };

    const getOtp = async (event) => {
        event.preventDefault();
        setSendingOtpLoading(true);
        const mailFormData = new FormData();
        var hasError = false;
        var object = {};
        if (telephone == "") {
            hasError = true;
            object['telephone'] = 'شماره تلفن الزامی است';
        }
        if (email == "" || !email) {
            hasError = true;
            object['email'] = 'ایمیل الزامی است';
        }
        if (nameAndFamily == "") {
            hasError = true;
            object['nameAndFamily'] = 'نام و نام خانوادگی الزامی است';
        }
        if (fatherName == "") {
            hasError = true;
            object['fatherName'] = 'نام پدر الزامی است';
        }
        if (nationalId == "") {
            hasError = true;
            object['nationalId'] = 'شماره شناسنامه الزامی است';
        }
        
        if (!birthDate && savedBirthDate == "") {
            hasError = true;
            object['birthDate'] = 'تاریخ تولد الزامی است';
        }
        if (registerPlace == "") {
            hasError = true;
            object['registerPlace'] = 'محل صدور الزامی است';
        }
        if (birthPlace == "") {
            hasError = true;
            object['birthPlace'] = 'محل تولد الزامی است';
        }
        if (gender == "-1") {
            hasError = true;
            object['gender'] = 'جنسیت الزامی است';
        }
        if (nationalCode == "" || nationalCode.length < 10) {
            hasError = true;
            object['nationalCode'] = 'کد ملی الزامی است';
        }
        if (religion == "") {
            hasError = true;
            object['religion'] = 'دین الزامی است';
        }
        if (religionBranch == "") {
            hasError = true;
            object['religionBranch'] = 'مذهب الزامی است';
        }
        if (citizenShip == "") {
            hasError = true;
            object['citizenShip'] = 'تابعیت الزامی است';
        }
        if (address == "") {
            hasError = true;
            object['address'] = 'آدرس الزامی است';
        }
        if (city == "") {
            hasError = true;
            object['city'] = 'شهر الزامی است';
        }
        if (freeTimeDescription == "") {
            hasError = true;
            object['freeTimeDescription'] = 'اوقات فراغت الزامی است';
        }
        if (knowing == "") {
            hasError = true;
            object['knowing'] = 'نحوه آشنایی الزامی است';
        }

        if (marriageStatus == "-1") {
            hasError = true;
            object['marriageStatus'] = ' وضعیت تاهل الزامی است ';
        }
        if (vehicleStatus == "-1") {
            hasError = true;
            object['vehicleStatus'] = ' وسیله نقلیه الزامی است ';
        }
        if (militaryStatus == "-1") {
            hasError = true;
            object['militaryStatus'] = ' وضعیت نظام وظیفه الزامی است ';
        }
        if (doctorStatus == "-1") {
            hasError = true;
            object['doctorStatus'] = 'وضعیت طرح الزامی است ';
        }
        if (doctorStatus == "0" && doctorStatusPlace == "") {
            hasError = true;
            object['doctorStatusPlace'] = ' محل طرح الزامی است ';
        }
        if (militaryStatus == "2" && militaryStatusDesc == "") {
            hasError = true;
            object['militaryStatusDesc'] = ' علت معافیت الزامی است ';
        }
        if (cellPhone == "" || cellPhone.length < 11) {
            object['cellPhone'] = 'شماره موبایل خود را وارد کنید';
            hasError = true;
        }
        if (resume && resume.length == 0) {
            object['resume'] = 'سوابق کاری الزامی است';
            hasError = true;
        }
        if (education && education.length == 0) {
            object['education'] = 'سوابق تحصیلی الزامی است';
            hasError = true;
        }
        if (language && language.length == 0) {
            object['language'] = 'سوابق تحصیلی الزامی است';
            hasError = true;
        }
        if (skill && skill.length == 0) {
            object['skill'] = 'مهارت ها الزامی است';
            hasError = true;
        }
        if (training && training.length == 0) {
            object['training'] = 'دوره های آموزشی الزامی است';
            hasError = true;
        }
        if (criminalStatus == "-1") {
            hasError = true;
            object['criminalStatus'] = 'وضیعت محکومیت کیفری الزامی است ';
        }
        if (criminalStatus == "0" && criminalDescription == "") {
            hasError = true;
            object['criminalDescription'] = ' توضیح محکومیت الزامی است ';
        }
        if (surgeryStatus == "-1") {
            hasError = true;
            object['surgeryStatus'] = 'وضیعت سابقه عمل جراحی الزامی است ';
        }
        if (surgeryStatus == "0" && surgeryDescription == "") {
            hasError = true;
            object['surgeryDescription'] = ' توضیح سابقه جراحی الزامی است ';
        }
        if (friendStatus == "-1") {
            hasError = true;
            object['friendStatus'] = ' الزامی است ';
        }
        if (friendStatus == "0" && friendDescription == "") {
            hasError = true;
            object['friendDescription'] = ' نام آشنا در شرکت الزامی است ';
        }
        if (coOperateStatus == "-1") {
            hasError = true;
            object['coOperateStatus'] = 'نحوه همکاری الزامی است ';
        }

        if (hasError) {
            object['general'] = 'لطفا اطلاعات خواسته شده را با دقت تکمیل نمایید ';
            setErrors(object);
            setSendingOtpLoading(false);
            return;
        }       

        mailFormData.append("cellphone", cellPhone);

        try {
            const response = await axios({
                method: "post",
                url: "/api/v1/interview/applicant/otp",
                data: mailFormData,
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data.status == 200) {
                setOtpSend(true);
                setShowReset(true);
                setMinutes(2);
                setSeconds(0);
                setSendingOtpLoading(false);
                object = {};
                setErrors(object);
            }
        } catch (error) {
            setSendingOtpLoading(false);
            object['master'] = error.response.data.message;
            setErrors(object);
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        var object = {};
        var hasError = false;

        if (telephone == "") {
            hasError = true;
            object['telephone'] = 'شماره تلفن الزامی است';
        }
        if (email == "" || !email) {
            hasError = true;
            object['email'] = 'ایمیل الزامی است';
        }
        if (nameAndFamily == "") {
            hasError = true;
            object['nameAndFamily'] = 'نام و نام خانوادگی الزامی است';
        }
        if (fatherName == "") {
            hasError = true;
            object['fatherName'] = 'نام پدر الزامی است';
        }
        if (nationalId == "") {
            hasError = true;
            object['nationalId'] = 'شماره شناسنامه الزامی است';
        }
        if (!birthDate && savedBirthDate == "") {
            hasError = true;
            object['birthDate'] = 'تاریخ تولد الزامی است';
        }
        if (registerPlace == "") {
            hasError = true;
            object['registerPlace'] = 'محل صدور الزامی است';
        }
        if (birthPlace == "") {
            hasError = true;
            object['birthPlace'] = 'محل تولد الزامی است';
        }
        if (gender == "-1") {
            hasError = true;
            object['gender'] = 'جنسیت الزامی است';
        }
        if (nationalCode == "" || nationalCode.length < 10) {
            hasError = true;
            object['nationalCode'] = 'کد ملی الزامی است';
        }
        if (religion == "") {
            hasError = true;
            object['religion'] = 'دین الزامی است';
        }
        if (religionBranch == "") {
            hasError = true;
            object['religionBranch'] = 'مذهب الزامی است';
        }
        if (citizenShip == "") {
            hasError = true;
            object['citizenShip'] = 'تابعیت الزامی است';
        }
        if (address == "") {
            hasError = true;
            object['address'] = 'آدرس الزامی است';
        }
        if (city == "") {
            hasError = true;
            object['city'] = 'شهر الزامی است';
        }
        if (freeTimeDescription == "") {
            hasError = true;
            object['freeTimeDescription'] = 'اوقات فراغت الزامی است';
        }
        if (knowing == "") {
            hasError = true;
            object['knowing'] = 'نحوه آشنایی الزامی است';
        }

        if (marriageStatus == "-1") {
            hasError = true;
            object['marriageStatus'] = ' وضعیت تاهل الزامی است ';
        }
        if (vehicleStatus == "-1") {
            hasError = true;
            object['vehicleStatus'] = ' وسیله نقلیه الزامی است ';
        }
        if (militaryStatus == "-1") {
            hasError = true;
            object['militaryStatus'] = ' وضعیت نظام وظیفه الزامی است ';
        }
        if (doctorStatus == "-1") {
            hasError = true;
            object['doctorStatus'] = 'وضعیت طرح الزامی است ';
        }
        if (doctorStatus == "0" && doctorStatusPlace == "") {
            hasError = true;
            object['doctorStatusPlace'] = ' محل طرح الزامی است ';
        }
        if (militaryStatus == "2" && militaryStatusDesc == "") {
            hasError = true;
            object['militaryStatusDesc'] = ' علت معافیت الزامی است ';
        }
        if (cellPhone == "" || cellPhone.length < 11) {
            object['cellPhone'] = 'شماره موبایل خود را وارد کنید';
            hasError = true;
        }
        if (resume && resume.length == 0) {
            object['resume'] = 'سوابق کاری الزامی است';
            hasError = true;
        }
        if (education && education.length == 0) {
            object['education'] = 'سوابق تحصیلی الزامی است';
            hasError = true;
        }
        if (language && language.length == 0) {
            object['language'] = 'سوابق تحصیلی الزامی است';
            hasError = true;
        }
        if (skill && skill.length == 0) {
            object['skill'] = 'مهارت ها الزامی است';
            hasError = true;
        }
        if (training && training.length == 0) {
            object['training'] = 'دوره های آموزشی الزامی است';
            hasError = true;
        }
        if (criminalStatus == "-1") {
            hasError = true;
            object['criminalStatus'] = 'وضیعت محکومیت کیفری الزامی است ';
        }
        if (criminalStatus == "0" && criminalDescription == "") {
            hasError = true;
            object['criminalDescription'] = ' توضیح محکومیت الزامی است ';
        }
        if (surgeryStatus == "-1") {
            hasError = true;
            object['surgeryStatus'] = 'وضیعت سابقه عمل جراحی الزامی است ';
        }
        if (surgeryStatus == "0" && surgeryDescription == "") {
            hasError = true;
            object['surgeryDescription'] = ' توضیح سابقه جراحی الزامی است ';
        }
        if (friendStatus == "-1") {
            hasError = true;
            object['friendStatus'] = ' الزامی است ';
        }
        if (friendStatus == "0" && friendDescription == "") {
            hasError = true;
            object['friendDescription'] = ' نام آشنا در شرکت الزامی است ';
        }
        if (coOperateStatus == "-1") {
            hasError = true;
            object['coOperateStatus'] = 'نحوه همکاری الزامی است ';
        }

        if (!activationCode) {
            hasError = true;
            object['activationCode'] = 'کد یکبار مصرف الزامی است';
        }

        if (hasError) {
            setErrors(object);
            return;
        }        
        axios
            .post('/api/v1/interview/applicant/add',
                {

                    telephone: telephone,
                    email: email,
                    resume: resume,
                    education: education,
                    language: language,
                    skill: skill,
                    training: training,
                    birthDate: birthDate ? String(birthDate.unix) : savedBirthDate,
                    nameAndFamily: nameAndFamily,
                    fatherName: fatherName,
                    registerPlace: registerPlace,
                    birthPlace: birthPlace,
                    gender: gender,
                    nationalCode: nationalCode,
                    religion: religion,
                    religionBranch: religionBranch,
                    militaryStatus: militaryStatus,
                    militaryStatusDesc: militaryStatusDesc,
                    citizenShip: citizenShip,
                    doctorStatus: doctorStatus,
                    doctorStatusPlace: doctorStatusPlace,
                    marriageStatus: marriageStatus,
                    vehicleStatus: vehicleStatus,
                    address: address,
                    city: city,
                    freeTimeDescription: freeTimeDescription,
                    cellPhone: cellPhone,
                    criminalStatus: criminalStatus,
                    criminalDescription: criminalDescription,
                    surgeryStatus: surgeryStatus,
                    surgeryDescription: surgeryDescription,
                    knowing: knowing,
                    friendStatus: friendStatus,
                    friendDescription: friendDescription,
                    coOperateStatus: coOperateStatus,
                    salary: salary,
                    insuranceType: insuranceType,
                    insuranceYear: insuranceYear,
                    insuranceMonth: insuranceMonth,
                    insuranceNumber: insuranceNumber,
                    nationalId: nationalId,
                    resumeFile: attachement,
                    interview_uuid: interviewId,
                    job_position: interviewData.applicant_job_position,
                    otp_code: activationCode,

                })
            .then((res) => {
                setSubmited(true);
            })
            .catch((err) => {
                object['master'] = err.response.data.message;
                setErrors(object)
            }
            );
    };

    const onSubmitDraft = async (event) => {
        event.preventDefault();
        axios
            .post('/api/v1/interview/applicant/addDraft',
                {

                    telephone: telephone,
                    email: email,
                    resume: resume,
                    education: education,
                    language: language,
                    skill: skill,
                    training: training,
                    birthDate: birthDate ? String(birthDate.unix) : savedBirthDate ? savedBirthDate : "",
                    nameAndFamily: nameAndFamily,
                    fatherName: fatherName,
                    registerPlace: registerPlace,
                    birthPlace: birthPlace,
                    gender: gender,
                    nationalCode: nationalCode,
                    religion: religion,
                    freeTimeDescription: freeTimeDescription,
                    religionBranch: religionBranch,
                    militaryStatus: militaryStatus,
                    militaryStatusDesc: militaryStatusDesc,
                    citizenShip: citizenShip,
                    doctorStatus: doctorStatus,
                    doctorStatusPlace: doctorStatusPlace,
                    marriageStatus: marriageStatus,
                    vehicleStatus: vehicleStatus,
                    address: address,
                    city: city,
                    cellPhone: cellPhone,
                    criminalStatus: criminalStatus,
                    criminalDescription: criminalDescription,
                    surgeryStatus: surgeryStatus,
                    surgeryDescription: surgeryDescription,
                    knowing: knowing,
                    friendStatus: friendStatus,
                    friendDescription: friendDescription,
                    coOperateStatus: coOperateStatus,
                    salary: salary,
                    insuranceType: insuranceType,
                    insuranceYear: insuranceYear,
                    insuranceMonth: insuranceMonth,
                    insuranceNumber: insuranceNumber,
                    nationalId: nationalId,
                    resumeFile: attachement,
                    interview_uuid: interviewId,
                    job_position: interviewData.applicant_job_position,
                    otp_code: activationCode,

                })
            .then((res) => {
                setSubmitedDraft(true);
            })
            .catch((err) => {
                object['master'] = err.response.data.message;
                setErrors(object)
            }
            );
    };
    const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");
    const removeNonNumericWithDot = num => num.toString().replace(/[^0-9,.]/g, "");

    const uploadChange = (event) => {
        try {
            var object = {};
            if (event.target.files[0].name.split('.').length > 1 && event.target.files[0].name.split('.')[1] != "pdf") {
                object['upload'] = "فقط فایل PDF مجاز می‌باشد";
                setErrors(object)
                return;
            }
            setLoadingUpload(true);
            const fileUpload = axios({
                method: "post",
                url: "/api/v1/interview/applicant/upload",
                data: {
                    attach: event.target.files[0],
                    interview_uuid: interviewId
                },
                headers: { "Content-Type": "multipart/form-data" },
            }).then(function (response) {
                setErrors([]);
                setLoadingUpload(false);
                setAttachment(response.data.data.file_uuid);
            });
        } catch (error) {
            setLoadingUpload(false);
            object['upload'] = err.response.data.message;
            setErrors(object)
        }
    };
    const deleteFile = () => {
        setAttachment("");
    };
    return (
        <div>
            {interviewData && !error ?
                !submited ?
                    <div className="flex flex-col flex-1">
                        <main>
                            <div className="py-6">

                                <div className="w-full px-4 sm:px-6 md:px-8">
                                    <form
                                        autoComplete="off"
                                        onSubmit={onSubmit}
                                        className="space-y-1 "
                                    >
                                        <div className=" grid lg:grid-cols-6 xs:grid-cols-2 bg-[#1f2937] p-2 mb-5 rounded-md shadow-sm">

                                            <div className="col-span-1">
                                                <div className=" flex justify-center">

                                                    {interviewData.company_info.logo ? (
                                                        <Image
                                                            loader={myLoader}
                                                            src={interviewData.company_info.logo}
                                                            alt="تصویر لوگو"
                                                            width={150}
                                                            height={150}
                                                        />
                                                    ) : (
                                                        <Image
                                                            loader={myLocalLoader}
                                                            src="noImage.png"
                                                            alt="تصویر لوگو"
                                                            width={150}
                                                            height={150}
                                                        />)}

                                                </div>
                                                <div className=" flex justify-center mt-2 text-white">
                                                    <div className="mt-4 sm:mt-0 ">
                                                        <a>{interviewData.company_info.title}</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-5 xs:col-span-1">
                                                <div className="grid mt-5 grid-cols-6 w-full gap-y-1 gap-x-1 sm:grid-cols-6">
                                                    <div className="col-span-6 text-white">
                                                        <p className="mb-3 ">نام و نام خانوادگی مصاحبه کننده: {interviewData.interviewer_name}</p>
                                                        <p className="mb-3 ">موقیعت شغلی: {interviewData.applicant_job_position}</p>
                                                        <p className="mb-3">زمان مصاحبه: {moment.unix(interviewData.timestamp).format("HH:mm   YYYY/MM/DD")}</p>
                                                        <p>آدرس محل مصاحبه: {interviewData.interview_place}</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="col-span-6 mt-8 flex justify-between">
                                            <p>لطفا اطلاعات زیر را به دقت تکمیل نمایید</p>
                                            <div className="col-span-1 ">
                                                <button
                                                    onClick={onSubmitDraft}
                                                    className="ml-2 w-full inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                                                >
                                                    ثبت موقت
                                                </button>
                                                {submitedDraft ? <p className="text-green-400"> با موفقیت ثبت شد </p> : null}
                                            </div>
                                        </div>

                                        <div className="sm:col-span-6 pt-1 pb-2 border-t"></div>

                                        <div className="max-w-full mx-auto px-1 sm:px-1 md:px-1">
                                            <div className="mb-4">
                                                <p
                                                    htmlFor="cover-photo"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    اطلاعات فردی
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                            <div className="sm:col-span-2">
                                                <InputBox
                                                    title="نام و نام خانوادگی"
                                                    name={nameAndFamily}
                                                    value={nameAndFamily}
                                                    onChange={(event) =>
                                                        setNameAndFamily(
                                                            event.target.value
                                                        )
                                                    }
                                                    error={errors["nameAndFamily"]}
                                                    type="text"
                                                    isrequired="true"
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <InputBox
                                                    title="نام پدر"
                                                    name={fatherName}
                                                    value={fatherName}
                                                    onChange={(event) =>
                                                        setFatherName(
                                                            event.target.value
                                                        )
                                                    }
                                                    error={
                                                        errors["fatherName"]
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
                                                    id="321"

                                                    format="YYYY/MM/DD"
                                                    value={
                                                        birthDate ? birthDate : PrevBirthDate
                                                    }
                                                    onChange={(
                                                        date
                                                    ) => {
                                                        setBirthDate(
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
                                                {errors && errors["birthDate"] ?
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors["birthDate"]}
                                                    </p> : null}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <InputBox
                                                    title="شماره شناسنامه"
                                                    name={nationalId}
                                                    value={nationalId}
                                                    onChange={(event) =>
                                                        setNationalId(
                                                            event.target.value
                                                        )
                                                    }
                                                    error={errors["nationalId"]}
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <InputBox
                                                    title="محل صدور"
                                                    name={registerPlace}
                                                    value={registerPlace}
                                                    onChange={(event) =>
                                                        setRegisterPlate(
                                                            event.target.value
                                                        )
                                                    }
                                                    error={errors["registerPlace"]}
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <InputBox
                                                    title="محل تولد"
                                                    name={birthPlace}
                                                    value={birthPlace}
                                                    onChange={(event) =>
                                                        setBirthPlace(
                                                            event.target.value
                                                        )
                                                    }
                                                    error={errors["birthPlace"]}
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
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
                                                                            checked={
                                                                                genderTypeMethods.id ===
                                                                                gender.toString()
                                                                            }
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
                                                {errors && errors["gender"] ?
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors["gender"]}
                                                    </p> : null}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <InputBox
                                                    title="کد ملی"
                                                    name={nationalCode}
                                                    value={nationalCode}
                                                    type="text"
                                                    onChange={(event) =>
                                                        setNationalCode(
                                                            removeNonNumeric(event.target.value.slice(0, 10))
                                                        )
                                                    }
                                                    error={errors["nationalCode"]}
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <InputBox
                                                    title="تابعیت"
                                                    name={citizenShip}
                                                    value={citizenShip}
                                                    onChange={(event) =>
                                                        setCitizenShip(
                                                            event.target.value
                                                        )
                                                    }
                                                    error={errors["citizenShip"]}
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <InputBox
                                                    title="دین"
                                                    name={religion}
                                                    value={religion}
                                                    onChange={(event) =>
                                                        setReligion(
                                                            event.target.value
                                                        )
                                                    }
                                                    error={errors["religion"]}
                                                />
                                            </div>

                                            <div className="sm:col-span-2">
                                                <InputBox
                                                    title="مذهب"
                                                    name={religionBranch}
                                                    value={religionBranch}
                                                    onChange={(event) =>
                                                        setReligionBranch(
                                                            event.target.value
                                                        )
                                                    }
                                                    error={
                                                        errors[
                                                        "religionBranch"
                                                        ]
                                                    }
                                                    type="text"
                                                    isrequired="true"
                                                />
                                            </div>
                                            <div className="sm:col-span-6 pt-1 border-t"></div>
                                            <div className="sm:col-span-6 grid-cols-6 grid">
                                                <div className="flex justify-start gap-x-10 col-span-6">
                                                    <div className="xs:col-span-1"> {/*typeMethod */}
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
                                                                                    checked={
                                                                                        marriageStatusTypeMethods.id ==
                                                                                        marriageStatus.toString()
                                                                                    }
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
                                                        {errors && errors["marriageStatus"] ?
                                                            <p className="text-sm text-red-500 mt-1">
                                                                {errors["marriageStatus"]}
                                                            </p> : null}
                                                    </div>
                                                    <div className="xs:col-span-1"> {/*typeMethod */}
                                                        <p
                                                            htmlFor="cover-photo"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            وسیله نقلیه
                                                        </p>
                                                        <fieldset className="mt-4">
                                                            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-1">
                                                                {vehicleStatusTypeMethods.map(
                                                                    (
                                                                        vehicleStatusTypeMethods
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                `vehicleStatusTypeMethods${vehicleStatusTypeMethods.id}`
                                                                            }
                                                                            className="flex items-center"
                                                                        >
                                                                            <label
                                                                                htmlFor={
                                                                                    `vehicleStatusTypeMethods${vehicleStatusTypeMethods.id}`
                                                                                }
                                                                                className="ml-3 block text-sm font-medium text-gray-700"
                                                                            >
                                                                                <input
                                                                                    id={
                                                                                        vehicleStatusTypeMethods.id
                                                                                    }
                                                                                    name="vehicleStatusMethod"
                                                                                    type="radio"
                                                                                    checked={
                                                                                        vehicleStatusTypeMethods.id ==
                                                                                        vehicleStatus.toString()
                                                                                    }
                                                                                    className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        setVehicleStatus(
                                                                                            e
                                                                                                .target
                                                                                                .id
                                                                                        );
                                                                                    }}
                                                                                />
                                                                                {
                                                                                    vehicleStatusTypeMethods.title
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </fieldset>
                                                        {errors && errors["vehicleStatus"] ?
                                                            <p className="text-sm text-red-500 mt-1">
                                                                {errors["vehicleStatus"]}
                                                            </p> : null}
                                                    </div>
                                                    <div className="xs:col-span-1"> {/*typeMethod */}
                                                        <p
                                                            htmlFor="cover-photo"
                                                            className="block text-sm font-medium text-gray-700"
                                                        >
                                                            وضعیت نظام وظیفه
                                                        </p>
                                                        <fieldset className="mt-4">
                                                            <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-1">
                                                                {militaryTypeMethods.map(
                                                                    (
                                                                        militaryTypeMethods
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                `militaryTypeMethods${militaryTypeMethods.id}`
                                                                            }
                                                                            className="flex items-center"
                                                                        >
                                                                            <label
                                                                                htmlFor={
                                                                                    `militaryTypeMethods${militaryTypeMethods.id}`
                                                                                }
                                                                                className="ml-3 block text-sm font-medium text-gray-700"
                                                                            >
                                                                                <input
                                                                                    id={
                                                                                        militaryTypeMethods.id
                                                                                    }
                                                                                    name="militaryMethod"
                                                                                    type="radio"
                                                                                    checked={
                                                                                        militaryTypeMethods.id ==
                                                                                        militaryStatus.toString()
                                                                                    }
                                                                                    className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        setMilitaryStatus(
                                                                                            e
                                                                                                .target
                                                                                                .id
                                                                                        );
                                                                                    }}
                                                                                />
                                                                                {
                                                                                    militaryTypeMethods.title
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </fieldset>
                                                        {errors && errors["militaryStatus"] ?
                                                            <p className="text-sm text-red-500 mt-1">
                                                                {errors["militaryStatus"]}
                                                            </p> : null}
                                                    </div>

                                                </div>
                                                <div className="col-span-2 mt-4">
                                                    {militaryStatus == '2' ?
                                                        <input
                                                            type="text" value={militaryStatusDesc}
                                                            onChange={e => setMilitaryStatusDesc(e.target.value)}
                                                            className="text-sm col-span-2 text-right w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                            placeholder="علت معافیت" />
                                                        : null}
                                                    {militaryStatus == '2' && errors && errors["militaryStatusDesc"] ?
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors["militaryStatusDesc"]}
                                                        </p> : null}
                                                </div>
                                            </div>
                                            <div className="sm:col-span-6 pt-1 border-t"></div>
                                            <div className="sm:col-span-6"> {/*typeMethod */}
                                                <p
                                                    htmlFor="cover-photo"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    مشمولان قانون خدمت پزشکان و پیراپزشکان
                                                </p>
                                                <fieldset className="mt-4">
                                                    <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                                                        {doctorStatusTypeMethods.map(
                                                            (
                                                                doctorStatusTypeMethods
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        `doctorStatusTypeMethods${doctorStatusTypeMethods.id}`
                                                                    }
                                                                    className="flex items-center"
                                                                >
                                                                    <label
                                                                        htmlFor={
                                                                            `doctorStatusTypeMethods${doctorStatusTypeMethods.id}`
                                                                        }
                                                                        className="ml-3 block text-sm font-medium text-gray-700"
                                                                    >
                                                                        <input
                                                                            id={
                                                                                doctorStatusTypeMethods.id
                                                                            }
                                                                            name="doctorStatusMethod"
                                                                            type="radio"
                                                                            checked={
                                                                                doctorStatusTypeMethods.id ==
                                                                                doctorStatus.toString()
                                                                            }
                                                                            className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                setDoctorStatus(
                                                                                    e
                                                                                        .target
                                                                                        .id
                                                                                );
                                                                            }}
                                                                        />
                                                                        {
                                                                            doctorStatusTypeMethods.title
                                                                        }
                                                                    </label>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </fieldset>
                                                {errors && errors["doctorStatus"] ?
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors["doctorStatus"]}
                                                    </p> : null}
                                            </div>
                                            <div className="sm:col-span-2">
                                                {doctorStatus == 0 ?
                                                    <input
                                                        type="text" value={doctorStatusPlace}
                                                        onChange={e => setDoctorStatusPlace(e.target.value)}
                                                        className="text-sm col-span-2 text-right w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                        placeholder="محل طرح" />
                                                    // <InputBox
                                                    //     title="در صورت انجام طرح، نام محل ذکر شود"
                                                    //     name={doctorStatusPlace}
                                                    //     value={doctorStatusPlace}
                                                    //     onChange={(event) =>
                                                    //         setDoctorStatusPlace(
                                                    //             event.target.value
                                                    //         )
                                                    //     }
                                                    //     error={errors["doctorStatusPlace"]}
                                                    // /> 
                                                    : null}
                                                {errors && errors["doctorStatusPlace"] ?
                                                    <p className="text-sm text-red-500 mt-1">
                                                        {errors["doctorStatusPlace"]}
                                                    </p> : null}
                                            </div>
                                            <div className="sm:col-span-4"></div>
                                            <div className="sm:col-span-6 pt-1 border-t"></div>
                                            <div className="sm:col-span-1">
                                                <InputBox
                                                    title="شهر محل سکونت"
                                                    name={city}
                                                    value={city}
                                                    type="text"
                                                    onChange={(event) =>
                                                        setCity(
                                                            event.target.value
                                                        )
                                                    }
                                                    error={errors["city"]}
                                                />
                                            </div>
                                            <div className="sm:col-span-5">
                                                <InputBox
                                                    title="آدرس کامل"
                                                    name={address}
                                                    value={address}
                                                    type="text"
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
                                                    title="تلفن ثابت"
                                                    name={telephone}
                                                    value={telephone}
                                                    type="text"
                                                    onChange={(event) =>
                                                        setTelephone(
                                                            removeNonNumeric(event.target.value.slice(0, 11))
                                                        )
                                                    }
                                                    error={errors["telephone"]}
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <InputBox
                                                    title="تلفن همراه"
                                                    name={cellPhone}
                                                    value={cellPhone}
                                                    type="text"
                                                    onChange={(event) => setCellPhone(removeNonNumeric(event.target.value.slice(0, 11)))}
                                                    error={errors["cellPhone"]}
                                                />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <InputBox
                                                    title="ایمیل"
                                                    name={email}
                                                    value={email}
                                                    type="text"
                                                    onChange={(event) =>
                                                        setEmail(
                                                            event.target.value
                                                        )
                                                    }
                                                    error={errors["email"]}
                                                />
                                            </div>
                                        </div>
                                        <div className="sm:col-span-6  border-t border-gray-300 py-5">
                                            <div className="flex justify-between">
                                                <p>سوابق کاری</p>
                                                <div className="flex">
                                                    <div className="ml-2">

                                                    </div>

                                                </div>

                                            </div>
                                            <button type="button" onClick={_ => addResume()} className="hover:bg-gray-50 transition duration-150 shadow p-2 px-4 rounded-md text-sm flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 ml-1"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                                اضافه کردن سابقه جدید
                                            </button>

                                            <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="p-2">
                                                            ردیف
                                                        </th>
                                                        <th>
                                                            محل کار
                                                        </th>
                                                        <th>
                                                            سمت
                                                        </th>
                                                        <th>
                                                            سال شروع
                                                        </th>
                                                        <th>
                                                            سال پایان
                                                        </th>
                                                        <th>
                                                            علت ترک کار
                                                        </th>
                                                        <th>
                                                            توضیحات
                                                        </th>
                                                        <th>

                                                        </th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        resume.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="text-center">
                                                                        {index + 1}
                                                                    </td>
                                                                    <td >
                                                                        <input type="text" value={item.place} onChange={e => changePlace(index, e.target.value)} className="text-sm w-full text-center border-0 p-2" placeholder="محل کار" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.position} onChange={e => changePosition(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="سمت" />
                                                                    </td>
                                                                    <td >
                                                                        <input type="text" value={item.startDate} onChange={e => changeStartDate(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="سال شروع" />
                                                                    </td>
                                                                    <td >
                                                                        <input type="text" value={item.endDate} onChange={e => changeEndDate(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="سال پایان" />
                                                                    </td>
                                                                    <td >
                                                                        <input type="text" value={item.leavingWorkReason} onChange={e => changeleavingWorkReason(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="علت ترک کار" />
                                                                    </td>
                                                                    <td >
                                                                        <input type="text" value={item.desc} onChange={e => changeDesc(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="توضیحات" />
                                                                    </td>

                                                                    <td>
                                                                        <button type="button" onClick={_ => removeResume(index)} className="hover:bg-gray-50 transition duration-150 text-sm flex items-center">
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
                                            {errors && errors["resume"] ?
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors["resume"]}
                                                </p> : null}
                                        </div>
                                        <div className="sm:col-span-6 border-t border-gray-300 py-5">
                                            <div className="flex justify-between">
                                                <p>سوابق تحصیلی(دو مقطع تحصیلی آخر)</p>
                                            </div>
                                            <button type="button" onClick={_ => addEducation()} className="hover:bg-gray-50 mb-2 mt-2 transition duration-150 shadow p-2 px-4 rounded-md text-sm flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 ml-1"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                                اضافه کردن مقطع جدید
                                            </button>

                                            <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="p-2">
                                                            ردیف
                                                        </th>
                                                        <th >
                                                            مقطع
                                                        </th>
                                                        <th>
                                                            رشته
                                                        </th>
                                                        <th>
                                                            گرایش تحصیلی
                                                        </th>
                                                        <th>
                                                            نام دانشگاه یا موسسه
                                                        </th>
                                                        <th>
                                                            موضوع پایان نامه
                                                        </th>
                                                        <th>
                                                            تاریخ شروع
                                                        </th>
                                                        <th>
                                                            تاریخ پایان
                                                        </th>
                                                        <th>
                                                            معدل
                                                        </th>

                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        education.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="text-center">
                                                                        {index + 1}
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.grade} onChange={e => changeGrade(index, e.target.value)} className="text-sm w-full text-center border-0 p-2" placeholder="مقطع" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.field} onChange={e => changeField(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="رشته" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.orientation} onChange={e => changeOrientation(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="گرایش تحصیلی" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.institute} onChange={e => changeInstitute(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="نام دانشگاه یا موسسه" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.thesis} onChange={e => changeThesis(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="موضوع پایان نامه" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.startDate} onChange={e => changeEduStartDate(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="تاریخ شروع" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.endDate} onChange={e => changeEduEndDate(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="تاریخ اتمام" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.gpa} onChange={e => changeGpa(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="معدل" />
                                                                    </td>

                                                                    <td>
                                                                        <button type="button" onClick={_ => removeEducation(index)} className="hover:bg-gray-50 transition duration-150 text-sm flex items-center">
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
                                            {errors && errors["education"] ?
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors["education"]}
                                                </p> : null}
                                        </div>
                                        <div className="sm:col-span-6 border-t border-gray-300 py-5">
                                            <div className="flex justify-between ">
                                                <p>آشنایی با زبان های خارجی</p>
                                            </div>
                                            <button type="button" onClick={_ => addLanguage()} className="hover:bg-gray-50 mt-2 mb-2 transition duration-150 shadow p-2 px-4 rounded-md text-sm flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 ml-1"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                                اضافه کردن زبان جدید
                                            </button>
                                            <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="p-2">
                                                            ردیف
                                                        </th>
                                                        <th>
                                                            نام زبان
                                                        </th>
                                                        <th >
                                                            مکالمه
                                                        </th>
                                                        <th>
                                                            ترجمه
                                                        </th>
                                                        <th>
                                                            خواندن
                                                        </th>
                                                        <th>
                                                            نوشتن
                                                        </th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        language.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="text-center">
                                                                        {index + 1}
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.name} onChange={e => changeLangName(index, e.target.value)} className="text-sm w-full text-center border-0 p-2" placeholder="نام زبان" />
                                                                    </td>
                                                                    <td >
                                                                        <fieldset className="flex min-h-full items-center justify-center">
                                                                            <div className=" sm:flex sm:items-center">
                                                                                {languageTypeMethods.map(
                                                                                    (
                                                                                        languageTypeMethods
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                `languageMethodConv${languageTypeMethods.id}${index}`
                                                                                            }
                                                                                            className="flex items-center"
                                                                                        >
                                                                                            <label
                                                                                                htmlFor={
                                                                                                    `languageMethodConv${languageTypeMethods.id}${index}`
                                                                                                }
                                                                                                className="ml-3 block text-sm font-medium text-gray-700"
                                                                                            >
                                                                                                <input
                                                                                                    id={
                                                                                                        languageTypeMethods.id
                                                                                                    }
                                                                                                    name={`langConversationMethod${index}`}
                                                                                                    type="radio"
                                                                                                    checked={
                                                                                                        languageTypeMethods.id == language[index].conversation.toString()
                                                                                                    }
                                                                                                    className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                                    onChange={(
                                                                                                        e
                                                                                                    ) => {
                                                                                                        changeLangConversation(index,
                                                                                                            e
                                                                                                                .target
                                                                                                                .id
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                                {
                                                                                                    languageTypeMethods.title
                                                                                                }
                                                                                            </label>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        </fieldset>
                                                                    </td>
                                                                    <td>
                                                                        <fieldset className="flex min-h-full items-center justify-center">
                                                                            <div className=" sm:flex sm:items-center">
                                                                                {languageTypeMethods.map(
                                                                                    (
                                                                                        languageTypeMethods
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                `languageMethodTrans${languageTypeMethods.id}${index}`
                                                                                            }
                                                                                            className="flex items-center"
                                                                                        >
                                                                                            <label
                                                                                                htmlFor={
                                                                                                    `languageMethodTrans${languageTypeMethods.id}${index}`
                                                                                                }
                                                                                                className="ml-3 block text-sm font-medium text-gray-700"
                                                                                            >
                                                                                                <input
                                                                                                    id={
                                                                                                        languageTypeMethods.id
                                                                                                    }
                                                                                                    name={`langTranslateMethod${index}`}
                                                                                                    type="radio"
                                                                                                    checked={
                                                                                                        languageTypeMethods.id == language[index].translate.toString()
                                                                                                    }
                                                                                                    className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                                    onChange={(
                                                                                                        e
                                                                                                    ) => {
                                                                                                        changeLangTranslate(index,
                                                                                                            e
                                                                                                                .target
                                                                                                                .id
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                                {
                                                                                                    languageTypeMethods.title
                                                                                                }
                                                                                            </label>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        </fieldset>                                                            </td>
                                                                    <td>
                                                                        <fieldset className="flex min-h-full items-center justify-center">
                                                                            <div className=" sm:flex sm:items-center">
                                                                                {languageTypeMethods.map(
                                                                                    (
                                                                                        languageTypeMethods
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                `languageMethodReading${languageTypeMethods.id}${index}`
                                                                                            }
                                                                                            className="flex items-center"
                                                                                        >
                                                                                            <label
                                                                                                htmlFor={
                                                                                                    `languageMethodReading${languageTypeMethods.id}${index}`
                                                                                                }
                                                                                                className="ml-3 block text-sm font-medium text-gray-700"
                                                                                            >
                                                                                                <input
                                                                                                    id={
                                                                                                        languageTypeMethods.id
                                                                                                    }
                                                                                                    name={`langReadingMethod${index}`}
                                                                                                    type="radio"
                                                                                                    checked={
                                                                                                        languageTypeMethods.id == language[index].reading.toString()
                                                                                                    }
                                                                                                    className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                                    onChange={(
                                                                                                        e
                                                                                                    ) => {
                                                                                                        changeLangReading(index,
                                                                                                            e
                                                                                                                .target
                                                                                                                .id
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                                {
                                                                                                    languageTypeMethods.title
                                                                                                }
                                                                                            </label>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        </fieldset>                                                            </td>
                                                                    <td>
                                                                        <fieldset className="flex min-h-full items-center justify-center">
                                                                            <div className=" sm:flex sm:items-center">
                                                                                {languageTypeMethods.map(
                                                                                    (
                                                                                        languageTypeMethods
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                `languageMethodWriting${languageTypeMethods.id}${index}`
                                                                                            }
                                                                                            className="flex items-center"
                                                                                        >
                                                                                            <label
                                                                                                htmlFor={
                                                                                                    `languageMethodWriting${languageTypeMethods.id}${index}`
                                                                                                }
                                                                                                className="ml-3 block text-sm font-medium text-gray-700"
                                                                                            >
                                                                                                <input
                                                                                                    id={
                                                                                                        languageTypeMethods.id
                                                                                                    }
                                                                                                    name={`langWritingMethod${index}`}
                                                                                                    type="radio"
                                                                                                    checked={
                                                                                                        languageTypeMethods.id == language[index].writing.toString()
                                                                                                    }
                                                                                                    className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                                    onChange={(
                                                                                                        e
                                                                                                    ) => {
                                                                                                        changeLangWriting(index,
                                                                                                            e
                                                                                                                .target
                                                                                                                .id
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                                {
                                                                                                    languageTypeMethods.title
                                                                                                }
                                                                                            </label>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        </fieldset>
                                                                    </td>
                                                                    <td>
                                                                        <button type="button" onClick={_ => removeLanguage(index)} className="hover:bg-gray-50 transition duration-150 text-sm flex items-center">
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
                                            {errors && errors["language"] ?
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors["language"]}
                                                </p> : null}
                                        </div>
                                        <div className="sm:col-span-6 border-t border-gray-300 py-5">
                                            <div className="flex justify-between ">
                                                <p>مهارت ها</p>
                                            </div>
                                            <button type="button" onClick={_ => addSkill()} className="hover:bg-gray-50 mt-2 mb-2 transition duration-150 shadow p-2 px-4 rounded-md text-sm flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 ml-1"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                                اضافه کردن مهارت جدید
                                            </button>
                                            <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="p-2">
                                                            ردیف
                                                        </th>
                                                        <th>
                                                            نوع مهارت
                                                        </th>
                                                        <th >
                                                            تجربه
                                                        </th>
                                                        <th>
                                                            ارزیابی مهارت
                                                        </th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        skill.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="text-center">
                                                                        {index + 1}
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.type} onChange={e => changeSkillType(index, e.target.value)} className="text-sm w-full text-center border-0 p-2" placeholder="نوع مهارت" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.experience} onChange={e => changeSkillExperience(index, e.target.value)} className="text-sm w-full text-center border-0 p-2" placeholder="تجربه" />
                                                                    </td>
                                                                    <td >
                                                                        <fieldset className="flex min-h-full items-center justify-center">
                                                                            <div className=" sm:flex sm:items-center">
                                                                                {languageTypeMethods.map(
                                                                                    (
                                                                                        languageTypeMethods
                                                                                    ) => (
                                                                                        <div
                                                                                            key={
                                                                                                `SkillMethod${languageTypeMethods.id}${index}`
                                                                                            }
                                                                                            className="flex items-center"
                                                                                        >
                                                                                            <label
                                                                                                htmlFor={
                                                                                                    `SkillMethod${languageTypeMethods.id}${index}`
                                                                                                }
                                                                                                className="ml-3 block text-sm font-medium text-gray-700"
                                                                                            >
                                                                                                <input
                                                                                                    id={
                                                                                                        languageTypeMethods.id
                                                                                                    }
                                                                                                    name={`skillExpMethod${index}`}

                                                                                                    type="radio"
                                                                                                    checked={
                                                                                                        languageTypeMethods.id == skill[index].evaluation.toString()
                                                                                                    }
                                                                                                    className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                                    onChange={(
                                                                                                        e
                                                                                                    ) => {
                                                                                                        changeSkillEvaluationMethod(index,
                                                                                                            e
                                                                                                                .target
                                                                                                                .id
                                                                                                        );
                                                                                                    }}
                                                                                                />
                                                                                                {
                                                                                                    languageTypeMethods.title
                                                                                                }
                                                                                            </label>
                                                                                        </div>
                                                                                    )
                                                                                )}
                                                                            </div>
                                                                        </fieldset>
                                                                    </td>
                                                                    <td>
                                                                        <button type="button" onClick={_ => removeSkill(index)} className="hover:bg-gray-50 transition duration-150 text-sm flex items-center">
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
                                            {errors && errors["skill"] ?
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors["skill"]}
                                                </p> : null}
                                        </div>
                                        <div className="sm:col-span-6 border-t border-gray-300 py-5">
                                            <div className="flex justify-between ">
                                                <p>مهمترین دوره‌های آموزشی مرتبط</p>
                                            </div>
                                            <button type="button" onClick={_ => addTraining()} className="hover:bg-gray-50 mt-2 mb-2 transition duration-150 shadow p-2 px-4 rounded-md text-sm flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 ml-1"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                                اضافه کردن دوره جدید
                                            </button>
                                            <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="p-2">
                                                            ردیف
                                                        </th>
                                                        <th>
                                                            نام دوره آموزشی
                                                        </th>
                                                        <th >
                                                            مدت دوره
                                                        </th>
                                                        <th>
                                                            برگزار کننده
                                                        </th>
                                                        <th>
                                                            سال برگزاری
                                                        </th>
                                                        <th>
                                                            توضیحات
                                                        </th>
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        training.map((item, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className="text-center">
                                                                        {index + 1}
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.name} onChange={e => changeTrainingName(index, e.target.value)} className="text-sm w-full text-center border-0 p-2" placeholder="نام دوره آموزشی" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.duration} onChange={e => changeTrainingDuration(index, e.target.value)} className="text-sm w-full text-center border-0 p-2" placeholder="مدت دوره" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.organizer} onChange={e => changeTrainingOrganizer(index, e.target.value)} className="text-sm w-full text-center border-0 p-2" placeholder="برگزار کننده" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.year} onChange={e => changeTrainingYear(index, e.target.value)} className="text-sm w-full text-center border-0 p-2" placeholder="سال برگزاری" />
                                                                    </td>
                                                                    <td>
                                                                        <input type="text" value={item.description} onChange={e => changeTrainingDescription(index, e.target.value)} className="text-sm w-full text-center border-0 p-2" placeholder="توضیحات" />
                                                                    </td>

                                                                    <td>
                                                                        <button type="button" onClick={_ => removeTraining(index)} className="hover:bg-gray-50 transition duration-150 text-sm flex items-center">
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
                                            {errors && errors["training"] ?
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors["training"]}
                                                </p> : null}
                                        </div>
                                        <div className="sm:col-span-6 pt-1 pb-2 border-t"></div>
                                        <div className="sm:col-span-3 "> {/*typeMethod */}
                                            <div className="grid lg:grid-cols-6 w-full gap-y-1 gap-x-4 xs:grid-cols-1">
                                                <div className="col-span-2 flex justify-contect pt-3 ">
                                                    <p
                                                        htmlFor="cover-photo"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        آیا سابقه محکومیت کیفری داشته اید؟
                                                        {errors && errors["criminalStatus"] ?
                                                            <p className="text-sm text-red-500 mt-1">
                                                                {errors["criminalStatus"]}
                                                            </p> : null}
                                                    </p>
                                                    <fieldset className="mr-4">
                                                        <div className="space-y-4 sm:flex  sm:space-y-0 sm:space-x-1">
                                                            {yesAndNoTypeMethods.map(
                                                                (
                                                                    yesAndNoTypeMethods
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            `criminalYesAndNoTypeMethods${yesAndNoTypeMethods.id}`
                                                                        }
                                                                        className="flex items-center"
                                                                    >
                                                                        <label
                                                                            htmlFor={
                                                                                `criminalYesAndNoTypeMethods${yesAndNoTypeMethods.id}`
                                                                            }
                                                                            className="ml-3 block text-sm font-medium text-gray-700"
                                                                        >
                                                                            <input
                                                                                id={
                                                                                    yesAndNoTypeMethods.id
                                                                                }
                                                                                name="criminalTypeMethod"
                                                                                type="radio"
                                                                                checked={
                                                                                    yesAndNoTypeMethods.id == criminalStatus.toString()
                                                                                }
                                                                                className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    setCriminalStatus(
                                                                                        e
                                                                                            .target
                                                                                            .id
                                                                                    );
                                                                                }}
                                                                            />
                                                                            {
                                                                                yesAndNoTypeMethods.title
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </fieldset>

                                                </div>
                                                <div className="col-span-4 pt-1">
                                                    {criminalStatus == '0' ?
                                                        <input type="text" value={criminalDescription} onChange={e => setCriminalDescription(e.target.value)} className="text-sm col-span-2 text-right w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="در صورت مثبت بودن توضیح دهید" />
                                                        : null}
                                                    {errors && errors["criminalDescription"] ?
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors["criminalDescription"]}
                                                        </p> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sm:col-span-3 "> {/*typeMethod */}
                                            <div className="grid lg:grid-cols-6 w-full gap-y-1 gap-x-4 xs:grid-cols-1">
                                                <div className="col-span-2 flex justify-contect pt-3 ">
                                                    <p
                                                        htmlFor="cover-photo"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        آیا سابقه عمل جراحی داشته اید؟
                                                        {errors && errors["surgeryStatus"] ?
                                                            <p className="text-sm text-red-500 mt-1">
                                                                {errors["surgeryStatus"]}
                                                            </p> : null}
                                                    </p>
                                                    <fieldset className="mr-4">
                                                        <div className="space-y-4 sm:flex  sm:space-y-0 sm:space-x-1">
                                                            {yesAndNoTypeMethods.map(
                                                                (
                                                                    yesAndNoTypeMethods
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            `surjeryYesAndNoTypeMethods${yesAndNoTypeMethods.id}`
                                                                        }
                                                                        className="flex items-center"
                                                                    >
                                                                        <label
                                                                            htmlFor={
                                                                                `surjeryYesAndNoTypeMethods${yesAndNoTypeMethods.id}`
                                                                            }
                                                                            className="ml-3 block text-sm font-medium text-gray-700"
                                                                        >
                                                                            <input
                                                                                id={
                                                                                    yesAndNoTypeMethods.id
                                                                                }
                                                                                name="surjeryTypeMethod"
                                                                                type="radio"
                                                                                checked={
                                                                                    yesAndNoTypeMethods.id == surgeryStatus.toString()
                                                                                }
                                                                                className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    setSurgeryStatus(
                                                                                        e
                                                                                            .target
                                                                                            .id
                                                                                    );
                                                                                }}
                                                                            />
                                                                            {
                                                                                yesAndNoTypeMethods.title
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </fieldset>

                                                </div>
                                                <div className="col-span-4 pt-1">
                                                    {surgeryStatus == '0' ?
                                                        <input type="text" value={surgeryDescription} onChange={e => setSurgeryDescription(e.target.value)} className="text-sm col-span-2 text-right w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="در صورت مثبت بودن توضیح دهید" />
                                                        : null}
                                                    {errors && errors["surgeryDescription"] ?
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors["surgeryDescription"]}
                                                        </p> : null}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3 "> {/*typeMethod */}
                                            <div className="grid lg:grid-cols-6 w-full gap-y-1 gap-x-4 xs:grid-cols-1">
                                                <div className="col-span-2 flex justify-contect pt-1 ">
                                                    <p
                                                        htmlFor="cover-photo"
                                                        className="block text-sm font-medium pt-2 ml-3 text-gray-700"
                                                    >
                                                        اوقات فراغت خود را چگونه سپری می‌کنید؟
                                                    </p>

                                                </div>
                                                <div className="col-span-4 pt-1">
                                                    <input type="text" value={freeTimeDescription} onChange={e => setFreeTimeDescription(e.target.value)} className="text-sm text-right w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="اوقات فراغت" />
                                                    {errors && errors["freeTimeDescription"] ?
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors["freeTimeDescription"]}
                                                        </p> : null}
                                                </div>

                                            </div>
                                        </div>
                                        <div className="sm:col-span-3 "> {/*typeMethod */}
                                            <div className="grid lg:grid-cols-6 w-full gap-y-1 gap-x-4 xs:grid-cols-1">
                                                <div className="col-span-2 flex justify-contect pt-1 ">
                                                    <p
                                                        htmlFor="cover-photo"
                                                        className="block text-sm font-medium pt-2 ml-3 text-gray-700"
                                                    >
                                                        با این شرکت چگونه آشنا شدید؟
                                                    </p>

                                                </div>
                                                <div className="col-span-4 pt-1">
                                                    <input type="text" value={knowing} onChange={e => setKnowing(e.target.value)} className="text-sm text-right w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="نحوه آشنایی" />
                                                    {errors && errors["knowing"] ?
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors["knowing"]}
                                                        </p> : null}
                                                </div>

                                            </div>
                                        </div>

                                        <div className="sm:col-span-3 "> {/*typeMethod */}
                                            <div className="grid lg:grid-cols-6 w-full gap-y-1 gap-x-4 xs:grid-cols-1">
                                                <div className="col-span-2 flex justify-contect pt-3 ">
                                                    <p
                                                        htmlFor="cover-photo"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        آیا در این شرکت دوست یا آشنایی دارید؟
                                                        {errors && errors["friendStatus"] ?
                                                            <p className="text-sm text-red-500 mt-1">
                                                                {errors["friendStatus"]}
                                                            </p> : null}
                                                    </p>
                                                    <fieldset className="mr-4">
                                                        <div className="space-y-4 sm:flex  sm:space-y-0 sm:space-x-1">
                                                            {yesAndNoTypeMethods.map(
                                                                (
                                                                    yesAndNoTypeMethods
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            `friendYesAndNoTypeMethods${yesAndNoTypeMethods.id}`
                                                                        }
                                                                        className="flex items-center"
                                                                    >
                                                                        <label
                                                                            htmlFor={
                                                                                `friendYesAndNoTypeMethods${yesAndNoTypeMethods.id}`
                                                                            }
                                                                            className="ml-3 block text-sm font-medium text-gray-700"
                                                                        >
                                                                            <input
                                                                                id={
                                                                                    yesAndNoTypeMethods.id
                                                                                }
                                                                                name="friendTypeMethod"
                                                                                type="radio"
                                                                                checked={
                                                                                    yesAndNoTypeMethods.id == friendStatus.toString()
                                                                                }
                                                                                className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    setFriendStatus(
                                                                                        e
                                                                                            .target
                                                                                            .id
                                                                                    );
                                                                                }}
                                                                            />
                                                                            {
                                                                                yesAndNoTypeMethods.title
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="col-span-4 pt-1">
                                                    {friendStatus == "0" ?
                                                        <input type="text" value={friendDescription} onChange={e => setFriendDescription(e.target.value)} className="text-sm col-span-2 text-right w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="در صورت مثبت بودن نام ببرید" />
                                                        : null}
                                                    {errors && errors["friendDescription"] ?
                                                        <p className="text-sm text-red-500 mt-1">
                                                            {errors["friendDescription"]}
                                                        </p> : null}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-6 "> {/*typeMethod */}
                                            <div className="grid lg:grid-cols-6 w-full gap-y-1 gap-x-4 xs:grid-cols-2">
                                                <div className="lg:col-span-2 xs:col-span-6 flex justify-contect pt-3 ">
                                                    <p
                                                        htmlFor="cover-photo"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        نحوه همکاری:
                                                        {errors && errors["coOperateStatus"] ?
                                                            <p className="text-sm text-red-500 mt-1">
                                                                {errors["coOperateStatus"]}
                                                            </p> : null}
                                                    </p>
                                                    <fieldset className="mr-4">
                                                        <div className="space-y-4 sm:flex  sm:space-y-0 sm:space-x-1">
                                                            {coOperateTypeMethods.map(
                                                                (
                                                                    coOperateTypeMethods
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            `coOperateTypeMethods${coOperateTypeMethods.id}`
                                                                        }
                                                                        className="flex items-center"
                                                                    >
                                                                        <label
                                                                            htmlFor={
                                                                                `coOperateTypeMethods${coOperateTypeMethods.id}`
                                                                            }
                                                                            className="ml-3 block text-sm font-medium text-gray-700"
                                                                        >
                                                                            <input
                                                                                id={
                                                                                    coOperateTypeMethods.id
                                                                                }
                                                                                name="coOperateTypeMethod"
                                                                                type="radio"
                                                                                checked={
                                                                                    coOperateTypeMethods.id == coOperateStatus.toString()
                                                                                }
                                                                                className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    setCoOperateStatus(
                                                                                        e
                                                                                            .target
                                                                                            .id
                                                                                    );
                                                                                }}
                                                                            />
                                                                            {
                                                                                coOperateTypeMethods.title
                                                                            }
                                                                        </label>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                <div className="col-span-4 pt-1">
                                                    <input type="text" value={salary} onChange={e => setSalary(addCommas(removeNonNumeric(
                                                        e.target.value)))} className="text-sm col-span-2 text-right w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="میزان حقوق درخواستی را بیان کنید" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sm:col-span-6 "> {/*typeMethod */}
                                            <div className="grid lg:grid-cols-1 w-full gap-y-6 gap-x-4 xs:grid-cols-1">
                                                <div className="col-span-1 flex justify-contect pt-3 pb-3">
                                                    <div className="grid lg:grid-cols-6 w-full gap-y-2 gap-x-4 xs:grid-cols-2">
                                                        <div className="col-span-2">
                                                            <p
                                                                htmlFor="cover-photo"
                                                                className="block text-sm  font-medium text-gray-700"
                                                            >
                                                                چنانچه قبلا تحت پوشش بیمه بوده اید، نوع آن را مشخص کنید
                                                            </p>
                                                        </div>
                                                        <div className="col-span-2">
                                                            <fieldset className="mr-4">
                                                                <div className="space-y-1 sm:flex  xs:space-y-0 xs:space-x-1">
                                                                    {insuranceTypeMethods.map(
                                                                        (
                                                                            insuranceTypeMethods
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    `insuranceTypeMethods${insuranceTypeMethods.id}`
                                                                                }
                                                                                className="flex items-center"
                                                                            >
                                                                                <label
                                                                                    htmlFor={
                                                                                        `insuranceTypeMethods${insuranceTypeMethods.id}`
                                                                                    }
                                                                                    className="ml-3 block text-sm font-medium text-gray-700"
                                                                                >
                                                                                    <input
                                                                                        id={
                                                                                            insuranceTypeMethods.id
                                                                                        }
                                                                                        name="insuranceTypeMethod"
                                                                                        type="radio"
                                                                                        checked={
                                                                                            insuranceTypeMethods.id == insuranceType.toString()
                                                                                        }
                                                                                        className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            setInsuranceType(
                                                                                                e
                                                                                                    .target
                                                                                                    .id
                                                                                            );
                                                                                        }}
                                                                                    />
                                                                                    {
                                                                                        insuranceTypeMethods.title
                                                                                    }
                                                                                </label>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </fieldset>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="sm:col-span-3 "> {/*typeMethod */}
                                            <div className="grid grid-cols-6 w-full gap-y-6 gap-x-4 sm:grid-cols-6">
                                                <div className="col-span-2 flex justify-contect pt-1 ">
                                                    <p
                                                        htmlFor="cover-photo"
                                                        className="block text-sm font-medium pt-2 ml-3 text-gray-700"
                                                    >
                                                        در صورت داشتن سابقه بیمه، مدت زمان و شماره بیمه را ذکر کنید:
                                                    </p>

                                                </div>
                                                <div className="col-span-4 pt-1">
                                                    <input type="text" value={insuranceYear} onChange={e => setInsuranceYear(e.target.value)} className="text-sm text-right mr-2 border border-gray-300 rounded-md shadow-sm p-2" placeholder="سال" />
                                                    <input type="text" value={insuranceMonth} onChange={e => setInsuranceMonth(e.target.value)} className="text-sm text-right mr-2 border border-gray-300 rounded-md shadow-sm p-2" placeholder="ماه" />
                                                    <input type="text" value={insuranceNumber} onChange={e => setInsuranceNumber(e.target.value)} className="text-sm text-right mr-2 border border-gray-300 rounded-md shadow-sm p-2" placeholder="شماره بیمه" />
                                                </div>

                                            </div>
                                        </div>

                                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 border-t border-gray-300 py-5">
                                            <div className="sm:col-span-2">
                                                {loadingUpload ?
                                                    <SkeletonTheme highlightColor="#fb923c" height={50}>
                                                        <p>
                                                            <Skeleton count={1} />
                                                        </p>
                                                    </SkeletonTheme>
                                                    : attachement == "" ?
                                                        <>
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
                                                                                        e
                                                                                    );
                                                                                }}
                                                                            />
                                                                        </label>
                                                                    </div>
                                                                    <p className="text-xs text-gray-500">
                                                                        کمتر از ۱۰ مگابایت
                                                                    </p>
                                                                </div>
                                                            </div></> :
                                                        attachement != ""
                                                            ?
                                                            <span
                                                                key={1}
                                                                className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    disabled
                                                                    className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                                >
                                                                    {"فایل رزومه"}
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        deleteFile()
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
                                                            : ""}

                                            </div>

                                        </div>
                                        {errors["upload"] ? (
                                            <span className="text-sm text-red-500">
                                                {
                                                    errors[
                                                    "upload"
                                                    ]
                                                }
                                            </span>
                                        ) : null}
                                        <div className="sm:col-span-6 mb-2">
                                            <p className="text-sm text-black-500 mb-3 ">
                                                شما با ارسال این پرسشنامه، تعهد زیر را می‌پذیرید:
                                            </p>
                                            <p className="text-sm text-black-500 ">
                                                اینجانب تعهد می‌نمایم که کلیه اطلاعات درخواستی را با حسن نیست و در کمال صداقت پاسخ گفته و اگر در آینده هرگونه خلافی از این اطلاعات مشاهده گردید به منزله استعفای اینجانب از کارم تلقی شده و شرکت به هر نحو که بخواهد نسبت به اعاده ضرر و زیان خود علیه اینجانب اقدام نماید.
                                                همچنین پر کردن این پرسشنامه حقی در ارتباط با استخدام برای اینجانب ایجاد نمی‌نماید.
                                            </p>
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
                                            {errors["general"] ? (
                                                <span className="text-sm text-red-500">
                                                    {
                                                        errors[
                                                        "general"
                                                        ]
                                                    }
                                                </span>
                                            ) : null}
                                            {errors["activationCode"] ? (
                                                <span className="text-sm text-red-500">
                                                    {
                                                        errors[
                                                        "activationCode"
                                                        ]
                                                    }
                                                </span>
                                            ) : null}
                                            <div className="flex ">
                                                <div className="grid lg:grid-cols-7 sm:grid-cols-4 md:grid-cols-3 gap-4 w-full">
                                                    <div className="col-span-1 w-full">
                                                        <button
                                                            onClick={getOtp}
                                                            disabled={otpSend || sendingOtpLoading}
                                                            className={` py-2 px-4 border
                                                        border-transparent
                                                        rounded-md
                                                        shadow-sm
                                                        text-sm
                                                        font-medium
                                                        text-white
                                                        ${!otpSend ? sendingOtpLoading ? `bg-gray-500` : `bg-amber-500` : `bg-gray-500`}
                                                        ${!otpSend ? sendingOtpLoading ? `hover:bg-gray-600` : `hover:bg-amber-600` : `hover:bg-gray-600`}                            
                                                        focus:outline-none
                                                        focus:ring-2
                                                        focus:ring-offset-2
                                                        focus:ring-amber-500
                                                        text-center
                                                        w-full`}
                                                        >
                                                            {sendingOtpLoading ? "در حال ارسال" : !otpSend ? " دریافت کد یکبار مصرف" : minutes === 0 && seconds === 0
                                                                ? " دریافت کد یکبار مصرف"
                                                                : <h1 >دریافت مجدد کد {`0${minutes}`}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                                                            }
                                                        </button>
                                                    </div>
                                                    {otpSend ?
                                                        <>
                                                            <div className="col-span-1 ">
                                                                <input type="text" value={activationCode} onChange={e => setActivationCode(e.target.value)} className="text-sm ml-4 w-full text-center border border-gray-300 rounded-md shadow-sm p-2" placeholder="کد یکبار مصرف" />
                                                            </div>
                                                            <div className="col-span-1 ">
                                                                <button
                                                                    type="submit"
                                                                    className="ml-2 w-full inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                                                                >
                                                                    ثبت فرم
                                                                </button></div>
                                                        </>
                                                        : null}
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
                        </main >
                    </div > :
                    <div>
                        <div className=" grid lg:grid-cols-7 xs:grid-cols-2 bg-green-700 p-2 mb-5 rounded-md shadow-sm">
                            <div className="col-span-3"></div>
                            <div className="col-span-1">
                                <div className=" flex justify-center text-white">
                                    اطلاعات با موفقیت ثبت شد
                                </div>
                            </div>
                            <div className="col-span-3"></div>
                        </div>
                    </div>
                :
                error ?
                    <div>
                        <div className=" grid lg:grid-cols-7 xs:grid-cols-2 bg-red-700 p-2 mb-5 rounded-md shadow-sm">
                            <div className="col-span-3"></div>
                            <div className="col-span-1">
                                <div className=" flex justify-center text-white">
                                    {
                                        error
                                    }
                                </div>
                            </div>
                            <div className="col-span-3"></div>
                        </div>
                    </div>
                    :
                    <div>
                        <div className=" grid lg:grid-cols-7 xs:grid-cols-2 bg-green-700 p-2 mb-5 rounded-md shadow-sm">
                            <div className="col-span-3"></div>
                            <div className="col-span-1">
                                <div className=" flex justify-center text-white">
                                    در حال دریافت اطلاعات
                                </div>
                            </div>
                            <div className="col-span-3"></div>
                        </div>
                    </div>
            }
        </div >
    );
}
