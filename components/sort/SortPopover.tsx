import { useState, useRef, useEffect } from "react";
import { Filter } from "lucide-react";
import SortPanel from "./SortPanel";
import { Button } from "../../components/ui/button";

export default function SortPopover(props: any) {
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const justOpened = useRef(false);

  // Close popover on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (justOpened.current) {
        justOpened.current = false;
        return;
      }
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleButtonClick() {
    setOpen((v) => {
      if (!v) justOpened.current = true;
      return !v;
    });
  }

  return (
    <div className="relative">
      <Button variant="outline" size="icon" aria-label="Sort" onClick={handleButtonClick}>
        <Filter size={20} />
      </Button>
      {/* Only render the popover when open is true */}
      {open && (
        <div
          ref={popoverRef}
          className="absolute right-0 mt-2 z-50 min-w-[680px] max-w-lg bg-white rounded-xl shadow-lg"
        >
          <SortPanel {...props} />
        </div>
      )}
    </div>
  );
} 