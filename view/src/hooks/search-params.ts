import { useSearchParams } from "react-router-dom";

export function useUpdateSearchParam() {
  const [searchParams, setSearchParams] = useSearchParams();

  return function (key: string, value: string | null) {
    const params = new URLSearchParams(searchParams);

    if (value === null || value === "") {
      params.delete(key); // ✅ remove instead of setting empty
    } else {
        if(value==="templates") params.delete("open");
      params.set(key, value);
    }

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
