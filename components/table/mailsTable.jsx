import React from "react";
import { useTable, usePagination } from "react-table";

import Button from "../forms/button";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

function Table({ columns, data }) {
    // const defaultColumn = React.useMemo(
    //     () => ({
    //         Filter: DefaultColumnFilter,
    //     }),
    //     []
    // );

    // function DefaultColumnFilter({
    //     column: { filterValue, preFilteredRows, setFilter },
    // }) {
    //     const count = preFilteredRows.length;

    //     return (
    //         <input
    //             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
    //             value={filterValue || ""}
    //             onChange={(e) => {
    //                 setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
    //             }}
    //             placeholder={`جستجو`}
    //         />
    //     );
    // }

    // const filterTypes = React.useMemo(
    //     () => ({
    //         text: (rows, id, filterValue) => {
    //             return rows.filter((row) => {
    //                 const rowValue = row.values[id];
    //                 return rowValue !== undefined
    //                     ? String(rowValue)
    //                           .toLowerCase()

    //                           .startsWith(String(filterValue).toLowerCase())
    //                     : true;
    //             });
    //         },
    //     }),
    //     []
    // );

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
            initialState: {
                pageIndex: 0,
                pageSize: 7,
            },
        },
        // useFilters,
        usePagination
    );

    const { pageIndex, pageSize } = state;

    return (
        <div className="overflow-x-auto text-xs">
            <table
                className="w-full divide-y divide-gray-300"
                {...getTableProps()}
            >
                <thead className="bg-gray-50">
                    {headerGroups.map((group, index) => (
                        <tr key={index} {...group.getHeaderGroupProps()}>
                            {group.headers.map((column) => {
                                return column.hideHeader === false ? null : (
                                    <th
                                        className="py-2 pl-1 pr-1 text-center text-sm font-semibold text-gray-900 sm:pr-3"
                                        {...column.getHeaderProps()}
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
                                            className="relative whitespace-nowrap py-1 text-center text-sm font-medium"
                                            {...cell.getCellProps({
                                                style: {
                                                    minWidth:
                                                        cell.column.minWidth,
                                                    maxWidth:
                                                        cell.column.maxWidth,
                                                },
                                            })}
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
            <div className="border-t pt-1 border-gray-200">
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
            </div>
        </div>
    );
}

function TablePage(props) {
    const { data, loadingData, setSelect, setDialog } = props;
    const columns = React.useMemo(
        () => [
            {
                Header: "1",
                Footer: "Footer 1",
                hideHeader: false,

                columns: [
                    {
                        Header: "موضوع",
                        accessor: "subject",
                        disableFilters: false,
                        minWidth: "20rem",
                        Cell: (props) => {
                            return props.row.values.subject
                                ? props.row.values.subject.substring(0, 50)
                                : "";
                        },
                    },

                    {
                        Header: "",
                        accessor: "indicator",
                        disableFilters: false,
                        minWidth: "2rem",
                        Cell: (props) => (
                            <button
                                onClick={(_) => {
                                    setSelect({
                                        indic: props.row.values.indicator,
                                        subj: props.row.values.subject,
                                    });
                                    setDialog(false);
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                    />
                                </svg>
                            </button>
                        ),
                    },
                ],
            },
        ],
        []
    );

    return (
        <div className="py-2">
            <div className="w-full">
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
            </div>
        </div>
    );
}

export default TablePage;
