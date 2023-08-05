import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import BathPayslipList from "../../../components/table/bathPayslipList"; 
import { useAuth } from "../../../hooks/auth";
import fileDownload from "js-file-download";
import { useState, forwardRef } from "react";
import React from "react";
import axios from "../../../lib/axios";
import Link from "next/link";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { ExcelRenderer } from 'react-excel-renderer';
import moment from "jalali-moment";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
moment.locale("fa");

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
const p2e = s => s.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))

export default function AddUser(popUpClick) {

    const [errors, setErrors] = useState([]);

    const [sendingForm, setSendingForm] = useState(false);
    const [userData, setUserData] = useState([]);
    const [userErrors, setUserErrors] = useState([]);
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [superAdmin, setSuperAdmin] = useState();
    const [open, setOpen] = useState(false);
    const [isHolding, setIsHolding] = useState(false);
    const handleToClose = (event, reason) => {
        window.location.assign("/users");
    };
    const DownloadFile = () => {
        axios
            .get(`/api/v1/file/download_sample`, {
                params: {
                },
                responseType: "blob",
            })
            .then((res) => {
                fileDownload(res.data, "فیش حقوقی.xlsx");
            });
    };
    const educations = [
        { id: "0", title: "زیر‌ دیپلم" },
        { id: "1", title: "دیپلم" },
        { id: "2", title: "فوق دیپلم" },
        { id: "3", title: "کارشناسی" },
        { id: "4", title: "کارشناسی ارشد" },
        { id: "5", title: "دکتری" },
    ];
   
    function findArrayElementByTitle(array, title) {
        return array.find((element) => {
            return element.title === title;
        })
    }

    const uploadChange = (event) => {
        let fileObj = event.target.files[0];
        event.target.value = null;
        var object = {};
        if (fileObj.name.split('.').pop() == 'xlsx') {
            ExcelRenderer(fileObj, (err, resp) => {
                if (err) {
                    console.log(err);
                    object['file'] = err;
                    setErrors(object)
                }
                else {
                    object['file'] = "";
                    setErrors(object)
                    var userDataBuf = [];
                    for (let j = 0; j < resp.rows.length; j++) {
                        var errorObjects = {};
                        if ((resp.rows[j][1] == 0 || "")) {
                            errorObjects['nationalCode'] = 'خطا در کدملی';
                        }
                        if ((resp.rows[j][4] > 33 || "" )) {
                            errorObjects['monthlyAbsence'] = 'بازه انتخابی بین 1-30 می باشد';
                        }
                
                        userDataBuf = [...userDataBuf, {
                            index: j+1,personalCode:resp.rows[j][0],nationalCode:resp.rows[j][1],
                            firstName:resp.rows[j][2], lastName: resp.rows[j][3],monthlyAbsence:resp.rows[j][4],effectiveOperation:resp.rows[j][5], 
                            overTime_H:resp.rows[j][6],overTime_M:resp.rows[j][7],workHoliday_H:resp.rows[j][8],workHoliday_M:resp.rows[j][9],nightWork_H:resp.rows[j][10],nightWork_M:resp.rows[j][11],
                            workDeduction_H:resp.rows[j][12],workDeduction_M:resp.rows[j][13],shiftWork_H:resp.rows[j][14],
                            basicSalary:resp.rows[j][15],rightToHousing:resp.rows[j][16],childrensRight:resp.rows[j][17],overTime_m:resp.rows[j][18],workerbon:resp.rows[j][19],workHoliday:resp.rows[j][20],
                            nightWork:resp.rows[j][21],consultingFee:resp.rows[j][22],rightGuardianship:resp.rows[j][23],severancePay:resp.rows[j][24],rightAttraction:resp.rows[j][25],
                            rightBoss:resp.rows[j][26],shiftWork:resp.rows[j][27],otherBenefits:resp.rows[j][28],rightToMandate:resp.rows[j][29],sumofBenefits:resp.rows[j][30],
                            imprest:resp.rows[j][31],employeeSocialSecurity:resp.rows[j][32],lowtimeWork:resp.rows[j][33],employeeSupplementaryInsurance:resp.rows[j][34],LifeInsurance:resp.rows[j][35],
                            salaryTax:resp.rows[j][36],onAccountPayment:resp.rows[j][37],deductions:resp.rows[j][38],
                            personnelLoan:resp.rows[j][39],netPayable:resp.rows[j][40],error: errorObjects
                        }];
                    }
                    setUserData(userDataBuf);
                }
            });
        }
        else {
            object['file'] = "فقط فایل های اکسل با پسوند xlsx مجاز می‌باشد";
            setErrors(object)
        }
    };

    const onSubmit = async () => {
        setSendingForm(true);
        var object = {};
        if (userData.length == 0) {
            object['master'] = 'اطلاعاتی برای ثبت یافت نشد';
            setErrors(object);
            setSendingForm(false);
            return;
        }
        var hasError = false;
        object['data'] = []
        for (let i = 0; i < userData.length; i++) {
            if (userData[i].error?.monthlyAbsence) {
                object['data'] = [...object['data'], ` خطا در بخش غیبت ماهانه به نام: ${userData[i].lastName} `, <br />];
                hasError = true;
            }
            if (userData[i].error?.nationalCode) {
                object['data'] = [...object['data'], ` خطا در بخش کدملی به نام: ${userData[i].lastName} `, <br />];
                hasError = true;
           }
            userData[i].personalCode = userData[i].personalCode
            // userData[i].nationalCode = userData[i].nationalCode.replaceAll('/', '-');

        }
        if (hasError) {
            setErrors(object);
            setSendingForm(false);
            return;
        }
        axios
            .post('/api/v1/user/register_batch',
                {
                    data: userData
                })
            .then((res) => {
                setOpen(true);
            })
            .catch((err) => {
                object['master'] = "خطا در ثبت اطلاعات";
                setErrors(object)
                setSendingForm(false);
            }
            );
    };
    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });
    if (isLoading || !user) {
        return null;
    }
    // function CheckIfAccessToPage(val) {
    //     console.log(currentUserActions.slice())
    //     if (currentUserActions && currentUserActions.indexOf(val) > -1) return true;
    //     return false;
    // }
    const submit = () => {

        confirmAlert({
      
          message: " شما در حال ارسال فیش حقوقی هست، آیا از انجام این کار مطمعن هستید؟",
          buttons: [
            {
              label: "بله",
              onClick: onSubmit
            },
            {
              label: "خیر"
              // onClick: () => alert("Click No")
            }
          ]
        });
      };
    return (
        <div>
            <SidebarMobile menu={navigationList()} loc={"/financial"} />
            <SidebarDesktop menu={navigationList()} loc={"/financial"}
                setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
                setActions={(props) => setCurrentUserActions(props.currentUserActions)}
                setIsHolding={(props) => setIsHolding(props.isHolding)}
                setSuperUser={(props) => setSuperAdmin(props.superAdmin)} />
            <div className="md:pr-52 flex flex-col flex-1">
                <StickyHeader />
                {!currentUserActions ? null :
                    <main>
                        <div className="py-6">
                            <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                    <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                        <div className="ml-4 mt-2 flex items-center">
                                            <h2 className="text-lg leading-6 font-large text-gray-900">
                                                افزودن فیش حقوقی
                                            </h2>
                                        </div>
                                        <div className="mr-10 space-x-3 justify-start ">
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
                                                {/* <label
                                                    htmlFor="file-downl"
                                                    className="relative inline-flex  mr-2 items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#1f2937] hover:bg-[#11151b] "
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
                                                </label> */}
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


                        </div>

                        <BathPayslipList loadingData={false} data={userData} roleData={currentUserRole} />

                        <div className="pt-3 pb-2 px-10 border-t border-gray-200">
                            <div className="flex justify-between">
                                <div>
                                    {errors["master"] ? (
                                        <span className="text-md text-red-500">
                                            {
                                                errors[
                                                "master"
                                                ]
                                            }
                                        </span>
                                    ) : null}
                                </div>
                                <div className="flex justify-end">   
                                <button
                                        onClick={submit}
                                        disabled={sendingForm}
                                        type="button"
                                        className={`ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm ${sendingForm ? " bg-gray-500 hover:bg-gray-500 " : " bg-[#43a047] hover:bg-[#2d592f] "}  focus:outline-none`}
                                    >
                                        <span>{`${sendingForm ? "در حال ثبت اطلاعات" : "ثبت"}`}</span>
                                    </button>
                                    <Link href="/users">
                                        <button
                                            type="button"
                                            className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                                        >
                                            <span>انصراف</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div>
                                {errors["data"] ? (
                                    <p className="text-md text-red-500">
                                        {
                                            errors[
                                            "data"
                                            ]
                                        }
                                    </p>
                                ) : null}
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
                    </main>}
            </div>
        </div>
    );
}
