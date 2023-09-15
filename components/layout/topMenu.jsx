function TopMenu() {
  return (
    <div className="flex flex-row px-4 sm:px-6 md:px-8">
      <div className="grid grid-cols-4 gap-4">
        {/* <div className="group bg-[#1f2937] p-3 rounded-md shadow-lg grid place-items-center hover:bg-amber-500">
                    <span className="inline-flex items-center justify-center p-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </span>
                    <p className="text-base items-center justify-center text-white">
                        مکاتبات
                    </p>
                </div> */}
        <div className="group bg-[#1f2937] p-5 rounded-md shadow-lg grid place-items-center hover:bg-[#22AA5B]">
          <span className="inline-flex items-center justify-center p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <p className="text-sm items-center justify-center text-white">
            حضور و غیاب
          </p>
        </div>

        <div className="group bg-[#1f2937] p-5 rounded-md shadow-lg grid place-items-center hover:bg-amber-500">
          <span className="inline-flex items-center justify-center p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
              />
            </svg>
          </span>
          <p className="text-sm items-center justify-center text-white">
            مدیریت اسناد
          </p>
        </div>

        <div className="group bg-[#1f2937] p-5 rounded-md shadow-lg grid place-items-center hover:bg-amber-500">
          <span className="inline-flex items-center justify-center p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </span>
          <p className="text-sm items-center justify-center text-white">
            چارت سازمانی
          </p>
        </div>
      </div>
    </div>
  );
}

export default TopMenu;
