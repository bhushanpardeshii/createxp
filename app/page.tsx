"use client";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Search, ArrowDownUp, Filter, Plus } from "lucide-react";

// Components
import ClientTable from "../components/table/ClientTable";
import SortPanel from "../components/sort/SortPanel";

// Hooks and Utils
import { useClientSort } from "../hooks/useClientSort";
import { mockClients } from "../utils/mockClients";

export default function Home() {
  const { sort, setSort, appliedSort, applySort, clearSort, multiSort } = useClientSort();
  const sortedClients = multiSort(mockClients);
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);
  // Remove popoverStyle, positioned, useLayoutEffect, and sortButtonRef

  return (
    <div className="p-8">
      <div className="flex items-center border-b pb-4 justify-between mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
      </div>
      {/* Button group and actions with popover wrapper */}
      <div className="relative flex items-center mb-1">
        <div className="flex gap-1  rounded-md p-1">
          <Button variant="ghost" size="sm" className="font-bold ">All</Button>
          <Button variant="ghost" size="sm" className="font-semibold text-gray-600">Individual</Button>
          <Button variant="ghost" size="sm" className="font-semibold text-gray-600">Company</Button>
        </div>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" className="ml-2"><Search className="w-5 h-5" /></Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSortPopoverOpen((v) => !v)}
          className="ml-2"
        >
          <ArrowDownUp className="w-5 h-5" />
          <div className="relative">  
            {sort.length > 0 && (
              <div className="absolute -top-5 -right-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                {sort.length}
              </div>
            )}
          </div>
        </Button>
        <Button variant="ghost" size="icon" className="ml-2"><Filter className="w-5 h-5" /></Button>
        <Button variant="default" className="px-4 py-2 font-semibold text-base flex items-center gap-2">
          <Plus className="w-4 h-4" />Add Client
        </Button>
        {/* Popover for sorting */}
        {sortPopoverOpen && (
          <div
            className="absolute right-45 top-8 mt-2 min-w-[680px] max-w-lg bg-white rounded-xl p-0 shadow-lg border z-50"
          >
            <SortPanel
              sort={sort}
              setSort={setSort}
              applySort={applySort}
              clearSort={clearSort}
              appliedSort={appliedSort}
            />
            <div className="absolute top-2 right-2">
              <Button variant="ghost" size="icon" onClick={() => setSortPopoverOpen(false)}>
                ×
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-8 flex-col md:flex-row">
        <ClientTable clients={sortedClients} />
      </div>
    </div>
  );
}
