const CATEGORIES = [
  { id: "all", label: "All Events" },
  { id: "concert", label: "Concerts" },
  { id: "sports", label: "Sports" },
  { id: "theater", label: "Theater" },
  { id: "comedy", label: "Comedy" },
  { id: "festival", label: "Festivals" },
];

type Props = {
  activeCategory: string;
  onChange: (categoryId: string) => void;
};

const CategoryFilter = ({ activeCategory, onChange }: Props) => {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {CATEGORIES.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onChange(category.id)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm transition-all duration-200 ${activeCategory === category.id
              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
              : "bg-white/8 text-gray-300 border border-white/10 hover:border-white/20 hover:text-white"
            }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
