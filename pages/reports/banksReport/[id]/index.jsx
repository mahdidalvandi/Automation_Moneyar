import SidebarDesktop from "../../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../../components/layout/sidebarMobile";
import StickyHeader from "../../../../components/layout/stickyHeader";
import navigationList from "../../../../components/layout/navigationList";
import { useRouter } from "next/router";
import { useAuth } from "../../../../hooks/auth";
import React, { useRef, useState, useEffect } from "react";
import ReactToPrint from "react-to-print";
import {
    Chart as ChartJS,
    ArcElement,
    RadialLinearScale,
    Legend,
    LineController,
    BarController,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
    Title
} from 'chart.js';
import { Bar, Line, Chart } from 'react-chartjs-2';
import _ from "lodash";
import {
    defaults
} from 'chart.js';

import axios from "../../../../lib/axios";
import moment from "jalali-moment";
moment.locale("fa");

defaults.font.family = 'iransans'

ChartJS.register(
    ArcElement,
    RadialLinearScale,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    Filler,
    LineElement,
    LineController,
    BarController
);

export const barOptions = {
    plugins: {
        legend: {
            position: 'bottom'
        }
    },
    responsive: true,
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
};

export const banksChartData = {
    labels: [],
    datasets: [
        {
            label: 'غیر قابل برداشت',
            data: [],
            backgroundColor: 'rgb(255, 99, 132)',
        },
        {
            label: 'قابل برداشت',
            data: [],
            backgroundColor: 'rgb(75, 192, 192)',
        }
    ],
};
const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default function OrganizationalChart() {
    let componentRef = useRef();
    const { asPath } = useRouter();
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [bankData, setBankData] = useState();

    const [totalValue, setTotalValue] = useState(0);
    const [withdrawalValue, setWithdrawalValue] = useState(0);

    const [selectedMonth, setSelectedMonth] = useState(moment().format("jM") == 1 ? 1 : moment().format("jM")-1);
    const [selectedYear, setSelectedYear] = useState(1402);
    const [companyName, setCompanyName] = useState("");
    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });

    const router = useRouter();
    useEffect(() => {
        if (router.isReady) {
            getNewReport();
        }
    }, [router.isReady]);

    if (isLoading || !user) {
        return null;
    }

    const handleChange = (event, newValue) => {
        setMonthRange(newValue);
    };

    const handleChangeCommited = (event, newValue) => {
        getNewReport(selectedYear, newValue);
    };

    function getNewReport(year = null, selectedMonthParam = null) {
        let year_temp = year ? year : selectedYear;
        let selected_month_temp = selectedMonthParam ? selectedMonthParam : selectedMonth;
        axios
            .post('/api/v1/report/bank',
                {
                    company_uuid: router.query.id,
                    year: year_temp,
                    selectedMonth: selected_month_temp,
                })
            .then((res) => {
                setCompanyName(res.data.data.company_title);
                var banksBufData = _.cloneDeep(banksChartData);

                banksBufData.labels = res.data.data.labels;
                banksBufData.datasets[0].data = res.data.data.blocked_value;
                banksBufData.datasets[1].data = res.data.data.withdrawal_value;
                setBankData(banksBufData);
                setTotalValue(res.data.data.total_balance);
                setWithdrawalValue(res.data.data.withdrawal_balance);
            })
            .catch((err) => {

            }
            );

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
                <main
                    style={{ direction: "rtl" }}
                    ref={(el) => (componentRef = el)}>
                    <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
                        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                            <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                                <div className="ml-4 flex items-center">
                                    <h2 className="text-lg leading-6 font-large text-gray-900 ">
                                        گزارش موجودی بانک شرکت {`${companyName}`}
                                    </h2>
                                </div>
                                <ReactToPrint
                                    pageStyle="@page { size: 210mm 297mm landscape; marginLeft:10px; }"
                                    trigger={() => <button className="bg-[#1f2937] text-white px-2 py-2 rounded-md text-sm inline-block ml-1" scale={0.5}>چاپ گزارش</button>}
                                    content={() => componentRef}
                                />

                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between px-10">
                        <div className=" space-x-3 space-x-reverse ">
                            <select
                                onChange={(year) => {
                                    setSelectedYear(
                                        year.currentTarget.value
                                    );
                                    getNewReport(
                                        year.currentTarget
                                            .value,
                                        selectedMonth
                                    );
                                }}
                                className="pr-10 mt-1 mb-1 relative items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            >
                                <option>انتخاب سال</option>
                                <option
                                    value={1402}
                                    selected={
                                        selectedYear == 1402
                                    }
                                >
                                    1402
                                </option>
                                <option
                                    value={1401}
                                    selected={
                                        selectedYear == 1401
                                    }
                                >
                                    1401
                                </option>
                                <option
                                    value={1400}
                                    selected={
                                        selectedYear == 1400
                                    }
                                >
                                    1400
                                </option>
                            </select>
                            <select
                                onChange={(month) => {
                                    setSelectedMonth(
                                        month.currentTarget
                                            .value
                                    );
                                    getNewReport(
                                        selectedYear,
                                        month.currentTarget
                                            .value
                                    );
                                }}
                                className="pr-10 mt-1 mb-1 relative items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            >
                                <option>انتخاب ماه</option>
                                <option
                                    value={1}
                                    selected={
                                        selectedMonth == 1
                                    }
                                >
                                    فروردین
                                </option>
                                <option
                                    value={2}
                                    selected={
                                        selectedMonth == 2
                                    }
                                >
                                    اردیبهشت
                                </option>
                                <option
                                    value={3}
                                    selected={
                                        selectedMonth == 3
                                    }
                                >
                                    خرداد
                                </option>
                                <option
                                    value={4}
                                    selected={
                                        selectedMonth == 4
                                    }
                                >
                                    تیر
                                </option>
                                <option
                                    value={5}
                                    selected={
                                        selectedMonth == 5
                                    }
                                >
                                    مرداد
                                </option>
                                <option
                                    value={6}
                                    selected={
                                        selectedMonth == 6
                                    }
                                >
                                    شهریور
                                </option>
                                <option
                                    value={7}
                                    selected={
                                        selectedMonth == 7
                                    }
                                >
                                    مهر
                                </option>
                                <option
                                    value={8}
                                    selected={
                                        selectedMonth == 8
                                    }
                                >
                                    آبان
                                </option>
                                <option
                                    value={9}
                                    selected={
                                        selectedMonth == 9
                                    }
                                >
                                    آذر
                                </option>
                                <option
                                    value={10}
                                    selected={
                                        selectedMonth == 10
                                    }
                                >
                                    دی
                                </option>
                                <option
                                    value={11}
                                    selected={
                                        selectedMonth == 11
                                    }
                                >
                                    بهمن
                                </option>
                                <option
                                    value={12}
                                    selected={
                                        selectedMonth == 12
                                    }
                                >
                                    اسفند
                                </option>
                            </select>

                        </div>                       
                    </div>
                    <div className="col-span-10 pt-1 pb-2 border-t"></div>

                    <div className="grid g-4 grid-cols-10 gap-3 mb-10">
                        <div className="col-span-3"></div>
                        <div className="col-span-2">
                            <div className="border border-gray-300 shadow-sm text-center rounded-md ml-5 mr-5">
                                <h2 className="text-sm leading-6 font-small text-gray-500 mt-8 mb-2 ml-8 mr-8">
                                    موجودی کل
                                </h2>
                                <h2 className="text-lg leading-6 font-large text-gray-900 mt-4 mb-4 ml-8 mr-8" style={{ fontSize: "30px" }}>
                                    {addCommas(totalValue)}
                                </h2>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <div className="col-span-2">
                                <div className="border border-gray-300 shadow-sm text-center rounded-md ml-5 mr-5">
                                    <h2 className="text-sm leading-6 font-small text-gray-500 mt-8 mb-2 ml-8 mr-8">
                                        موجودی قابل برداشت کل
                                    </h2>
                                    <h2 className="text-lg leading-6 font-large text-gray-900 mt-4 mb-4 ml-8 mr-8" style={{ fontSize: "30px" }}>
                                        {addCommas(withdrawalValue)}
                                    </h2>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="col-span-10 pt-3 mb-3 pb-2 border-t"></div>
                    <div className="grid grid-cols-10 gap-2">
                        <h2 className="mr-10 text-gray-500" style={{ fontSize: "14px" }}>نمودار موجودی بانک</h2>
                        <div className="col-span-8 ml-10 mr-10" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {bankData ?
                                <Bar options={barOptions} data={bankData} height={70} /> : null}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
