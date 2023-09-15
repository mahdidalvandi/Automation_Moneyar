import { Dialog } from "@headlessui/react";
import MailsTable from "../../components/table/mailsTable";
import { SearchIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import axios from "../../lib/axios";

export default function MailsDialog(props) {
  const [data, setData] = useState([]);
  const [defaultData, setDefaultData] = useState(props.data);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    setData(props.data);
  }, []);

  const onSearch = async (e) => {
    e.preventDefault();

    const SearchFormData = new FormData();
    SearchFormData.append("subject", e.target.value);
    const JsonData = JSON.stringify(Object.fromEntries(SearchFormData));
    getData(JsonData);

    function getData(searchText) {
      setLoadingData(true);
      const response = axios({
        method: "post",
        url: "/api/v1/cartable/search",
        data: searchText,
      }).then((response) => {
        if (response.data.data != null) {
          setData(response.data.data);
          setLoadingData(false);
        } else {
          setData(defaultData);
          setLoadingData(false);
        }
      });
    }
  };

  return (
    <Dialog
      open={props.dialogOpen}
      onClose={() => props.setDialog(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="flex min-h-full items-center justify-center">
          <Dialog.Panel className="max-w-full rounded bg-white p-5">
            <Dialog.Title>
              <div className="max-w-7xl mx-auto px-2 sm:px-2 md:px-4">
                <div className="bg-white">
                  <div className="-ml-3 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                    <div className="mt-2">
                      <h2 className="text-lg leading-6 font-large text-gray-900">
                        انتخاب نامه
                      </h2>
                    </div>

                    <div className="mt-2 flex-shrink-0">
                      <div className=" relative flex-grow focus-within:z-10">
                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                          <SearchIcon
                            className="h-5 w-5 text-gray-400 pl-1"
                            aria-hidden="true"
                          />
                        </div>

                        <input
                          onInput={(e) => onSearch(e)}
                          type="text"
                          name="desktop-search-candidate"
                          id="desktop-search-candidate"
                          className="border focus:ring-amber-500 focus:border-amber-500 w-full sm:block sm:text-sm border-gray-300"
                          placeholder="جستجو .."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Title>
            <div
              style={{
                maxHeight: "30rem",
                overflowX: "hidden",
              }}
            >
              <MailsTable
                data={data && data.length ? data : props.data}
                loadingData={loadingData}
                setSelect={(per) =>
                  props.setSelect({
                    indic: per.indic,
                    subj: per.subj,
                  })
                }
                setDialog={(per) => props.setDialog(per)}
              />
            </div>
            <button
              onClick={() => props.setDialog(false)}
              className="bg-[#eb5757] hover:bg-[#843737] text-white px-2 py-2 rounded-md text-sm inline-block"
            >
              بستن
            </button>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
