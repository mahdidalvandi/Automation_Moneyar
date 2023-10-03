import React from "react";
import { useTable, usePagination } from "react-table";
import Status from "../forms/status";
import Priority from "../forms/priority";
import Confidentiality from "../forms/confidentiality";
import Dabir from "../../public/images/dabir.png";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import View from "../forms/view";
import StarButton from "../forms/starButton";
import Attachment from "../forms/attachment";
import MailRoom from "../forms/mailRoom";
import PinButton from "../../components/forms/pinButton";
import { PaperClipIcon } from "@heroicons/react/outline";
import { Pagination, PaginationItem } from "@mui/material";
import PaginationItems from "../Pagination/PaginationItems";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
function pad(n) {
  return n < 10 ? "0" + n : n;
}
function Table({ columns, data, allData }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
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
        hiddenColumns: [
          "seen",
          "bookmark",
          "confidentiality",
          "is_mailroom",
          "is_mailroom_issued",
        ],
        pageIndex: 0,
      },
    },
    // useFilters,
    usePagination
  );
  const { pageIndex, pageSize } = state;
  return (
    <div className="text-xs">
      <table className="w-full divide-y divide-gray-300" {...getTableProps()}>
        <thead className="bg-[#D5E8FF]">
          {headerGroups.map((group, index) => (
            <tr key={index} {...group.getHeaderGroupProps()}>
              {group.headers.map((column) => {
                return column.hideHeader === false ? null : (
                  <th
                    className="py-3 pl-1 text-right text-sm font-semibold text-gray-900 sm:pr-3 "
                    {...column.getHeaderProps()}
                  >
                    <p className="text-right">{column.render("Header")}</p>
                    {column.canFilter ? column.render("Filter") : null}
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
                      className="relative whitespace-nowrap py-3 text-right text-sm font-medium border-b border-zinc-50 "
                      {...cell.getCellProps({
                        style: {
                          minWidth: cell.column.minWidth,
                          maxWidth: cell.column.maxWidth,
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
      <div className="">
        <div></div>
      </div>
      <PaginationItems allData={allData} />
    </div>
  );
}

function TablePage(props) {
  const { data, loadingData, source, allData } = props;
  const hndleClick = (props) => {
    const fd = props.row.values.uuid;
    let link = "/cartable/";
    window.location.assign(link + fd);
  };
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
            minWidth: "0rem",
            Cell: (props) => (props.row.values.confidentiality ? "" : ""),
          },
          // {
          //   Header: "اولویت",
          //   accessor: "confidentialityNum",
          //   disableFilters: false,
          //   minWidth: "2rem",
          //   Cell: (props) => {
          //     return (
          //       props.row.values.confidentiality && (
          //         <p>{props.row.values.confidentiality}</p>
          //       )
          //     );
          //   },
          // },

          // {
          //   Header: "",
          //   accessor: "status",
          //   disableFilters: false,
          //   minWidth: "1rem",

          //   Cell: (props) => (
          //     <div className="flex justify-center ">
          //       {source == "sendList" && props.row.values.seen == 1 ? (
          //         <Status status="1" />
          //       ) : source == "sendList" && props.row.values.seen == 2 ? (
          //         <Status status="2" />
          //       ) : (
          //         ""
          //       )}
          //       {props.row.values.priority == 2 ||
          //         (props.row.values.priority == 3 && (
          //           <div title="با اولویت بالا">
          //             <Priority status="1" />
          //           </div>
          //         ))}
          //       {props.row.values.confidentiality == 2 ||
          //         (props.row.values.confidentiality == 3 && (
          //           <div title="محرمانه">
          //             <Confidentiality status="1" />
          //           </div>
          //         ))}
          //       {props.row.values.is_mailroom == 1 && <MailRoom status="1" />}
          //       {props.row.values.is_mailroom_issued == 1 && (
          //         <div title="دبیرخانه">
          //           <MailRoom status="1" />
          //         </div>
          //       )}
          //       {props.row.values.has_attachment == 1 && (
          //         <div title="ضمیمه">
          //           <Image
          //             src={Dabir}
          //             className="h-5 w-5 text-gray-500"
          //             status="1"
          //           />
          //         </div>
          //       )}
          //     </div>
          //   ),
          // },
          // {
          //   Header: "",
          //   accessor: "bookmark",
          //   disableFilters: false,
          //   minWidth: "0.5rem",
          //   Cell: (props) => (props.row.values.has_attachment ? "" : ""),
          // },
          {
            Header: "",
            accessor: "has_attachment",
            disableFilters: false,
            minWidth: "1rem",
            Cell: (props) =>
              props.row.values.has_attachment == 1 && (
                <div className="" title="دریافتی">
                  <Image
                    src={Dabir}
                    className="h-5 w-5 text-gray-500"
                    status="1"
                  />
                </div>
              ),
          },
          // {
          //   Header: "",
          //   accessor: "is_mailroom_issued",
          //   disableFilters: false,
          //   minWidth: "0.5rem",
          //   Cell: (props) => (props.row.values.has_attachment ? "" : ""),
          // },
          // {
          //   Header: "",
          //   accessor: "priority",
          //   disableFilters: false,
          //   minWidth: "0.5rem",
          //   Cell: (props) =>
          //     props.row.values.priority == 2 ||
          //     props.row.values.priority == 3 ? (
          //       <Priority status="1" />
          //     ) : (
          //       // <Priority status="0" />
          //       ""
          //     ),
          // },
          // {
          //   Header: "",
          //   accessor: "confidentiality",
          //   minWidth: "0.5rem",
          //   disableFilters: false,
          //   Cell: (props) =>
          //     props.row.values.confidentiality == 2 ||
          //     props.row.values.confidentiality == 3 ? (
          //       <Confidentiality status="1" />
          //     ) : (
          //       // <Confidentiality status="0" />
          //       ""
          //     ),
          // },
          // {
          //   Header: "",
          //   accessor: "is_mailroom",
          //   minWidth: "0.5rem",
          //   disableFilters: false,
          //   Cell: (props) =>
          //     props.row.values.is_mailroom == 1 ? (
          //       <MailRoom status="1" />
          //     ) : (
          //       // <Confidentiality status="0" />
          //       ""
          //     ),
          // },
          // {
          //   Header: " فرستنده اصلی",
          //   accessor: "sender",
          //   disableFilters: false,
          //   minWidth: "4rem",
          //   Cell: (props) => {
          //     return props.row.values.sender ? (
          //       <p
          //         style={
          //           source != "sendList" && !props.row.values.seen
          //             ? { fontWeight: "bold" }
          //             : null
          //         }
          //       >
          //         {props.row.values.sender.length > 33
          //           ? props.row.values.sender.substring(0, 33) + "..."
          //           : props.row.values.sender}
          //       </p>
          //     ) : (
          //       ""
          //     );
          //   },
          // },
          // {
          //   Header: "گیرنده",
          //   accessor: "receiver",
          //   disableFilters: false,
          //   minWidth: "4rem",
          //   Cell: (props) => {
          //     return props.row.values.receiver ? (
          //       <p
          //         style={
          //           source != "sendList" && !props.row.values.seen
          //             ? { fontWeight: "bold" }
          //             : null
          //         }
          //       >
          //         {props.row.values.receiver.length > 33
          //           ? props.row.values.receiver.substring(0, 33) + "..."
          //           : props.row.values.receiver}
          //       </p>
          //     ) : (
          //       ""
          //     );
          //   },
          // },
          {
            Header: "فرستنده",
            accessor: "primary_sender",
            disableFilters: false,
            minWidth: "6rem",
            Cell: (props) => {
              return props.row.values.primary_sender ? (
                <div
                  className="cursor-pointer h-100 w-full"
                  onClick={() => hndleClick(props)}
                >
                  <p
                    style={
                      source != "sendList" && !props.row.values.seen
                        ? { fontWeight: "bold" }
                        : null
                    }
                  >
                    {props.row.values.primary_sender.length > 22
                      ? props.row.values.primary_sender.substring(0, 22) + "..."
                      : props.row.values.primary_sender}
                  </p>
                </div>
              ) : (
                ""
              );
            },
          },
          // {
          //   Header: "گیرنده اصلی",
          //   accessor: "primary_receiver",
          //   disableFilters: false,
          //   minWidth: "4rem",
          //   Cell: (props) => {
          //     return props.row.values.primary_receiver ? (
          //       <p
          //         style={
          //           source != "sendList" && !props.row.values.seen
          //             ? { fontWeight: "bold" }
          //             : null
          //         }
          //       >
          //         {props.row.values.primary_receiver.length > 44
          //           ? props.row.values.primary_receiver.substring(0, 44) + "..."
          //           : props.row.values.primary_receiver}
          //       </p>
          //     ) : (
          //       ""
          //     );
          //   },
          // },

          {
            Header: "موضوع",
            accessor: "subject",
            disableFilters: false,
            minWidth: "6rem",
            Cell: (props) => {
              return props.row.values.subject ? (
                <div
                  className="cursor-pointer h-100 w-full"
                  onClick={() => hndleClick(props)}
                >
                  <p
                    className="flex text-right"
                    style={
                      source != "sendList" && !props.row.values.seen
                        ? { fontWeight: "bold" }
                        : null
                    }
                  >
                    {props.row.values.subject.length > 50
                      ? props.row.values.subject.substring(0, 50) + "..."
                      : props.row.values.subject}
                  </p>
                </div>
              ) : (
                " "
              );
            },
          },

          {
            Header: "تاریخ",
            accessor: "letter_date_time",
            disableFilters: false,
            minWidth: "10rem",
            Cell: (props) => {
              return props.row.values.letter_date_time ? (
                <div
                  className="cursor-pointer h-100 w-full"
                  onClick={() => hndleClick(props)}
                >
                  <p
                    style={
                      source != "sendList" && !props.row.values.seen
                        ? { fontWeight: "bold" }
                        : null
                    }
                  >
                    {pad(props.row.values.letter_date_time.split(":")[0]) +
                      ":" +
                      pad(props.row.values.letter_date_time.split(":")[1]) +
                      " " +
                      props.row.values.letter_date_time.split(" ")[1]}
                  </p>
                </div>
              ) : (
                " "
              );
            },
          },
          {
            Header: "محرمانگی",
            accessor: "privacy",
            disableFilters: false,
            minWidth: "1rem",
            Cell: (props) => {
              return props.row.values.confidentiality ? (
                <div
                  className="cursor-pointer text-right h-100 w-full"
                  onClick={() => hndleClick(props)}
                >
                  <p
                    style={
                      source != "sendList" &&
                      !props.row.values.seen && { fontWeight: "bold" }
                    }
                  >
                    {props.row.values.confidentiality.length > 22
                      ? props.row.values.confidentiality.substring(0, 22) +
                        "..."
                      : props.row.values.confidentiality}
                  </p>
                </div>
              ) : (
                <div
                  className="cursor-pointer h-100 w-full"
                  onClick={() => hndleClick(props)}
                >
                  عادی
                </div>
              );
            },
          },
          {
            Header: "اولویت",
            accessor: "priority",
            disableFilters: false,
            minWidth: "0rem",
            Cell: (props) =>
              props.row.values.priority == 2 ||
              (props.row.values.priority == 3 ? (
                <div title="با اولویت بالا">
                  <Priority status="1" />
                </div>
              ) : (
                <div
                  className="cursor-pointer h-100 w-full"
                  onClick={() => hndleClick(props)}
                >
                  <p className="text-right">عادی</p>
                </div>
              )),
          },
          {
            Header: "",
            accessor: "uuid",
            disableFilters: false,
            minWidth: "1rem",
            Cell: (props) => (
              <div className="mr-5">
                {/* <View
                  link="/cartable/"
                  uuid={
                    source == "sendList"
                      ? props.row.values.uuid + "/arrived"
                      : props.row.values.uuid
                  }
                  text="مشاهده"
                  color="amber"
                /> */}
                {/* <PinButton bookMarked={props.row.original.bookmark} /> */}
                <StarButton
                  bookMarked={props.row.original.bookmark}
                  uuid={props.row.values.uuid}
                />
              </div>
            ),
          },
        ],
      },
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
            <>
              <Table columns={columns} data={data} allData={allData} />
            </>
          )}
        </>
      </div>
    </div>
  );
}

export default TablePage;
