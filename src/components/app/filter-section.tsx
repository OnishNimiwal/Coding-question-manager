
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface FilterSectionProps {
  title: string;
  options: string[];
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  icon?: React.ReactNode;
}

export function FilterSection({ title, options, selected, onSelectionChange, icon }: FilterSectionProps) {
  const handleCheckedChange = (option: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selected, option]);
    } else {
      onSelectionChange(selected.filter((item) => item !== option));
    }
  };

  return (
    <div className="space-y-2">
        <h3 className="text-sm font-medium tracking-tight flex items-center gap-2">
            {icon}
            {title}
        </h3>
        <div className="flex flex-col gap-2">
            {options.map((option) => (
            <div key={option} className="flex items-center space-x-3">
                <Checkbox
                id={`${title}-${option}`}
                checked={selected.includes(option)}
                onCheckedChange={(checked) => handleCheckedChange(option, !!checked)}
                />
                <Label htmlFor={`${title}-${option}`} className="font-normal capitalize cursor-pointer text-sm">
                {option}
                </Label>
            </div>
            ))}
      </div>
    </div>
  );
}
