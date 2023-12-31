import {
  HomeIcon,
  UsersIcon,
  MailIcon,
  OfficeBuildingIcon,
  CloudDownloadIcon,
  ArrowCircleDownIcon,
  ArrowCircleUpIcon,
  CalendarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  TemplateIcon,
  ArchiveIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  ClipboardCopyIcon,
  UserAddIcon,
  ViewListIcon,
  ArrowDownIcon,
  DocumentAddIcon,
  BellIcon,
  TicketIcon,
  ChartPieIcon,
  LibraryIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  CurrencyEuroIcon,
  CurrencyBangladeshiIcon,
} from "@heroicons/react/outline";

function navigationList(props) {
  return [
    {
      name: "داشبورد",
      href: "/dashboard",
      icon: HomeIcon,
      current: true,
      subMenu: false,
    },
    {
      name: "کارتابل",
      href: null,
      master: "/cartable",
      icon: MailIcon,
      current: false,
      subMenu: true,
      subList: [
        {
          name: "دریافتی",
          href: "/cartable/inbox",
          master: "/cartable",
          icon: ArrowCircleDownIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "ارسالی",
          href: "/cartable/sendList",
          icon: ArrowCircleUpIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "پیش نویس",
          href: "/cartable/drafts",
          icon: DocumentIcon,
          current: false,
          subMenu: false,
        },
      ],
    },
    {
      name: "دبیرخانه",
      href: null,
      master: "/mailRoom",
      icon: ArchiveIcon,
      current: false,
      subMenu: true,
      subList: [
        {
          name: "وارده",
          href: "/mailRoom/arrived",
          icon: ArrowCircleDownIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "صادره",
          href: "/mailRoom/issued",
          icon: ArrowCircleUpIcon,
          current: false,
          subMenu: false,
        },
      ],
    },
    {
      name: "مدیریت جلسات",
      href: null,
      master: "/proceedingMenu",
      icon: UserGroupIcon,
      current: false,
      subMenu: true,
      subList: [
        {
          name: "تقویم جلسات",
          href: "/proceedingMenu/proceedingsCalendar",
          icon: CalendarIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "لیست‌ جلسات",
          href: "/proceedingMenu/proceedingsList",
          icon: ViewListIcon,
          current: false,
          subMenu: false,
        },
      ],
    },
    {
      name: "کاربران",
      href: "/users",
      icon: UsersIcon,
      current: false,
      subMenu: false,
    },
    {
      name: "شرکت‌ها",
      href: "/companies",
      icon: OfficeBuildingIcon,
      current: false,
      subMenu: false,
    },
    {
      name: "مالی",
      href: null,
      master: "/financial",
      icon: CurrencyEuroIcon,
      current: false,
      subMenu: true,
      subList: [
        {
          name: "فیش حقوقی",
          href: "/financial/payslip",
          icon: CurrencyEuroIcon,
          current: false,
          subMenu: false,
        },
      ],
    },
    {
      name: "اطلاعات پایه",
      href: null,
      master: "/initialData",
      icon: ArrowDownIcon,
      current: false,
      subMenu: true,
      subList: [
        {
          name: "سمت‌ها",
          href: "/initialData/posts",
          icon: CloudDownloadIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "واحد‌ها",
          href: "/initialData/departments",
          icon: CloudDownloadIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "گروه‌ها",
          href: "/initialData/groups",
          icon: CloudDownloadIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "دسترسی ها",
          href: "/initialData/access",
          icon: CloudDownloadIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "نمایندگان",
          href: "/initialData/contactList",
          icon: CloudDownloadIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "سرفصل مصارف",
          href: "/initialData/costHeadings",
          icon: CloudDownloadIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "سرفصل منابع",
          href: "/initialData/incomeHeadings",
          icon: CloudDownloadIcon,
          current: false,
          subMenu: false,
        },
      ],
    },
    {
      name: "جذب و استخدام",
      href: null,
      master: "/recruitment",
      icon: UserAddIcon,
      current: false,
      subMenu: true,
      subList: [
        {
          name: "مصاحبه",
          href: "/recruitment/resumeCalendar",
          icon: CalendarIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "لیست‌ رزومه‌ها",
          href: "/recruitment/resumeList",
          icon: ViewListIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "آرشیو رزومه‌ها",
          href: "/recruitment/resumeArchive",
          icon: ArchiveIcon,
          current: false,
          subMenu: false,
        },
      ],
    },
    {
      name: "گزارش‌ها",
      href: null,
      master: "/reports",
      icon: ChartBarIcon,
      current: false,
      subMenu: true,
      subList: [
        {
          name: "گزارش انحراف جریان وجوه نقدی",
          href: "/reports/expenseReport",
          icon: ChartBarIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "گزارش منابع انسانی",
          href: "/reports/hrReport",
          icon: UserGroupIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "گزارش وضعیت سهام",
          href: "/reports/stockReport",
          icon: ChartPieIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "گزارش موجودی بانک",
          href: "/reports/banksReport",
          icon: CurrencyDollarIcon,
          current: false,
          subMenu: false,
        },
      ],
    },
    {
      name: "انبار داده",
      href: null,
      master: "/reportData",
      icon: ClipboardCopyIcon,
      current: false,
      subMenu: true,
      subList: [
        {
          name: "پیش‌بینی جریان وجوه نقدی",
          href: "/reportData/forecast",
          icon: DocumentAddIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "جریان وجوه نقدی",
          href: "/reportData/realized",
          icon: DocumentAddIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "موجودی بانک",
          href: "/reportData/banks",
          icon: DocumentAddIcon,
          current: false,
          subMenu: false,
        },
      ],
    },
    {
      name: "چارت سازمانی",
      href: "/organizationalChart",
      icon: TemplateIcon,
      current: false,
      subMenu: false,
    },
    {
      name: "اطلاعیه‌ها",
      href: "/announcements",
      icon: BellIcon,
      current: false,
      subMenu: false,
    },
    {
      name: "پشتیبانی",
      href: null,
      master: "/support",
      icon: QuestionMarkCircleIcon,
      current: false,
      subMenu: true,
      subList: [
        {
          name: "راهنما",
          href: "/support/training",
          icon: AcademicCapIcon,
          current: false,
          subMenu: false,
        },
        {
          name: "تیکت",
          href: "/support/ticket",
          icon: TicketIcon,
          current: false,
          subMenu: false,
        },
      ],
    },
  ];
}

export default navigationList;
