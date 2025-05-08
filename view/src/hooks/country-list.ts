import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import enLocale from "i18n-iso-countries/langs/en.json";
import countries from "i18n-iso-countries";
import { useMemo } from "react";

countries.registerLocale(enLocale);

export function useCountryList() {
    return useMemo(() => {
        return getCountries().map((code) => ({
            code,
            name: countries.getName(code, "en"),
            callingCode: `+${getCountryCallingCode(code)}`
        }));
    }, []);
}

export type CountryList = ReturnType<typeof useCountryList>;
