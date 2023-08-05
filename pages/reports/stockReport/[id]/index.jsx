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
import { Pie, Line, Chart } from 'react-chartjs-2';
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
    responsive: true,
    scales: {
        y: {
            suggestedMax: 10,
            min: 0,
            ticks: {
                stepSize: 10
            }
        }
    },
    plugins: {
        legend: {
            position: 'bottom'
        }
    },
};

export const hrBarData = {
    labels: [],
    datasets: [
        {
            type: 'bar',
            label: 'خارج شده',
            backgroundColor: '#c23728',
            borderColor: '#c23728',
            borderWidth: 0,

            data: [],
        },
        {
            type: 'bar',
            label: 'جذب شده ',
            backgroundColor: '#1984c5',
            data: [],
            borderColor: '1984c5',
            borderWidth: 0,
        }
    ],
};

export const genderChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
            }
        },
        datalabels: {
            display: true,
            color: "white",
        },
        title: {
            display: true,
            text: ' جنیست',
        },
    },
};
export const marriageChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
            }
        },
        datalabels: {
            display: true,
            color: "white",
        },
        title: {
            display: true,
            text: ' وضعیت تاهل',
        },
    },
};
export const educationChartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
            }
        },
        datalabels: {
            display: true,
            color: "white",
        },
        title: {
            display: true,
            text: ' میزان تحصیلات',
        },
    },
};

export const ageChartOptions = {
    responsive: true,
    scales: {
        y: {
            suggestedMax: 10,
            min: 0,
            ticks: {
                stepSize: 10
            }
        }
    },
    plugins: {
        legend: {
            position: 'bottom',
        },
    },
};

export const ageChartData = {
    labels: [],
    datasets: [
        {
            fill: true,
            label: 'میانگین سن',
            data: [],
            borderColor: '#ffa300',
            backgroundColor: '#ffa300',
        },
    ],
};


export const genderChartData = {
    labels: [],
    type: 'pointLabel',
    datasets: [
        {
            label: ' نفر',
            data: [],
            backgroundColor: [
                '#1984c5',
                '#c23728',
                '#bebebe'
            ],
            borderColor: [
                '#1984c5',
                '#c23728',
                '#bebebe'
            ],
            borderWidth: 0,
        },
    ],
};
export const MarriageChartData = {
    labels: [],
    type: 'pointLabel',
    datasets: [
        {
            label: ' نفر',
            data: [],
            backgroundColor: [
                '#ed73be',
                '#9b19f5',
                '#bebebe'
            ],
            borderColor: [
                '#ed73be',
                '#9b19f5',
                '#bebebe'
            ],
            borderWidth: 0,
        },
    ],
};
export const educationChartData = {
    labels: [],
    type: 'pointLabel',
    datasets: [
        {
            label: ' نفر',
            data: [],
            backgroundColor: [
                '#8b6eff',
                '#63aaff',
                '#fbc16d',
                '#f77570',
                '#6effac',
                '#f66bc8',
                '#bebebe'
            ],
            borderColor: [
                '#8b6eff',
                '#63aaff',
                '#fbc16d',
                '#f77570',
                '#6effac',
                '#f66bc8',
                '#bebebe'
            ],
            borderWidth: 0,
        },
    ],
};


export const chartData = {
    labels: [],
    type: 'pointLabel',
    datasets: [
        {
            label: ' نفر',
            data: [],
            backgroundColor: [
                '#00bfa0',
                '#b3d4ff',
                '#dc0ab4',
                '#ffa300',
                '#9b19f5',
                '#e6d800',
                '#50e991',
                '#0bb4ff',
                '#e60049',
                '#7c1158',
                '#4421af',
                '#87bc45',
                '#f46a9b'
            ],
            borderColor: [
                '#00bfa0',
                '#b3d4ff',
                '#dc0ab4',
                '#ffa300',
                '#9b19f5',
                '#e6d800',
                '#50e991',
                '#0bb4ff',
                '#e60049',
                '#7c1158',
                '#4421af',
                '#87bc45',
                '#f46a9b'
            ],
            borderWidth: 0,
        },
    ],
};

