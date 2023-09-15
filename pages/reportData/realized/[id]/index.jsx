import SidebarDesktop from "../../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../../components/layout/sidebarMobile";
import StickyHeader from "../../../../components/layout/stickyHeader";
import navigationList from "../../../../components/layout/navigationList";
import InputBox from "../../../../components/forms/inputBox";
import Link from "next/link";

import { useRouter } from "next/router";
import { useAuth } from "../../../../hooks/auth";
import { forwardRef } from "react";
import { useState, useEffect } from "react";
import Forbidden from "../../../../components/forms/forbidden";
import axios from "../../../../lib/axios";
import moment from "jalali-moment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { OutTable, ExcelRenderer } from "react-excel-renderer";

moment.locale("fa");
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ForeCastData() {
  const [errors, setErrors] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const [costHeadings, setCostHeadings] = useState();
  const [values, setValues] = useState();
  const [incomeHeadings, setIncomeHeadings] = useState();
  const [incomeValues, setIncomeValues] = useState();
  const [costValues, setCostValues] = useState();
  const { asPath } = useRouter();
  const [selectedYear, setSelectedYear] = useState(1402);
  const [selectedMonth, setSelectedMonth] = useState(moment().format("jM"));
  const [open, setOpen] = useState(false);
  const [sendingForm, setSendingForm] = useState(false);
  const [responseData, setResponseData] = useState();
  const [totalIncome, setTotalIncome] = useState(0);
  const [sumIncome, setSumIncome] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [sumCost, setSumCost] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [totalCost, setTotalCost] = useState(0);

  const handleToClose = (event, reason) => {
    window.location.href = "/reportData/realized";
  };
  function checkMonth(month) {
    // if (selectedMonth == 1 && month == 11) return false;
    // else {
    //     if (selectedMonth == 1) return true;
    //     if (selectedMonth - 2 == month) return false;
    //     return true;
    // }
    return false; //Temp
  }

  const router = useRouter();
  const handleFocus = (event) => event.target.select();
  useEffect(() => {
    if (router.isReady) {
      axios
        .post("/api/v1/budget/realized/get", {
          year: router.query.id,
        })
        .then((response) => {
          setCostValues(response.data.data.cost);
          setIncomeValues(response.data.data.income);
          calcIncomeSum(response.data.data.income);
          calcCostSum(response.data.data.cost);
        })
        .catch((err) => {});
    }
  }, [router.isReady]);

  const onSubmit = async (event) => {
    event.preventDefault();
    var object = {};
    setSendingForm(true);
    axios
      .post("/api/v1/budget/realized/add", {
        year: router.query.id,
        income: incomeValues,
        cost: costValues,
      })
      .then((res) => {
        setOpen(true);
      })
      .catch((err) => {
        if (err.response.data.message == "no permission") {
          object["master"] = "شما دسترسی جهت انجام عملیات را ندارید";
          setErrors(object);
        } else {
          object["master"] = err.response.data.message;
          setErrors(object);
        }
        setSendingForm(false);
      });
  };
  const addCommas = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");

  function convertToInt(val) {
    try {
      if (val == 0) return 0;
      return parseInt(val);
    } catch (error) {
      return 0;
    }
  }

  const calcIncomeSum = (incomeValuesInput) => {
    var sumIncomeBuf = [];
    incomeValuesInput.map((item, index) => {
      var sum = 0;
      item.map((subItem) => (sum += convertToInt(subItem.value)));
      sumIncomeBuf = [...sumIncomeBuf, sum];
    });
    setSumIncome(sumIncomeBuf);
  };

  const calcCostSum = (costValuesInput) => {
    var sumCostBuf = [];
    costValuesInput.map((item, index) => {
      var sum = 0;
      item.map((subItem) => (sum += convertToInt(subItem.value)));
      sumCostBuf = [...sumCostBuf, sum];
    });
    setSumCost(sumCostBuf);
  };
  const setValue = (month, uuid, value) => {
    setValues({ [month + uuid]: value });
    var incomeValuesBuf = incomeValues.map((item, index) =>
      item.map((subItem) =>
        subItem.uuid === uuid && index === month - 1
          ? { ...subItem, value: value }
          : subItem
      )
    );
    setIncomeValues(incomeValuesBuf);
    calcIncomeSum(incomeValuesBuf);
  };
  const setExcelValue = (month, itemIndex, value) => {
    setIncomeValues(
      incomeValues.map((item, index) =>
        item.map((subItem, subIndex) =>
          subIndex === itemIndex && index === month - 1
            ? { ...subItem, value: value }
            : subItem
        )
      )
    );
  };
  const setCostValue = (month, uuid, value) => {
    setValues({ [month + uuid]: value });
    var costValuesBuf = costValues.map((item, index) =>
      item.map((subItem) =>
        subItem.uuid === uuid && index === month - 1
          ? { ...subItem, value: value }
          : subItem
      )
    );
    setCostValues(costValuesBuf);
    calcCostSum(costValuesBuf);
  };
  const setCostExcelValue = (month, itemIndex, value) => {
    setCostValues(
      costValues.map((item, index) =>
        item.map((subItem, subIndex) =>
          subIndex === itemIndex && index === month - 1
            ? { ...subItem, value: value }
            : subItem
        )
      )
    );
  };

  const monthsArray = [
    {
      id: 1,
      value: "فروردین",
    },
    {
      id: 2,
      value: "اردیبهشت",
    },
    {
      id: 3,
      value: "خرداد",
    },
    {
      id: 4,
      value: "تیر",
    },
    {
      id: 5,
      value: "مرداد",
    },
    {
      id: 6,
      value: "شهریور",
    },
    {
      id: 7,
      value: "مهر",
    },
    {
      id: 8,
      value: "آبان",
    },
    {
      id: 9,
      value: "آذر",
    },
    {
      id: 10,
      value: "دی",
    },
    {
      id: 11,
      value: "بهمن",
    },
    {
      id: 12,
      value: "اسفند",
    },
  ];

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
    if (fileObj.name.split(".").pop() == "xlsx") {
      ExcelRenderer(fileObj, (err, resp) => {
        if (err) {
          object["file"] = err;
          setErrors(object);
        } else {
          object["file"] = "";
          setErrors(object);
          let incomeIndex = incomeValues[0].length;
          let costIndex = costValues[0].length;
          let incomeBuf = [...incomeValues];
          let costBuf = [...costValues];
          for (let j = 0; j < 12; j++) {
            for (let i = 0; i < incomeIndex; i++) {
              incomeBuf[j][i].value = resp.rows[2 + i][j + 1]
                ? resp.rows[2 + i][j + 1]
                : 0;
            }
            for (let i = 0; i < costIndex; i++) {
              costBuf[j][i].value = resp.rows[4 + incomeIndex + i][j + 1]
                ? resp.rows[4 + incomeIndex + i][j + 1]
                : 0;
            }
          }
          setIncomeValues(incomeBuf);
          setCostValues(costBuf);
        }
      });
    } else {
      object["file"] = "فقط فایل های اکسل با پسوند xlsx مجاز می‌باشد";
      setErrors(object);
    }
  };
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
        {!currentUserActions ? null : CheckIfAccessToPage(
            "/reportData/realized"
          ) ? (
          <main>
            <div className="py-6">
              <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                  <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <div className="ml-4 mt-2 flex items-center">
                      <h2 className="text-lg leading-6 font-large text-gray-900">
                        {`جریان وجوه نقدی سال ${router.query.id}`}
                      </h2>
                    </div>
                    {/* <div className="mr-10 space-x-3  justify-start ">
                                            <div>
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
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
                                            </div>

                                        </div> */}
                    <div className=" flex gap-2">
                      <Link href="/reportData/forecast">
                        <button
                          type="button"
                          className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                        >
                          <span>بازگشت</span>
                        </button>
                      </Link>
                      <button
                        onClick={onSubmit}
                        disabled={sendingForm}
                        type="button"
                        className={`ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm ${
                          sendingForm
                            ? " bg-gray-500 hover:bg-gray-500 "
                            : " bg-[#43a047] hover:bg-[#2d592f] "
                        }  focus:outline-none`}
                      >
                        <span>{`${
                          sendingForm ? "در حال ثبت اطلاعات" : "ثبت"
                        }`}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  {errors["file"] ? (
                    <span className="text-sm mr-5 text-red-500">
                      {errors["file"]}
                    </span>
                  ) : null}
                </div>
              </div>
              {/* <div className="flex justify-end ml-5 mt-2">
                                <Link href="/reportData/forecast">
                                    <button
                                        type="button"
                                        className="rounded-md  bg-[#eb5757] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#843737] focus:outline-none "
                                    >
                                        <span>انصراف</span>
                                    </button>
                                </Link>
                            </div> */}
              <div className="grid lg:grid-cols-6 sx:grid-cols-1 gap-4 col-span-6 rounded-md p-3">
                {monthsArray.map((cell, i) => {
                  return incomeValues && costValues ? (
                    <div className="col-span-2">
                      <div className="grid grid-cols-6 gap-4 col-span-6 rounded-md bg-gray-100 p-3">
                        <div className="col-span-6 flex justify-between">
                          <p className="py-2">{cell.value}</p>
                          {/* {!checkMonth(i) ? <button
                                                            onClick={onSubmit}
                                                            disabled={sendingForm}
                                                            type="button"
                                                            className={`ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm ${sendingForm ? " bg-gray-500 hover:bg-gray-500 " : " bg-[#43a047] hover:bg-[#2d592f] "}  focus:outline-none`}
                                                        >
                                                            <span>{`${sendingForm ? "در حال ثبت اطلاعات" : "ثبت"}`}</span>
                                                        </button> : null} */}
                        </div>
                        <div className="col-span-6 grid grid-cols-2 gap-2">
                          <div className="col-span-1 bg-gray-200 p-2 rounded-md">
                            <p>منابع</p>
                            {incomeValues[i].map((incomeCell, j) => {
                              return (
                                <div key={j}>
                                  <InputBox
                                    title={incomeCell.title}
                                    name={incomeCell.title}
                                    onFocus={handleFocus}
                                    disabled={checkMonth(i)}
                                    value={
                                      incomeCell.value
                                        ? addCommas(
                                            removeNonNumeric(incomeCell.value)
                                          )
                                        : addCommas(removeNonNumeric(0))
                                    }
                                    onChange={(event) =>
                                      setValue(
                                        cell.id,
                                        incomeCell.uuid,
                                        removeNonNumeric(event.target.value)
                                      )
                                    }
                                  />
                                </div>
                              );
                            })}

                            {
                              <p className="pt-2">{`جمع کل: ${addCommas(
                                removeNonNumeric(sumIncome[i])
                              )} ریال`}</p>
                            }
                          </div>
                          <div className="col-span-1 bg-gray-200 p-2 rounded-md">
                            <p>مصارف</p>
                            {costValues[i].map((costCell, j) => {
                              return (
                                <div key={j}>
                                  <InputBox
                                    title={costCell.title}
                                    name={costCell.title}
                                    onFocus={handleFocus}
                                    disabled={checkMonth(i)}
                                    value={
                                      costCell.value
                                        ? addCommas(
                                            removeNonNumeric(costCell.value)
                                          )
                                        : addCommas(removeNonNumeric(0))
                                    }
                                    onChange={(event) =>
                                      setCostValue(
                                        cell.id,
                                        costCell.uuid,
                                        removeNonNumeric(event.target.value)
                                      )
                                    }
                                  />
                                </div>
                              );
                            })}
                            {
                              <p className="pt-2">{`جمع کل: ${addCommas(
                                removeNonNumeric(sumCost[i])
                              )} ریال`}</p>
                            }
                          </div>
                          {/* {!checkMonth(i) && responseData ?
                                                            responseData[j] ? responseData[j].success ? <span className="text-sm text-green-700">با موفقیت ثبت شد</span> : <span className="text-sm text-red-700">امکان تغییر اطلاعات وجود ندارد</span> : <span>&nbsp;</span> : <span>&nbsp;</span>} */}
                        </div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            {errors["master"] ? (
              <span className="text-lg mr-5 text-red-500">
                {errors["master"]}
              </span>
            ) : null}
            <div className="pt-3 pb-2 px-10 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={onSubmit}
                  disabled={sendingForm}
                  type="button"
                  className={`ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm ${
                    sendingForm
                      ? " bg-gray-500 hover:bg-gray-500 "
                      : " bg-[#43a047] hover:bg-[#2d592f] "
                  }  focus:outline-none`}
                >
                  <span>{`${sendingForm ? "در حال ثبت اطلاعات" : "ثبت"}`}</span>
                </button>
              </div>
            </div>
          </main>
        ) : (
          <Forbidden />
        )}
      </div>
      <Snackbar
        anchorOrigin={{
          horizontal: "center",
          vertical: "bottom",
        }}
        open={open}
        autoHideDuration={1500}
        onClose={handleToClose}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          عملیات با موفقیت انجام شد
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ForeCastData;
