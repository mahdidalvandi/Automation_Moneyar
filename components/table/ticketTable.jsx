import React from "react";
import { useTable, usePagination } from "react-table";
import View from "../forms/view";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import moment from "jalali-moment";
import PaginationItems from "../Pagination/PaginationItems";

moment.locale("fa");

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
      initialState: { pageIndex: 0, pageSize: 100000 },
    },
    // useFilters,
    usePagination
  );

  const { pageIndex, pageSize } = state;

  // Render the UI for your table
  return (
    <div className="">
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
      <PaginationItems allData={allData} />
    </div>
  );
}

function TicketTable(props) {
  const { roleData, setClicked, allData } = props;
  const { data, loadingData } = props;
  const columns = React.useMemo(
    () => [
      {
        Header: "1",
        Footer: "Footer 1",
        hideHeader: false,

        columns: [
          {
            Header: "شماره تیکت",
            accessor: "id",
            disableFilters: false,
            width: "10%",
            Cell: (props) => (
              <p className="text-right mr-4">{props.row.values.id}</p>
            ),
          },
          {
            Header: "موضوع ",
            accessor: "subject",
            disableFilters: false,
            width: "10%",
            Cell: (props) => (
              <p className="text-right mr-4">{props.row.values.subject}</p>
            ),
          },
          {
            Header: "زمان پیام ",
            accessor: "last_message_timestamp",
            disableFilters: false,
            width: "40%",
            Cell: (props) =>
              props.row.values.last_message_timestamp && (
                <p className="text-right mr-4">
                  {moment
                    .unix(props.row.values.last_message_timestamp)
                    .format("HH:mm YYYY/MM/DD")}
                </p>
              ),
          },
          {
            Header: "وضعیت تیکت",
            accessor: "status",
            disableFilters: false,
            width: "10%",
            Cell: (props) =>
              props.row.values.status == 1 ? (
                <h3 className="text-sm p-1 text-gray-500 border border-gray-200 rounded-md text-center bg-gray-300 ">
                  بسته شده
                </h3>
              ) : props.row.values.status == 2 ? (
                <h3 className="text-sm p-1 text-gray-500 border border-gray-200 rounded-md text-center bg-blue-300 ">
                  در انتظار پاسخ
                </h3>
              ) : (
                <h3 className="text-sm p-1 text-gray-500 border border-gray-200 rounded-md text-center bg-green-300 ">
                  پاسخ داده شده
                </h3>
              ),
          },
          {
            Header: "مشاهده",
            accessor: "uuid",
            disableFilters: true,
            width: "5%",
            Cell: (props) => (
              <>
                <View link="/support/ticket/" uuid={props.row.values.uuid} />
              </>
            ),
          },
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
        <Table columns={columns} data={data} allData={allData} />
      )}
    </>
  );
}

export default TicketTable;
