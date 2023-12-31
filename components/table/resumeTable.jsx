import React from "react";
import { useTable, useFilters, usePagination } from "react-table";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Link from "next/link";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import _ from "lodash";
import moment from "jalali-moment";
import Archive from "../forms/archive";
import { useMemo } from "react";
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
      initialState: {
        pageIndex: 0,
        hiddenColumns: [
          "applicant_data",
          "applicant_result",
          "applicant_mobile",
          "applicant_job_position",
        ],
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
        <thead className="bg-gray-50 [text-align-last:right] ">
          {headerGroups.map((group, i) => (
            <tr key={i} className="" {...group.getHeaderGroupProps()}>
              {group.headers.map((column, i) => {
                return column.hideHeader === false ? null : (
                  <th
                    key={i}
                    className="py-3 pl-2  bg-[#D5E8FF] text-sm font-semibold text-gray-900 sm:pr-3"
                    {...column.getHeaderProps({
                      style: {
                        minWidth: column.minWidth,
                        width: column.width,
                      },
                    })}
                  >
                    <p className="text-l ml-4 text-center">
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
                className={`${i % 2 === 0 ? "bg-[#E3E3E3] text-center" : ""}`}
                key={i}
                {...row.getRowProps()}
              >
                {row.cells.map((cell, i) => {
                  return (
                    <td
                      key={i}
                      className={`relative whitespace-nowrap text-right  py-3 pl-2 pr-2  text-sm font-medium sm:pr-3`}
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
      <div className="border-t pt-5 border-gray-200"></div>
      <PaginationItems allData={allData} />
    </div>
  );
}

function ResumeTable(props) {
  const { roleData, setClicked, isArchived } = props;
  // const [loadingData, setLoadingData] = useState(true);
  const { data, loadingData, searchedTag, allData } = props;

  const columnsWithTags = useMemo(() => {
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
            accessor: "applicant_job_position",
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "",
            accessor: "applicant_data",
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "",
            accessor: "applicant_result",
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "",
            accessor: "applicant_mobile",
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "متقاضی",
            accessor: "applicant_name",
            disableFilters: false,
            width: "10%",
            Cell: (props) => (
              <>
                <p className="text-lg">{`${props.row.values.applicant_name}`}</p>
                <p className="text-sm text-[#666666]">{`${props.row.values.applicant_job_position}`}</p>
                <p className="text-sm text-[#666666]">{`${props.row.values.applicant_mobile}`}</p>
              </>
            ),
          },
          {
            Header: "وضعیت مصاحبه عمومی",
            accessor: "applicant_public_result",
            disableFilters: false,
            width: "10%",
            Cell: (props) =>
              props.row.values.applicant_public_result ? (
                <>
                  <p
                    className={`${
                      props.row.values.applicant_public_result.approved ==
                        "1" ||
                      props.row.values.applicant_public_result.approved == "2"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >{`وضعیت مصاحبه: 
                                ${
                                  props.row.values.applicant_public_result
                                    .approved == "0"
                                    ? "رد شده"
                                    : props.row.values.applicant_public_result
                                        .approved == "1"
                                    ? "قبول"
                                    : props.row.values.applicant_public_result
                                        .approved == "2"
                                    ? "مشروط"
                                    : "عدم توافق پکیج"
                                }`}</p>
                  <p className="text-[#666666]">{`مصاحبه کننده: ${props.row.values.applicant_public_result.interviewer_name}`}</p>
                  <p className="text-[#666666]">{`تاریخ : ${moment
                    .unix(props.row.values.applicant_public_result.timestamp)
                    .format("YYYY/MM/DD")}`}</p>
                </>
              ) : (
                <>
                  <p className="text-red-500">{`انجام نشده است`}</p>
                </>
              ),
          },
          {
            Header: "وضعیت مصاحبه تخصصی",
            accessor: "applicant_expert_result",
            disableFilters: false,
            width: "10%",
            Cell: (props) =>
              props.row.values.applicant_expert_result ? (
                <>
                  {/* <p className="text-green-500">{`انجام شده`}</p> */}
                  <p
                    className={`${
                      props.row.values.applicant_expert_result.approved ==
                        "1" ||
                      props.row.values.applicant_expert_result.approved == "2"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >{`وضعیت مصاحبه: 
                                ${
                                  props.row.values.applicant_expert_result
                                    .approved == "0"
                                    ? "رد شده"
                                    : props.row.values.applicant_expert_result
                                        .approved == "1"
                                    ? "قبول"
                                    : props.row.values.applicant_expert_result
                                        .approved == "2"
                                    ? "مشروط"
                                    : "عدم توافق پکیج"
                                }`}</p>
                  <p>{`مصاحبه کننده: ${props.row.values.applicant_expert_result.interviewer_name}`}</p>
                  <p>{`تاریخ : ${moment
                    .unix(props.row.values.applicant_expert_result.timestamp)
                    .format("YYYY/MM/DD")}`}</p>
                </>
              ) : (
                <>
                  <p className="text-red-500">{`انجام نشده است`}</p>
                </>
              ),
          },
          {
            Header: "نظر مدیریت",
            accessor: "applicant_manager_result",
            disableFilters: false,
            width: "10%",
            Cell: (props) =>
              props.row.values.applicant_manager_result ? (
                <>
                  <p
                    className={`${
                      props.row.values.applicant_manager_result.approved ==
                        "1" ||
                      props.row.values.applicant_manager_result.approved == "2"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >{`وضعیت استخدام: 
                                ${
                                  props.row.values.applicant_manager_result
                                    .approved == "0"
                                    ? "رد شده"
                                    : props.row.values.applicant_manager_result
                                        .approved == "1"
                                    ? "قبول"
                                    : props.row.values.applicant_manager_result
                                        .approved == "2"
                                    ? "مشروط"
                                    : "عدم توافق پکیج"
                                }`}</p>
                  <p className="text-[#666666]">{`توضیحات : ${props.row.values.applicant_manager_result.comment}`}</p>
                  <p className="text-[#666666]">{`تاریخ : ${moment
                    .unix(props.row.values.applicant_manager_result.timestamp)
                    .format("YYYY/MM/DD")}`}</p>
                </>
              ) : (
                <>
                  <p className="text-red-500">{`ثبت نشده است`}</p>
                </>
              ),
          },
          {
            Header: "مهارت ها",
            accessor: "compet",
            disableFilters: false,
            width: "20%",
            Cell: (props) =>
              searchedTag ? (
                <div className="grid gap-y-1" style={{ direction: "ltr" }}>
                  <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    {props.row.values.applicant_expert_result
                      ? props.row.values.applicant_expert_result.json.map(
                          (item, index) => {
                            return item &&
                              searchedTag.indexOf(item.competence) !== -1 ? (
                              <Chip
                                avatar={<Avatar>{item.rate}</Avatar>}
                                label={item.competence}
                                variant="outlined"
                              />
                            ) : null;
                          }
                        )
                      : null}
                  </Stack>
                  <Stack direction="row" justifyContent="flex-end" spacing={1}>
                    {props.row.values.applicant_public_result
                      ? props.row.values.applicant_public_result.json.map(
                          (item, index) => {
                            return item &&
                              searchedTag.indexOf(item.competence) !== -1 ? (
                              <Chip
                                avatar={<Avatar>{item.rate}</Avatar>}
                                label={item.competence}
                                variant="outlined"
                              />
                            ) : null;
                          }
                        )
                      : null}
                  </Stack>
                </div>
              ) : (
                <>tesgt</>
              ),
          },
          {
            Header: "",
            accessor: "interview_uuid",
            Cell: (props) => (
              <Link
                href={`/recruitment/resumeList/${props.row.values.interview_uuid}`}
              >
                <button
                  type="button"
                  className="ml-2 inline-flex justify-center rounded-md py-2 px-4 text-sm font-medium text-white shadow-sm bg-[#43a047] hover:bg-[#2d592f] focus:outline-none "
                >
                  <span>&nbsp; مشاهده فرم اطلاعات&nbsp;</span>
                </button>
              </Link>
            ),
            disableFilters: false,
            width: "10%",
          },
          {
            Header: "",
            accessor: "applicant_uuid",
            Cell: (props) => (
              <Archive
                uuid={props.row.values.applicant_data.uuid}
                isArchived={isArchived}
                setClicked={(per) => {
                  setClicked(per);
                }}
              />
            ),
            disableFilters: false,
            width: "2%",
          },
        ],
      },
    ];
  }, [searchedTag]);

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
            accessor: "applicant_job_position",
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "",
            accessor: "applicant_data",
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "",
            accessor: "applicant_result",
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "",
            accessor: "applicant_mobile",
            disableFilters: false,
            width: "20%",
          },
          {
            Header: "متقاضی",
            accessor: "applicant_name",
            disableFilters: false,
            width: "7%",
            Cell: (props) => (
              <>
                <p className="text-lg">{`${props.row.values.applicant_name}`}</p>
                <p className="text-sm text-[#666666]">{`${props.row.values.applicant_job_position}`}</p>
                <p className="text-sm text-[#666666]">{`${props.row.values.applicant_mobile}`}</p>
              </>
            ),
          },
          {
            Header: "وضعیت مصاحبه عمومی",
            accessor: "applicant_public_result",
            disableFilters: false,
            width: "8%",
            Cell: (props) =>
              props.row.values.applicant_public_result ? (
                <>
                  {/* <p className="text-green-500">{`انجام شده`}</p> */}
                  <p
                    className={`${
                      props.row.values.applicant_public_result.approved ==
                        "1" ||
                      props.row.values.applicant_public_result.approved == "2"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >{`وضعیت مصاحبه: 
                                ${
                                  props.row.values.applicant_public_result
                                    .approved == "0"
                                    ? "رد شده"
                                    : props.row.values.applicant_public_result
                                        .approved == "1"
                                    ? "قبول"
                                    : props.row.values.applicant_public_result
                                        .approved == "2"
                                    ? "مشروط"
                                    : "عدم توافق پکیج"
                                }`}</p>
                  <p>{`مصاحبه کننده: ${props.row.values.applicant_public_result.interviewer_name}`}</p>
                  <p>{`تاریخ : ${moment
                    .unix(props.row.values.applicant_public_result.timestamp)
                    .format("YYYY/MM/DD")}`}</p>
                </>
              ) : (
                <>
                  <p className="text-red-500">{`انجام نشده است`}</p>
                </>
              ),
          },
          {
            Header: "وضعیت مصاحبه تخصصی",
            accessor: "applicant_expert_result",
            disableFilters: false,
            width: "10%",
            Cell: (props) =>
              props.row.values.applicant_expert_result ? (
                <>
                  {/* <p className="text-green-500">{`انجام شده`}</p> */}
                  <p
                    className={`${
                      props.row.values.applicant_expert_result.approved ==
                        "1" ||
                      props.row.values.applicant_expert_result.approved == "2"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >{`وضعیت مصاحبه: 
                                ${
                                  props.row.values.applicant_expert_result
                                    .approved == "0"
                                    ? "رد شده"
                                    : props.row.values.applicant_expert_result
                                        .approved == "1"
                                    ? "قبول"
                                    : props.row.values.applicant_expert_result
                                        .approved == "2"
                                    ? "مشروط"
                                    : "عدم توافق پکیج"
                                }`}</p>
                  <p className="text-[#666666]">{`مصاحبه کننده: ${props.row.values.applicant_expert_result.interviewer_name}`}</p>
                  <p className="text-[#666666]">{`تاریخ : ${moment
                    .unix(props.row.values.applicant_expert_result.timestamp)
                    .format("YYYY/MM/DD")}`}</p>
                </>
              ) : (
                <>
                  <p className="text-red-500">{`انجام نشده است`}</p>
                </>
              ),
          },
          {
            Header: "نظر مدیریت",
            accessor: "applicant_manager_result",
            disableFilters: false,
            width: "5%",
            Cell: (props) =>
              props.row.values.applicant_manager_result ? (
                <>
                  <p
                    className={`${
                      props.row.values.applicant_manager_result.approved ==
                        "1" ||
                      props.row.values.applicant_manager_result.approved == "2"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >{`وضعیت استخدام: 
                                ${
                                  props.row.values.applicant_manager_result
                                    .approved == "0"
                                    ? "رد شده"
                                    : props.row.values.applicant_manager_result
                                        .approved == "1"
                                    ? "قبول"
                                    : props.row.values.applicant_manager_result
                                        .approved == "2"
                                    ? "مشروط"
                                    : "عدم توافق پکیج"
                                }`}</p>
                  <p className="text-[#666666]">{`توضیحات : ${props.row.values.applicant_manager_result.comment}`}</p>
                  <p className="text-[#666666]">{`تاریخ : ${moment
                    .unix(props.row.values.applicant_manager_result.timestamp)
                    .format("YYYY/MM/DD")}`}</p>
                </>
              ) : (
                <>
                  <p className="text-red-500">{`ثبت نشده است`}</p>
                </>
              ),
          },
          {
            Header: "",
            accessor: "interview_uuid",
            Cell: (props) => (
              <Link
                href={`/recruitment/resumeList/${props.row.values.interview_uuid}`}
              >
                <button
                  type="button"
                  className="ml-2 inline-flex justify-center rounded-md py-2 px-4
                  text-sm border border-[#22AA5B] font-semibold text-[#22AA5B]
                  shadow-sm hover:bg-[#c3f7c5] focus:outline-none "
                >
                  <span>&nbsp;نمایش فرم&nbsp;</span>
                </button>
              </Link>
            ),
            disableFilters: false,
            width: "0%",
          },
          {
            Header: "",
            accessor: "applicant_uuid",
            Cell: (props) => (
              <Archive
                uuid={props.row.values.applicant_data.uuid}
                isArchived={isArchived}
                setClicked={(per) => {
                  setClicked(per);
                }}
              />
            ),
            disableFilters: false,
            width: "2%",
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
        <Table
          allData={allData}
          columns={
            searchedTag && searchedTag.length > 0 ? columnsWithTags : columns
          }
          data={data}
        />
      )}
    </>
  );
}

export default ResumeTable;
