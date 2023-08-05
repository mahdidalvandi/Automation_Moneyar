import { Dialog } from "@headlessui/react";
import { useState } from "react";
import axios from "../../lib/axios";
import Textarea from "../forms/textarea";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

export default function ExpertInterviewDialog(props) {
    const [errors, setErrors] = useState([]);
    const [expectedCompetence, setExpectedCompetence] = useState([]);
    const [comment, setComment] = useState("");
    const [query, setQuery] = useState("");
    const [approved, setApproved] = useState(-1);

    const hiringTypeMethods = [
        { id: "0", title: "رد شده" },
        { id: "1", title: "قبول" },
        { id: "2", title: "مشروط" },
        { id: "3", title: "عدم توافق پکیج" },
    ];
    const filteredBanks =
        query === ""
            ? props.hashtags
            : props.hashtags.filter((person) => {
                return person.title.includes(query.toLowerCase());
            });
    function addExpected() {
        setExpectedCompetence([...expectedCompetence, { competence: "", rate: "" }]);
    }
    function removeExpected(index) {
        let temp = [...expectedCompetence];
        temp.splice(index, 1);
        setExpectedCompetence(temp);
    }
    function changeCompetence(index, value) {
        let temp = [...expectedCompetence];
        temp[index].competence = value && value.title ? value.title : value;
        setExpectedCompetence(temp);
    }
    function changeRate(index, value) {
        let temp = [...expectedCompetence];
        temp[index].rate = value;
        setExpectedCompetence(temp);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        var object = {};
        var hasError = false;
        if (approved == "-1") {
            object['approved'] = 'وضعیت نهایی الزامی است';
            hasError = true;
        }
        if (!comment) {
            object['comment'] = 'نظر نهایی الزامی است';
            hasError = true;
        }
        if (expectedCompetence.length == 0) {
            object['expectedCompetence'] = 'ثبت شایستگی الزامی است';
            hasError = true;
        }
        if (hasError) {
            setErrors(object);
            return;
        }
        axios
            .post('/api/v1/interview/comment',
                {
                    json: expectedCompetence,
                    comment: comment,
                    approved: approved,
                    interview_uuid: props.interviewId,
                    applicant_uuid: props.applicantId,
                    type: 1
                })
            .then((res) => {
                props.setDialog(false);
            })
            .catch((err) => {
                object['master'] = err.response.data.message;
                setErrors(object)
            }
            );
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
                                                نتیجه مصاحبه تخصصی
                                            </h2>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </Dialog.Title>

                        <div className="sm:col-span-6  border-t border-gray-300 py-5">
                        <div className="sm:col-span-2 mb-4">
                                <p
                                    htmlFor="cover-photo"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    وضعیت نهایی مصاحبه
                                </p>
                                <fieldset className="mt-4">
                                    <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-1">
                                        {hiringTypeMethods.map(
                                            (
                                                hiringTypeMethods
                                            ) => (
                                                <div
                                                    key={
                                                        `genderStatusTypeMethods${hiringTypeMethods.id}`
                                                    }
                                                    className="flex items-center"
                                                >
                                                    <label
                                                        htmlFor={
                                                            `genderStatusTypeMethods${hiringTypeMethods.id}`
                                                        }
                                                        className="ml-3 block text-sm font-medium text-gray-700"
                                                    >
                                                        <input
                                                            id={
                                                                hiringTypeMethods.id
                                                            }
                                                            name="GenderStatusMethod"
                                                            type="radio"
                                                            className="focus:ring-amber-500 h-4 w-4 text-amber-600 border-gray-300 ml-2"
                                                            onChange={(
                                                                e
                                                            ) => {
                                                                setApproved(
                                                                    e
                                                                        .target
                                                                        .id
                                                                );
                                                            }}
                                                        />
                                                        {
                                                            hiringTypeMethods.title
                                                        }
                                                    </label>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </fieldset>
                                {errors["approved"] ? (
                                    <span className="text-sm text-red-500">
                                        {
                                            errors["approved"]
                                        }
                                    </span>
                                ) : null}
                            </div>
                            <button type="button" onClick={_ => addExpected()} className="hover:bg-gray-50 transition duration-150 shadow p-2 px-4 rounded-md text-sm flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 ml-1"} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                اضافه کردن شایستگی جدید *
                            </button>
                            <table className="font-light table-auto w-full text-sm font-light my-3 shadow rounded-md overflow-hidden">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2">
                                            ردیف
                                        </th>
                                        <th>
                                            مهارت (توانمندی علمی)
                                        </th>
                                        <th>
                                            امتیاز (۱ تا ۱۰)
                                        </th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        expectedCompetence.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td >
                                                        {item.title ?
                                                            <input type="text" value={item.title} className="text-sm w-full border-0 p-2" placeholder="مهارت" /> :
                                                            <Autocomplete
                                                                clearOnBlur={false}
                                                                clearOnEscape={false}
                                                                id="tags-standard"
                                                                className=" iransans relative flex items-stretch flex-grow focus-within:z-10"
                                                                options={
                                                                    filteredBanks
                                                                }
                                                                noOptionsText="یافت نشد!"
                                                                onInputChange={(event, newValue) => { changeCompetence(index, newValue); }}
                                                                onChange={(event, newValue) => { changeCompetence(index, newValue); }}
                                                                getOptionLabel={(
                                                                    person
                                                                ) =>
                                                                    person.title
                                                                }
                                                                renderInput={(
                                                                    params
                                                                ) => (
                                                                    <TextField
                                                                        className="iransans appearance-none block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                                                                        {...params}
                                                                        variant="standard"
                                                                        placeholder="افزودن .."
                                                                        onChange={(event) => setQuery(event.target.value)}
                                                                    />
                                                                )}
                                                            />}
                                                    </td>
                                                    <td>
                                                        <input type="number" value={item.rate} onChange={e => changeRate(index, e.target.value)} className="text-sm text-center w-full border-0 p-2" placeholder="امتیاز (۱ تا ۱۰)" />
                                                    </td>
                                                    <td>
                                                        <button type="button" onClick={_ => removeExpected(index)} className="hover:bg-gray-50 transition duration-150 text-sm flex items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            {errors["expectedCompetence"] ? (
                                <span className="text-sm text-red-500">
                                    {
                                        errors["expectedCompetence"]
                                    }
                                </span>
                            ) : null}
                        </div>
                        <div style={{ width: "90vh" }}>
                            <Textarea
                                title="نظر نهایی تخصصی *"
                                name="Agenda"
                                // defaultValue={
                                //     selectedEvent.agenda != null ? selectedEvent.agenda : "دستور جلسه وارد نشده است"
                                // }
                                onChange={(e) => {
                                    setComment(e.target.value);
                                }}
                                error={errors["comment"]}
                                defaultValue={comment}
                                rows="5"
                                type="text"
                            />
                            {/* <p className="text-sm">مهارت های ثبت شده به عنوان تگ در بخش جستجوی رزومه‌ها قابل استفاده است. لذا جهت بهره‌مندی دقیق تر از تگ ها، مهارت ها را به صورت دقیق وارد کنید.</p> */}
                        </div>
                        <button
                            onClick={onSubmit}
                            className="bg-[#43a047] hover:bg-[#2d592f] ml-2 text-white px-2 py-2 mt-5 rounded-md text-sm inline-block"
                        >
                            ثبت
                        </button>
                        <button
                            onClick={() => props.setDialog(false)}
                            className="bg-[#eb5757] hover:bg-[#843737] text-white px-2 py-2 mt-5 rounded-md text-sm inline-block"
                        >
                            بستن
                        </button>
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    );
}
