import { Dialog } from "@headlessui/react";
import RecieversTable from "../../components/table/recieversTable";
import { useState, useEffect } from "react";

export default function RecieversDialog(props) {
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    setData(props.data);
  }, []);

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
                        انتخاب گروه
                      </h2>
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
              <RecieversTable
                data={data && data.length ? data : props.data}
                loadingData={loadingData}
                setSelect={(per) => props.setSelect(per)}
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
