'use client';

import { CATEGORIES, CATEGORY_LABELS } from '@/lib/utils';

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map((category) => {
        const isSelected = selected === category;

        return (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isSelected
                ? 'bg-accent text-white'
                : 'bg-[var(--surface)] text-[var(--muted)] hover:text-foreground'
            }`}
          >
            {CATEGORY_LABELS[category]}
          </button>
        );
      })}
    </div>
  );
}
