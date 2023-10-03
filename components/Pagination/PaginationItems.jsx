import React, { useEffect, useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useRouter } from "next/router";
const PaginationItems = ({ allData }) => {
  const [data, setData] = useState({});
  const [clicked, setClicked] = useState(1);
  const ListNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  const router = useRouter();
  const totalPage = allData?.last_page;
  const PageHandler = (item) => {
    setClicked(item);
    router.push(`?=${totalPage}-${item}`);
  };

  const FirstPageHndler = () => {
    setClicked(1);
    router.push(`?=${totalPage}-${1}`);
  };

  const LastPageHndler = (item) => {
    setClicked(totalPage);
    router.push(`?=${totalPage}-${totalPage}`);
  };
  return (
    <div className="pt-5">
      <div className="container">
        <div className="w-fit">
          <ul className="flex mr-6 h-8 items-center my-8 rounded-lg border border-[#CCCCCC] p-4">
            <button onClick={FirstPageHndler}>
              {
                <ArrowForwardIosIcon
                  fontSize="small"
                  className="text-[#999999]"
                />
              }
            </button>
            <li className="flex justify-center items-center text-xl cursor-pointer">
              <div className="flex items-center content-center text-center">
                {ListNum.slice(0, ListNum.indexOf(totalPage) + 1).map(
                  (item, x) => (
                    <button
                      onClick={() => PageHandler(item)}
                      key={x}
                      className={`${
                        item == clicked
                          ? "flex rounded-xl p-4 m-1 font-medium"
                          : "flex rounded-xl m-1 font-medium"
                      }`}
                    >
                      <p
                        className={`${
                          item == clicked
                            ? "bg-[#E3E3E3] pr-2 pl-2 border rounded-sm"
                            : ""
                        }`}
                      >
                        {item}
                      </p>
                    </button>
                  )
                )}
              </div>
            </li>
            <button onClick={LastPageHndler}>
              {<ArrowBackIosIcon className="text-[#999999]" fontSize="small" />}
            </button>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaginationItems;
