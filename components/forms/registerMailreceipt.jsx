import { Dialog } from "@headlessui/react";
import MailsTable from "../table/mailsTable";
import { SearchIcon } from "@heroicons/react/outline";
import React, { useRef } from "react";
import { useState, useEffect } from "react";
import axios from "../../lib/axios";
import moment from "jalali-moment";
moment.locale("fa");
import ReactToPrint from "react-to-print";

export default function RegisterMailreceipt(props) {
  let componentRef = useRef();
  const [indicator, setIndicator] = useState(props.indicator);
  const [mailDate, setMailDate] = useState(props.mailDate);
  const [mailSubject, setMailSubject] = useState(props.mailSubject);
  const [mailNo, setMailNo] = useState(props.mailNo);

  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    setIndicator(props.indicator);
    setMailDate(props.mailDate);
    setMailNo(props.mailNo);
    setMailSubject(props.mailSubject);
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
                      <h2 className="text-lg leading-6 font-large text-green-900">
                        نامه وارده با موفقیت ثبت شد
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Title>
            <br />
            {/* <br />
                        <div
                            style={{
                                maxHeight: "40rem",
                                overflowX: "hidden",
                            }}
                        >
                            <p>شماره دبیرخانه: {props.indicator}</p>
                            <p> تاریخ دریافت نامه: {moment().format('jYYYY/jMM/jDD')}</p>
                        </div>
                        <br /> */}
            <div>
              <PrintableReceipt
                mailDate={
                  props.mailDate
                    ? moment.unix(props.mailDate).format("YYYY/MM/DD")
                    : null
                }
                indicator={props.indicator}
                mailNo={props.mailNo}
                mailSubject={props.mailSubject}
                ref={(el) => (componentRef = el)}
              />
            </div>
            <ReactToPrint
              pageStyle="@page { size: 148mm 210mm; marginLeft:100px}"
              trigger={() => (
                <button className="bg-[#1f2937] text-white px-2 py-2 rounded-md text-sm inline-block ml-1">
                  چاپ رسید
                </button>
              )}
              content={() => componentRef}
            />

            {/* component to be printed */}

            <button
              onClick={() => props.setDialog(false)}
              className="bg-[#1f2937] text-white px-2 py-2 rounded-md text-sm inline-block ml-1"
            >
              بستن
            </button>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}

class PrintableReceipt extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={{ direction: "rtl" }}>
        <table width="500px">
          <thead></thead>
          <tbody>
            <tr>
              <td></td>
              <td>
                <h2 style={{ alignContent: "center" }}>رسید دریافت نامه</h2>{" "}
              </td>
              <td></td>
            </tr>
            &nbsp;
            <tr>
              <td>&nbsp; </td>
              <td>&nbsp; </td>
              <td>&nbsp; </td>
            </tr>
            <tr>
              <td>شماره دبیرخانه</td>
              <td> </td>
              <td>{this.props.indicator}</td>
            </tr>
            <tr>
              <td>تاریخ ایجاد نامه</td>
              <td> </td>
              <td>{moment().format("jYYYY/jMM/jDD HH:mm:ss")}</td>
            </tr>
            <tr>
              <td>موضوع</td>
              <td></td>
              <td>{this.props.mailSubject}</td>
            </tr>
            <tr>
              <td>شماره نامه وارده</td>
              <td></td>
              <td>{this.props.mailNo}</td>
            </tr>
            <tr>
              <td>تاریخ نامه وارده</td>
              <td></td>
              <td>{this.props.mailDate}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
