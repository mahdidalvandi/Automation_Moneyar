import SidebarDesktop from "../../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../../components/layout/sidebarMobile";
import StickyHeader from "../../../../components/layout/stickyHeader";
import navigationList from "../../../../components/layout/navigationList";
import { useRouter } from "next/router";
import { useAuth } from "../../../../hooks/auth";
import React, { useRef, useState, useEffect } from "react";
import Slider from '@mui/material/Slider';
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
    Title
} from 'chart.js';
import { Pie, Chart } from 'react-chartjs-2';
import GaugeChart from 'react-gauge-chart'
import _ from "lodash";
import {
    defaults
} from 'chart.js';

import axios from "../../../../lib/axios";
import moment from "jalali-moment";
moment.locale("fa");

const marks = [
    {
        value: 1,
        label: 'فروردین',
    },
    {
        value: 2,
        label: 'اردیبهشت',
    },
    {
        value: 3,
        label: 'خرداد',
    },
    {
        value: 4,
        label: 'تیر',
    },
    {
        value: 5,
        label: 'مرداد',
    },
    {
        value: 6,
        label: 'شهریور',
    },
    {
        value: 7,
        label: 'مهر',
    },
    {
        value: 8,
        label: 'آبان',
    },
    {
        value: 9,
        label: 'آذر',
    },
    {
        value: 10,
        label: 'دی',
    },
    {
        value: 11,
        label: 'بهمن',
    },
    {
        value: 12,
        label: 'اسفند',
    },

];
const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const removeNonNumeric = num => num.toString().replace(/[^0-9]/g, "");

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
    LineElement,
    LineController,
    BarController
);

export const incomeOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
            }
        },
        title: {
            display: true,
            text: 'منابع به تفکیک سرفصل',
        },
    },
};
export const costOptions = {
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
            text: 'مصارف به تفکیک سرفصل',
        },
    },
};
export const barOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom'
        }
    },
};

export const incomeBarSampleData = {
    labels: [],
    datasets: [
        {
            type: 'line',
            label: 'پیش‌بینی',
            borderColor: '#363445',
            borderWidth: 2,
            fill: false,
            data: [],
        },
        {
            type: 'bar',
            label: 'محقق شده',
            backgroundColor: '#1984c5',
            data: [],
            borderColor: 'white',
            borderWidth: 2,
        }
    ],
};

export const costBarSampleData = {
    labels: [],
    datasets: [
        {
            type: 'line',
            label: 'پیش‌بینی',
            borderColor: '#363445',
            borderWidth: 2,
            fill: false,
            data: [],
        },
        {
            type: 'bar',
            label: 'محقق شده',
            backgroundColor: '#c23728',
            data: [],
            borderColor: 'white',
            borderWidth: 2,
        }
    ],
};


