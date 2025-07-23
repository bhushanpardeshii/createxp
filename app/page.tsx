"use client";
import ClientTable from "./ClientTable";
import SortPanel from "./SortPanel";
import { useClientSort } from "./useClientSort";
import { mockClients } from "./mockClients";
import SortPopover from "./SortPopover";
import { Button } from "../components/ui/button";
import { Search, Filter,ArrowDownUp, Plus } from "lucide-react";
import { useState, useRef } from "react";

export default function Home() {
  const { sort, setSort, appliedSort, applySort, clearSort, multiSort } = useClientSort();
  const sortedClients = multiSort(mockClients);
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="p-8">
      <div className="flex items- border-b justify-between pb-6 mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
      </div>
      {/* Button group and actions */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex gap-1 rounded-md p-1">
          <Button variant="secondary" size="sm" className="font-semibold">All</Button>
          <Button variant="ghost" size="sm" className="font-semibold">Individual</Button>
          <Button variant="ghost" size="sm" className="font-semibold">Company</Button>
        </div>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" className="ml-2"><Search className="w-5 h-5" /></Button>
        <Button ref={sortButtonRef}
          variant="ghost"
          size="icon"
          onClick={() => setSortPopoverOpen((v) => !v)} className="ml-2"><ArrowDownUp className="w-5 h-5" /></Button>
        <Button
         variant="ghost"
          size="icon"
        >
          <Filter className="w-5 h-5" />
        </Button>
        
        <Button  variant="default" className="px-4 py-2 font-semibold text-base flex items-center gap-2"><Plus className="w-4 h-4" />Add Client</Button>
        {/* Popover for sorting */}
        {sortPopoverOpen && (
          <div
            style={{ position: 'absolute', right:210, top: 150, zIndex: 50 }}
            className="min-w-[680px] max-w-lg bg-white rounded-xl p-0 shadow-lg border"
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
