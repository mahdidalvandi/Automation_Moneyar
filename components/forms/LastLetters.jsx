import React, { useEffect, useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import moment from "jalali-moment";
import axios2 from "../../lib/axios";
import Image from "next/image";
import Link from "next/link";
const LastLetters = () => {
  const [data, setData] = useState({});
  const Month = moment(data).format("jMMMM");
  const [loadingData, setLoadingData] = useState(true);
  const [letters, setLetters] = useState([]);
  const [clicked, setClicked] = useState(false);
  const ClickedNow = () => {
    setClicked(!clicked);
  };

  useEffect(() => {
    axios2.get("/api/v1/dashboard/lastLetters").then((res) => {
      setLetters(res.data.data?.letter_data);
    });
  }, []);

  return (
    <>
      <div className="w-5/12 border mt-12 mr-14 rounded-md p-2 ">
        <div className="flex justify-center items-center w-full ">
          <div className="flex w-full mr-3">
            <EmailIcon className="text-[#2E8BFF] ml-1 " />
            <p className="text-[#2E8BFF]">آخرین نامه ها</p>
          </div>
          <Link href="/cartable/newMail?send=1">
            <button
              type="button"
              className="w-48 ml-8 mt-2 text-[#22AA5B] bg-white border border-[#22AA5B] hover:bg-[#22AA5B] hover:text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              + نامه جدید
            </button>
          </Link>
        </div>
        {letters?.map((item, i) => {
          const dateF = item.letter_date_time.split(" ")[1];
          const sliceDate = dateF.replace("1402/", "");
          return (
            <div className="mt-7" key={i}>
              <div
                className="flex mb-3 items-center"
                key={i}
                onClick={ClickedNow}
              >
                <div className="mt-1 mr-2">
                  <Image src="/images/user.png" width={25} height={25} />
                </div>
                <p className="text-sm w-48 font-semibold mr-2">
                  {item.primary_sender}
                </p>
                <div className="flex-col w-72 mr-28 items-center">
                  <p className="text-sm items-center ">{item.subject}</p>
                </div>
                <div className="flex-col">
                  <p className="text-sm w-24 mr-32 object-center">
                    {sliceDate}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {/* <TablePage data={data} loadingData={loadingData} source="cartable" /> */}
      </div>
    </>
  );
};

export default LastLetters;
