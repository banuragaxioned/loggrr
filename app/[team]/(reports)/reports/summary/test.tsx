"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const YourComponent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedCount, setSelectedCount] = useState<number>(0);
  const selected = searchParams.get("selectedOptions");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const updateUrlParams = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map((option) => option.value);
    const query = selectedOptions.length > 0 ? selectedOptions.join(",") : null;
    if (query) {
      router.push(pathname + "?" + createQueryString("selectedOptions", query));
    }
  };

  useEffect(() => {
    const selectedOptionsParam = selected;
    if (selectedOptionsParam) {
      const options = selectedOptionsParam.split(",") as string[];
      setSelectedOptions(options);
      setSelectedCount(options.length);
    }
  }, [selected]);

  return (
    <div>
      <label htmlFor="options">Select options:</label>
      <select id="options" multiple onChange={updateUrlParams} value={selectedOptions}>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>

      <div>Selected Count: {selectedCount}</div>
    </div>
  );
};

export default YourComponent;
