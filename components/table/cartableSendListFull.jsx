import React from "react";
import { useTable, usePagination } from "react-table";
import Status from "../forms/status";
import Priority from "../forms/priority";
import Confidentiality from "../forms/confidentiality";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import View from "../forms/view";
import StarButton from '../forms/starButton'
import Attachment from "../forms/attachment";
import MailRoom from "../forms/mailRoom";
import { PaperClipIcon } from "@heroicons/react/outline";
function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}
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

                hiddenColumns: ['seen', 'bookmark', 'has_attachment', 'priority', 'confidentiality', 'is_mailroom', 'is_mailroom_issued'],
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
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
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

function TablePage(props) {
    const { data, loadingData, source } = props;
    const columns = React.useMemo(
        () => [
            {
                Header: "1",
                Footer: "Footer 1",
                hideHeader: false,

                columns: [
                    {
                        Header: "",
                        accessor: "seen",
                        disableFilters: false,
                        minWidth: "0.5rem",
                        Cell: (props) =>
                            props.row.values.confidentiality ? (
                                ""
                            ) : (
                                ""
                            ),

                    },
                    {
                        Header: "",
                        accessor: "status",
                        disableFilters: false,
                        minWidth: "0.5rem",
                        Cell: (props) => <div className="flex ">
                            {source == "sendList" && props.row.values.seen == 1 ?
                                <Status status="1" />
                                :
                                source == "sendList" && props.row.values.seen == 2 ?
                                    <Status status="2" />
                                    : ""}
                            {props.row.values.priority == 2 ||
                                props.row.values.priority == 3 ?
                                <div title='با اولویت بالا'><Priority status="1" /></div>
                                :
                                ""}
                            {props.row.values.confidentiality == 2 ||
                                props.row.values.confidentiality == 3 ?
                                <div title='محرمانه'><Confidentiality status="1" /></div>
                                :
                                ""}
                            {props.row.values.is_mailroom == 1 ?
                                <MailRoom status="1" />
                                :
                                ""}
                            {props.row.values.is_mailroom_issued == 1 ?
                                <div title='دبیرخانه'><MailRoom status="1" /></div>
                                :
                                ""}
                            {props.row.values.has_attachment == 1 ?
                                <div title='ضمیمه'><PaperClipIcon className="h-5 w-5 text-gray-500"
                                    status="1" /></div>
                                :
                                ""}
                        </div>,
                    },
                    {
                        Header: "",
                        accessor: "bookmark",
                        disableFilters: false,
                        minWidth: "0.5rem",
                        Cell: (props) =>
                            props.row.values.has_attachment ? (
                                ""
                            ) : (
                                ""
                            ),
                    },
                    {
                        Header: "",
                        accessor: "has_attachment",
                        disableFilters: false,
                        minWidth: "0.5rem",
                        Cell: (props) =>
                            props.row.values.has_attachment ? (
                                ""
                            ) : (
                                ""
                            ),
                    },
                    {
                        Header: "",
                        accessor: "is_mailroom_issued",
                        disableFilters: false,
                        minWidth: "0.5rem",
                        Cell: (props) =>
                            props.row.values.has_attachment ? (
                                ""
                            ) : (
                                ""
                            ),
                    },
                    {
                        Header: "",
                        accessor: "priority",
                        disableFilters: false,
                        minWidth: "0.5rem",
                        Cell: (props) =>
                            props.row.values.priority == 2 ||
                                props.row.values.priority == 3 ? (
                                <Priority status="1" />
                            ) : (
                                // <Priority status="0" />
                                ""
                            ),
                    },
                    {
                        Header: "",
                        accessor: "confidentiality",
                        minWidth: "0.5rem",
                        disableFilters: false,
                        Cell: (props) =>
                            props.row.values.confidentiality == 2 ||
                                props.row.values.confidentiality == 3 ? (
                                <Confidentiality status="1" />
                            ) : (
                                // <Confidentiality status="0" />
                              ""
                            ),
                    },
                    {
                        Header: "",
                        accessor: "is_mailroom",
                        minWidth: "0.5rem",
                        disableFilters: false,
                        Cell: (props) =>
                            props.row.values.is_mailroom == 1 ? (
                                <MailRoom status="1" />
                            ) : (
                                // <Confidentiality status="0" />
                                ""
                            ),
                    },
                    {
                        Header: "فرستنده",
                        accessor: "sender",
                        disableFilters: false,
                        minWidth: "4rem",
                        Cell: (props) => {
                            return props.row.values.sender ? (
                                <p
                                    style={
                                        source != "sendList" && !props.row.values.seen
                                            ? { fontWeight: "bold" }
                                            : null
                                    }
                                >
                                    {props.row.values.sender.length > 33 ? props.row.values.sender.substring(0, 33) +
                                        "..." : props.row.values.sender}
                                </p>
                            ) : (
                                ""
                            );
                        },
                    },
                    {
                        Header: "گیرنده",
                        accessor: "receiver",
                        disableFilters: false,
                        minWidth: "4rem",
                        Cell: (props) => {
                            return props.row.values.receiver ? (
                                <p
                                    style={
                                        source != "sendList" && !props.row.values.seen
                                            ? { fontWeight: "bold" }
                                            : null
                                    }
                                >
                                    {props.row.values.receiver.length > 33 ? props.row.values.receiver.substring(0, 33) + "..." : props.row.values.receiver}
                                </p>
                            ) : (
                                ""
                            );
                        },
                    },
                    {
                        Header: "فرستنده اصلی",
                        accessor: "primary_sender",
                        disableFilters: false,
                        minWidth: "4rem",
                        Cell: (props) => {
                            return props.row.values.primary_sender ? (
                                <p
                                    style={
                                        source != "sendList" && !props.row.values.seen
                                            ? { fontWeight: "bold" }
                                            : null
                                    }
                                >
                                    {props.row.values.primary_sender.length > 22 ? props.row.values.primary_sender.substring(0, 22) + "..." : props.row.values.primary_sender}

                                </p>
                            ) : (
                                ""
                            );
                        },
                    },
                    {
                        Header: "گیرنده اصلی",
                        accessor: "primary_receiver",
                        disableFilters: false,
                        minWidth: "4rem",
                        Cell: (props) => {
                            return props.row.values.primary_receiver ? (
                                <p
                                    style={
                                        source != "sendList" && !props.row.values.seen
                                            ? { fontWeight: "bold" }
                                            : null
                                    }
                                >
                                    {props.row.values.primary_receiver.length > 44 ? props.row.values.primary_receiver.substring(0, 44) + "..." : props.row.values.primary_receiver}
                                </p>
                            ) : (
                                ""
                            );
                        },
                    },
                    {
                        Header: "موضوع",
                        accessor: "subject",
                        disableFilters: false,
                        minWidth: "15rem",
                        Cell: (props) => {
                            return props.row.values.subject ? (
                                <p
                                    style={
                                        source != "sendList" && !props.row.values.seen
                                            ? { fontWeight: "bold" }
                                            : null
                                    }
                                >
                                    {props.row.values.subject.length > 50 ? props.row.values.subject.substring(0, 50) + '...' : props.row.values.subject}
                                </p>
                            ) : (
                                " "
                            );
                        },
                    },

                    {
                        Header: "تاریخ نامه",
                        accessor: "letter_date_time",
                        disableFilters: false,
                        minWidth: "4rem",
                        Cell: (props) => {
                            return props.row.values.letter_date_time ? (
                                <p
                                    style={
                                        source != "sendList" && !props.row.values.seen
                                            ? { fontWeight: "bold" }
                                            : null
                                    }
                                >
                                    {pad(props.row.values.letter_date_time.split(":")[0]) + ":" + pad(props.row.values.letter_date_time.split(":")[1]) + " " + props.row.values.letter_date_time.split(" ")[1]}
                                </p>
                            ) : (
                                " "
                            );
                        },
                    },
                    {
                        Header: "",
                        accessor: "uuid",
                        disableFilters: false,
                        minWidth: "1rem",
                        Cell: (props) => (
                            // <Button
                            //     link="/cartable/"
                            //     uuid={source == "sendList" ? props.row.values.uuid + "/arrived" : props.row.values.uuid}
                            //     text="مشاهده"
                            //     color="amber"
                            // />
                            <div className="mr-5">
                                <View
                                    link="/cartable/"
                                    uuid={source == "sendList" ? props.row.values.uuid + "/arrived" : props.row.values.uuid}
                                />
                                {/* <StarButton
                                    bookMarked={props.row.values.bookmark}
                                    uuid={props.row.values.uuid}
                                /> */}
                            </div>
                        ),
                    },
                    // {
                    //   Header: "زمان انتظار پاسخ",
                    //   accessor: "read_date_time",
                    //   disableFilters: false,
                    // },
                    // {
                    //   Header: "type",
                    //   accessor: "type",
                    //   disableFilters: false,
                    // },
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

    return (
        <div className="py-2">
            <div className="w-full px-4 sm:px-6 md:px-8">
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
