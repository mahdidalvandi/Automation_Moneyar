import React from "react";
import { useTable, usePagination, useFiters } from "react-table";
import { useState, useEffect } from "react";
import Status from "../forms/status";
import Priority from "../forms/priority";
import Button from "../forms/button";
import PinButton from "../forms/pinButton";
import StarButton from "../forms/starButton";

import View from "../forms/view";
import Edit from "../forms/edit";
import Confidentiality from "../forms/confidentiality";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import moment from "jalali-moment";
moment.locale("fa");

import { PlusIcon, SearchIcon } from "@heroicons/react/outline";
import Attachment from "../forms/attachment";
import PaginationItems from "../Pagination/PaginationItems";

function Table({ columns, data, allData }) {
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
    <div className="text-xs">
      <table className="w-full divide-y divide-gray-300" {...getTableProps()}>
        <thead className="bg-[#D5E8FF]">
          {headerGroups.map((group, index) => (
            <tr key={index} {...group.getHeaderGroupProps()}>
              {group.headers.map((column) => {
                return column.hideHeader === false ? null : (
                  <th
                    className="py-3  pr-1 text-center text-sm font-semibold text-[#333333] sm:pr-3 "
                    {...column.getHeaderProps()}
                  >
                    <p className="text-right mr-4">{column.render("Header")}</p>
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
              <tr
                className={` ${i % 2 === 1 ? "bg-[#E3E3E3]" : ""}`}
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
        {/* <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          قبلی
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          بعدی
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
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
        </select> */}
      </div>
      <PaginationItems allData={allData} />
    </div>
  );
}

function MailRoomArrivedTable(props) {
  const { data, loadingData, allData } = props;
  const hndleClick = (props) => {
    const fd = props.row.values.uuid;
    let link = "/mailRoom/arrived/";
    window.location.assign(link + fd);
  };
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
            Cell: (props) => {
              return (
                <div
                  className="cursor-pointer hover:border-r-green-400 hover:border-r-4 h-100 w-full"
                  onClick={() => hndleClick(props)}
                >
                  <p className="text-right mr-6">
                    {props.row.original.indicator}
                  </p>
                </div>
              );
            },
          },
          {
            Header: "موضوع",
            accessor: "letter_subject",
            disableFilters: false,
            width: "10%",
            Cell: (props) => {
              return (
                <div
                  className="cursor-pointer h-100 w-full"
                  onClick={() => hndleClick(props)}
                >
                  <p className="text-right mr-6">
                    {props.row.original.letter_subject}
                  </p>
                </div>
              );
            },
          },
          {
            Header: "شماره وارده",
            accessor: "letter_number",
            disableFilters: false,
            width: "10%",
            Cell: (props) => {
              return (
                <div
                  className="cursor-pointer h-100 w-full"
                  onClick={() => hndleClick(props)}
                >
                  {console.log(props)}
                  <p className="text-right mr-6">
                    {props.row.original.letter_number}
                  </p>
                </div>
              );
            },
          },
          {
            Header: "فرستنده",
            accessor: "letter_sender_name",
            disableFilters: false,
            width: "20%",
            Cell: (props) => {
              return (
                <div
                  className="cursor-pointer h-100 w-full"
                  onClick={() => hndleClick(props)}
                >
                  <p className="text-right mr-6">
                    {props.row.original.letter_sender_name}
                  </p>
                </div>
              );
            },
          },
          {
            Header: "تاریخ",
            accessor: "letter_timestamp",
            Cell: (props) => (
              <div className="text-right mr-6">
                {moment
                  .unix(props.row.values.letter_timestamp)
                  .format("YYYY/MM/DD")}
              </div>
            ),

            disableFilters: false,
            width: "10%",
          },
          {
            Header: "وضعیت ارجاع",
            accessor: "is_cartable_added",
            Cell: (props) =>
              props.row.values.is_cartable_added ? (
                <div
                  className="cursor-pointer h-100 w-full"
                  onClick={() => hndleClick(props)}
                >
                  <p className="text-sm w-full text-right mr-6 text-[#146637]">
                    ارجاع شده
                  </p>
                </div>
              ) : (
                <div
                  className="cursor-pointer h-100 w-full"
                  onClick={() => hndleClick(props)}
                >
                  <p className="text-sm w-full text-right mr-6 text-[#FF4646]">
                    ارجاع نشده
                  </p>
                </div>
              ),
            disableFilters: false,
            width: "10%",
          },
          {
            Header: "",
            accessor: "uuid",
            disableFilters: true,
            width: "5%",
            Cell: (props) => (
              <>
                {/* <View link="/mailRoom/arrived/" uuid={props.row.values.uuid} /> */}
                {/* <PinButton /> */}
                <StarButton
                  bookMarked={props.row.values.bookmark}
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
            <Table columns={columns} data={data} allData={allData} />
          )}
        </>
      </div>
    </div>
  );
}

export default MailRoomArrivedTable;
