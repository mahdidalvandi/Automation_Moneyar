import React from "react";
import { useTable, useFilters, usePagination } from "react-table";
import { useState, useEffect } from "react";
import View from "../forms/view";
import Edit from "../forms/edit";
import Pen from "../forms/pen";
import Users from "../forms/users";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Link from "next/link";

function Table({ columns, data, roleData, uuid }) {
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
      initialState: { pageIndex: 0, pageSize: 10000 },
    },
    // useFilters,
    usePagination
  );

  const { pageIndex, pageSize } = state;
  function CheckIfAccess(val) {
    if (roleData && roleData.indexOf(val) > -1) return true;
    return false;
  }

  // Render the UI for your table
  return (
    <div className="">
      <table className="w-full divide-y divide-gray-300" {...getTableProps()}>
        <thead className="bg-[#D5E8FF] rounded-3xl">
          {headerGroups.map((group, i) => (
            <tr key={i} {...group.getHeaderGroupProps()}>
              {group.headers.map((column, i) => {
                return column.hideHeader === false ? null : (
                  <th
                    key={i}
                    className="py-3 pl-2 text-center text-sm font-semibold text-gray-900 sm:pr-3"
                  >
                    <p className="text-l  text-center">
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
                className={` ${i % 2 === 1 && "bg-[#E3E3E3]"}`}
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

function UsersTable(props) {
  const { data, loadingData } = props;
  const { roleData } = props;
  function CheckIfAccess(val) {
    if (roleData && roleData.indexOf(val) > -1) return true;
    return false;
  }
  const OpenHandler = (props) => {
    console.log(console.log(props));
  };
  const columns = React.useMemo(
    () => [
      {
        Header: "1",
        Footer: "Footer 1",
        hideHeader: false,

        columns: [
          {
            Header: "نام شرکت",
            accessor: "title",
            disableFilters: false,
            width: "30%",
          },
          {
            Header: "شماره تلفن",
            accessor: "tel",
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "شناسه ملی",
            accessor: "national_id",
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "شماره ثبت",
            accessor: "registration_id",
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
                {CheckIfAccess("see_company_details") && (
                  <Users
                    link="/companies/userDetails/"
                    uuid={props.row.values.uuid}
                  />
                )}

                {CheckIfAccess("edit_company") ? (
                  <Pen link="/companies/edit/" uuid={props.row.values.uuid} />
                ) : null}
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

  return (
    <>
      {props.loading ? (
        <SkeletonTheme highlightColor="#fb923c" height={50}>
          <p>
            <Skeleton count={10} />
          </p>
        </SkeletonTheme>
      ) : (
        <Table
          columns={columns}
          data={data}
          roleData={roleData}
          uuid={props.row?.values.uuid}
        />
      )}
    </>
  );
}

export default UsersTable;