export const incomeChartData = {
    labels: [],
    type: 'pointLabel',
    datasets: [
        {
            label: ' ریال',
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
function valuetext(value) {
    return `${value}`;
}
export default function OrganizationalChart() {
    let componentRef = useRef();
    const currentMonth = moment().format("jMM");
    const { asPath } = useRouter();
    const [currentUserRole, setCurrentUserRole] = useState();
    const [currentUserActions, setCurrentUserActions] = useState();
    const [totalCostForecast, setTotalCostForecast] = useState(0);
    const [totalCostRealized, setTotalCostRealized] = useState(0);
    const [incomeDeviation, setIncomeDeviation] = useState(0);
    const [costDeviation, setCostDeviation] = useState(0);
    const [totalIncomeForecast, setTotalIncomeForecast] = useState(0);
    const [totalIncomeRealized, setTotalIncomeRealized] = useState(0);
    const [incomeData, setIncomeData] = useState();
    const [costData, setCostData] = useState();
    const [incomeBarData, setIncomeBarData] = useState();
    const [costBarData, setCostBarData] = useState();
    const [monthRange, setMonthRange] = useState([currentMonth == 1 ? currentMonth : currentMonth - 1, currentMonth == 1 ? currentMonth + 1 : currentMonth]);
    const [selectedYear, setSelectedYear] = useState(1402);
    const [loadingData, setLoadingData] = useState(true);
    const [months, setMonths] = useState([]);
    const [companyName, setCompanyName] = useState("");
    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });
    useEffect(() => {
        async function getData() {
            await axios.get("api/v1/budget/forecast/list").then((response) => {
                setMonths(response.data.data);
                setLoadingData(false);
            });
        }
        if (loadingData) {
            getData();
        }
    }, []);

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

    function getNewReport(year = null, month = null) {
        let month_temp = month ? month : monthRange;
        let year_temp = year ? year : selectedYear;

        axios
            .post('/api/v1/budget/report/get_range',
                {
                    company_uuid:router.query.id,
                    year: year_temp,
                    startMonth: month_temp[0],
                    endMonth: month_temp[1],
                })
            .then((res) => {
                var incomeData = _.cloneDeep(incomeChartData);
                var costData = _.cloneDeep(incomeChartData);
                var costBarData = _.cloneDeep(costBarSampleData);
                var incomeBarData = _.cloneDeep(incomeBarSampleData);

                incomeData.labels = res.data.data.income_label;
                // incomeData.datasets[0].backgroundColor = res.data.data.incomeColor;
                // incomeData.datasets[0].borderColor = res.data.data.incomeColor;
                incomeData.datasets[0].data = res.data.data.income_realized_values;
                setIncomeData(incomeData);
                costData.labels = res.data.data.cost_label;
                // costData.datasets[0].backgroundColor = res.data.data.costColor;
                // costData.datasets[0].borderColor = res.data.data.costColor;
                costData.datasets[0].data = res.data.data.cost_realized_values;
                setCostData(costData);
                costBarData.labels = res.data.data.sum_label;
                costBarData.datasets[0].data = res.data.data.sum_cost_forecast_values;
                costBarData.datasets[1].data = res.data.data.sum_cost_realized_values;
                setCostBarData(costBarData);
                incomeBarData.labels = res.data.data.sum_label;
                incomeBarData.datasets[0].data = res.data.data.sum_income_forecast_values;
                incomeBarData.datasets[1].data = res.data.data.sum_income_realized_values;
                setIncomeBarData(incomeBarData);
                setTotalCostForecast(res.data.data.total_cost_forecast);
                setTotalCostRealized(res.data.data.total_cost_realized);
                setTotalIncomeForecast(res.data.data.total_income_forecast);
                setTotalIncomeRealized(res.data.data.total_income_realized);
                setCostDeviation(res.data.data.cost_deviation);
                setIncomeDeviation(res.data.data.income_deviation);
                setCompanyName(res.data.data.company_title);

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
                                        گزارش انحراف جریان وجوه نقدی شرکت {`${companyName}`}
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
                                        monthRange
                                    );
                                }}
                                className="pr-10 relative items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                            >
                                <option>انتخاب سال</option>
                                {months.map((opt) => (
                                    <option
                                        selected={
                                            selectedYear == opt.year
                                        }
                                        value={opt.year}
                                    >
                                        {opt.year}
                                    </option>
                                ))}

                            </select>

                        </div>
                        <div className="mr-10 space-x-3 pl-8 space-x-reverse w-full">
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
                        </div>
                    </div>
                    <div className="col-span-10 pt-1 pb-2 border-t"></div>
                    <div className="grid g-4 grid-cols-10 gap-5">
                        <div className="col-span-2" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {incomeData ?
                                <Pie data={costData} options={costOptions} />
                                : null}
                        </div>
                        <div className="col-span-6">
                            {costBarData ?
                                <Chart type='bar' data={costBarData} options={barOptions} /> : null}
                        </div>
                        <div className="col-span-2">
                            <div className="border border-gray-300 shadow-sm text-center rounded-md ml-5 mr-5">
                                <h2 className="text-sm leading-6 font-small text-gray-500 mt-2 mb-2">
                                    جمع مصارف دوره
                                </h2>
                                <h2 className="text-lg leading-6 font-large text-gray-900 mb-1" style={{ fontSize: "30px" }}>
                                    {addCommas(removeNonNumeric(totalCostRealized))}
                                </h2>
                                <h2 className="text-sm leading-6 font-small text-gray-900 mb-2">
                                    ریال
                                </h2>
                            </div>
                            <div className="border border-gray-300 shadow-sm text-center rounded-md  ml-5 mt-5 mr-5">
                                <h2 className="text-sm leading-6 font-small text-gray-500 mt-2 mb-2">
                                    جمع پیش بینی مصارف دوره
                                </h2>
                                <h2 className="text-lg leading-6 font-large text-gray-900 mb-1" style={{ fontSize: "30px" }}>
                                    {addCommas(removeNonNumeric(totalCostForecast))}
                                </h2>
                                <h2 className="text-sm leading-6 font-small text-gray-900 mb-2">
                                    ریال
                                </h2>
                            </div>
                            <div className=" ml-5 mt-5 mr-5">
                                <h2 className="text-sm leading-6 text-center font-small text-gray-500 mt-2 mb-5">
                                    {`تحقق بودجه`}
                                </h2>
                                <GaugeChart id="gauge-chart2"
                                    label="test"
                                    nrOfLevels={20}
                                    arcsLength={[0.3, 0.3, 0.3]}
                                    hideText={true}
                                    colors={['#c23728', '#ffb400','#1984c5']}
                                    percent={costDeviation}
                                />
                                <h2 className="text-lg leading-6 text-center font-large text-gray-900 ">
                                    {`%${costDeviation * 100}`.split('.')[0]}
                                </h2>
                            </div>
                        </div>
                        {incomeData ?
                            <div className="col-span-10 pt-2 pb-2 border-t"></div> : null}
                        <div className="col-span-2" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {incomeData ?
                                <Pie data={incomeData} options={incomeOptions} /> : null}
                        </div>

                        <div className="col-span-6">
                            {incomeBarData ?
                                <Chart type='bar' data={incomeBarData} options={barOptions} /> : null}
                        </div>
                        <div className="col-span-2">
                            <div className="border border-gray-300 shadow-sm text-center rounded-md ml-5 mr-5">
                                <h2 className="text-sm leading-6 font-small text-gray-500 mt-2 mb-2">
                                    جمع منابع دوره
                                </h2>
                                <h2 className="text-lg leading-6 font-large text-gray-900 mb-1" style={{ fontSize: "30px" }}>
                                    {addCommas(removeNonNumeric(totalIncomeRealized))}
                                </h2>
                                <h2 className="text-lg leading-6 font-large text-gray-900 mb-2">
                                    ریال
                                </h2>
                            </div>
                            <div className="border border-gray-300 shadow-sm text-center rounded-md  ml-5 mt-5 mr-5">
                                <h2 className="text-sm leading-6 font-small text-gray-500 mt-2 mb-2">
                                    جمع پیش بینی منابع دوره
                                </h2>
                                <h2 className=" leading-6  text-gray-900 mb-1" style={{ fontSize: "30px" }}>
                                    {addCommas(removeNonNumeric(totalIncomeForecast))}
                                </h2>
                                <h2 className="text-lg leading-6 font-large text-gray-900 mb-2">
                                    ریال
                                </h2>
                            </div>
                            <div className=" ml-5 mt-5 mr-5">
                                <h2 className="text-sm leading-6 text-center font-small text-gray-500 mt-2 mb-5">
                                    {` تحقق بودجه`}
                                </h2>
                                <GaugeChart id="gauge-chart2"
                                    label="test"
                                    nrOfLevels={20}
                                    arcsLength={[0.3, 0.3, 0.3]}
                                    hideText={true}
                                    colors={['#c23728', '#ffb400','#1984c5']}
                                    percent={incomeDeviation}
                                />
                                <h2 className="text-lg leading-6 text-center font-large text-gray-900 ">
                                    {`%${incomeDeviation * 100}`.split('.')[0]}
                                </h2>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
