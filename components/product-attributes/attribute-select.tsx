"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AttributesResponse } from "@/types";

interface AttributeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  attributes: AttributesResponse[];
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export function AttributeSelect({
  value,
  onValueChange,
  attributes,
  disabled = false,
  error,
  placeholder = "Chọn thuộc tính",
  label = "Thuộc tính",
  required = false,
}: AttributeSelectProps) {
  const [open, setOpen] = useState(false);

  // Find selected attribute
  const selectedAttribute = attributes.find((attr) => attr.id === value);

  return (
    <div className="space-y-2">
      <Label htmlFor="attributeId">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal",
              !value && "text-muted-foreground"
            )}
            disabled={disabled}
          >
            {selectedAttribute ? selectedAttribute.attributeName : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Tìm kiếm thuộc tính..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>Không tìm thấy thuộc tính nào.</CommandEmpty>
              <CommandGroup>
                {attributes.map((attribute) => (
                  <CommandItem
                    key={attribute.id}
                    value={attribute.attributeName}
                    onSelect={() => {
                      onValueChange(attribute.id === value ? "" : attribute.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === attribute.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {attribute.attributeName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
