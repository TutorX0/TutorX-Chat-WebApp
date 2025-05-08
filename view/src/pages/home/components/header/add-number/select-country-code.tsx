import type { Control, UseFormSetValue } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CountryList } from "@/hooks";
import { Button } from "@/components";
import { Form } from "./number-form";
import { cn } from "@/lib";

type SelectCountryCodeProps = {
    control: Control<Form, any, Form>;
    countryList: CountryList;
    setValue: UseFormSetValue<Form>;
};

export function SelectCountryCode({ control, countryList, setValue }: SelectCountryCodeProps) {
    const [open, setOpen] = useState(false);

    return (
        <FormField
            control={control}
            name="countryName"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel className="font-normal text-neutral-400">Enter contact nationality</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn("justify-between font-normal", !field.value && "text-muted-foreground")}
                                >
                                    {field.value
                                        ? countryList.find((country) => country.name === field.value)?.name
                                        : "Select language"}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                            <Command>
                                <CommandInput placeholder="Search framework..." className="h-9" />
                                <CommandList>
                                    <CommandEmpty>No country found</CommandEmpty>
                                    <CommandGroup>
                                        {countryList.map((country) => {
                                            return country.name ? (
                                                <CommandItem
                                                    value={country.name}
                                                    key={country.code}
                                                    onSelect={() => {
                                                        setValue("countryName", country.name!);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {country.name}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            country.name === field.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ) : null;
                                        })}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
