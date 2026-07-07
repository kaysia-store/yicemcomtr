"use client";

import { useState, type ReactNode } from "react";

type Props<T extends { id: string }> = {
  items: T[];
  onReorder: (items: T[]) => void;
  disabled?: boolean;
  renderItem: (item: T, index: number, dragHandle: ReactNode) => ReactNode;
};

export default function SortableList<T extends { id: string }>({
  items,
  onReorder,
  disabled = false,
  renderItem,
}: Props<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDrop = (dropIndex: number) => {
    if (disabled || dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }

    const next = [...items];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(dropIndex, 0, moved);
    onReorder(next);
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="admin-sortable-list">
      {items.map((item, index) => {
        const dragHandle = (
          <span
            className={`admin-drag-handle ${disabled ? "disabled" : ""}`}
            draggable={!disabled}
            onDragStart={() => setDragIndex(index)}
            onDragEnd={() => {
              setDragIndex(null);
              setOverIndex(null);
            }}
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            title="Sürükleyerek sırala"
            aria-label="Sürükleyerek sırala"
          >
            ⋮⋮
          </span>
        );

        return (
          <div
            key={item.id}
            className={`admin-sortable-item ${dragIndex === index ? "dragging" : ""} ${overIndex === index ? "over" : ""}`}
            onDragOver={(event) => {
              if (disabled) return;
              event.preventDefault();
              setOverIndex(index);
            }}
            onDragLeave={() => setOverIndex((current) => (current === index ? null : current))}
            onDrop={(event) => {
              event.preventDefault();
              handleDrop(index);
            }}
          >
            {renderItem(item, index, dragHandle)}
          </div>
        );
      })}
    </div>
  );
}