export default function OrganizationalChart() {
    let componentRef = useRef();
    const { asPath } = useRouter();
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [genderData, setGenderData] = useState();
    const [educationData, setEducationData] = useState();
    const [marriageData, setMarriageData] = useState();
    const [ageData, setAgeData] = useState();
    const [employeeCount, setEmployeeCount] = useState(0);
    const [hiredPercent, setHiredPercent] = useState(0);
    const [leavedPercent, setLeavedPercent] = useState(0);
    const [leavedEmployeeCount, setLeavedEmployeeCount] = useState();
    const [hiredEmployeeCount, setHiredEmployeeCount] = useState();
    const [hrData, setHrData] = useState();
    const [selectedMonth, setSelectedMonth] = useState(moment().format("jM"));
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
            .post('/api/v1/report/hr',
                {
                    company_uuid: router.query.id,
                    year: year_temp,
                    selectedMonth: selected_month_temp,
                })
            .then((res) => {
                setCompanyName(res.data.data.company_title);
                var genderBufData = _.cloneDeep(genderChartData);
                var educationBufData = _.cloneDeep(educationChartData);
                var marriageBufData = _.cloneDeep(MarriageChartData);
                var ageBufData = _.cloneDeep(ageChartData);
                var hrBufData = _.cloneDeep(hrBarData);


                genderBufData.labels = ['زن', 'مرد', 'ثبت نشده'];
                genderBufData.datasets[0].data = res.data.data.gender_data;
                setGenderData(genderBufData);

                marriageBufData.labels = ['متاهل', 'مجرد', 'ثبت نشده'];
                marriageBufData.datasets[0].data = res.data.data.marriage_data;
                setMarriageData(marriageBufData);

                educationBufData.labels = ['زیر‌ دیپلم', 'دیپلم', 'فوق دیپلم', 'کارشناسی', 'کارشناسی ارشد', 'دکتری', 'ثبت نشده'];
                educationBufData.datasets[0].data = res.data.data.education_data;
                setEducationData(educationBufData);

                ageBufData.labels = ['تا ۲۰ سال', 'تا ۳۰ سال', 'تا ۴۰ سال', 'تا ۵۰ سال', 'تا ۶۰ سال', 'تا ۷۰ سال', 'تا ۸۰ سال']
                ageBufData.datasets[0].data = res.data.data.age_data;
                setAgeData(ageBufData);

                if (res.data.data.hr_chart_data) {
                    hrBufData.labels = res.data.data.hr_chart_data.labels;
                    hrBufData.datasets[0].data = res.data.data.hr_chart_data.leaved_data;
                    hrBufData.datasets[1].data = res.data.data.hr_chart_data.hired_data;
                    setHrData(hrBufData);
                }
                else {
                    setHrData();
                }

                setEmployeeCount(res.data.data.employee_count);
                setLeavedEmployeeCount(res.data.data.leaved_employee_count);
                setHiredEmployeeCount(res.data.data.hired_employee_count);
                setHiredPercent(res.data.data.hired_percent);
                setLeavedPercent(res.data.data.leaved_percent);
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
                                        گزارش منابع انسانی شرکت {`${companyName}`}
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
                                    value={0}
                                    selected={
                                        selectedMonth == 0
                                    }
                                >
                                    کل سال
                                </option>
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
                        {/* <div className="mr-10 space-x-3 pl-8 space-x-reverse w-full">
                            <Slider
                                getAriaLabel={() => 'بازه زمانی'}
                                value={monthRange}
                                getAriaValueText={valuetext}
                                onChange={handleChange}
                                onChangeCommitted={handleChangeCommited}
                                step={1}
                                min={1}
                                max={12}
                                marks={marks}
                                valueLabelDisplay="off"
                            />
                        </div> */}
                    </div>
                    <div className="col-span-10 pt-1 pb-2 border-t"></div>
                    <div className="grid g-4 grid-cols-10 gap-3 pb-2">
                        <div className="col-span-3"></div>
                        <div className="col-span-4">
                            <div className="border border-gray-300 shadow-sm text-center rounded-md ml-5 mr-5">
                                <h2 className="text-lg leading-6 font-large mt-3 mb-3 text-gray-900" >
                                    {`تعداد کارمندان : ${employeeCount} نفر`}
                                </h2>
                            </div>
                        </div>
                        <div className="col-span-3"></div>
                    </div>
                    <div className="grid g-4 grid-cols-10 gap-3 mb-10">
                        {!hrData ? <div className="col-span-3">
                        </div> : null}
                        <div className="col-span-2">
                            <div className="border border-gray-300 shadow-sm text-center rounded-md ml-5 mr-5">
                                <h2 className="text-sm leading-6 font-small text-gray-500 mt-8 mb-2 ml-8 mr-8">
                                    تعداد جذب در دوره
                                </h2>
                                <h2 className="text-lg leading-6 font-large text-gray-900 mt-4 mb-4 ml-8 mr-8" style={{ fontSize: "30px" }}>
                                    {hiredEmployeeCount}
                                </h2>
                            </div>
                            <div className="border border-gray-300 shadow-sm text-center rounded-md  ml-5 mt-5 mr-5  flex justify-between">
                                <h2 className="text-sm leading-6 font-small text-gray-500 mt-4 mb-4 ml-8 mr-8">
                                    نرخ جذب
                                </h2>
                                <h2 className="text-lg leading-6 font-large text-gray-900 mt-4 mb-4 ml-8 mr-8" style={{ fontSize: "30px" }}>
                                    {`%${hiredPercent}`.split('.')[0]}
                                </h2>
                            </div>
                        </div>
                        {hrData ? <div className="col-span-6">
                            <h2 className="text-gray-500" style={{ fontSize: "14px" }}>نمودار میانگین جذب و استخدام</h2>
                            <Chart type='bar' data={hrData} options={barOptions} height={85} />
                        </div> : null}
                        <div className="col-span-2">
                            <div className="col-span-2">
                                <div className="border border-gray-300 shadow-sm text-center rounded-md ml-5 mr-5">
                                    <h2 className="text-sm leading-6 font-small text-gray-500 mt-8 mb-2 ml-8 mr-8">
                                        تعداد خروج در دوره
                                    </h2>
                                    <h2 className="text-lg leading-6 font-large text-gray-900 mt-4 mb-4 ml-8 mr-8" style={{ fontSize: "30px" }}>
                                        {leavedEmployeeCount}
                                    </h2>
                                </div>
                                <div className="border border-gray-300 shadow-sm text-center rounded-md  ml-5 mt-5 mr-5 flex justify-between">
                                    <h2 className="text-sm leading-6 font-small text-gray-500 mt-4 mb-4 ml-8 mr-8">
                                        نرخ خروج
                                    </h2>
                                    <h2 className="text-lg leading-6 font-large text-gray-900 mt-4 mb-4 ml-8 mr-8" style={{ fontSize: "30px" }}>
                                        {`%${leavedPercent}`.split('.')[0]}
                                    </h2>
                                </div>
                            </div>

                        </div>
                        {!hrData ? <div className="col-span-3">
                        </div> : null}
                    </div>
                    <div className="col-span-10 pt-3 mb-3 pb-2 border-t"></div>
                    <div className="grid grid-cols-10 gap-2 mt-10 mb-10">
                        <h2 className="mr-10 text-gray-500" style={{ fontSize: "14px" }}>نمودار میانگین سن</h2>
                        <div className="col-span-10 ml-10 mr-10" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {ageData ?
                                <Line options={ageChartOptions} data={ageData} height={70} /> : null}
                        </div>
                    </div>
                    <div className="col-span-10 pt-1 pb-2 border-t"></div>
                    <div className="grid grid-cols-8 gap-10 mt-10">
                        <div className="col-span-1"></div>
                        <div className="col-span-2 m-4" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {genderData ?
                                <Pie data={genderData} options={genderChartOptions} />
                                : null}
                        </div>
                        <div className="col-span-2 m-4" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {educationData ?
                                <Pie data={marriageData} options={marriageChartOptions} /> : null}
                        </div>
                        <div className="col-span-2 m-4" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {educationData ?
                                <Pie data={educationData} options={educationChartOptions} /> : null}
                        </div>
                        <div className="col-span-1"></div>

                    </div>


                </main>
            </div>
        </div>
    );
}
