import { useEffect, useState } from "react";
import * as React from "react";
import { SearchIcon, PlusIcon } from "@heroicons/react/outline";
// ELEMENTS
import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import { useRouter } from "next/router";
require("react-big-calendar/lib/css/react-big-calendar.css");
import Forbidden from "../../../components/forms/forbidden";
import ResumeTable from "../../../components/table/resumeTable";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
// LIB
import axios from "../../../lib/axios";
import moment from "jalali-moment";
moment.locale("fa");

import { useAuth } from "../../../hooks/auth";
import Link from "next/link";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProceedingsList() {
  const { asPath } = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const [isHolding, setIsHolding] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [searchHasValue, setSearchHasValue] = useState(false);
  const [searchHashtagsHasValue, setSearchHashtagsHasValue] = useState(false);
  const [searchValue, setSearchValue] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [searchHashtagsData, setSearchHashtagsData] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [selectedHashtagsTitles, setSelectedHashtagsTitles] = useState([]);
  const [allData, setAllData] = useState({});
  const router = useRouter();
  var obj = router.query;
  const filteredTags =
    query === ""
      ? hashtags
      : hashtags.filter((person) => {
          return person.title.includes(query.toLowerCase());
        });
  const { user, isLoading } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/",
  });

  useEffect(() => {
    async function getData() {
      await axios.get("api/v1/hashtag/list").then((response) => {
        setHashtags(response.data.data);
      });
    }
    if (loadingData) {
      getData();
    }
  }, []);
  function selectHashtags(value) {
    var selectedHashtagBuf = selectedHashtags;
    var selectedHashtagTitlesBuf = selectedHashtagsTitles;
    selectedHashtagBuf = [...selectedHashtagBuf, value];
    selectedHashtagTitlesBuf = [...selectedHashtagTitlesBuf, value.title];
    setSelectedHashtags(selectedHashtagBuf);
    setSelectedHashtagsTitles(selectedHashtagTitlesBuf);
    searchHashtags(selectedHashtagBuf);
  }

  const handleDelete = (h, t) => () => {
    var selectedHashtagBuf = selectedHashtags.filter(
      (hashtag) => hashtag && hashtag.uuid !== h
    );
    var selectedHashtagTitlesBuf = selectedHashtagsTitles.filter(
      (hashtag) => hashtag && hashtag !== t
    );
    setSelectedHashtags(selectedHashtagBuf);
    setSelectedHashtagsTitles(selectedHashtagTitlesBuf);
    searchHashtags(selectedHashtagBuf);
  };
  function search(val) {
    if (data) {
      var resumeBuf = [];
      if (val.length > 2) {
        setSearchHasValue(true);
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].applicant_name.includes(val) ||
            data[i].applicant_job_position.includes(val) ||
            data[i].applicant_mobile.includes(val)
          ) {
            resumeBuf = [...resumeBuf, data[i]];
          }
        }
      } else setSearchHasValue(false);
      setSearchData(resumeBuf);
    }
  }
  function searchHashtags(vals) {
    if (data) {
      var resumeBuf = [];
      setSearchHashtagsHasValue(true);
      if (vals.length > 0 && vals[0]) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].applicant_public_result) {
            for (let j = 0; j < vals.length; j++) {
              data[i].applicant_public_result.json.forEach((element) => {
                if (vals[j] && element.competence == vals[j].title) {
                  if (resumeBuf.indexOf(data[i]) === -1)
                    resumeBuf = [...resumeBuf, data[i]];
                }
              });
            }
          }
          if (data[i].applicant_expert_result) {
            for (let j = 0; j < vals.length; j++) {
              data[i].applicant_expert_result.json.forEach((element) => {
                if (vals[j] && element.competence == vals[j].title) {
                  if (resumeBuf.indexOf(data[i]) === -1)
                    resumeBuf = [...resumeBuf, data[i]];
                }
              });
            }
          }
        }
      } else setSearchHashtagsHasValue(false);
      setSearchHashtagsData(resumeBuf);
    }
  }
  var GetData = () => {
    const updatedPINdex = obj.hasOwnProperty("") ? obj[""].split("-")[1] : 1;
    axios.get(`/api/v1/interview/all?page=${updatedPINdex}`).then((res) => {
      setLoading(false);
      setAllData(res.data.data);
      setData(res.data.data.data);
      setSearchData([]);
      setSearchHashtagsData([]);
      setSearchHasValue(false);
      setSearchHashtagsHasValue(false);
    });
  };
  useEffect(() => {
    GetData();
  }, [obj]);
  const p2e = (s) => s.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));

  if (isLoading || !user || loading) {
    return null;
  }
  function CheckIfAccess(val) {
    if (currentUserRole && currentUserRole.indexOf(val) > -1) return true;
    return false;
  }
  function CheckIfAccessToPage(val) {
    if (currentUserActions && currentUserActions.indexOf(val) > -1) return true;
    return false;
  }
  console.log(allData);
  console.log(data);
  return (
    <div>
      <SidebarMobile menu={navigationList()} loc={asPath} />
      <SidebarDesktop
        menu={navigationList()}
        loc={asPath}
        setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
        setActions={(props) => setCurrentUserActions(props.currentUserActions)}
        setIsHolding={(props) => setIsHolding(props.isHolding)}
        setSuperUser={(props) => {}}
      />
      <div className="md:pr-52 flex flex-col flex-1">
        <StickyHeader />
        {!currentUserActions ? null : CheckIfAccessToPage(
            window.location.pathname
          ) ? (
          <main>
            <div className="py-6">
              <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                  <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <div className="ml-4 flex items-center">
                      <h2 className="text-lg leading-6 font-large text-gray-900">
                        لیست رزومه‌ها
                      </h2>
                    </div>

                    <div className="ml-4 mt-2 flex-shrink-0 space-x-2 space-x-reverse">
                      {CheckIfAccess("add_resume_list") ? (
                        <Link href="/recruitment/resumeList/store">
                          <button
                            type="button"
                            className="relative inline-flex items-center px-4 py-2  shadow-sm text-sm font-medium rounded-md text-white bg-[#1f2937] hover:bg-[#11151b] "
                          >
                            <PlusIcon
                              className="ml-2 h-5 w-5 text-white"
                              aria-hidden="true"
                            />
                            <span>افزودن رزومه جدید</span>
                          </button>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full px-4 sm:px-6 md:px-8">
                <div className="grid grid-cols-4 gap-y-2 gap-x-4 mb-2 ">
                  <form
                    className="w-full flex md:ml-0 mb-2 mt-4 col-span-4"
                    action="#"
                    method="GET"
                  >
                    <label htmlFor="search-field" className="sr-only">
                      جستجو
                    </label>
                    <div className="relative w-1/4 text-gray-400  focus-within:text-gray-600">
                      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                        <SearchIcon
                          className="h-5 w-5 ml-2"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        onChange={(e) => {
                          search(p2e(e.target.value));
                        }}
                        id="search-field"
                        className="block w-full h-full pl-8 pr-3 py-2border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-gray-300 sm:text-sm"
                        placeholder="جستجو بر اساس نام یا موقعیت شغلی یا شماره موبایل"
                        type="text"
                        name="search"
                      />
                    </div>
                  </form>
                  <div className="col-span-4 w-full">
                    <div className="relative w-full text-gray-400 border border-gray-300 rounded-r-md shadow-sm focus-within:text-gray-600">
                      <div className="grid grid-cols-4 mb-2 gap-3">
                        <Autocomplete
                          clearIcon={false}
                          id="tags-standard"
                          className=" iransans col-span-1 relative flex items-stretch flex-grow focus-within:z-10"
                          options={filteredTags}
                          noOptionsText="یافت نشد!"
                          onChange={(event, newValue) => {
                            selectHashtags(newValue);
                          }}
                          getOptionLabel={(person) => person.title}
                          renderInput={(params) => (
                            <TextField
                              className="iransans col-span-1 appearance-none block  px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                              {...params}
                              variant="standard"
                              placeholder="جستجو بر اساس تگ"
                              onChange={(event) => setQuery(event.target.value)}
                            />
                          )}
                        />
                        <Stack direction="row" className="col-span-4">
                          {selectedHashtags.map((item, index) => {
                            return (
                              <div className="ml-1 mr-1" key={index}>
                                {item ? (
                                  <Chip
                                    label={item.title}
                                    variant="outlined"
                                    onDelete={handleDelete(
                                      item.uuid,
                                      item.title
                                    )}
                                  />
                                ) : null}
                              </div>
                            );
                          })}
                        </Stack>
                      </div>
                    </div>
                  </div>
                </div>
                <ResumeTable
                  allData={allData}
                  data={
                    searchHasValue
                      ? searchData
                      : searchHashtagsHasValue
                      ? searchHashtagsData
                      : data
                  }
                  loadingData={false}
                  roleData={currentUserRole}
                  isArchived={false}
                  searchedTag={selectedHashtagsTitles}
                  setClicked={(per) => {
                    GetData(per);
                  }}
                />
              </div>
            </div>
          </main>
        ) : (
          <Forbidden />
        )}
      </div>
    </div>
  );
}
