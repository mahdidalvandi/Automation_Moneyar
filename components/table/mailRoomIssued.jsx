import React from "react";
import { useTable, usePagination, useFiters } from "react-table";
import View from "../forms/view";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import moment from "jalali-moment";
import StarButton from "../forms/starButton";
import PaginationItems from "../Pagination/PaginationItems";
moment.locale("fa");

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
        hiddenColumns: ["status", "edit_status"],
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
                    className="py-3 pl-1 pr-1 text-center text-sm font-semibold text-gray-900 sm:pr-3 "
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
              <tr className="bg-[#E3E3E3]" key={i} {...row.getRowProps()}>
                {row.cells.map((cell, i) => {
                  return (
                    <td
                      key={i}
                      className="relative whitespace-nowrap py-3 text-center text-sm font-medium border-b "
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
      <div>
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

function MailRoomIssuedTable(props) {
  const { data, loadingData, allData } = props;
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
            accessor: "edit_status",
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "شماره دبیرخانه",
            accessor: "indicator",
            disableFilters: false,
            width: "20%",
            Cell: (props) => (
              <div>
                <p className="text-right mr-6">{props.row.values.indicator}</p>
              </div>
            ),
          },
          {
            Header: "موضوع",
            accessor: "subject",
            disableFilters: false,
            width: "30%",
            Cell: (props) => (
              <div>
                <p className="text-right mr-6">{props.row.values.subject}</p>
              </div>
            ),
          },
          {
            Header: "گیرنده",
            accessor: "to_company",
            disableFilters: false,
            width: "20%",
            Cell: (props) => (
              <div>
                <p className="text-right mr-6">{props.row.values.to_company}</p>
              </div>
            ),
          },

          {
            Header: "شماره نامه صادره",
            accessor: "secretariat_number",
            Cell: (props) =>
              props.row.values.secretariat_number == 0
                ? ""
                : props.row.values.secretariat_number,
            Cell: (props) => (
              <div>
                {props.row.values.secretariat_number == 0 ? (
                  ""
                ) : (
                  <p className="text-right mr-6">
                    {props.row.values.secretariat_number}
                  </p>
                )}
              </div>
            ),
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "تاریخ صدور نامه",
            accessor: "issuance_timestamp",
            Cell: (props) =>
              props.row.values.issuance_timestamp && (
                <div className="text-right mr-6">
                  {moment
                    .unix(props.row.values.issuance_timestamp)
                    .format("hh:mm:ss YYYY/MM/DD")}
                </div>
              ),
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "وضعیت پیش نویس",
            accessor: "is_cartable_added",
            Cell: (props) =>
              props.row.values.status == -1 ? (
                props.row.values.edit_status == 0 ? (
                  <p className="text-sm  text-gray-500">پیش نویس</p>
                ) : (
                  <span className="text-sm text-[#333333]">
                    تغییرات ذخیره نشده
                  </span>
                )
              ) : props.row.values.status == 0 ? (
                <p className="text-sm text-right mr-5 w-full text-[#A58309]">
                  در انتظار تایید
                </p>
              ) : props.row.values.status == 1 ? (
                <p className="text-sm text-right mr-5 text-[#146637]">
                  تایید شده
                </p>
              ) : props.row.values.status == 2 ? (
                <p className="text-sm text-right mr-5 text-[#FF4646]">رد شده</p>
              ) : props.row.values.status == 3 ? (
                <p className="text-sm text-right mr-5 w-full text-[#146637]">
                  صادر شده
                </p>
              ) : null,
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
                {props.row.values.status == -1 ? (
                  <View
                    link="/mailRoom/issued/edit/"
                    uuid={props.row.values.uuid}
                  />
                ) : (
                  <>
                    <View
                      link="/mailRoom/issued/"
                      uuid={props.row.values.uuid}
                    />
                    <StarButton />
                  </>
                )}
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
            <Table columns={columns} data={data} allData={allData} />
          )}
        </>
      </div>
    </div>
  );
}

export default MailRoomIssuedTable;
