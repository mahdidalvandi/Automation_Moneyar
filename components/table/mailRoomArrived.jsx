import React from "react";
import { useTable, usePagination, useFiters } from "react-table";
import { useState, useEffect } from "react";
import Status from "../forms/status";
import Priority from "../forms/priority";
import Button from "../forms/button";
import View from "../forms/view";
import Edit from "../forms/edit";
import Confidentiality from "../forms/confidentiality";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import moment from "jalali-moment";
moment.locale("fa");
import Link from "next/link";

import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import Attachment from "../forms/attachment";

function Table({ columns, data }) {
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
                                        className="py-3 pl-1 pr-1 text-center text-sm font-semibold text-gray-900 sm:pr-3 "
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
                            <tr
                                className="hover:bg-zinc-100"
                                key={i}
                                {...row.getRowProps()}
                            >
                                {row.cells.map((cell, i) => {
                                    return (
                                        <td
                                            key={i}
                                            className="relative whitespace-nowrap py-3 text-center text-sm font-medium border-b border-zinc-50 "
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

function MailRoomArrivedTable(props) {
    const { data, loadingData } = props;
    function CheckIfAccess(val) {
        // if (roleData && roleData.indexOf(val) > -1) return true;
        // return false;
        return true;
    }
    const columns = React.useMemo(
        () => [
            {
                Header: "1",
                Footer: "Footer 1",
                hideHeader: false,
                columns: [
                    {
                        Header: "شماره دبیرخانه",
                        accessor: "indicator",
                        disableFilters: false,
                        width: "20%",
                    },
                    {
                        Header: "موضوع",
                        accessor: "letter_subject",
                        disableFilters: false,
                        width: "40%",
                    },
                    {
                        Header: "شماره وارده",
                        accessor: "letter_number",
                        disableFilters: false,
                        width: "40%",
                    },
                    {
                        Header: "فرستنده",
                        accessor: "letter_sender_name",
                        disableFilters: false,
                        width: "20%",
                    },
                    {
                        Header: "تاریخ نامه",
                        accessor: "letter_timestamp",
                        Cell: (props) => (
                            moment.unix(props.row.values.letter_timestamp).format("YYYY/MM/DD")
                        ),
                        disableFilters: false,
                        width: "20%",
                    },
                    {
                        Header: "وضعیت ارجاع",
                        accessor: "is_cartable_added",
                        Cell: (props) => (
                            props.row.values.is_cartable_added ?
                                <span className="text-sm text-green-500">ارجاع شده</span>
                                :
                                <span className="text-sm text-red-500">ارجاع نشده</span>
                        ),
                        disableFilters: false,
                        width: "20%",
                    },
                    {
                        Header: "",
                        accessor: "uuid",
                        disableFilters: true,
                        width: "5%",
                        Cell: (props) => (
                            <>
                                <View
                                    link="/mailRoom/arrived/"
                                    uuid={props.row.values.uuid}
                                />

                            </>
                        ),
                    },

                ],
            },
        ],
        []
    );

    return (
        <div className="py-6">
            <div className="w-full ">
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

export default MailRoomArrivedTable;
