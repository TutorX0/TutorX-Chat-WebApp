import axios, { type AxiosResponse } from "axios";
import { useEffect, useState } from "react";

const cache: Record<string, AxiosResponse | null> = {};

type FetchState<T> = {
    data: T | null;
    error: any;
    loading: boolean;
};

export function useFetchOnce<T = any>(url: string) {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        error: null,
        loading: true
    });

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        if (cache[url]) {
            setState({ data: cache[url]?.data ?? null, error: null, loading: false });
            return;
        }

        axios
            .get<T>(url, { signal: controller.signal })
            .then((response) => {
                if (!isMounted) return;
                cache[url] = response;
                setState({ data: response.data, error: null, loading: false });
            })
            .catch((error) => {
                if (!isMounted || axios.isCancel(error)) return;
                setState({ data: null, error, loading: false });
            });

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [url]);

    return state;
}
