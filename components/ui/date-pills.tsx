interface DatePillsProps {
    selected: string;
    onSelect: (name: string) => void;
    options?: string[];
    className?: string;
    left?: boolean;
  }
  
  const defaultOptions = [
    "Hoy",
    "Ayer",
    "Últimos 7 días",
    "Últimos 30 días",
    "Próximos",
  ];
  
  export function DatePills({ selected, onSelect, options, left }: DatePillsProps) {
    const clase = left ? "flex gap-x-2 mt-0 w-full justify-end" : "flex gap-x-2 mt-0 w-full justify-center";
    const optionsToUse = options ?? defaultOptions;
    return (
      <div className={clase} >
        {optionsToUse.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className={`${
              selected === option
                ? "bg-secondary-foreground text-secondary"
                : "bg-secondary text-secondary-foreground"
            } px-4 py-1 rounded-xl text-sm`}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }