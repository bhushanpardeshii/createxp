import { useEffect, useState } from "react";

export type Client = {
  id: number;
  name: string;
  type: string;
  email: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
};

export type SortField = {
  field: string;
  direction: "asc" | "desc";
};

export const SORT_FIELDS = [
  { key: "name", label: "Client Name", type: "string" },
  { key: "createdAt", label: "Created At", type: "date" },
  { key: "updatedAt", label: "Updated At", type: "date" },
  { key: "id", label: "Client ID", type: "number" },
];

function getDefaultSort(): SortField[] {
  return [
    { field: "name", direction: "asc" },
    { field: "createdAt", direction: "desc" },
  ];
}

function loadSortFromStorage(): SortField[] {
  try {
    const raw = localStorage.getItem("clientSort");
    if (raw) return JSON.parse(raw);
  } catch {}
  return getDefaultSort();
}

function saveSortToStorage(sort: SortField[]) {
  localStorage.setItem("clientSort", JSON.stringify(sort));
}

export function useClientSort() {
  const [sort, setSort] = useState<SortField[]>(getDefaultSort());
  const [appliedSort, setAppliedSort] = useState<SortField[]>(getDefaultSort());

  useEffect(() => {
    setSort(loadSortFromStorage());
    setAppliedSort(loadSortFromStorage());
  }, []);

  useEffect(() => {
    saveSortToStorage(appliedSort);
  }, [appliedSort]);

  function applySort() {
    setAppliedSort(sort);
  }

  function clearSort() {
    setSort([]);
  }

  function multiSort(data: Client[]): Client[] {
    return [...data].sort((a, b) => {
      for (const { field, direction } of appliedSort) {
        let av = a[field as keyof Client];
        let bv = b[field as keyof Client];
        const type = SORT_FIELDS.find(f => f.key === field)?.type;
        if (type === "date") {
          av = new Date(av as string).getTime();
          bv = new Date(bv as string).getTime();
        }
        if (av < bv) return direction === "asc" ? -1 : 1;
        if (av > bv) return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  return {
    sort,
    setSort,
    appliedSort,
    applySort,
    clearSort,
    multiSort,
  };
} 