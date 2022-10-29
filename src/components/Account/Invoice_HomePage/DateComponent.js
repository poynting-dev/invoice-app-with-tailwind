import { DatePicker } from "react-responsive-datepicker";
import "react-responsive-datepicker/dist/index.css";

var options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const InvoiceDate = ({
  invoiceDate,
  setInvoiceDate,
  isOpen1,
  setIsOpen1,
}) => {
  return (
    <div className="mb-2 md:mb-1 md:flex items-center">
      <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
        Invoice Date
      </label>
      <span className="mr-4 inline-block hidden md:block">:</span>
      <div className="flex-1">
        <input
          className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker"
          type="text"
          id="datepicker1"
          placeholder="eg. 17 Feb, 2020"
          value={invoiceDate}
          onClick={() => {
            setIsOpen1(true);
          }}
          autoComplete="off"
          readOnly
        />
      </div>
      <DatePicker
        isOpen={isOpen1}
        onClose={() => setIsOpen1(false)}
        defaultValue={new Date(2022, 8, 8)}
        minDate={new Date()}
        maxDate={new Date(2023, 0, 10)}
        headerFormat="DD, MM dd"
        onChange={(date) =>
          setInvoiceDate(date.toLocaleDateString("en-IN", options))
        }
      />
    </div>
  );
};

export const DueDate = ({ dueDate, setDueDate, isOpen2, setIsOpen2 }) => {
  return (
    <>
      <div className="mb-2 md:mb-1 md:flex items-center">
        <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
          Due Date
        </label>
        <span className="mr-4 inline-block hidden md:block">:</span>
        <div className="flex-1">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 js-datepicker"
            type="text"
            id="datepicker1"
            placeholder="eg. 17 Feb, 2020"
            value={dueDate}
            onClick={() => {
              setIsOpen2(true);
            }}
            autoComplete="off"
            readOnly
          />
        </div>
        <DatePicker
          isOpen={isOpen2}
          onClose={() => setIsOpen2(false)}
          defaultValue={new Date(2022, 8, 8)}
          minDate={new Date()}
          maxDate={new Date(2023, 0, 10)}
          headerFormat="DD, MM dd"
          onChange={(date) =>
            setDueDate(date.toLocaleDateString("en-IN", options))
          }
        />
      </div>
    </>
  );
};
