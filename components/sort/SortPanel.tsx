"use client";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, User, Calendar, Hash, GripVertical, SquareUser, ArrowUp, ArrowDown } from "lucide-react";
import { SORT_FIELDS, SortField } from "../../hooks/useClientSort";
import React from "react";

function getIcon(field: string) {
  switch (field) {
    case "name":
      return <User size={16} className="mr-1" />;
    case "createdAt":
    case "updatedAt":
      return <Calendar size={16} className="mr-1" />;
    case "id":
      return <Hash size={16} className="mr-1" />;
    default:
      return null;
  }
}

function SortableItem({ s, label, onToggle, onRemove }: any) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: s.field });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: 8,
    cursor: "default",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 rounded border mb-3 bg-white shadow-sm ${isDragging ? "opacity-50 bg-gray-100" : ""}`}
    >
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors mr-2"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <GripVertical className="w-4 h-4" />
      </span>
      {getIcon(s.field)}
      <span className="flex-1 font-medium">{label}</span>
      <button
        onClick={() => onToggle(s.field, "asc")}
        className={`px-2 py-1 cursor-pointer rounded text-xs font-semibold ${s.direction === "asc" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
      >
        <ArrowUp className="inline w-4 h-4 mr-1" />
        {s.field.includes("At") ? "Newest to Oldest" : "A-Z"}
      </button>
      <button
        onClick={() => onToggle(s.field, "desc")}
        className={`px-2 py-1 cursor-pointer rounded text-xs font-semibold ml-1 ${s.direction === "desc" ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`}
      >
        <ArrowDown className="inline w-4 h-4 mr-1" />
        {s.field.includes("At") ? "Oldest to Newest" : "Z-A"}
      </button>
      <button onClick={() => onRemove(s.field)} className="ml-2 p-1 cursor-pointer text-gray-400 hover:text-red-500" title="Remove">
        <X size={16} />
      </button>
    </div>
  );
}

export default function SortPanel({ sort, setSort, applySort, clearSort, appliedSort }: {
  sort: SortField[];
  setSort: React.Dispatch<React.SetStateAction<SortField[]>>;
  applySort: () => void;
  clearSort: () => void;
  appliedSort: SortField[];
}) {
  const sensors = useSensors(useSensor(PointerSensor));
  const activeFields = sort.map((s) => s.field);
  const inactiveFields = SORT_FIELDS.filter((f) => !activeFields.includes(f.key));

  console.log('SortPanel render, sort:', sort);

  function handleDragEnd(event: any) {
    const { active, over } = event;
    console.log('handleDragEnd', { active, over, sort });
    if (active.id !== over?.id) {
      const oldIndex = sort.findIndex((s) => s.field === active.id);
      const newIndex = sort.findIndex((s) => s.field === over.id);
      console.log('Moving from', oldIndex, 'to', newIndex);
      setSort(arrayMove(sort, oldIndex, newIndex));
    }
  }

  function handleToggle(field: string, dir: "asc" | "desc") {
    console.log('handleToggle called', { field, dir });
    setSort((prev) => {
      console.log('handleToggle prev', prev);
      const updated = prev.map((s) => s.field === field ? { ...s, direction: dir } : s);
      console.log('handleToggle updated', updated);
      return updated;
    });
  }

  function handleRemove(field: string) {
    setSort((prev) => prev.filter((s) => s.field !== field));
  }

  function handleAdd(field: string, dir: "asc" | "desc") {
    setSort([...sort, { field, direction: dir }]);
  }

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-lg  flex flex-col gap-4">
      <div className="font-semibold text-lg mb-2">Sort By</div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={(() => { const items = sort.map((s) => s.field); console.log('SortableContext items', items); return items; })()}
          strategy={verticalListSortingStrategy}
        >
          {sort.map((s) => (
            <SortableItem
              key={s.field}
              s={s}
              label={SORT_FIELDS.find(f => f.key === s.field)?.label || s.field}
              onToggle={handleToggle}
              onRemove={handleRemove}
            />
          ))}
        </SortableContext>
      </DndContext>
      {/* Inactive fields */}
      {inactiveFields.length > 0 && (
        <div className="mt-2 flex flex-col gap-2">
          {inactiveFields.map((f) => (
            <div key={f.key} className="flex items-center gap-2 p-2 rounded border bg-gray-50">
              {getIcon(f.key)}
              <span className="flex-1 text-gray-500">{f.label}</span>
              <button
                onClick={() => handleAdd(f.key, "asc")}
                className="px-2 py-1 cursor-pointer rounded text-xs font-semibold hover:bg-gray-100"
              >
                <ArrowUp className="inline w-4 h-4 mr-1" />
                {f.key.includes("At") ? "Newest to Oldest" : "A-Z"}
              </button>
              <button
                onClick={() => handleAdd(f.key, "desc")}
                className="px-2 py-1 cursor-pointer rounded text-xs font-semibold hover:bg-gray-100 ml-1"
              >
                <ArrowDown className="inline w-4 h-4 mr-1" />
                {f.key.includes("At") ? "Oldest to Newest" : "Z-A"}
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between mt-4">
        <button
          className="text-gray-500 cursor-pointer hover:underline text-sm"
          onClick={clearSort}
          disabled={sort.length === 0}
        >
          Clear all
        </button>
        <button
          className="px-4 py-2 cursor-pointer bg-black text-white rounded font-semibold hover:bg-gray-800"
          onClick={applySort}
          disabled={JSON.stringify(sort) === JSON.stringify(appliedSort)}
        >
          Apply Sort
        </button>
      </div>
    </div>
  );
} 