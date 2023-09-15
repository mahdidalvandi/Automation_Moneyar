import React, { useMemo } from "react";
import { useTable, useFilters, usePagination } from "react-table";
import axios from "../../lib/axios";
import { useState, useEffect } from "react";
import Edit from "../forms/edit";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import View from "../forms/view";
import Link from "next/link";

import moment from "jalali-moment";
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
      initialState: { pageIndex: 0, hiddenColumns: ["is_canceled"] },
    },
    // useFilters,
    usePagination
  );

  const { pageIndex, pageSize } = state;

  // Render the UI for your table
  return (
    <div className="overflow-x-auto">
      <table className="w-full divide-y divide-gray-300" {...getTableProps()}>
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
        </select>
      </div>
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
            width: "20%",
          },
          {
            Header: "",
            accessor: "uuid",
            disableFilters: false,
            width: "5%",
            Cell: (props) =>
              props.row.values.status == 1 && !props.row.values.is_canceled ? (
                <span className="w-3 h-3 inline-block rounded-full text-[11px] font-bold bg-green-500"></span>
              ) : props.row.values.status == 0 &&
                props.row.values.is_canceled ? (
                <span className="w-3 h-3 inline-block rounded-full text-[11px] font-bold bg-gray-500"></span>
              ) : (
                <span className="w-3 h-3 inline-block rounded-full text-[11px] font-bold bg-red-500"></span>
              ),
          },
          {
            Header: "نام شرکت",
            accessor: "company_title",
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "عنوان جلسه",
            accessor: "title",
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "تاریخ جلسه",
            accessor: "timestamp",
            Cell: (props) =>
              moment.unix(props.row.values.timestamp).format("YYYY/MM/DD"),
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "وضعیت جلسه",
            accessor: "status",
            Cell: (props) =>
              props.row.values.status == 0 && props.row.values.is_canceled
                ? "لغو شده"
                : props.row.values.status == 1 && !props.row.values.is_canceled
                ? "برگزار شده"
                : "برگزار نشده",
            disableFilters: false,
            width: "20%",
          },
          // {
          //     Header: "وضعیت جلسه",
          //     accessor: "title",
          //     disableFilters: false,
          //     width: "20%",
          // },
          {
            Header: "",
            accessor: "hast_minutes",
            disableFilters: false,
            width: "5%",
            Cell: (props) => (
              <>
                {roleData && CheckIfAccess("see_minute") ? (
                  props.row.values.hast_minutes ? (
                    <Link
                      href={`/proceedingMenu/proceedingsList/minutes/${props.row.values.uuid}`}
                    >
                      <button
                        type="button"
                        className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                      >
                        <span>&nbsp;مشاهده صورت‌جلسه&nbsp;</span>
                      </button>
                    </Link>
                  ) : props.row.values.status == 0 &&
                    props.row.values.is_canceled ? (
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 ml-2 shadow-sm text-sm cursor-text font-medium rounded-md text-white bg-[#c4c4c4]  "
                    >
                      <span>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;لغو
                        شده&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 ml-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-500 focus:outline-none "
                    >
                      <span>صورت‌جلسه وارد نشده</span>
                    </button>
                  )
                ) : null}
              </>
            ),
          },
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
