import React from "react";
import { useTable, useFilters, usePagination } from "react-table";
import axios from "../../lib/axios";
import { useState, useEffect } from "react";
import Edit from "../forms/edit";
import View from "../forms/view";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

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
                            {group.headers.map((column, i) => {
                                return column.hideHeader === false ? null : (
                                    <th
                                        key={i}
                                        className="py-3 pl-2 pr-2 text-center text-sm font-semibold text-gray-900 sm:pr-3"
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
                            <tr key={i} {...row.getRowProps()}>
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

function RealizedTable(props) {
    function CheckIfAccess(val) {
        if (roleData && roleData.indexOf(val) > -1) return true;
        return false;
    }
    const { roleData } = props;
    const [loadingData, setLoadingData] = useState(true);
    const columns = React.useMemo(
        () => [
            {
                Header: "1",
                Footer: "Footer 1",
                hideHeader: false,

                columns: [
                    {
                        Header: "تاریخ",
                        accessor: "year",
                        disableFilters: false,
                        width: "20%",
                    },
                    {
                        Header: "",
                        accessor: "uuid",
                        disableFilters: true,
                        width: "5%",
                        Cell: (props) => (
                            <>{CheckIfAccess("edit_realized") ?                                                                
                                <View
                                    link="/reportData/realized/"
                                    uuid={props.row.values.year}
                                /> : null}
                                {/* <Edit /> */}
                            </>
                        ),
                    },
                ],
            },

            // {
            //   Header: "2",
            //   Footer: "Footer 2",
            //   hideHeader: false,

            //   columns: [

            //   ],
            // },
        ],
        []
    );
    const [data, setData] = useState([]);

    useEffect(() => {
        async function getData() {
            await axios.get("api/v1/budget/forecast/list").then((response) => {
                setData(response.data.data);
                setLoadingData(false);
            });
        }
        if (loadingData) {
            getData();
        }
    }, []);

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

export default RealizedTable;
