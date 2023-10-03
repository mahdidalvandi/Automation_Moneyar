import React, { useMemo } from "react";
import { useTable, useFilters, usePagination } from "react-table";
import axios from "../../lib/axios";
import { useState, useEffect } from "react";
import Edit from "../forms/edit";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import View from "../forms/view";
import Link from "next/link";
import Seen from "../../public/images/seen.png";
import UnSeen from "../../public/images/unseen.png";

import moment from "jalali-moment";
import Image from "next/image";
moment.locale("fa");

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
      initialState: {
        pageIndex: 0,
        hiddenColumns: ["is_canceled", "uuid"],
        pageSize: 500,
      },
    },
    // useFilters,
    usePagination
  );

  const { pageIndex, pageSize } = state;

  // Render the UI for your table
  return (
    <div className="">
      <table className="w-full divide-y divide-gray-300" {...getTableProps()}>
        <thead className="bg-[#D5E8FF]">
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
    </div>
  );
}

function EventsTable(props) {
  function CheckIfAccess(val) {
    if (roleData && roleData.indexOf(val) > -1) return true;
    return false;
  }
  const { roleData } = props;
  // const [loadingData, setLoadingData] = useState(true);
  const { data, loadingData } = props;
  const columns = useMemo(() => {
    if (!roleData) {
      return [];
    }
    return [
      {
        Header: "1",
        Footer: "Footer 1",
        hideHeader: false,

        columns: [
          {
            Header: "",
            accessor: "is_canceled",
            disableFilters: false,
            width: "10%",
          },
          {
            Header: "نام شرکت",
            accessor: "company_title",
            disableFilters: false,
            width: "5%",
          },
          {
            Header: "موضوع جلسه",
            accessor: "title",
            disableFilters: false,
            width: "5%",
          },
          {
            Header: "تاریخ",
            accessor: "timestamp",
            Cell: (props) =>
              moment.unix(props.row.values.timestamp).format("YYYY/MM/DD"),
            disableFilters: false,
            width: "5%",
          },
          {
            Header: "",
            accessor: "uuid",
            disableFilters: false,
            width: "0%",
          },
          {
            Header: "وضعیت",
            accessor: "status",
            Cell: (props) => (
              <div>
                {props.row.values.status == 1 &&
                !props.row.values.is_canceled ? (
                  <div className="flex items-center">
                    <span className="w-3 h-3 ml-1 inline-block rounded-full text-[11px] font-bold bg-green-500"></span>
                    <p className="mr-1">برگزار شده</p>
                  </div>
                ) : props.row.values.status == 0 &&
                  props.row.values.is_canceled ? (
                  <div className="flex items-center">
                    <span className="w-3 h-3 ml-1 inline-block rounded-full text-[11px] font-bold bg-[#FF4646]"></span>
                    <p className="mr-1">لغو شده</p>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="w-3 h-3 ml-1 inline-block rounded-full text-[11px] font-bold bg-[#F9C613]"></span>
                    <p className="mr-1">در انتظار برگزاری</p>
                  </div>
                )}
              </div>
            ),
            disableFilters: false,
            width: "3%",
          },
          {
            Header: "صورت‌جلسه",
            accessor: "hast_minutes",
            disableFilters: false,
            width: "0%",
            Cell: (props) => (
              <>
                {roleData && CheckIfAccess("see_minute") ? (
                  props.row.values.hast_minutes ? (
                    <span>&nbsp;وارد شده&nbsp;</span>
                  ) : props.row.values.status == 0 &&
                    props.row.values.is_canceled ? (
                    <span>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;لغو
                      شده&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                  ) : (
                    <span>وارد نشده</span>
                  )
                ) : null}
              </>
            ),
          },
          {
            Header: "مشاهده",
            accessor: "seen",
            Cell: (props) =>
              props.row.values.hast_minutes == 0 ||
              props.row.values.is_canceled ? (
                <div className=" [text-align:-webkit-center] cursor-no-drop ">
                  <Image src={UnSeen} />
                </div>
              ) : (
                props.row.values.status == 1 &&
                !props.row.values.is_canceled && (
                  <div className="[text-align:-webkit-center]">
                    <Link
                      href={`/proceedingMenu/proceedingsList/minutes/${props.row.values.uuid}`}
                    >
                      <Image src={Seen} />
                    </Link>
                  </div>
                )
              ),
            disableFilters: false,
            width: "3%",
          },
          // {
          //     Header: "وضعیت جلسه",
          //     accessor: "title",
          //     disableFilters: false,
          //     width: "20%",
          // },
        ],
      },
    ];
  }, [roleData]);

  return (
    <>
      {!roleData ? (
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

export default EventsTable;
