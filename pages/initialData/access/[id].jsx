import SidebarDesktop from "../../../components/layout/sidebarDesktop";
import SidebarMobile from "../../../components/layout/sidebarMobile";
import StickyHeader from "../../../components/layout/stickyHeader";
import navigationList from "../../../components/layout/navigationList";
import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/auth";
import { useAccess } from "../../../hooks/access";
import Link from "next/link";
import { useRouter } from "next/router";
import Textarea from "../../../components/forms/textarea";
import axios from "../../../lib/axios";
import "react-loading-skeleton/dist/skeleton.css";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function EditPost() {
  const { asPath } = useRouter();

  const [title, setTitle] = useState("");

  const [errors, setErrors] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState();
  const [currentUserActions, setCurrentUserActions] = useState();
  const [dashboard, setDashboard] = useState(false);
  const [cartable, setCartable] = useState(false);
  const [sendList, setSendList] = useState(false);
  const [inbox, setInbox] = useState(false);
  const [newMail, setNewMail] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [proceedingsList, setProceedingsList] = useState(false);
  const [proceedings, setProceedings] = useState(false);
  const [proceedingMenu, setproceedingMenu] = useState(false);
  const [users, setUsers] = useState(false);
  const [companies, setCompanies] = useState(false);
  const [addCompany, setAddCompany] = useState(false);
  const [editCompany, setEditCompany] = useState(false);
  const [contactList, setContactList] = useState(false);
  const [recruitment, setRecruitment] = useState(false);
  const [resumeCalendar, setResumeCalendar] = useState(false);
  const [resumeList, setResumeList] = useState(false);
  const [resumeArchive, setResumeArchive] = useState(false);
  const [reportData, setReportData] = useState(false);
  const [forecast, setForecast] = useState(false);
  const [realized, setRealized] = useState(false);
  const [reports, setReports] = useState(false);
  const [expenseReport, setExpenseReport] = useState(false);
  const [hrReport, setHrReport] = useState(false);
  const [stockReport, setStockReport] = useState(false);
  const [announcements, setAnnouncements] = useState(false);

  const [initialData, setInitialData] = useState(false);
  const [posts, setPosts] = useState(false);
  const [departments, setDepartments] = useState(false);
  const [costHeadings, setCostHeadings] = useState(false);
  const [incomeHeadings, setIncomeHeadings] = useState(false);
  const [groups, setGroups] = useState(false);
  const [organizationalChart, setOrganizationalChart] = useState(false);
  const [access, setAccess] = useState(false);
  const [mailRoom, setMailRoom] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [newArrived, setNewArrived] = useState(false);
  const [newIssued, setNewIssued] = useState(false);
  const [issued, setIssued] = useState(false);
  const [banks, setBanks] = useState(false);
  const [banksReport, setBanksReport] = useState(false);
  const [userDetails, setUserDetails] = useState(false);
  const [edit_role, setEdit_role] = useState(false);
  const [edit_user, setEdit_user] = useState(false);
  const [see_user_details, setSee_user_details] = useState(false);
  const [add_user, setAdd_user] = useState(false);
  const [add_company, setAdd_company] = useState(false);
  const [see_company_details, setSee_company_details] = useState(false);
  const [edit_company, setEdit_company] = useState(false);
  const [add_post, setAdd_post] = useState(false);
  const [edit_post, setEdit_post] = useState(false);
  const [add_department, setAdd_department] = useState(false);
  const [edit_department, setEdit_department] = useState(false);
  const [add_group, setAdd_group] = useState(false);
  const [edit_group, setEdit_group] = useState(false);
  const [add_event, setAdd_event] = useState(false);
  const [print_minute, setPrint_minute] = useState(false);
  const [edit_minute, setEdit_minute] = useState(false);
  const [see_minute, setSee_minute] = useState(false);
  const [add_access, setAdd_access] = useState(false);
  const [edit_access, setEdit_access] = useState(false);
  const [arrived_newMail, setArrived_newMail] = useState(false);
  const [issued_newMail, setIssued_newMail] = useState(false);
  const [add_contact_list, setAdd_contact_list] = useState(false);
  const [edit_contact_list, setEdit_contact_list] = useState(false);
  const [delete_contact_list, setDelete_contact_list] = useState(false);
  const [see_contact_list, setSee_contact_list] = useState(false);
  const [add_resume_calendar, setAdd_resume_calendar] = useState(false);
  const [add_resume_list, setAdd_resume_list] = useState(false);
  const [add_cost_headings, setAdd_cost_headings] = useState(false);
  const [edit_cost_headings, setEdit_cost_headings] = useState(false);
  const [add_income_headings, setAdd_income_headings] = useState(false);
  const [add_forecast, setAdd_forecast] = useState(false);
  const [get_forecast, setGet_forecast] = useState(false);
  const [add_realized, setAdd_realized] = useState(false);
  const [get_realized, setGet_realized] = useState(false);
  const [get_announcements, setGet_announcements] = useState(false);
  const [get_announcements_list, setGet_announcements_list] = useState(false);
  const [add_announcements, setAdd_announcements] = useState(false);
  const [edit_announcements, setEdit_announcements] = useState(false);
  const [delete_announcements, setDelete_announcements] = useState(false);
  const [edit_income_headings, setEdit_income_headings] = useState(false);
  const [dataIsLoading, setDataIsLoading] = useState(false);
  const [get_expense_report, setGet_expense_report] = useState(false);
  const [get_hr_report, setGet_hr_report] = useState(false);
  const [get_stock_report, setGet_stock_report] = useState(false);
  const [add_banks, setAdd_banks] = useState(false);
  const [get_banks_report, setGet_banks_reoport] = useState(false);
  const [see_company_user_details, setSee_company_user_details] =
    useState(false);

  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      getAccess(router.query.id);
    }
  }, [router.isReady]);

  const { getAccess, accessData, isAccessLoading } = useAccess();

  const onSubmit = async (event) => {
    event.preventDefault();
    const mailFormData = new FormData();
    var actions = [];
    var functions = [];

    if (cartable) {
      actions = [...actions, "/cartable"];
    }
    if (users) {
      actions = [...actions, "/users"];
    }
    if (newUser) {
      actions = [...actions, "/users/addInformation"];
    }
    if (newUser) {
      actions = [...actions, "/users/addBatchInformation"];
    }
    if (editUser) {
      actions = [...actions, "/users/edit"];
    }
    if (sendList) {
      actions = [...actions, "/cartable/sendList", "/cartable/drafts"];
    }
    if (inbox) {
      actions = [...actions, "/cartable/inbox"];
    }
    if (newMail) {
      actions = [...actions, "/cartable/newMail"];
    }
    if (dashboard) {
      actions = [...actions, "/dashboard"];
    }
    if (proceedingsList) {
      actions = [...actions, "/proceedingMenu/proceedingsList"];
    }
    if (proceedings) {
      actions = [...actions, "/proceedingMenu/proceedingsCalendar"];
    }
    if (proceedingMenu) {
      actions = [...actions, "/proceedingMenu"];
    }
    if (companies) {
      actions = [...actions, "/companies"];
    }
    if (addCompany) {
      actions = [...actions, "/companies/addInformation"];
    }
    if (editCompany) {
      actions = [...actions, "/companies/edit"];
    }
    if (initialData) {
      actions = [...actions, "/initialData"];
    }
    if (posts) {
      actions = [...actions, "/initialData/posts"];
    }
    if (departments) {
      actions = [...actions, "/initialData/departments"];
    }
    if (groups) {
      actions = [...actions, "/initialData/groups"];
    }
    if (access) {
      actions = [...actions, "/initialData/access"];
    }
    if (organizationalChart) {
      actions = [...actions, "/organizationalChart"];
    }
    if (mailRoom) {
      actions = [...actions, "/mailRoom"];
    }
    if (arrived) {
      actions = [...actions, "/mailRoom/arrived"];
    }
    if (newArrived) {
      actions = [...actions, "/mailRoom/arrived/newMail"];
    }
    if (newIssued) {
      actions = [
        ...actions,
        "/mailRoom/issued/newMail",
        "/mailRoom/issued/getSecretariatNumber",
      ];
    }
    if (issued) {
      actions = [...actions, "/mailRoom/issued"];
    }
    if (contactList) {
      actions = [...actions, "/initialData/contactList"];
    }
    if (recruitment) {
      actions = [...actions, "/recruitment"];
    }
    if (resumeCalendar) {
      actions = [...actions, "/recruitment/resumeCalendar"];
    }
    if (resumeList) {
      actions = [...actions, "/recruitment/resumeList"];
    }
    if (resumeArchive) {
      actions = [...actions, "/recruitment/resumeArchive"];
    }
    if (costHeadings) {
      actions = [...actions, "/initialData/costHeadings"];
    }
    if (incomeHeadings) {
      actions = [...actions, "/initialData/incomeHeadings"];
    }
    if (reportData) {
      actions = [...actions, "/reportData"];
    }
    if (forecast) {
      actions = [...actions, "/reportData/forecast"];
    }
    if (realized) {
      actions = [...actions, "/reportData/realized"];
    }
    if (expenseReport) {
      actions = [...actions, "/reports/expenseReport"];
    }
    if (reports) {
      actions = [...actions, "/reports"];
    }
    if (expenseReport) {
      actions = [...actions, "/reports/expenseReport"];
    }
    if (hrReport) {
      actions = [...actions, "/reports/hrReport"];
    }
    if (stockReport) {
      actions = [...actions, "/reports/stockReport"];
    }
    if (announcements) {
      actions = [...actions, "/announcements"];
    }
    if (banks) {
      actions = [...actions, "/reportData/banks"];
    }
    if (banksReport) {
      actions = [...actions, "/reports/banksReport"];
    }
    if (userDetails) {
      actions = [...actions, "/companies/userDetails"];
    }
    actions = [...actions, "/support"];
    actions = [...actions, "/support/training"];
    actions = [...actions, "/support/ticket"];
    if (edit_role) {
      functions = [...functions, "edit_role"];
    }
    if (edit_user) {
      functions = [...functions, "edit_user"];
    }
    if (see_user_details) {
      functions = [...functions, "see_user_details"];
    }
    if (add_user) {
      functions = [...functions, "add_user"];
    }
    if (add_company) {
      functions = [...functions, "add_company"];
    }
    if (see_company_details) {
      functions = [...functions, "see_company_details"];
    }
    if (edit_company) {
      functions = [...functions, "edit_company"];
    }
    if (add_post) {
      functions = [...functions, "add_post"];
    }
    if (edit_post) {
      functions = [...functions, "edit_post"];
    }
    if (add_department) {
      functions = [...functions, "add_department"];
    }
    if (edit_department) {
      functions = [...functions, "edit_department"];
    }
    if (add_group) {
      functions = [...functions, "add_group"];
    }
    if (edit_group) {
      functions = [...functions, "edit_group"];
    }
    if (add_event) {
      functions = [...functions, "add_event"];
    }
    if (print_minute) {
      functions = [...functions, "print_minute"];
    }
    if (see_minute) {
      functions = [...functions, "see_minute"];
    }
    if (add_access) {
      functions = [...functions, "add_access"];
    }
    if (edit_access) {
      functions = [...functions, "edit_access"];
    }
    if (organizationalChart) {
      functions = [...functions, "see_chart"];
    }
    if (arrived_newMail) {
      functions = [...functions, "arrived_newMail"];
    }
    if (add_contact_list) {
      functions = [...functions, "add_contact_list"];
    }
    if (edit_contact_list) {
      functions = [...functions, "edit_contact_list"];
    }
    if (delete_contact_list) {
      functions = [...functions, "delete_contact_list"];
    }
    if (see_contact_list) {
      functions = [...functions, "see_contact_list"];
    }
    if (edit_minute) {
      functions = [...functions, "edit_minute"];
    }
    if (add_resume_calendar) {
      functions = [...functions, "add_resume_calendar"];
    }
    if (add_resume_list) {
      functions = [...functions, "add_resume_list"];
    }
    if (issued_newMail) {
      functions = [...functions, "issued_newMail"];
    }
    if (add_cost_headings) {
      functions = [...functions, "add_cost_headings"];
    }
    if (edit_cost_headings) {
      functions = [...functions, "edit_cost_headings"];
    }
    if (add_income_headings) {
      functions = [...functions, "add_income_headings"];
    }
    if (edit_income_headings) {
      functions = [...functions, "edit_income_headings"];
    }
    if (add_forecast) {
      functions = [
        ...functions,
        "add_forecast",
        "get_forecast",
        "edit_forecast",
      ];
    }
    if (add_realized) {
      functions = [
        ...functions,
        "add_realized",
        "get_realized",
        "edit_realized",
      ];
    }
    if (get_announcements_list) {
      functions = [...functions, "get_announcements_list"];
    }
    if (add_announcements) {
      functions = [...functions, "add_announcements"];
    }
    if (delete_announcements) {
      functions = [...functions, "delete_announcements"];
    }
    if (edit_announcements) {
      functions = [...functions, "get_announcements", "edit_announcements"];
    }
    if (get_expense_report) {
      functions = [...functions, "get_expense_report"];
    }
    if (get_hr_report) {
      functions = [...functions, "get_hr_report"];
    }
    if (get_stock_report) {
      functions = [...functions, "get_stock_report"];
    }
    if (add_banks) {
      functions = [...functions, "add_banks", "edit_bank"];
    }
    if (get_banks_report) {
      functions = [...functions, "get_banks_report"];
    }
    if (see_company_user_details) {
      functions = [...functions, "see_company_user_details"];
    }
    mailFormData.append("title", title ? title : accessData.title);
    mailFormData.append("uuid", accessData.uuid);
    mailFormData.append("actions", actions);
    mailFormData.append("functions", functions);

    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/user/role/update",
        data: mailFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status == 200) {
        window.location.assign("/initialData/access");
      }
    } catch (error) {
      setErrors(error.response.data.message);
    }
  };

  function setValues(actions, functions) {
    setDataIsLoading(true);
    actions.map(function (item, i) {
      switch (item) {
        case "/dashboard":
          setDashboard(true);
          break;
        case "/cartable":
          setCartable(true);
          break;
        case "/users":
          setUsers(true);
          break;
        case "/users/addInformation":
          setNewUser(true);
          break;
        case "/users/edit":
          setEditUser(true);
          break;
        case "/cartable/sendList":
          setSendList(true);
          break;
        case "/cartable/inbox":
          setInbox(true);
          break;
        case "/cartable/newMail":
          setNewMail(true);
          break;
        case "/proceedingMenu/proceedingsList":
          setProceedingsList(true);
          break;
        case "/proceedingMenu":
          setproceedingMenu(true);
          break;
        case "/proceedingMenu/proceedingsCalendar":
          setProceedings(true);
          break;
        case "/companies":
          setCompanies(true);
          break;
        case "/companies/addInformation":
          setAddCompany(true);
          break;
        case "/companies/edit":
          setEditCompany(true);
          break;
        case "/initialData":
          setInitialData(true);
          break;
        case "/initialData/posts":
          setPosts(true);
          break;
        case "/initialData/departments":
          setDepartments(true);
          break;
        case "/initialData/groups":
          setGroups(true);
          break;
        case "/organizationalChart":
          setOrganizationalChart(true);
          break;
        case "/initialData/access":
          setAccess(true);
          break;
        case "/mailRoom":
          setMailRoom(true);
          break;
        case "/mailRoom/arrived":
          setArrived(true);
          break;
        case "/mailRoom/issued":
          setIssued(true);
          break;
        case "/initialData/contactList":
          setContactList(true);
          break;
        case "/recruitment":
          setRecruitment(true);
          break;
        case "/recruitment/resumeCalendar":
          setResumeCalendar(true);
          break;
        case "/recruitment/resumeList":
          setResumeList(true);
          break;
        case "/recruitment/resumeArchive":
          setResumeArchive(true);
          break;
        case "/initialData/costHeadings":
          setCostHeadings(true);
          break;
        case "/initialData/incomeHeadings":
          setIncomeHeadings(true);
          break;
        case "/reportData":
          setReportData(true);
          break;
        case "/reportData/forecast":
          setForecast(true);
          break;
        case "/reportData/realized":
          setRealized(true);
          break;
        case "/reports/expenseReport":
          setExpenseReport(true);
          setGet_expense_report(true);
          break;
        case "/reports":
          setReports(true);
          break;
        case "/reports/hrReport":
          setHrReport(true);
          setGet_hr_report(true);
          break;
        case "/reports/stockReport":
          setStockReport(true);
          setGet_stock_report(true);
          break;
        case "/reports/banksReport":
          setBanksReport(true);
          setGet_banks_reoport(true);
          break;
        case "/reportData/banks":
          setBanks(true);
          break;
        case "/companies/userDetails":
          setUserDetails(true);
          break;
        case "/announcements":
          setAnnouncements(true);
          setGet_announcements_list(true);
          break;
      }
    });

    functions.map(function (item, i) {
      switch (item) {
        case "edit_role":
          setEdit_role(true);
          break;
        case "edit_user":
          setEdit_user(true);
          break;
        case "see_user_details":
          setSee_user_details(true);
          break;
        case "add_user":
          setAdd_user(true);
          break;
        case "add_company":
          setAdd_company(true);
          break;
        case "see_company_details":
          setSee_company_details(true);
          break;
        case "edit_company":
          setEdit_company(true);
          break;
        case "add_post":
          setAdd_post(true);
          break;
        case "edit_post":
          setEdit_post(true);
          break;
        case "add_department":
          setAdd_department(true);
          break;
        case "edit_department":
          setEdit_department(true);
          break;
        case "add_group":
          setAdd_group(true);
          break;
        case "edit_group":
          setEdit_group(true);
          break;
        case "add_event":
          setAdd_event(true);
          break;
        case "print_minute":
          setPrint_minute(true);
          break;
        case "see_minute":
          setSee_minute(true);
          break;
        case "edit_minute":
          setEdit_minute(true);
          break;
        case "add_access":
          setAdd_access(true);
          break;
        case "edit_access":
          setEdit_access(true);
          break;
        case "arrived_newMail":
          setArrived_newMail(true);
          setNewArrived(true);
          break;
        case "add_contact_list":
          setAdd_contact_list(true);
          break;
        case "edit_contact_list":
          setEdit_contact_list(true);
          break;
        case "see_contact_list":
          setSee_contact_list(true);
          break;
        case "delete_contact_list":
          setDelete_contact_list(true);
          break;
        case "add_resume_calendar":
          setAdd_resume_calendar(true);
          break;
        case "add_resume_list":
          setAdd_resume_list(true);
          break;
        case "issued_newMail":
          setIssued_newMail(true);
          setNewIssued(true);
          break;
        case "add_cost_headings":
          setAdd_cost_headings(true);
          break;
        case "edit_cost_headings":
          setEdit_cost_headings(true);
          break;
        case "add_income_headings":
          setAdd_income_headings(true);
          break;
        case "edit_income_headings":
          setEdit_income_headings(true);
          break;
        case "add_forecast":
          setAdd_forecast(true);
          setGet_forecast(true);
          break;
        case "add_realized":
          setAdd_realized(true);
          setGet_realized(true);
          break;
        case "get_announcements_list":
          setGet_announcements_list(true);
          break;
        case "add_announcements":
          setAdd_announcements(true);
          break;
        case "delete_announcements":
          setDelete_announcements(true);
          break;
        case "get_hr_report":
          setGet_hr_report(true);
          break;
        case "get_expense_report":
          setGet_expense_report(true);
          break;
        case "get_stock_report":
          setGet_stock_report(true);
          break;
        case "add_banks":
          setAdd_banks(true);
          break;
        case "see_company_user_details":
          setSee_company_user_details(true);
          break;
        case "edit_announcements":
          setEdit_announcements(true);
          setGet_announcements(true);
          break;
      }
    });
  }

  const { user, isLoading } = useAuth({
    middleware: "auth",
    redirectIfAuthenticated: "/",
  });

  if (isLoading || !user) {
    return null;
  }

  {
    !dataIsLoading && accessData && accessData.actions
      ? setValues(accessData.actions, accessData.functions)
      : null;
  }
  return (
    <div>
      <SidebarMobile menu={navigationList()} loc={asPath} />
      <SidebarDesktop
        menu={navigationList()}
        loc={asPath}
        setSelect={(props) => setCurrentUserRole(props.currentUserRole)}
        setActions={(props) => setCurrentUserActions(props.currentUserActions)}
        setIsHolding={(props) => {}}
        setSuperUser={(props) => {}}
      />
      <div className="md:pr-52 flex flex-col flex-1">
        <StickyHeader />
        <main>
          <div className="py-6">
            <div className="w-full px-4 sm:px-6 md:px-8">
              <form className="space-y-8 ">
                <div className="space-y-8 divide-y divide-gray-200">
                  <div>
                    <div className="mt-2 mb-2 grid grid-cols-1 gap-y-5 gap-x-2 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <h2 className="text-xl">تغییر اطلاعات سمت</h2>
                      </div>

                      <div className="sm:col-span-2">
                        <Textarea
                          title="نام دسترسی *"
                          name={title}
                          rows="1"
                          defaultValue={accessData.title}
                          onChange={(event) => setTitle(event.target.value)}
                          error={errors["title"]}
                          type="text"
                          isrequired="true"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-y-2 gap-x-4 mb-2 sm:grid-cols-10">
                  <div className="sm:col-span-4">
                    <div style={{ border: "1px solid gray", borderRadius: 5 }}>
                      <a style={{ paddingRight: 10 }}>داشبورد</a>
                      <span className="flex items-center mr-2">
                        <input
                          id="/dashboard"
                          name="/dashboard"
                          type="checkbox"
                          checked={dashboard}
                          onClick={(e) => setDashboard(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/dashboard"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          داشبورد
                        </label>
                      </span>
                    </div>
                    <div
                      style={{
                        border: "1px solid gray",
                        borderRadius: 5,
                        marginTop: 5,
                      }}
                    >
                      <a style={{ paddingRight: 10 }}>کارتابل</a>
                      <span className="flex items-center mr-2">
                        <input
                          id="/cartable"
                          name="/cartable"
                          type="checkbox"
                          checked={cartable}
                          onClick={(e) => setCartable(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/cartable"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          کارتابل
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/cartable/inbox"
                          name="/cartable/inbox"
                          type="checkbox"
                          checked={inbox}
                          onClick={(e) => setInbox(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/cartable/inbox"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          نامه های دریافتی
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/cartable/sendList"
                          name="/cartable/sendList"
                          type="checkbox"
                          checked={sendList}
                          onClick={(e) => setSendList(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/cartable/sendList"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          نامه های ارسالی
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/cartable/newMail"
                          name="/cartable/newMail"
                          type="checkbox"
                          checked={newMail}
                          onClick={(e) => setNewMail(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/cartable/newMail"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ارسال نامه
                        </label>
                      </span>
                    </div>
                    <div
                      style={{
                        border: "1px solid gray",
                        borderRadius: 5,
                        marginTop: 5,
                      }}
                    >
                      <a style={{ paddingRight: 10 }}>دبیرخانه</a>
                      <span className="flex items-center mr-2">
                        <input
                          id="/mailRoom"
                          name="/mailRoom"
                          type="checkbox"
                          checked={mailRoom}
                          onClick={(e) => setMailRoom(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/mailRoom"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          دبیرخانه
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/mailRoom/arrived"
                          name="/mailRoom/arrived"
                          type="checkbox"
                          checked={arrived}
                          onClick={(e) => setArrived(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/cartable/sendList"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          نامه های وارده
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/arrived/newMail"
                          name="/arrived/newMail"
                          type="checkbox"
                          checked={arrived_newMail}
                          onClick={(e) => {
                            setArrived_newMail(e.target.checked);
                            setNewArrived(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/arrived/newMail"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ثبت نامه وارده
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/mailRoom/issued"
                          name="/mailRoom/issued"
                          type="checkbox"
                          checked={issued}
                          onClick={(e) => setIssued(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/cartable/newMail"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          نامه های صادره
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/issued/newMail"
                          name="/issued/newMail"
                          type="checkbox"
                          checked={issued_newMail}
                          onClick={(e) => {
                            setIssued_newMail(e.target.checked);
                            setNewIssued(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/issued/newMail"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ثبت نامه صادره
                        </label>
                      </span>
                    </div>
                    <div
                      style={{
                        border: "1px solid gray",
                        borderRadius: 5,
                        marginTop: 5,
                      }}
                    >
                      <a style={{ paddingRight: 10 }}>کاربران</a>
                      <span className="flex items-center mr-2">
                        <input
                          id="/users"
                          name="/users"
                          type="checkbox"
                          checked={users}
                          onClick={(e) => setUsers(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/users"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          کاربران
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/see_user_details"
                          name="/see_user_details"
                          type="checkbox"
                          checked={see_user_details}
                          onClick={(e) => setSee_user_details(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/see_user_details"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          مشاهده جزئیات کاربر
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/users/addInformation"
                          name="/users/addInformation"
                          type="checkbox"
                          checked={newUser}
                          onClick={(e) => setNewUser(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/users/addInformation"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          کاربر جدید
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/add_user"
                          name="/add_user"
                          type="checkbox"
                          checked={add_user}
                          onClick={(e) => setAdd_user(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/add_user"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          افزودن کاربر
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/users/edit"
                          name="/users/edit"
                          type="checkbox"
                          checked={editUser}
                          onClick={(e) => setEditUser(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/users/edit"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ویرایش کاربر
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/edit_user"
                          name="/edit_user"
                          type="checkbox"
                          checked={edit_user}
                          onClick={(e) => setEdit_user(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/edit_user"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ویرایش کاربر
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/edit_role"
                          name="/edit_role"
                          type="checkbox"
                          checked={edit_role}
                          onClick={(e) => setEdit_role(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/edit_role"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          تغییر دسترسی کاربر
                        </label>
                      </span>
                    </div>
                    <div
                      style={{
                        border: "1px solid gray",
                        borderRadius: 5,
                        marginTop: 5,
                      }}
                    >
                      <a style={{ paddingRight: 10 }}>شرکت ها</a>
                      <span className="flex items-center mr-2">
                        <input
                          id="/companies"
                          name="/companies"
                          type="checkbox"
                          checked={companies}
                          onClick={(e) => setCompanies(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/companies"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          شرکت
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/see_company_details"
                          name="/see_company_details"
                          type="checkbox"
                          checked={see_company_details}
                          onClick={(e) =>
                            setSee_company_details(e.target.checked)
                          }
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/see_company_details"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          مشاهده جزئیات شرکت
                        </label>
                      </span>

                      <span className="flex items-center mr-2">
                        <input
                          id="/companies/addInformation"
                          name="/companies/addInformation"
                          type="checkbox"
                          checked={addCompany}
                          onClick={(e) => setAddCompany(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/companies/addInformation"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          شرکت جدید
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/add_company"
                          name="/add_company"
                          type="checkbox"
                          checked={add_company}
                          onClick={(e) => setAdd_company(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/add_company"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          افزودن شرکت
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/companies/edit"
                          name="/companies/edit"
                          type="checkbox"
                          checked={editCompany}
                          onClick={(e) => setEditCompany(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/companies/edit"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ویرایش شرکت
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/edit_company"
                          name="/edit_company"
                          type="checkbox"
                          checked={edit_company}
                          onClick={(e) => setEdit_company(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/edit_company"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ویرایش شرکت
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/companies/userDetails"
                          name="/companies/userDetails"
                          type="checkbox"
                          checked={userDetails}
                          onClick={(e) => setUserDetails(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/companies/userDetails"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          لیست پرسنل
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/see_company_user_details"
                          name="/see_company_user_details"
                          type="checkbox"
                          checked={see_company_user_details}
                          onClick={(e) =>
                            setSee_company_user_details(e.target.checked)
                          }
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/see_company_user_details"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          مشاهده لیست پرسنل
                        </label>
                      </span>
                    </div>

                    <div
                      style={{
                        border: "1px solid gray",
                        borderRadius: 5,
                        marginTop: 5,
                      }}
                    >
                      <a style={{ paddingRight: 10 }}>رزومه و استخدام</a>
                      <span className="flex items-center mr-2">
                        <input
                          id="/recruitment"
                          name="/recruitment"
                          type="checkbox"
                          checked={recruitment}
                          onClick={(e) => setRecruitment(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/recruitment"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          رزومه و استخدام
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="//recruitment/resumeCalendar"
                          name="//recruitment/resumeCalendar"
                          type="checkbox"
                          checked={resumeCalendar}
                          onClick={(e) => setResumeCalendar(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="//recruitment/resumeCalendar"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          تقویم جلسات
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/add_resume_calendar"
                          name="/add_resume_calendar"
                          type="checkbox"
                          checked={add_resume_calendar}
                          onClick={(e) =>
                            setAdd_resume_calendar(e.target.checked)
                          }
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/add_resume_calendar"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ثبت جلسه جدید
                        </label>
                      </span>

                      <span className="flex items-center mr-2">
                        <input
                          id="/recruitment/resumeList"
                          name="/recruitment/resumeList"
                          type="checkbox"
                          checked={resumeList}
                          onClick={(e) => setResumeList(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/recruitment/resumeList"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          لیست رزومه‌ها
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/add_resume_list"
                          name="/add_resume_list"
                          type="checkbox"
                          checked={add_resume_list}
                          onClick={(e) => setAdd_resume_list(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/add_resume_list"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ثبت رزومه جدید
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/recruitment/resumeArchive"
                          name="/recruitment/resumeArchive"
                          type="checkbox"
                          checked={resumeArchive}
                          onClick={(e) => setResumeArchive(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/recruitment/resumeArchive"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          لیست آرشیو رزومه‌ها
                        </label>
                      </span>
                    </div>

                    <div
                      style={{
                        border: "1px solid gray",
                        borderRadius: 5,
                        marginTop: 5,
                      }}
                    >
                      <a style={{ paddingRight: 10 }}>انبار داده</a>
                      <span className="flex items-center mr-2">
                        <input
                          id="/reportData"
                          name="/reportData"
                          type="checkbox"
                          checked={reportData}
                          onClick={(e) => setReportData(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/recruitment"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          انبار داده
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/reportData/forecast"
                          name="/reportData/forecast"
                          type="checkbox"
                          checked={forecast}
                          onClick={(e) => setForecast(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/reportData/resumeCalendar"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          پیش‌بینی جریان وجوه نقدی
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/add_forecast"
                          name="/add_forecast"
                          type="checkbox"
                          checked={add_forecast}
                          onClick={(e) => {
                            setAdd_forecast(e.target.checked);
                            setGet_forecast(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/add_forecast"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ثبت و ویرایش
                        </label>
                      </span>

                      <span className="flex items-center mr-2">
                        <input
                          id="/reportData/realized"
                          name="/reportData/realized"
                          type="checkbox"
                          checked={realized}
                          onClick={(e) => setRealized(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/reportData/realized"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          جریان وجوه نقدی
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/add_realized"
                          name="/add_realized"
                          type="checkbox"
                          checked={add_realized}
                          onClick={(e) => {
                            setAdd_realized(e.target.checked);
                            setGet_realized(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/add_realized"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ثبت و ویرایش
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/reportData/banks"
                          name="/reportData/banks"
                          type="checkbox"
                          checked={banks}
                          onClick={(e) => setBanks(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/reportData/banks"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          موجودی بانک
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/add_banks"
                          name="/add_banks"
                          type="checkbox"
                          checked={add_banks}
                          onClick={(e) => {
                            setAdd_banks(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/add_banks"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ثبت و ویرایش
                        </label>
                      </span>
                    </div>
                  </div>
                  <div className="sm:col-span-1"></div>
                  <div className="sm:col-span-4">
                    <div style={{ border: "1px solid gray", borderRadius: 5 }}>
                      <a style={{ paddingRight: 10 }}>گزارشات</a>
                      <span className="flex items-center mr-2">
                        <input
                          id="/reports"
                          name="/reports"
                          type="checkbox"
                          checked={reports}
                          onClick={(e) => setReports(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/organizationalChart"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          گزارشات
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/reports/expenseReport"
                          name="/reports/expenseReport"
                          type="checkbox"
                          checked={expenseReport}
                          onClick={(e) => {
                            setExpenseReport(e.target.checked);
                            setGet_expense_report(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/reports/expenseReport"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          گزارش جریان وجوه نقدی
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/reports/hrReport"
                          name="/reports/hrReport"
                          type="checkbox"
                          checked={hrReport}
                          onClick={(e) => {
                            setHrReport(e.target.checked);
                            setGet_hr_report(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/reports/hrReport"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          گزارش منابع انسانی
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/reports/stockReport"
                          name="/reports/stockReport"
                          type="checkbox"
                          checked={stockReport}
                          onClick={(e) => {
                            setStockReport(e.target.checked);
                            setGet_stock_report(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/reports/stockReport"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          گزارش سهام
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/reports/banksReport"
                          name="/reports/banksReport"
                          type="checkbox"
                          checked={banksReport}
                          onClick={(e) => {
                            setBanksReport(e.target.checked);
                            setGet_banks_reoport(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/reports/banksReport"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          گزارش موجودی بانک
                        </label>
                      </span>
                    </div>
                    <div
                      style={{
                        border: "1px solid gray",
                        borderRadius: 5,
                        marginTop: 5,
                      }}
                    >
                      <a style={{ paddingRight: 10 }}>اطلاعات پایه</a>
                      <span className="flex items-center mr-2">
                        <input
                          id="/initialData"
                          name="/initialData"
                          type="checkbox"
                          checked={initialData}
                          onClick={(e) => setInitialData(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/initialData"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          اطلاعات پایه
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/initialData/posts"
                          name="/initialData/posts"
                          type="checkbox"
                          checked={posts}
                          onClick={(e) => setPosts(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/initialData/posts"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          سمت ها
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/add_post"
                          name="/add_post"
                          type="checkbox"
                          checked={add_post}
                          onClick={(e) => setAdd_post(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/add_post"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          اضافه کردن سمت
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/edit_post"
                          name="/edit_post"
                          type="checkbox"
                          checked={edit_post}
                          onClick={(e) => setEdit_post(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/edit_post"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ویرایش سمت
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/initialData/departments"
                          name="/initialData/departments"
                          type="checkbox"
                          checked={departments}
                          onClick={(e) => setDepartments(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/initialData/departments"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          واحد ها
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/add_department"
                          name="/add_department"
                          type="checkbox"
                          checked={add_department}
                          onClick={(e) => setAdd_department(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/add_department"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          اضافه کردن واحد
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/edit_department"
                          name="/edit_department"
                          type="checkbox"
                          checked={edit_department}
                          onClick={(e) => setEdit_department(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/edit_department"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ویرایش واحد
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/initialData/groups"
                          name="/initialData/groups"
                          type="checkbox"
                          checked={groups}
                          onClick={(e) => setGroups(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/initialData/groups"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          گروه ها
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/add_group"
                          name="/add_group"
                          type="checkbox"
                          checked={add_group}
                          onClick={(e) => setAdd_group(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/add_group"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          اضافه کردن گروه
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/edit_group"
                          name="/edit_group"
                          type="checkbox"
                          checked={edit_group}
                          onClick={(e) => setEdit_group(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/edit_group"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ویرایش گروه
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/initialData/costHeadings"
                          name="/initialData/costHeadings"
                          type="checkbox"
                          checked={costHeadings}
                          onClick={(e) => setCostHeadings(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/initialData/costHeadings"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          سرفصل مصارف
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/add_cost_headings"
                          name="/add_cost_headings"
                          type="checkbox"
                          checked={add_cost_headings}
                          onClick={(e) =>
                            setAdd_cost_headings(e.target.checked)
                          }
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/add_cost_headings"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          اضافه کردن سرفصل
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/edit_cost_headings"
                          name="/edit_cost_headings"
                          type="checkbox"
                          checked={edit_cost_headings}
                          onClick={(e) =>
                            setEdit_cost_headings(e.target.checked)
                          }
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/edit_cost_headings"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ویرایش سرفصل
                        </label>
                      </span>

                      <span className="flex items-center mr-2">
                        <input
                          id="/initialData/incomeHeadings"
                          name="/initialData/incomeHeadings"
                          type="checkbox"
                          checked={incomeHeadings}
                          onClick={(e) => setIncomeHeadings(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/initialData/incomeHeadings"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          سرفصل منابع
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/add_income_headings"
                          name="/add_income_headings"
                          type="checkbox"
                          checked={add_income_headings}
                          onClick={(e) =>
                            setAdd_income_headings(e.target.checked)
                          }
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/add_income_headings"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          اضافه کردن سرفصل
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/edit_income_headings"
                          name="/edit_income_headings"
                          type="checkbox"
                          checked={edit_income_headings}
                          onClick={(e) =>
                            setEdit_income_headings(e.target.checked)
                          }
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/edit_income_headings"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ویرایش سرفصل
                        </label>
                      </span>
                    </div>

                    <div
                      style={{
                        border: "1px solid gray",
                        borderRadius: 5,
                        marginTop: 5,
                      }}
                    >
                      <a style={{ paddingRight: 10 }}>جلسات</a>

                      <span className="flex items-center mr-2">
                        <input
                          id="/proceedingMenu"
                          name="/proceedingMenu"
                          type="checkbox"
                          checked={proceedingMenu}
                          onClick={(e) => setproceedingMenu(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/proceedingMenu"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          مدیریت جلسات
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/proceedingMenu/proceedingsList"
                          name="/proceedingMenu/proceedingsList"
                          type="checkbox"
                          checked={proceedingsList}
                          onClick={(e) => setProceedingsList(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/proceedingMenu/proceedingsList"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          لیست جلسات
                        </label>
                      </span>
                      <span className="flex items-center mr-2">
                        <input
                          id="/proceedingMenu/proceedingsCalendar"
                          name="/proceedingMenu/proceedingsCalendar"
                          type="checkbox"
                          checked={proceedings}
                          onClick={(e) => setProceedings(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/proceedingMenu/proceedingsCalendar"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          تقویم جلسات
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/add_event"
                          name="/add_event"
                          type="checkbox"
                          checked={add_event}
                          onClick={(e) => setAdd_event(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/add_event"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          اضافه کردن جلسه
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/print_minute"
                          name="/print_minute"
                          type="checkbox"
                          checked={print_minute}
                          onClick={(e) => setPrint_minute(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/print_minute"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          پرینت صورت‌جلسه
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/edit_minute"
                          name="/edit_minute"
                          type="checkbox"
                          checked={edit_minute}
                          onClick={(e) => setEdit_minute(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/edit_minute"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ویرایش صورت‌جلسه
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/see_minute"
                          name="/see_minute"
                          type="checkbox"
                          checked={see_minute}
                          onClick={(e) => setSee_minute(e.target.checked)}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/see_minute"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          مشاهده صورت‌جلسه
                        </label>
                      </span>
                    </div>
                    <div
                      style={{
                        border: "1px solid gray",
                        borderRadius: 5,
                        marginTop: 5,
                      }}
                    >
                      <a style={{ paddingRight: 10 }}>چارت سازمانی</a>
                      <span className="flex items-center mr-2">
                        <input
                          id="/organizationalChart"
                          name="/organizationalChart"
                          type="checkbox"
                          checked={organizationalChart}
                          onClick={(e) =>
                            setOrganizationalChart(e.target.checked)
                          }
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/organizationalChart"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          چارت سازمانی
                        </label>
                      </span>
                    </div>
                    <div
                      style={{
                        border: "1px solid gray",
                        borderRadius: 5,
                        marginTop: 5,
                      }}
                    >
                      <a style={{ paddingRight: 10 }}>نمایندگان ها</a>
                      <span className="flex items-center mr-2">
                        <input
                          id="/initialData/contactList"
                          name="/initialData/contactList"
                          type="checkbox"
                          checked={contactList}
                          onClick={(e) => {
                            setContactList(e.target.checked);
                            setSee_contact_list(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/initialData/contactList"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          نمایندگان
                        </label>
                      </span>

                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/initialData/contactList"
                          name="/initialData/contactList"
                          type="checkbox"
                          checked={add_contact_list}
                          onClick={(e) => {
                            setAdd_contact_list(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/arrived/newMail"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ثبت نماینده{" "}
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/initialData/contactList"
                          name="/initialData/contactList"
                          type="checkbox"
                          checked={edit_contact_list}
                          onClick={(e) => {
                            setEdit_contact_list(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/arrived/newMail"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ویرایش نماینده{" "}
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/initialData/contactList"
                          name="/initialData/contactList"
                          type="checkbox"
                          checked={delete_contact_list}
                          onClick={(e) => {
                            setDelete_contact_list(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/arrived/newMail"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          حذف نماینده{" "}
                        </label>
                      </span>
                    </div>
                    <div
                      style={{
                        border: "1px solid gray",
                        borderRadius: 5,
                        marginTop: 5,
                      }}
                    >
                      <a style={{ paddingRight: 10 }}>اطلاعیه‌ها</a>
                      <span className="flex items-center mr-2">
                        <input
                          id="/announcements"
                          name="/announcements"
                          type="checkbox"
                          checked={announcements}
                          onClick={(e) => {
                            setAnnouncements(e.target.checked);
                            setGet_announcements_list(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/announcements"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          اطلاعیه‌ها
                        </label>
                      </span>

                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/announcements/Add"
                          name="/announcements/Add"
                          type="checkbox"
                          checked={add_announcements}
                          onClick={(e) => {
                            setAdd_announcements(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/announcements/Add"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ثبت اطلاعیه{" "}
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/initialData/contactList"
                          name="/initialData/contactList"
                          type="checkbox"
                          checked={edit_announcements}
                          onClick={(e) => {
                            setEdit_announcements(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/arrived/newMail"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          ویرایش اطلاعیه{" "}
                        </label>
                      </span>
                      <span
                        className="flex items-center mr-2"
                        style={{ paddingRight: 30 }}
                      >
                        <input
                          id="/announcements/Delete"
                          name="/announcements/Delete"
                          type="checkbox"
                          checked={delete_announcements}
                          onClick={(e) => {
                            setDelete_announcements(e.target.checked);
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded"
                        />
                        <label
                          htmlFor="/announcements/Delete"
                          className="mr-2 block text-sm text-gray-900"
                        >
                          حذف اطلاعیه{" "}
                        </label>
                      </span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="pt-3 pb-2 px-10 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={onSubmit}
                  type="button"
                  className="inline-flex justify-center py-2 px-4 ml-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <span>ثبت تغییرات</span>
                </button>

                {/* <button
                                    onClick={DeleteGroup}
                                    type="button"
                                    className="inline-flex justify-center py-2 px-4 ml-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <span>حذف گروه</span>
                                </button> */}
                <Link href="/initialData/access">
                  <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <span>بازگشت</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
