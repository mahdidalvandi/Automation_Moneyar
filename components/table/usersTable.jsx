import React from "react";
import { useTable, usePagination } from "react-table";
import View from "../forms/view";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAuth } from "../../hooks/auth";
import Edit from "../forms/edit";
import Activation from "../forms/activation";

function Table({ columns, data, allData }) {
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
        pageSize: 1000000,
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
                    className="py-3 pl-2 pr-2 text-center font-sans text-sm font-semibold text-[#333333] -sm:pr-3"
                    {...column.getHeaderProps({
                      style: {
                        minWidth: column.minWidth,
                        width: column.width,
                      },
                    })}
                  >
                    <p className="text-right mr-6">{column.render("Header")}</p>

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
            Header: "himself",
            accessor: "himself",
            disableFilters: false,
            width: "0%",
          },
          {
            Header: "شماره پرسنلی",
            accessor: "id",
            disableFilters: false,
            width: "5%",
            Cell: (props) => (
              <div>
                <p className="text-right mr-6">{props.row.values.id}</p>
              </div>
            ),
          },
          {
            Header: "نام",
            accessor: "first_name",
            disableFilters: false,
            width: "5%",
            Cell: (props) => (
              <div>
                <p className="text-right mr-6">{props.row.values.first_name}</p>
              </div>
            ),
          },
          {
            Header: "نام خانوادگی",
            accessor: "last_name",
            disableFilters: false,
            width: "5%",
            Cell: (props) => (
              <div>
                <p className="text-right mr-6">{props.row.values.last_name}</p>
              </div>
            ),
          },
          {
            Header: "سمت",
            accessor: "post_name",
            disableFilters: false,
            width: "5%",
            Cell: (props) => (
              <div>
                <p className="text-right mr-6">{props.row.values.post_name}</p>
              </div>
            ),
          },
          {
            Header: " واحد",
            accessor: "department_name",
            disableFilters: false,
            width: "5%",
            Cell: (props) => (
              <div>
                <p className="text-right mr-6">
                  {props.row.values.department_name}
                </p>
              </div>
            ),
          },
          {
            Header: " شرکت",
            accessor: "company_name",
            disableFilters: false,
            width: "5%",
            Cell: (props) => (
              <div>
                <p className="text-right mr-6">
                  {props.row.values.company_name}
                </p>
              </div>
            ),
          },
          {
            Header: "مشاهده",
            accessor: "seen",
            disableFilters: true,
            width: "0%",
            Cell: (props) => (
              <div className="flex justify-center items-center hover:cursor-pointer">
                {CheckIfAccess("see_user_details") && (
                  <View
                    link="/users/"
                    className="items-center"
                    uuid={props.row.values.uuid}
                  />
                )}
              </div>
            ),
          },
          {
            Header: "ویرایش",
            accessor: "edit",
            disableFilters: true,
            width: "0%",
            Cell: (props) => (
              <div className="flex  justify-center items-center hover:cursor-pointer">
                {CheckIfAccess("edit_user") && (
                  <div className="">
                    <Edit link="/users/edit/" uuid={props.row.values.uuid} />
                  </div>
                )}
              </div>
            ),
          },
          {
            Header: "فعال",
            accessor: "uuid",
            disableFilters: true,
            width: "3%",
            Cell: (props) => (
              <div className="flex">
                {CheckIfAccess("edit_role") && (
                  <Activation
                    himself={props.row.values.himself}
                    isActive={props.row.values.is_active}
                    uuid={props.row.values.uuid}
                  />
                )}
              </div>
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
  const adminColumns = React.useMemo(
    () => [
      {
        Header: "1",
        Footer: "Footer 1",
        hideHeader: false,

        columns: [
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
            Header: " شرکت",
            accessor: "company_name",
            disableFilters: false,
            width: "10%",
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
      {loadingData ? (
        <SkeletonTheme highlightColor="#fb923c" height={50}>
          <p>
            <Skeleton count={10} />
          </p>
        </SkeletonTheme>
      ) : (
        <Table
          columns={user != null && user.is_super_user ? adminColumns : columns}
          data={data}
        />
      )}
    </>
  );
}

export default UsersTable;
