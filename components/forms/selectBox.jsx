import { Listbox } from "@headlessui/react";

export default function InputBox(props) {
  const { title, error, onChange, value, options } = props;

  return (
    <Listbox as="div" value={value} onChange={onChange}>
      {({ open }) => (
        <>
          <Listbox.Label className="text-sm font-medium text-gray-700">
            {title}
          </Listbox.Label>
          <div className="relative">
            <span className="inline-block w-full">
              <Listbox.Button className="pr-3 py-2 w-full text-right focus:outline-none focus:shadow-outline-blue focus:border-gray-300 relative border shadow-sm border-gray-300 rounded text-gray-800">
                <span className="block truncate"></span>
              </Listbox.Button>
            </span>

            <Listbox.Options className="border border-gray-300 rounded mt-1">
              {options.map((opt) => (
                <Listbox.Option key={opt.value} value={opt.value}>
                  {({ selected, active }) => (
                    <div
                      className={`${
                        active ? "text-white bg-amber-400" : "text-gray-900"
                      } cursor-default select-none relative py-2 pl-10 pr-4`}
                    >
                      <span
                        className={`${
                          selected ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {opt.label}
                      </span>

                      {selected && (
                        <span
                          className={`${
                            active ? "text-white" : "text-amber-600"
                          } absolute inset-y-0 left-0 flex items-center pl-2`}
                        >
                          <svg
                            className="h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
            {error && <span className="text-sm text-red-500">{error}</span>}
          </div>
        </>
      )}
    </Listbox>
  );
}
