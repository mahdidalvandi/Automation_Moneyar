import React from "react";
import { useTable, usePagination } from "react-table";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAuth } from "../../hooks/auth";
import { useMemo } from "react";

function Table({ columns, data }) {
    const defaultColumn = React.useMemo(
        () => ({
            Filter: DefaultColumnFilter,
        }),
        []
    );

    function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
    }) {
        const count = preFilteredRows.length;

        return (
            <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                value={filterValue || ""}
                onChange={(e) => {
                    setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
                }}
                placeholder={`جستجو`}
            />
        );
    }

    const filterTypes = React.useMemo(
        () => ({
            text: (rows, id, filterValue) => {
                return rows.filter((row) => {
                    const rowValue = row.values[id];
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()

                            .startsWith(String(filterValue).toLowerCase())
                        : true;
                });
            },
        }),
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        pageOptions,
        state,
        gotoPage,
        pageCount,
        setPageSize,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        // useFilters,
        usePagination
    );

    const { pageIndex, pageSize } = state;

    // Render the UI for your table
    return (
        <div className="overflow-x-auto">
            <table
                className="w-full divide-y divide-gray-300"
                {...getTableProps()}
            >
                <thead className="bg-gray-50">
                    {headerGroups.map((group, i) => (
                        <tr key={i} {...group.getHeaderGroupProps()}>
                            {group.headers.map((column) => {
                                return column.hideHeader === false ? null : (
                                    <th
                                        className="py-3 pl-10 pr-4 text-center text-sm font-semibold text-gray-900 sm:pr-3"
                                        {...column.getHeaderProps({
                                            style: {
                                                minWidth: column.minWidth,
                                                width: column.width,
                                            },
                                        })}
                                    >
                                        <p className="text-l text-center">
                                            {column.render("Header")}
                                        </p>

                                        {column.canFilter
                                            ? column.render("Filter")
                                            : null}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr
                                className="hover:bg-zinc-100"
                                key={i}
                                {...row.getRowProps()}
                            >
                                {row.cells.map((cell, i) => {
                                    return (
                                        <td
                                            key={i}
                                            className="relative whitespace-nowrap py-3 pl-2 pr-2 text-center text-sm font-medium sm:pr-3"
                                            {...cell.getCellProps()}
                                        >
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot></tfoot>
            </table>
            <div className="border-t pt-5 border-gray-200">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {"<<"}
                </button>{" "}
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >
                    قبلی
                </button>{" "}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    بعدی
                </button>{" "}
                <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                >
                    {">>"}
                </button>{" "}
                <span>
                    صفحه{"   "}
                    <strong>
                        {pageIndex + 1} از {pageOptions.length}
                    </strong>{" "}
                </span>
                <span>
                    | برو به صفحه:{" "}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const pageNumber = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            gotoPage(pageNumber);
                        }}
                        style={{ width: "50px" }}
                    />
                </span>{" "}
                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[10, 25, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            نمایش {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

function BathPayslipList(props) {
    const { data, loadingData } = props;

    function CheckIfAccess(val) {
        if (roleData && roleData.indexOf(val) > -1) return true;
        return false;
    }
    const { roleData } = props;
    const { user, isLoading } = useAuth({
        middleware: "auth",
        redirectIfAuthenticated: "/",
    });
 
    const columns = useMemo(
        () => [
          {
            // first group - TV Show
            Header: "مشخصات",
            // First group columns
            columns: [
                {
                    Header: "ردیف",
                    accessor: "index",
                    disableFilters: false,
                    width: "5%",
                },
                {
                    Header: "کد پرسنلی",
                    accessor: "personalCode",
                    disableFilters: false,
                    width: "5%",
                  
                },
                {
                    Header: "کد ملی",
                    accessor: "nationalCode",
                    disableFilters: false,
                    width: "5%",
                    Cell: (props) => (
                      props.row.original.error.nationalCode ? <span className="text-red-600">{props.row.values.nationalCode}</span> : <span>{props.row.values.nationalCode}</span>
                  ),
                },
                {
                    Header: "نام",
                    accessor: "firstName",
                    disableFilters: false,
                    width: "5%",
                },
                {
                    Header: "نام خانوادگی",
                    accessor: "lastName",
                    disableFilters: false,
                    width: "5%",
                  
               }
            ],
          },
          ,
          {
            // Second group - Details
            Header: "کارکرد",
            // Second group columns
            columns: [
                {
                    Header: "غیبت ماهانه",
                    accessor: "monthlyAbsence",
                    disableFilters: false,
                    width: "5%",
                    Cell: (props) => (
                      props.row.original.error.monthlyAbsence ? <span className="text-red-600">{props.row.values.monthlyAbsence}</span> : <span>{props.row.values.monthlyAbsence  }</span>
                  ),
                },
                {
                    Header:"کارکرد موثر",
                    accessor: "effectiveOperation",
                    disableFilters: false,
                    width: "5%",
                },
              {
                Header: "کارکرد اضافه کاری(ساعت)",
                accessor: "overTime_H",
              },
              {
                Header: "کارکرد اضافه کاری(دقیقه)",
                accessor: "overTime_M",
              },
              {
                Header: "کارکرد تعطیل کاری(ساعت)",
                accessor: "workHoliday_H",
              },
              {
                Header: "کارکرد تعطیل کاری(دقیقه)",
                accessor: "workHoliday_M",
              },
              {
                Header: "کارکرد شبکاری(ساعت)",
                accessor: "nightWork_H",
              },
                {
                Header: "کارکرد شبکاری(دقیقه)",
                accessor: "nightWork_M",
              },
              {
                Header: "کارکرد کسرکاری(ساعت)",
                accessor: "workDeduction_H",
              },
              {
                Header: "کارکرد کسرکاری(دقیقه)",
                accessor: "workDeduction_M",
              },
              {
                Header: "کارکرد نوبت کاری(ساعت)",
                accessor: "shiftWork_H",
              }
            ],
          },
          {
            // Second group - Details
            Header: "مزایا",
            // Second group columns
            columns: [
              {
                Header: "حقوق پایه",
                accessor: "basicSalary",
              },
              {
                Header: "حق مسکن",
                accessor: "rightToHousing",
              },
              {
                Header: "حق اولاد",
                accessor: "childrensRight",
              },
              {
                Header: "اضافه کاری",
                accessor: "overTime_m",
              },
              {
                Header: "بن کارگری",
                accessor: "workerbon",
              },
              {
                Header: "تعطیل کاری",
                accessor: "workHoliday",
              },
              {
                Header: "شبکاری",
                accessor: "nightWork",
              },
              {
                Header: "حق الزحمه مشاوره ای",
                accessor: "consultingFee",
              },
              {
                Header: "حق سرپرستی",
                accessor: "rightGuardianship",
              },
              {
                Header: "حق سنوات",
                accessor: "severancePay",
              },
              {
                Header: "حق جذب",
                accessor: "rightAttraction",
              },
              {
                Header: "حق مدیریت",
                accessor: "rightBoss",
              },
              {
                Header: "نوبتکاری 22/5",
                accessor: "shiftWork",
              },
              {
                Header: "سایر مزایا(حق گان)",
                accessor: "otherBenefits",
              },
              {
                Header: "حق ماموریت حکمی",
                accessor: "rightToMandate",
              },
              {
                Header: "جمع مزایا",
                accessor: "sumofBenefits",
              }
            ],

          },
          ,
          {
            // Second group - Details
            Header: "کسورات",
            // Second group columns
            columns: [
              {
                Header: "مساعده",
                accessor: "imprest",
              },
              {
                Header: "بیمه تامین اجتماعی سهم کارمند",
                accessor: "employeeSocialSecurity",
              },
              {
                Header: "کسرکار",
                accessor: "lowtimeWork",
              },
              {
                Header: "بیمه تکمیلی کارمند",
                accessor: "employeeSupplementaryInsurance",
              },
              
              {
                Header: "بیمه عمر و حوادث",
                accessor: "LifeInsurance",
              },
              {
                Header: "مالیات حقوق",
                accessor: "salaryTax",
              },
              {
                Header: "علی الحساب پرداختی (هزینه ناهار)",
                accessor: "onAccountPayment",
              },
              {
                Header: "کسورات ج",
                accessor: "deductions",
              },
            ],
          },
          {
            // Second group - Details
            Header: "وام",
            // Second group columns
            columns: [
                {
                    Header: "وام پرسنل",
                    accessor: "personnelLoan",
                    disableFilters: false,
                    width: "5%",
                },
              ],
            },
            ,
          {
            // Second group - Details
            Header: "خالص پرداختی",
            // Second group columns
            columns: [
                {
                    Header: "خالص پرداختی",
                    accessor: "netPayable",
                    disableFilters: false,
                    width: "5%",
                   
                },
              ],
            },
        ],
        []
      );
    return (
        <>
            {loadingData ? (
                <SkeletonTheme highlightColor="#fb923c" height={50}>
                    <p>
                        <Skeleton count={10} />
                    </p>
                </SkeletonTheme>
            ) : (
                <Table columns={columns} data={data} />

            )}
        </>
    );
}

export default BathPayslipList;
