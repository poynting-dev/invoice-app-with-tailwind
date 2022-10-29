export const InvoiceTableHeading = () => {
  return (
    <div className="flex -mx-1 border-b py-2 items-start">
      <div className="flex-1 px-1">
        <p className="text-gray-800 uppercase tracking-wide text-sm font-bold">
          Description
        </p>
      </div>

      <div className="px-1 w-20 text-right">
        <p className="text-gray-800 uppercase tracking-wide text-sm font-bold">
          Units
        </p>
      </div>

      <div className="px-1 w-32 text-right">
        <p className="leading-none">
          <span className="block uppercase tracking-wide text-sm font-bold text-gray-800">
            Unit Price
          </span>
          <span className="font-medium text-xs text-gray-500">(Incl. GST)</span>
        </p>
      </div>

      <div className="px-1 w-32 text-right">
        <p className="leading-none">
          <span className="block uppercase tracking-wide text-sm font-bold text-gray-800">
            Amount
          </span>
          <span className="font-medium text-xs text-gray-500">(Incl. GST)</span>
        </p>
      </div>

      <div className="px-1 w-20 text-center"></div>
    </div>
  );
};
