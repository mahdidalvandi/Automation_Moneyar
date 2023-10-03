import React from "react";
import { useTable, usePagination } from "react-table";
import View from "../forms/view";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAuth } from "../../hooks/auth";

import Edit from "../forms/edit";
import Activation from "../forms/activation";

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
        pageSize: 10000,
        hiddenColumns: ["is_active", "himself"],
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
              {group.headers.map((column) => {
                return column.hideHeader === false ? null : (
                  <th
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

function UsersTable(props) {
  const { data, loadingData } = props;

  function CheckIfAccess(val) {
    if (roleData && roleData.indexOf(val) > -1) return true;
    return false;
  }
  const { roleData } = props;
  const { user, isLoading } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/",
  });
  const columns = React.useMemo(
    () => [
      {
        Header: "1",
        Footer: "Footer 1",
        hideHeader: false,

        columns: [
          {
            Header: "is_active",
            accessor: "is_active",
            disableFilters: false,
            width: "0%",
          },
          {
            Header: "شماره پرسنلی",
            accessor: "id",
            disableFilters: false,
            width: "5%",
          },
          {
            Header: "نام",
            accessor: "first_name",
            disableFilters: false,
            width: "5%",
          },
          {
            Header: "نام خانوادگی",
            accessor: "last_name",
            disableFilters: false,
            width: "5%",
          },
          {
            Header: "سمت",
            accessor: "post_name",
            disableFilters: false,
            width: "5%",
          },
          {
            Header: " واحد",
            accessor: "department_name",
            disableFilters: false,
            width: "5%",
          },
          {
            Header: " دسترسی",
            accessor: "access_name",
            disableFilters: false,
            width: "5%",
          },
          {
            Header: " کد ملی",
            accessor: "national_code",
            disableFilters: false,
            width: "5%",
          },
          {
            Header: " موبایل",
            accessor: "mobile",
            disableFilters: false,
            width: "5%",
          },
          // {
          //     Header: "",
          //     accessor: "uuid",
          //     disableFilters: true,
          //     width: "10%",
          //     Cell: (props) => (
          //         <>
          //             {CheckIfAccess("see_user_details") ?
          //                 <View
          //                     link="/users/"
          //                     uuid={props.row.values.uuid}
          //                 /> : null}
          //             {CheckIfAccess("edit_user") ?
          //                 <Edit
          //                     link="/users/edit/"
          //                     uuid={props.row.values.uuid}
          //                 /> : null}
          //             {CheckIfAccess("edit_role") ?
          //                 <Activation
          //                     himself={props.row.values.himself}
          //                     isActive={props.row.values.is_active}
          //                     uuid={props.row.values.uuid}
          //                 /> : null}
          //         </>
          //     ),
          // },
        ],
      },
    ],
    []
  );

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

export default UsersTable;
