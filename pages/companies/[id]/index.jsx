import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/auth";
import { useCompany } from "../../../hooks/company";
import Link from "next/link";
import { useRouter } from "next/router";
import TextWithLabel from "../../../components/forms/textWithLabel";
import Image from "next/image";
import { loadImageFromServer } from "../../../lib/helper";
import { loadImageFromLocal } from "../../../lib/helper";
import { CloudDownloadIcon } from "@heroicons/react/solid";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import moment from "jalali-moment";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "../../../lib/axios";
import fileDownload from "js-file-download";
import CircularProgress from "@mui/material/CircularProgress";
import { Close } from "@material-ui/icons";
import { Dialog } from "@headlessui/react";
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
export default function ViewEmail() {
  const { asPath } = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const [downloading, setDownloading] = useState();
  const [imageContent, setImageContent] = useState();
  const [pdfContent, setPdfContent] = useState();
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const ShowPreview = (value, type, name) => {
    if (
      type == "png" ||
      type == "jpg" ||
      type == "jpeg" ||
      type == "gif" ||
      type == "pdf"
    ) {
      setPreviewDialogOpen(true);
      setPreviewLoading(true);
      axios
        .get(`/api/v1/file/download`, {
          params: {
            file_uuid: value,
          },
          responseType: "blob",
        })
        .then((res) => {
          if (type == "pdf") {
            setPdfContent(window.URL.createObjectURL(res.data));
            setImageContent(null);
          } else if (
            type == "png" ||
            type == "jpg" ||
            type == "jpeg" ||
            type == "gif"
          ) {
            setImageContent(res.data);
            setPdfContent(null);
          }
          setPreviewLoading(false);
        });
    }
  };

  const DownloadFile = (value, type, name) => {
    setDownloading(value);
    axios
      .get(`/api/v1/file/download`, {
        params: {
          file_uuid: value,
        },
        responseType: "blob",
      })
      .then((res) => {
        setDownloading();
        if (name) {
          fileDownload(res.data, name);
        } else {
          fileDownload(res.data, value + "." + type);
        }
      });
  };

  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      getCompany(router.query.id);
    }
  }, [router.isReady]);

  const { getCompany, companyData, isCompanyLoading } = useCompany();

  const { user, isLoading } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/",
  });

  if (isLoading || !user) {
    return null;
  }
  function getPrintLink() {
    axios
      .post("/api/v1/exports/comp", {
        uuid: router.query.id,
      })
      .then((res) => {
        window.open(res.data.data.url, "_blank", "noopener,noreferrer");
      });
  }

  return (
    <div>
      <SidebarMobile menu={navigationList()} loc={asPath} />
      <SidebarDesktop
        menu={navigationList()}
        loc={asPath}
        setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
        setActions={(props) => setCurrentUserActions(props.currentUserActions)}
        setIsHolding={(props) => {}}
        setSuperUser={(props) => {}}
      />
      <div className="md:pr-52 flex flex-col flex-1">
        <StickyHeader />
        <main>
          <div className="py-6">
            <div className="w-full px-4 sm:px-6 md:px-8">
              <form className="space-y-8 divide-y divide-gray-200">
                <div className="space-y-8 divide-y divide-gray-200">
                  <div>
                    <div className="mt-2 mb-2 grid grid-cols-1 gap-y-5 gap-x-2 sm:grid-cols-6">
                      <div className="sm:col-span-6 flex justify-between">
                        <h2 className="text-xl">
                          اطلاعات شرکت {companyData.title}
                        </h2>
                        <button
                          onClick={() => getPrintLink()}
                          type="button"
                          className=" inline-flex mb-4 justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#1f2937] hover:bg-[#1f2937] focus:outline-none "
                        >
                          <span>چاپ اطلاعات</span>
                        </button>
                      </div>
                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="شناسه ملی"
                          text={companyData.national_id}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="شماره ثبت"
                          text={companyData.registration_id}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="شماره تماس* "
                          text={
                            companyData.tel ? companyData.tel : "ثبت نشده است"
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="آدرس ایمیل"
                          text={
                            companyData.email
                              ? companyData.email
                              : "ثبت نشده است"
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="فکس"
                          text={
                            companyData.fax ? companyData.fax : "ثبت نشده است"
                          }
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <TextWithLabel
                          title="آدرس ثبتی"
                          text={
                            companyData.address
                              ? companyData.address
                              : "ثبت نشده است"
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="مدیرعامل"
                          text={
                            companyData.ceo ? companyData.ceo : "ثبت نشده است"
                          }
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <TextWithLabel
                          title="آدرس فعلی"
                          text={
                            companyData.current_address
                              ? companyData.current_address
                              : "ثبت نشده است"
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="سال مالی"
                          text={
                            companyData.fin_year
                              ? companyData.fin_year
                              : "ثبت نشده است"
                          }
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
                            companyData.registration_date
                              ? moment
                                  .unix(companyData.registration_date)
                                  .format("YYYY/MM/DD HH:mm:ss")
                              : null
                          }
                          disabled="ture"
                          onChange={(date) => {
                            setRegisterDate(date);
                          }}
                          calendar={persian}
                          locale={persian_fa}
                          placeholder="ثبت نشده است"
                          calendarPosition="bottom-right"
                          inputClass="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                          containerStyle={{
                            width: "100%",
                          }}
                          required="true"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="آخرین سرمایه ثبتی شرکت"
                          text={
                            companyData.registered_capital
                              ? companyData.registered_capital
                              : "ثبت نشده است"
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <TextWithLabel
                          title="موسسه حسابرسی"
                          text={
                            companyData.audit_inst
                              ? companyData.audit_inst
                              : "ثبت نشده است"
                          }
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
                            disabled
                            value={
                              companyData && companyData.company_type >= 0
                                ? companyData.company_type
                                : -1
                            }
                          >
                            <MenuItem value={undefined}>ثبت نشده است</MenuItem>
                            <MenuItem value={-1}>ثبت نشده است</MenuItem>
                            <MenuItem value={0}>سهامی عام</MenuItem>
                            <MenuItem value={1}>سهامی خاص</MenuItem>
                            <MenuItem value={2}>مسئولیت محدود</MenuItem>
                            <MenuItem value={3}>تعاونی</MenuItem>
                            <MenuItem value={4}>تضامنی</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="sm:col-span-2 ml-5">
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
                            disabled
                            value={
                              companyData && companyData.activity_type >= 0
                                ? companyData.activity_type
                                : -1
                            }
                          >
                            <MenuItem value={undefined}>ثبت نشده است</MenuItem>
                            <MenuItem value={-1}>ثبت نشده است</MenuItem>
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
                            disabled
                            value={
                              companyData &&
                              companyData.daneshBonyan_status >= 0
                                ? companyData.daneshBonyan_status
                                : -1
                            }
                          >
                            <MenuItem value={undefined}>ثبت نشده است</MenuItem>
                            <MenuItem value={-1}>ثبت نشده است</MenuItem>
                            <MenuItem value={0}>ندارد</MenuItem>
                            <MenuItem value={1}>نوپا نوع ۱</MenuItem>
                            <MenuItem value={2}>نوپا نوع ۲</MenuItem>
                            <MenuItem value={3}> تولیدی نوع ۱</MenuItem>
                            <MenuItem value={4}> تولیدی نوع ۲</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="sm:col-span-6">
                        <TextWithLabel
                          title="موضوع فعالیت"
                          text={
                            companyData.subject_of_activity
                              ? companyData.subject_of_activity
                              : "ثبت نشده است"
                          }
                        />
                      </div>

                      <div className="col-span-6 border-t border-gray-300 py-5">
                        <p className="block text-sm font-medium  text-gray-700">
                          محصولات
                        </p>
                        <div>
                          <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="p-2" style={{ width: "5%" }}>
                                  ردیف
                                </th>
                                <th
                                  className="text-right"
                                  style={{ width: "50%" }}
                                >
                                  محصول
                                </th>
                                <th style={{ width: "45%" }}>توضیحات</th>
                              </tr>
                            </thead>
                            <tbody>
                              {companyData.products &&
                                companyData.products.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td className="text-center">
                                        {index + 1}
                                      </td>
                                      <td>
                                        <p className="text-sm w-full border-0 p-2">
                                          {item.product}
                                        </p>
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          disabled
                                          value={item.description}
                                          className="text-sm text-center w-full border-0 p-2"
                                          placeholder="ثبت نشده"
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col-span-6  border-t border-gray-300 py-5">
                        <div className="flex justify-between ">
                          <p className="block text-sm font-medium  text-gray-700">
                            آخرین ترکیب سهامداری
                          </p>
                          <div className="flex ">
                            <div className="ml-2 mt-6 ">
                              {companyData.share_holder_attachment &&
                              Object.keys(companyData.share_holder_attachment)
                                .length != 0
                                ? companyData.share_holder_attachment.map(
                                    (file, index) => (
                                      <span
                                        key={index}
                                        className="relative z-0 inline-flex shadow-sm rounded-md h-full mr-2"
                                      >
                                        <button
                                          type="button"
                                          onClick={() =>
                                            ShowPreview(
                                              file.uuid,
                                              file.type,
                                              file.name
                                            )
                                          }
                                          className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                        >
                                          {file.name
                                            ? file.name
                                            : "فایل" + "." + file.type}
                                        </button>

                                        <button
                                          onClick={() =>
                                            DownloadFile(
                                              file.uuid,
                                              file.type,
                                              file.name
                                            )
                                          }
                                          type="button"
                                          className="-mr-px relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                        >
                                          {downloading == file.uuid ? (
                                            <Image
                                              alt="image"
                                              src="/images/dots.svg"
                                              height={22}
                                              width={22}
                                            />
                                          ) : (
                                            <CloudDownloadIcon
                                              className="-ml-1 h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          )}
                                        </button>
                                      </span>
                                    )
                                  )
                                : ""}
                            </div>
                            <div className="ml-2">
                              <TextWithLabel
                                title="شماره روزنامه"
                                text={
                                  companyData.share_holder_np_no
                                    ? companyData.share_holder_np_no
                                    : "ثبت نشده است"
                                }
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
                                  companyData.share_holder_np_date
                                    ? moment
                                        .unix(companyData.share_holder_np_date)
                                        .format("YYYY/MM/DD")
                                    : null
                                }
                                disabled=" ture"
                                calendar={persian}
                                locale={persian_fa}
                                placeholder="ثبت نشده است"
                                calendarPosition="bottom-right"
                                inputClass="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                containerStyle={{
                                  width: "100%",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <table className="table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="p-2" style={{ width: "5%" }}>
                                  ردیف
                                </th>
                                <th
                                  className="text-right"
                                  style={{ width: "40%" }}
                                >
                                  نام سهامدار
                                </th>
                                <th style={{ width: "15%" }}>درصد سهام</th>
                                <th style={{ width: "15%" }}>ارزش سهام</th>
                                <th style={{ width: "25%" }}>توضیحات</th>
                              </tr>
                            </thead>
                            <tbody>
                              {companyData.share_holder &&
                                companyData.share_holder.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td className="text-center">
                                        {index + 1}
                                      </td>
                                      <td>
                                        <p className="text-sm w-full border-0 p-2">
                                          {item.name}
                                        </p>
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          disabled
                                          value={item.percent}
                                          className="text-sm text-center w-full border-0 p-2"
                                          placeholder="ثبت نشده"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          disabled
                                          value={item.value}
                                          className="text-sm text-center w-full border-0 p-2"
                                          placeholder="ثبت نشده"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          disabled
                                          value={item.description}
                                          className="text-sm text-center w-full border-0 p-2"
                                          placeholder="ثبت نشده"
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col-span-6  border-t border-gray-300 py-5">
                        <div className="flex justify-between ">
                          <p className="block text-sm font-medium  text-gray-700">
                            آخرین ترکیب اعضای هیئت مدیره
                          </p>
                          <div className="flex ">
                            <div className="ml-2 mt-6 ">
                              {companyData.board_attachment &&
                              Object.keys(companyData.board_attachment)
                                .length != 0
                                ? companyData.board_attachment.map(
                                    (file, index) => (
                                      <span
                                        key={index}
                                        className="relative z-0 inline-flex shadow-sm rounded-md h-full mr-2"
                                      >
                                        <button
                                          type="button"
                                          onClick={() =>
                                            ShowPreview(
                                              file.uuid,
                                              file.type,
                                              file.name
                                            )
                                          }
                                          className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                        >
                                          {file.name
                                            ? file.name
                                            : "فایل" + "." + file.type}
                                        </button>

                                        <button
                                          onClick={() =>
                                            DownloadFile(
                                              file.uuid,
                                              file.type,
                                              file.name
                                            )
                                          }
                                          type="button"
                                          className="-mr-px relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                        >
                                          {downloading == file.uuid ? (
                                            <Image
                                              alt="image"
                                              src="/images/dots.svg"
                                              height={22}
                                              width={22}
                                            />
                                          ) : (
                                            <CloudDownloadIcon
                                              className=" ml-1 h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          )}
                                        </button>
                                      </span>
                                    )
                                  )
                                : ""}
                            </div>
                            <div className="ml-2">
                              <TextWithLabel
                                title="شماره روزنامه"
                                text={
                                  companyData.board_member_np_no
                                    ? companyData.board_member_np_no
                                    : "ثبت نشده است"
                                }
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
                                  companyData.board_member_np_date
                                    ? moment
                                        .unix(companyData.board_member_np_date)
                                        .format("YYYY/MM/DD")
                                    : null
                                }
                                disabled="true"
                                calendar={persian}
                                locale={persian_fa}
                                placeholder="ثبت نشده است"
                                calendarPosition="bottom-right"
                                inputClass="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                containerStyle={{
                                  width: "100%",
                                }}
                                required="true"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="p-2" style={{ width: "5%" }}>
                                  ردیف
                                </th>
                                <th
                                  className="text-right"
                                  style={{ width: "40%" }}
                                >
                                  نام و نام خانوادگی
                                </th>
                                <th style={{ width: "15%" }}>سمت</th>
                                <th style={{ width: "15%" }}>امضای مجاز</th>
                                <th style={{ width: "25%" }}>توضیحات </th>
                              </tr>
                            </thead>
                            <tbody>
                              {companyData.board &&
                                companyData.board.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td className="text-center">
                                        {index + 1}
                                      </td>
                                      <td>
                                        <p className="text-sm w-full border-0 p-2">
                                          {item.name}
                                        </p>
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          disabled
                                          value={item.position}
                                          className="text-sm text-center w-full border-0 p-2"
                                          placeholder="ثبت نشده"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          disabled
                                          value={item.sign}
                                          className="text-sm text-center w-full border-0 p-2"
                                          placeholder="ثبت نشده"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          disabled
                                          value={item.description}
                                          className="text-sm text-center w-full border-0 p-2"
                                          placeholder="ثبت نشده"
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="col-span-6  border-t border-gray-300 py-5">
                        <div className="flex justify-between ">
                          <p className="block text-sm font-medium  text-gray-700">
                            بانک ها
                          </p>
                        </div>
                        <div>
                          <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="p-2" style={{ width: "5%" }}>
                                  ردیف
                                </th>
                                <th
                                  className="text-right"
                                  style={{ width: "40%" }}
                                >
                                  نام بانک
                                </th>
                                <th style={{ width: "15%" }}>شماره سپرده</th>
                                <th style={{ width: "15%" }}>شماره شبا</th>
                              </tr>
                            </thead>
                            <tbody>
                              {companyData.banks &&
                                companyData.banks.map((item, index) => {
                                  return (
                                    <tr key={index}>
                                      <td className="text-center">
                                        {index + 1}
                                      </td>
                                      <td>
                                        <p className="text-sm w-full border-0 p-2">
                                          {item.title}
                                        </p>
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          disabled
                                          value={item.deposit}
                                          className="text-sm text-center w-full border-0 p-2"
                                          placeholder="ثبت نشده"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="text"
                                          disabled
                                          value={item.iban}
                                          className="text-sm text-center w-full border-0 p-2"
                                          placeholder="ثبت نشده"
                                        />
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* <div className="sm:col-span-3">
                                    <TextWithLabel title="ضمیمه" />

                                    <div className="mb-4">
                                        {Object.keys(attachments).length != 0
                                            ? attachments.map((file, index) => (
                                                  <span
                                                      key={index}
                                                      className="relative z-0 inline-flex shadow-sm rounded-md mt-2 mr-2"
                                                  >
                                                      <button
                                                          type="button"
                                                          disabled
                                                          className="relative inline-flex items-center px-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                      >
                                                          {"فایل" +
                                                              " " +
                                                              (index + 1) +
                                                              "." +
                                                              file.type}
                                                      </button>

                                                      <button
                                                          onClick={() =>
                                                              DownloadFile(
                                                                  file.uuid,
                                                                  file.type
                                                              )
                                                          }
                                                          type="button"
                                                          className="-mr-px relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                                                      >
                                                          <CloudDownloadIcon
                                                              className="-ml-1 ml-1 h-5 w-5"
                                                              aria-hidden="true"
                                                          />
                                                      </button>
                                                  </span>
                                              ))
                                            : ""}
                                    </div>
                                </div> */}
                    </div>
                  </div>
                  <div className="sm:col-span-2 ">
                    <label
                      htmlFor="logo"
                      className={
                        "block text-sm mt-5 font-medium  text-gray-700"
                      }
                    >
                      لوگو
                    </label>
                    {companyData.logo ? (
                      <Image
                        loader={myLoader}
                        src={companyData.logo}
                        alt="تصویر لوگو"
                        width={250}
                        height={250}
                      />
                    ) : (
                      <Image
                        loader={myLocalLoader}
                        src="noImage.png"
                        alt="تصویر لوگو"
                        width={200}
                        height={200}
                      />
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="pt-3 pb-2 px-10 border-t border-gray-200">
              <div className="flex justify-end">
                {/* <Link href={`${router.query.id}/edit`}>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center py-2 px-4 ml-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <span>ویرایش</span>
                                    </button>
                                </Link> */}

                <Link href="/companies">
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
        </main>
        {previewDialogOpen ? (
          <Dialog
            open={previewDialogOpen}
            onClose={() => setPreviewDialogOpen(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0  flex items-start justify-center p-2">
              <div
                style={{ height: "80vh", width: "80vh" }}
                className="relative w-80 h-80  border border-gray-200 bg-gray-100 rounded-md overflow-hidden"
              >
                {previewLoading ? (
                  <div
                    style={{ height: "80vh", width: "80vh" }}
                    className="flex justify-center items-center"
                  >
                    <Image
                      alt="image"
                      src="/images/dots.svg"
                      height={120}
                      width={120}
                    />
                  </div>
                ) : imageContent ? (
                  <Image
                    src={URL.createObjectURL(imageContent)}
                    layout="fill"
                    objectFit="contain"
                    quality={100}
                  />
                ) : pdfContent ? (
                  <embed
                    src={pdfContent}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                  />
                ) : null}
              </div>
              <button
                onClick={() => setPreviewDialogOpen(false)}
                className="text-white mr-2"
              >
                <Close className="bg-red-500 rounded-md"></Close>
              </button>
            </div>
          </Dialog>
        ) : null}
      </div>
    </div>
  );
}
