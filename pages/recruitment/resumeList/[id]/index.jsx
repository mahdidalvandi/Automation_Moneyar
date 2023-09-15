import SidebarDesktop from "../../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../../components/layout/sidebarMobile";
import StickyHeader from "../../../../components/layout/stickyHeader";
import navigationList from "../../../../components/layout/navigationList";
import InputBox from "../../../../components/forms/inputBox";
import { useState, forwardRef, useEffect, useRef } from "react";
import Link from "next/link";
import axios from "../../../../lib/axios";
import Image from "next/image";
import { loadImageFromServer } from "../../../../lib/helper";
import Forbidden from "../../../../components/forms/forbidden";
import Textarea from "../../../../components/forms/textarea";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useRouter } from "next/router";

import * as React from "react";
import { useResume } from "../../../../hooks/resume";
import fileDownload from "js-file-download";
import ExpertDialog from "../../../../components/forms/expertInterviewDialog";
import PublicDialog from "../../../../components/forms/publicInterviewDialog";
import FinalDialog from "../../../../components/forms/finalInterviewDialog";

import ReactToPrint from "react-to-print";

import moment from "jalali-moment";
import { fileURLToPath } from "url";
moment.locale("fa");

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AddUser() {
  let componentRef = useRef();
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();

  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState([]);
  const [education, setEducation] = useState([]);
  const [language, setLanguage] = useState([]);
  const [skill, setSkill] = useState([]);
  const [training, setTraining] = useState([]);
  const [birthDate, setBirthDate] = useState();
  const [nameAndFamily, setNameAndFamily] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [registerPlace, setRegisterPlate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [gender, setGender] = useState("");
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
  const [criminalStatus, setCriminalStatus] = useState("");
  const [criminalDescription, setCriminalDescription] = useState("");
  const [surgeryStatus, setSurgeryStatus] = useState("");
  const [surgeryDescription, setSurgeryDescription] = useState("");
  const [freeTimeDescription, setFreeTimeDescription] = useState("");
  const [knowing, setKnowing] = useState("");
  const [friendStatus, setFriendStatus] = useState(-1);
  const [friendDescription, setFriendDescription] = useState("");
  const [coOperateStatus, setCoOperateStatus] = useState("");
  const [salary, setSalary] = useState("");
  const [insuranceType, setInsuranceType] = useState(-1);
  const [insuranceYear, setInsuranceYear] = useState("");
  const [insuranceMonth, setInsuranceMonth] = useState("");
  const [insuranceNumber, setInsuranceNumber] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [avatar, setAvatar] = useState("");
  const [interviewId, setInterviewId] = useState("");
  const [pdf, setPdf] = useState();
  const [expertDialog, setExpertDialog] = useState(false);
  const [publicDialog, setPublicDialog] = useState(false);
  const [finalDialog, setFinalDialog] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [publicResult, setPublicResult] = useState();
  const [expertResult, setExpertResult] = useState();
  const [managerResult, setManagerResult] = useState();
  const [publicHashtags, setPublicHashtags] = useState();
  const [expertHashtags, setExpertHashtags] = useState();

  const router = useRouter();
  const { getResume, resumeData, isResumeLoading, error } = useResume();

  useEffect(() => {
    async function getData() {
      await axios.get("api/v1/hashtag/public_list").then((response) => {
        setPublicHashtags(response.data.data);
      });
      await axios.get("api/v1/hashtag/expert_list").then((response) => {
        setExpertHashtags(response.data.data);
      });
    }
    if (loadingData) {
      getData();
    }
  }, []);

  useEffect(() => {
    if (router.isReady) {
      getResume(router.query.id);
      setInterviewId(router.query.id);
    }
  }, [router.isReady]);

  const setDialogClose = () => {
    window.location.reload();
  };

  const DownloadFile = (value, type) => {
    axios
      .get(`/api/v1/interview/resume/download`, {
        params: {
          file_uuid: value,
        },
        responseType: "blob",
      })
      .then((res) => {
        setPdf(window.URL.createObjectURL(res.data));
      });
  };

  const handleOpenDialog = () => {
    setExpertDialog(true);
  };
  const handlePublicOpenDialog = () => {
    setPublicDialog(true);
  };
  const handleFinalOpenDialog = () => {
    setFinalDialog(true);
  };
  const openLinkInNewTab = () => {
    const newTab = window.open(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/interview/print/${router.query.id}`,
      "_blank",
      "noopener,noreferrer"
    );
    if (newTab) newTab.opener = null;
  };
  return (
    <div>
      <SidebarMobile menu={navigationList()} loc={router.asPath} />
      <SidebarDesktop
        menu={navigationList()}
        loc={router.asPath}
        setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
        setActions={(props) => setCurrentUserActions(props.currentUserActions)}
        setIsHolding={(props) => {}}
        setSuperUser={(props) => {}}
      />
      {resumeData ? (
        <div className="md:pr-52 flex flex-col flex-1 mb-20">
          <StickyHeader />

          <main>
            <div className="py-6">
              <div className="w-full px-4 sm:px-6 md:px-8">
                <div className="flex w-full justify-end">
                  {/* <ReactToPrint
                                        pageStyle="@page { size: 210mm 297mm; marginLeft:10px; }"
                                        trigger={() => <button className="bg-[#1f2937] text-white px-2 py-2 rounded-md text-sm inline-block ml-1" scale={0.8}>چاپ </button>}
                                        content={() => componentRef}
                                    /> */}
                  <button
                    onClick={() => openLinkInNewTab()}
                    className="bg-[#1f2937] text-white px-2 py-2 rounded-md text-sm inline-block ml-1"
                    scale={0.8}
                  >
                    چاپ{" "}
                  </button>
                  {!publicResult ? (
                    <button
                      onClick={() => handlePublicOpenDialog()}
                      className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                    >
                      ثبت نتیجه مصاحبه عمومی
                    </button>
                  ) : null}
                  {!expertResult ? (
                    <button
                      onClick={() => handleOpenDialog()}
                      className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                    >
                      ثبت نتیجه مصاحبه تخصصی
                    </button>
                  ) : null}
                  {!managerResult && publicResult && expertResult ? (
                    <button
                      onClick={() => handleFinalOpenDialog()}
                      className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                    >
                      ثبت نتیجه نهایی مصاحبه
                    </button>
                  ) : null}
                </div>
                <form
                  autoComplete="off"
                  className="space-y-1 "
                  style={{ direction: "rtl" }}
                  ref={(el) => (componentRef = el)}
                >
                  {resumeData && resumeData.result_items ? (
                    <div className="grid grid-cols-1 gap-y-6  gap-x-4 sm:grid-cols-6 mt-5">
                      {resumeData.result_items.map((item, index) => {
                        item.type === 1 && !expertResult
                          ? setExpertResult(true)
                          : null;
                        item.type === 0 && !publicResult
                          ? setPublicResult(true)
                          : null;
                        item.type === 2 && !managerResult
                          ? setManagerResult(true)
                          : null;
                        return item.type === 2 ? (
                          <div className="grid grid-cols-6 gap-y-4  gap-x-4 col-span-6 rounded-md bg-gray-200 p-3">
                            <div className="col-span-6 flex justify-between">
                              {item.type == 2 ? (
                                <p className="flex justify-start">
                                  {" "}
                                  نتیجه نظر مدیریت:{" "}
                                  <p
                                    className={`${
                                      item.approved == 1 || item.approved == 2
                                        ? "text-green-500"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {item.approved == 0
                                      ? "رد شده"
                                      : item.approved == 1
                                      ? " قبول"
                                      : item.approved == 2
                                      ? " مشروط"
                                      : " عدم توافق پکیج"}
                                  </p>
                                </p>
                              ) : null}{" "}
                              <p>{`تایید کننده :${item.interviewer_name}`}</p>
                              <p>{`زمان ثبت:${moment
                                .unix(item.timestamp)
                                .format(" HH:mm YYYY/MM/DD")}`}</p>
                            </div>
                            <div className="col-span-3">
                              <InputBox
                                title="وضعیت استخدام در شرکت "
                                name="startDate"
                                value={
                                  item.approved == 0
                                    ? "رد شده"
                                    : item.approved == 1
                                    ? "قبول"
                                    : item.approved == 2
                                    ? "مشروط"
                                    : "عدم توافق پکیج"
                                }
                                disabled
                              />
                            </div>
                            <div className="col-span-3">
                              <InputBox
                                title="تاریخ شروع به کار "
                                name="startDate"
                                value={moment
                                  .unix(item.startDate)
                                  .format("YYYY/MM/DD")}
                                disabled
                              />
                            </div>
                            <div className="col-span-3">
                              <InputBox
                                title="مدت قرارداد"
                                name={item.contractDuration}
                                value={item.contractDuration}
                                disabled
                              />
                            </div>
                            <div className="sm:col-span-3">
                              <InputBox
                                title="حقوق پایه(ریال)"
                                name={item.salary}
                                value={item.salary}
                                disabled
                              />
                            </div>
                            <div className="sm:col-span-6">
                              <Textarea
                                title="نظر نهایی"
                                name="Agenda"
                                defaultValue={item.comment}
                                rows="5"
                                disabled
                                type="text"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="sm:col-span-6 rounded-md bg-gray-200 p-3">
                            <div className="flex justify-between">
                              {item.type == 0 ? (
                                <p className="flex justify-start">
                                  {" "}
                                  نتیجه مصاحبه عمومی:{" "}
                                  <p
                                    className={`${
                                      item.approved == 1 || item.approved == 2
                                        ? "text-green-500"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {item.approved == 0
                                      ? "رد شده"
                                      : item.approved == 1
                                      ? " قبول"
                                      : item.approved == 2
                                      ? " مشروط"
                                      : " عدم توافق پکیج"}
                                  </p>
                                </p>
                              ) : null}
                              {item.type == 1 ? (
                                <p className="flex justify-start">
                                  {" "}
                                  نتیجه مصاحبه تخصصی:{" "}
                                  <p
                                    className={`${
                                      item.approved == 1 || item.approved == 2
                                        ? "text-green-500"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {item.approved == 0
                                      ? "رد شده"
                                      : item.approved == 1
                                      ? " قبول"
                                      : item.approved == 2
                                      ? " مشروط"
                                      : " عدم توافق پکیج"}
                                  </p>
                                </p>
                              ) : null}
                              {/* 
                                                                <p>{item.type === 0 ?
                                                                 `نتیجه مصاحبه عمومی: ${item.approved == 0 ? <p>"رد"</p> : item.approved == 1 ? <p>{'قبول'}</p> : item.approved == 2 ? "مشروط" : "عدم توافق پکیج"}` : 
                                                                 item.type === 1 ? `نتیجه مصاحبه تخصصی: ${item.approved == 0 ? "رد" : item.approved == 1 ? "قبول" : item.approved == 2 ? "مشروط" : "عدم توافق پکیج"}` 
                                                                 : "نتیجه نظر مدیریت"}</p> */}
                              <p>{`مصاحبه کننده: ${item.interviewer_name}`}</p>
                              <p>{`زمان ثبت: ${moment
                                .unix(item.timestamp)
                                .format(" HH:mm YYYY/MM/DD")}`}</p>
                            </div>
                            <div className="sm:col-span-6  py-2">
                              <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="p-2">ردیف</th>
                                    <th>شایستگی مورد انتظار</th>
                                    <th>امتیاز</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.json.map((item, index) => {
                                    return (
                                      <tr key={index}>
                                        <td className="w-10">
                                          <input
                                            type="text"
                                            value={index + 1}
                                            className="text-sm w-full text-center border-0 p-2"
                                            placeholder="شایستگی مورد انتظار"
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            value={item.competence}
                                            className="text-sm w-full text-center border-0 p-2"
                                            placeholder="شایستگی مورد انتظار"
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="text"
                                            value={item.rate}
                                            className="text-sm text-center w-full border-0 p-2"
                                            placeholder="امتیاز"
                                          />
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            <div>
                              <Textarea
                                title="نظر نهایی"
                                name="Agenda"
                                disabled
                                defaultValue={item.comment}
                                rows="5"
                                type="text"
                              />
                            </div>
                          </div>
                        );
                      })}
                      <div className="sm:col-span-6 pt-1 border-t"></div>
                    </div>
                  ) : null}

                  <div className="max-w-full mx-auto px-1 sm:px-1 md:px-1">
                    <div className="mb-4"></div>
                    <div className="mb-4">
                      <p
                        htmlFor="cover-photo"
                        className="block text-lg font-large text-gray-700"
                      >
                        فرم اطلاعات فردی
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-2">
                      <InputBox
                        title="نام و نام خانوادگی"
                        name={nameAndFamily}
                        value={resumeData.applicant_resume.nameAndFamily}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <InputBox
                        title="نام پدر"
                        name={fatherName}
                        value={resumeData.applicant_resume.fatherName}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <InputBox
                        title="تاریخ تولد"
                        name={birthDate}
                        value={moment
                          .unix(resumeData.applicant_resume.birthDate)
                          .format("YYYY/MM/DD")}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <InputBox
                        title="شماره شناسنامه"
                        name={nationalId}
                        value={resumeData.applicant_resume.nationalId}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <InputBox
                        title="محل صدور"
                        name={registerPlace}
                        value={resumeData.applicant_resume.registerPlace}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <InputBox
                        title="محل تولد"
                        name={birthPlace}
                        value={resumeData.applicant_resume.birthPlace}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <InputBox
                        title="جنسیت"
                        name={gender}
                        value={
                          resumeData.applicant_resume.gender == 0
                            ? "زن"
                            : resumeData.applicant_resume.gender == 1
                            ? "مرد"
                            : "وارد نشده است"
                        }
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <InputBox
                        title="کد ملی"
                        name={nationalCode}
                        value={resumeData.applicant_resume.nationalCode}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <InputBox
                        title="تابعیت"
                        name={citizenShip}
                        value={resumeData.applicant_resume.citizenShip}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <InputBox
                        title="دین"
                        name={religion}
                        value={resumeData.applicant_resume.religion}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <InputBox
                        title="مذهب"
                        name={religionBranch}
                        value={resumeData.applicant_resume.religionBranch}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                    <div className="sm:col-span-6 pt-1 border-t"></div>
                    <div className="sm:col-span-6">
                      <div className="flex justify-start gap-x-10">
                        <div className="xs:col-span-1">
                          {" "}
                          {/*typeMethod */}
                          <InputBox
                            title="وضعیت تاهل"
                            name={marriageStatus}
                            value={
                              resumeData.applicant_resume.marriageStatus == 0
                                ? "متاهل"
                                : resumeData.applicant_resume.marriageStatus ==
                                  1
                                ? "مجرد"
                                : "وارد نشده است"
                            }
                            disabled
                            notGrayDisable={true}
                          />
                        </div>
                        <div className="xs:col-span-1">
                          {" "}
                          {/*typeMethod */}
                          <InputBox
                            title="وسیله نقلیه"
                            name={vehicleStatus}
                            value={
                              resumeData.applicant_resume.vehicleStatus == 0
                                ? "دارم"
                                : resumeData.applicant_resume.vehicleStatus == 1
                                ? "ندارم"
                                : "وارد نشده است"
                            }
                            disabled
                            notGrayDisable={true}
                          />
                        </div>
                        <div className="xs:col-span-1">
                          {" "}
                          {/*typeMethod */}
                          <InputBox
                            title="وضعیت نظام وظیفه"
                            name={militaryStatus}
                            value={
                              resumeData.applicant_resume.militaryStatus == 0
                                ? "عیر مشمول"
                                : resumeData.applicant_resume.militaryStatus ==
                                  1
                                ? "پایان خدمت"
                                : resumeData.applicant_resume.militaryStatus ==
                                  2
                                ? "معاف"
                                : "وارد نشده است"
                            }
                            disabled
                            notGrayDisable={true}
                          />
                        </div>
                        <div className="xs:col-span-1">
                          {" "}
                          {/*typeMethod */}
                          {resumeData.applicant_resume.militaryStatus == 2 ? (
                            <InputBox
                              title="دلیل معافیت"
                              name={militaryStatusDesc}
                              value={
                                resumeData.applicant_resume.militaryStatusDesc
                              }
                              disabled
                              notGrayDisable={true}
                            />
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-6 pt-1 border-t"></div>
                    <div className="sm:col-span-2">
                      {" "}
                      {/*typeMethod */}
                      <InputBox
                        title="مشمولان قانون خدمت پزشکان و پیراپزشکان"
                        name={doctorStatus}
                        value={
                          resumeData.applicant_resume.doctorStatus == 0
                            ? "طرح انجام شده"
                            : resumeData.applicant_resume.doctorStatus == 1
                            ? "طرح انجام نشده"
                            : "وارد نشده است"
                        }
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <InputBox
                        title="در صورت انجام طرح، نام محل ذکر شود"
                        name={doctorStatusPlace}
                        value={resumeData.applicant_resume.doctorStatusPlace}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                    <div className="sm:col-span-4"></div>
                    <div className="sm:col-span-6 pt-1 border-t"></div>
                    <div className="sm:col-span-1">
                      <InputBox
                        title="شهر محل سکونت"
                        name={city}
                        value={resumeData.applicant_resume.city}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <InputBox
                        title="آدرس کامل"
                        name={address}
                        value={resumeData.applicant_resume.address}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <InputBox
                        title="تلفن ثابت"
                        name={telephone}
                        value={resumeData.applicant_resume.telephone}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <InputBox
                        title="تلفن همراه"
                        name={cellPhone}
                        value={resumeData.applicant_resume.cellPhone}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <InputBox
                        title="ایمیل"
                        name={email}
                        value={resumeData.applicant_resume.email}
                        disabled
                        notGrayDisable={true}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-6  border-t border-gray-300 py-5">
                    <div className="flex justify-between">
                      <p>سوابق کاری</p>
                      <div className="flex">
                        <div className="ml-2"></div>
                      </div>
                    </div>

                    <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2">ردیف</th>
                          <th>محل کار</th>
                          <th>سمت</th>
                          <th>سال شروع</th>
                          <th>سال پایان</th>
                          <th>علت ترک کار</th>
                          <th>توضیحات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumeData.applicant_resume.resume.map(
                          (item, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.place}
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="وارد نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.position}
                                    className="text-sm text-center w-full border-0 p-2"
                                    placeholder="وارد نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.startDate}
                                    className="text-sm text-center w-full border-0 p-2"
                                    placeholder="وارد نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.endDate}
                                    className="text-sm text-center w-full border-0 p-2"
                                    placeholder="وارد نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.leavingWorkReason}
                                    className="text-sm text-center w-full border-0 p-2"
                                    placeholder="وارد نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.desc}
                                    className="text-sm text-center w-full border-0 p-2"
                                    placeholder="وارد نشده است"
                                  />
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="sm:col-span-6 border-t border-gray-300 py-5">
                    <div className="flex justify-between">
                      <p>سوابق تحصیلی(دو مقطع تحصیلی آخر)</p>
                    </div>

                    <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2">ردیف</th>
                          <th>مقطع</th>
                          <th>رشته</th>
                          <th>گرایش تحصیلی</th>
                          <th>نام دانشگاه یا موسسه</th>
                          <th>موضوع پایان نامه</th>
                          <th>تاریخ شروع</th>
                          <th>تاریخ پایان</th>
                          <th>معدل</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumeData.applicant_resume.education.map(
                          (item, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.grade}
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.field}
                                    className="text-sm text-center w-full border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.orientation}
                                    className="text-sm text-center w-full border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.institute}
                                    className="text-sm text-center w-full border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.thesis}
                                    className="text-sm text-center w-full border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.startDate}
                                    className="text-sm text-center w-full border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.endDate}
                                    className="text-sm text-center w-full border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.gpa}
                                    className="text-sm text-center w-full border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="sm:col-span-6 border-t border-gray-300 py-5">
                    <div className="flex justify-between ">
                      <p>آشنایی با زبان های خارجی</p>
                    </div>
                    <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2">ردیف</th>
                          <th>نام زبان</th>
                          <th>مکالمه</th>
                          <th>ترجمه</th>
                          <th>خواندن</th>
                          <th>نوشتن</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumeData.applicant_resume.language.map(
                          (item, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.name}
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={
                                      item.conversation == 0
                                        ? "عالی"
                                        : item.conversation == 1
                                        ? "خوب"
                                        : "متوسط"
                                    }
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={
                                      item.translate == 0
                                        ? "عالی"
                                        : item.translate == 1
                                        ? "خوب"
                                        : "متوسط"
                                    }
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={
                                      item.reading == 0
                                        ? "عالی"
                                        : item.reading == 1
                                        ? "خوب"
                                        : "متوسط"
                                    }
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={
                                      item.writing == 0
                                        ? "عالی"
                                        : item.writing == 1
                                        ? "خوب"
                                        : "متوسط"
                                    }
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="sm:col-span-6 border-t border-gray-300 py-5">
                    <div className="flex justify-between ">
                      <p>مهارت ها</p>
                    </div>
                    <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2">ردیف</th>
                          <th>نوع مهارت</th>
                          <th>تجربه</th>
                          <th>ارزیابی مهارت</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumeData.applicant_resume.skill.map(
                          (item, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.type}
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={item.experience}
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    disabled
                                    value={
                                      item.evaluation == 0
                                        ? "عالی"
                                        : item.evaluation == 1
                                        ? "خوب"
                                        : item.evaluation == 2
                                        ? "متوسط"
                                        : "ثبت نشده است"
                                    }
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="ثبت نشده است"
                                  />
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="sm:col-span-6 border-t border-gray-300 py-5">
                    <div className="flex justify-between ">
                      <p>سوابق آموزشی</p>
                    </div>
                    <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2">ردیف</th>
                          <th>نام دوره آموزشی</th>
                          <th>مدت دوره</th>
                          <th>برگزار کننده</th>
                          <th>سال برگزاری</th>
                          <th>توضیحات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumeData.applicant_resume.training.map(
                          (item, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>
                                  <input
                                    type="text"
                                    value={item.name}
                                    disabled
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="نام دوره آموزشی"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={item.duration}
                                    disabled
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="مدت دوره"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={item.organizer}
                                    disabled
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="برگزار کننده"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={item.year}
                                    disabled
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="سال برگزاری"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={item.description}
                                    disabled
                                    className="text-sm w-full text-center border-0 p-2"
                                    placeholder="توضیحات"
                                  />
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="sm:col-span-6 pt-1 pb-2 border-t"></div>
                  <div className="sm:col-span-3 ">
                    {" "}
                    {/*typeMethod */}
                    <div className="grid lg:grid-cols-6 w-full gap-y-1 gap-x-4 xs:grid-cols-1">
                      <div className="col-span-2 flex justify-contect pt-3 ">
                        <p
                          htmlFor="cover-photo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          آیا سابقه محکومیت کیفری داشته اید؟
                        </p>
                        <p className="mr-4">
                          {resumeData.applicant_resume.criminalStatus == 0
                            ? "بله"
                            : resumeData.applicant_resume.criminalStatus == 1
                            ? "خیر"
                            : "ثبت نشده است"}{" "}
                        </p>
                      </div>
                      <div className="col-span-4 pt-1">
                        {resumeData.applicant_resume.criminalDescription ? (
                          <input
                            value={
                              resumeData.applicant_resume.criminalDescription
                            }
                            disabled
                            className="text-sm col-span-2 text-right w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="در صورت مثبت بودن توضیح دهید"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-3 ">
                    {" "}
                    {/*typeMethod */}
                    <div className="grid lg:grid-cols-6 w-full gap-y-1 gap-x-4 xs:grid-cols-1">
                      <div className="col-span-2 flex justify-contect pt-3 ">
                        <p
                          htmlFor="cover-photo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          آیا سابقه عمل جراحی داشته اید؟
                        </p>
                        <p className="mr-4">
                          {resumeData.applicant_resume.surgeryStatus == 0
                            ? "بله"
                            : resumeData.applicant_resume.surgeryStatus == 1
                            ? "خیر"
                            : "ثبت نشده است"}{" "}
                        </p>
                      </div>
                      <div className="col-span-4 pt-1">
                        {resumeData.applicant_resume.surgeryDescription ? (
                          <input
                            value={
                              resumeData.applicant_resume.surgeryDescription
                            }
                            disabled
                            className="text-sm col-span-2 text-right w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="در صورت مثبت بودن توضیح دهید"
                          />
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3 ">
                    {" "}
                    {/*typeMethod */}
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
                        {resumeData.applicant_resume.freeTimeDescription ? (
                          <input
                            value={
                              resumeData.applicant_resume.freeTimeDescription
                            }
                            disabled
                            className="text-sm text-right w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="اوقات فراغت"
                          />
                        ) : (
                          <input
                            value={"ثبت نشده است"}
                            disabled
                            className="text-sm text-right w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="اوقات فراغت"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-3 ">
                    {" "}
                    {/*typeMethod */}
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
                        {resumeData.applicant_resume.knowing ? (
                          <input
                            value={resumeData.applicant_resume.knowing}
                            disabled
                            className="text-sm text-right w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="نحوه آشنایی"
                          />
                        ) : (
                          <input
                            value={"ثبت نشده است"}
                            disabled
                            className="text-sm text-right w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="اوقات فراغت"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-3 ">
                    {" "}
                    {/*typeMethod */}
                    <div className="grid lg:grid-cols-6 w-full gap-y-1 gap-x-4 xs:grid-cols-1">
                      <div className="col-span-2 flex justify-contect pt-3 ">
                        <p
                          htmlFor="cover-photo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          آیا در این شرکت دوست یا آشنایی دارید؟
                        </p>
                        <p className="mr-4">
                          {resumeData.applicant_resume.friendStatus == 0
                            ? "بله"
                            : resumeData.applicant_resume.friendStatus == 1
                            ? "خیر"
                            : "ثبت نشده است"}{" "}
                        </p>
                      </div>
                      <div className="col-span-4 pt-1">
                        <input
                          value={
                            resumeData.applicant_resume.friendDescription
                              ? resumeData.applicant_resume.friendDescription
                              : "ثبت نشده است"
                          }
                          disabled
                          className="text-sm col-span-2 text-right w-full border border-gray-300 rounded-md shadow-sm p-2"
                          placeholder="در صورت مثبت بودن نام ببرید"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6 ">
                    {" "}
                    {/*typeMethod */}
                    <div className="grid lg:grid-cols-6 w-full gap-y-1 gap-x-4 xs:grid-cols-2">
                      <div className="lg:col-span-2 xs:col-span-6 flex justify-contect pt-3 ">
                        <p
                          htmlFor="cover-photo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          نحوه همکاری:
                        </p>
                        <p className="mr-4">
                          {resumeData.applicant_resume.coOperateStatus == 0
                            ? "تمام وقت"
                            : resumeData.applicant_resume.coOperateStatus == 1
                            ? "پاره وقت"
                            : "ثبت نشده است"}{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6 ">
                    {" "}
                    {/*typeMethod */}
                    <div className="grid lg:grid-cols-6 w-full gap-y-1 gap-x-4 xs:grid-cols-2">
                      <div className="lg:col-span-2 xs:col-span-6 flex justify-contect pt-3 ">
                        <p
                          htmlFor="cover-photo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          حقوق درخواستی:
                        </p>
                        <p className="mr-4">{`${
                          resumeData.applicant_resume.salary
                            ? resumeData.applicant_resume.salary
                            : "ثبت نشده است"
                        } ${
                          resumeData.applicant_resume.salary ? "ریال" : ""
                        }`}</p>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-6 ">
                    {" "}
                    {/*typeMethod */}
                    <div className="grid lg:grid-cols-1 w-full gap-y-6 gap-x-4 xs:grid-cols-1">
                      <div className="col-span-1 flex justify-contect pt-3 pb-3">
                        <div className="grid lg:grid-cols-6 w-full gap-y-2 gap-x-4 xs:grid-cols-2">
                          <div className="col-span-2">
                            <p
                              htmlFor="cover-photo"
                              className="block text-sm  font-medium text-gray-700"
                            >
                              چنانچه قبلا تحت پوشش بیمه بوده اید، نوع آن را مشخص
                              کنید
                            </p>
                          </div>
                          <p className="mr-4 text-sm font-medium">
                            {resumeData.applicant_resume.insuranceType == 0
                              ? "تامین اجتماعی"
                              : resumeData.applicant_resume.insuranceType == 1
                              ? "خدمات درمانی"
                              : "ثبت نشده است"}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sm:col-span-3 ">
                    {" "}
                    {/*typeMethod */}
                    <div className="grid grid-cols-6 w-full gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="col-span-2 flex justify-contect pt-1 ">
                        <p
                          htmlFor="cover-photo"
                          className="block text-sm font-medium pt-2 ml-3 text-gray-700"
                        >
                          در صورت داشتن سابقه بیمه، مدت زمان و شماره بیمه را ذکر
                          کنید:
                        </p>
                      </div>
                      <div className="col-span-4 pt-1">
                        <input
                          value={resumeData.applicant_resume.insuranceYear}
                          disabled
                          className="text-sm text-right mr-2 border border-gray-300 rounded-md shadow-sm p-2"
                          placeholder="ثبت نشده است"
                        />
                        <input
                          value={resumeData.applicant_resume.insuranceMonth}
                          disabled
                          className="text-sm text-right mr-2 border border-gray-300 rounded-md shadow-sm p-2"
                          placeholder="ثبت نشده است"
                        />
                        <input
                          value={resumeData.applicant_resume.insuranceNumber}
                          disabled
                          className="text-sm text-right mr-2 border border-gray-300 rounded-md shadow-sm p-2"
                          placeholder="ثبت نشده است"
                        />
                      </div>
                    </div>
                  </div>
                </form>
                <div className="sm:col-span-6 pt-1  border-t"></div>
                {resumeData.applicant_resume.resumeFile && !pdf
                  ? DownloadFile(resumeData.applicant_resume.resumeFile)
                  : null}
                {resumeData.applicant_resume.resumeFile && pdf ? (
                  <div className="pl-5 pr-5">
                    <p className="pb-2"> فایل رزومه</p>
                    <div
                      className="embed-responsive"
                      style={{ height: "100vh" }}
                    >
                      <embed
                        src={pdf}
                        type="application/pdf"
                        width="100%"
                        height="100%"
                      />
                    </div>
                  </div>
                ) : resumeData.applicant_resume.resumeFile ? (
                  <div className="flex justify-center pt-10 pb-5">
                    <p> در حال دریافت فایل رزومه</p>
                  </div>
                ) : (
                  <div className="flex justify-center pt-10 pb-5">
                    <p> فایل رزومه بارگزاری نشده است</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      ) : null}
      <ExpertDialog
        hashtags={expertHashtags}
        dialogOpen={expertDialog}
        interviewId={resumeData ? resumeData.interview_uuid : ""}
        applicantId={router.query.id}
        setDialog={(par) => setDialogClose(par)}
      />
      <PublicDialog
        hashtags={publicHashtags}
        dialogOpen={publicDialog}
        interviewId={resumeData ? resumeData.interview_uuid : ""}
        applicantId={router.query.id}
        setDialog={(par) => setDialogClose(par)}
      />
      <FinalDialog
        dialogOpen={finalDialog}
        interviewId={resumeData ? resumeData.interview_uuid : ""}
        applicantId={router.query.id}
        setDialog={(par) => setDialogClose(par)}
      />
    </div>
  );
}
