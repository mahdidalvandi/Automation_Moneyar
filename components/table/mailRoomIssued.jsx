import React from "react";
import { useTable, usePagination, useFiters } from "react-table";
import View from "../forms/view";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import moment from "jalali-moment";
moment.locale("fa");


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
                hiddenColumns: ['status'],
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

function MailRoomIssuedTable(props) {
    const { data, loadingData } = props;
    const columns = React.useMemo(
        () => [
            {
                Header: "1",
                Footer: "Footer 1",
                hideHeader: false,
                columns: [
                    {
                        Header: "شماره دبیرخانه",
                        accessor: "status",
                        disableFilters: false,
                        width: "20%",
                    },
                    {
                        Header: "شماره دبیرخانه",
                        accessor: "indicator",
                        disableFilters: false,
                        width: "20%",
                    },
                    {
                        Header: "موضوع",
                        accessor: "subject",
                        disableFilters: false,
                        width: "40%",
                    },
                    {
                        Header: "گیرنده",
                        accessor: "to_company",
                        disableFilters: false,
                        width: "20%",
                    },
                    {
                        Header: "تاریخ صدور نامه",
                        accessor: "issuance_timestamp",
                        Cell: (props) => (
                            props.row.values.issuance_timestamp ?
                                moment.unix(props.row.values.issuance_timestamp).format("hh:mm:ss YYYY/MM/DD") : ""
                        ),
                        disableFilters: false,
                        width: "20%",
                    },
                    {
                        Header: "شماره نامه صادره",
                        accessor: "secretariat_number",
                        Cell: (props) => (
                            props.row.values.secretariat_number == 0 ?
                                "" : props.row.values.secretariat_number
                        ),
                        disableFilters: false,
                        width: "20%",
                    },
                    {
                        Header: "وضعیت پیش نویس",
                        accessor: "is_cartable_added",
                        Cell: (props) => (
                            props.row.values.status == 0 ?
                            <span className="text-sm text-amber-500">در انتظار تایید</span> :
                            props.row.values.status == 1 ?
                                <span className="text-sm text-green-500">تایید شده</span>
                                : props.row.values.status == 2 ?
                                    <span className="text-sm text-red-500">رد شده</span>
                                    : props.row.values.status == 3 ?
                                    <span className="text-sm text-[#1f2937]">صادر شده</span> : null
                        ),
                        disableFilters: false,
                        width: "20%",
                    }
                    ,
                    {
                        Header: "",
                        accessor: "uuid",
                        disableFilters: true,
                        width: "5%",
                        Cell: (props) => (
                            <>

                                <View
                                    link="/mailRoom/issued/"
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

export default MailRoomIssuedTable;
