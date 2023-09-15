import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter } from "next/router";
const PaginationItems = ({ allData }) => {
  const [data, setData] = useState({});
  const ListNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const router = useRouter();
  const totalPage = allData.last_page;
  const PageHandler = (item) => {
    router.push(`?=${totalPage}-${item}`);
  };

  const FirstPageHndler = (item) => {
    router.push(`?=${totalPage}-${1}`);
  };

  const LastPageHndler = (item) => {
    router.push(`?=${totalPage}-${totalPage}`);
  };
  return (
    <div className="border-t pt-5 flex">
      {/* <button onClick={() => previousPage()} disabled={!canPreviousPage}>
        قبلی
      </button>{" "}
      <button onClick={() => nextPage()} disabled={!canNextPage}>
        بعدی
      </button>{" "} */}
      {/* <span>
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
            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(pageNumber);
          }}
          style={{ width: "50px" }}
        />
      </span> */}
      <div className="container ">
        <ul className="flex mr-6 h-20 my-8 rounded-lg">
          <button onClick={FirstPageHndler}>
            {
              <ArrowForwardIosIcon
                fontSize="medium"
                className="text-[#aaaaaa]"
              />
            }
          </button>
          <li className="flex justify-center items-center text-xl cursor-pointer">
            <div className="flex">
              {/* {ListNum.map((item, x) => (
                <p className="flex m-2">{item}</p>
              ))} */}
              {ListNum.slice(0, ListNum.indexOf(totalPage) + 1).map(
                (item, x) => (
                  <button
                    onClick={() => PageHandler(item)}
                    key={x}
                    className="flex rounded-xl p-4 bg-[#F0F0F0] m-1 font-medium"
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </li>
          <button onClick={LastPageHndler}>
            {<ArrowBackIosIcon className="text-[#aaaaaa]" fontSize="medium" />}
          </button>
        </ul>
      </div>
    </div>
  );
};

export default PaginationItems;
