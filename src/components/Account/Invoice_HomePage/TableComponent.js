export const InvoiceTableHeading = () => {
    return (
        <div class="flex -mx-1 border-b py-2 items-start">
            <div class="flex-1 px-1">
                <p class="text-gray-800 uppercase tracking-wide text-sm font-bold">
                    Description
                </p>
            </div>

            <div class="px-1 w-20 text-right">
                <p class="text-gray-800 uppercase tracking-wide text-sm font-bold">
                    Units
                </p>
            </div>

            <div class="px-1 w-32 text-right">
                <p class="leading-none">
                    <span class="block uppercase tracking-wide text-sm font-bold text-gray-800">
                        Unit Price
                    </span>
                    <span class="font-medium text-xs text-gray-500">
                        (Incl. GST)
                    </span>
                </p>
            </div>

            <div class="px-1 w-32 text-right">
                <p class="leading-none">
                    <span class="block uppercase tracking-wide text-sm font-bold text-gray-800">
                        Amount
                    </span>
                    <span class="font-medium text-xs text-gray-500">
                        (Incl. GST)
                    </span>
                </p>
            </div>

            <div class="px-1 w-20 text-center"></div>
        </div>
    )
}
