import SidebarDesktop from "../components/layout/sidebarDesktop";
import SidebarMobile from "../components/layout/sidebarMobile";
import StickyHeader from "../components/layout/stickyHeader";
import navigationList from "../components/layout/navigationList";
import { useRouter } from "next/router";
import moment from "jalali-moment";
import EmailIcon from "@mui/icons-material/Email";
import { useState } from "react";
import PersianWeeklyCalendar from "../components/forms/calendar";
import LastLetters from "../components/forms/LastLetters";
import NewSessionPopup from "../components/forms/newSessionPopup";

moment.locale("fa");

export default function Dashboard() {
  const router = useRouter();
  const { asPath } = useRouter();
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const [data, setData] = useState({});
  const [loadingData, setLoadingData] = useState(true);

  var date = new Date();
  date.setDate(date.getDate() + 5);
  function CheckIfAccess(val) {
    if (currentUserActions && currentUserActions.indexOf(val) > -1) return true;
    return false;
  }

  const Month = moment(data).format("jMMMM");

  return (
    <>
      <div>
        <SidebarMobile menu={navigationList()} loc={asPath} />
        <SidebarDesktop
          menu={navigationList()}
          loc={asPath}
          setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
          setActions={(props) =>
            setCurrentUserActions(props.currentUserActions)
          }
          setIsHolding={(props) => {}}
          setSuperUser={(props) => {}}
        />
        <div className="md:pr-52 flex flex-col flex-1">
          <StickyHeader />
          {/* Top Side */}
          <div className="flex relative">
            {/* Right Side */}
            <LastLetters />
            <div className="w-8"></div>
            {/* Left Side */}
            <div className="w-6/12 h-1/3 mt-12 border rounded-md px-2">
              <div className="flex justify-center mt-3 items-center w-full ">
                <div className="flex w-full items-center mb-2">
                  <EmailIcon className="text-[#2E8BFF] " />
                  <p className="text-[#2E8BFF] mr-1 font-medium text-lg">
                    تقویم این هفته
                  </p>
                </div>
                <NewSessionPopup />
              </div>
              <PersianWeeklyCalendar />
              {/* <Calender /> */}
            </div>
          </div>
          {/* Down Side */}
          {/* <div className="w-5/12 h-1/3 mt-12 border mr-14 px-2 ">
            <div className="flex justify-center mt-2 items-center w-full ">
              <div className="flex justify-center items-center w-full ">
                <div className="flex w-full">
                  <EmailIcon className="text-[#2E8BFF] ml-1 " />
                  <p className="text-[#2E8BFF]">دبیرخانه</p>
                </div>
                <button
                  type="button"
                  className="w-48 ml-8 mt-2 text-[#22AA5B] bg-white border border-[#22AA5B] hover:bg-[#22AA5B] hover:text-white focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                >
                  + نامه جدید
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}
