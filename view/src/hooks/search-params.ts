import { useSearchParams } from "react-router-dom";

export function useUpdateSearchParam() {
    const [searchParams, setSearchParams] = useSearchParams();

    return function (key: string, value: string) {
        const params = new URLSearchParams(searchParams);
        params.set(key, value);
        setSearchParams(params);
    };
}

export function useDeleteSearchParam() {
    const [searchParams, setSearchParams] = useSearchParams();

    return function (key: string) {
        const params = new URLSearchParams(searchParams);
        params.delete(key);
        setSearchParams(params);
    };
}
