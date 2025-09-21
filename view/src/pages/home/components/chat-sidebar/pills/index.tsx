import { useSearchParams } from "react-router-dom";

import { ScrollArea, ScrollBar } from "@/components";
import {  useUpdateSearchParam } from "@/hooks";
import { AddPill } from "./add-pill";
import { useStore } from "@/store";

type PillsProps = {
  pillTitles: string[];
};

export function Pills({ pillTitles }: PillsProps) {
  const updateSearchParam = useUpdateSearchParam();
  const [searchParams] = useSearchParams();


  const toggleShowTemplate = useStore((state) => state.toggleShowTemplate);
  const showTemplateTrue = useStore((state) => state.showTemplateTrue);
  // const showTemplate = useStore((state) => state.showTemplate);
  

     

//console.log("showTemplate", searchParams.get("chat_type"), showTemplate);
const handleClick = (title: string) => {
  if(searchParams.get("chat_type") !== "templates") {
    showTemplateTrue();

  }
  else if(searchParams.get("chat_type") === "templates"){
toggleShowTemplate()
  }
   updateSearchParam("chat_type", title?.toLowerCase());

  

};


  return (
    <ScrollArea className="w-full px-5 py-3 whitespace-nowrap ">
      <section className="flex w-max items-center gap-2">
  
        {pillTitles.map((title) => (
          <div
            key={title}
            className="bg-secondary/30 border-secondary 
                       data-[active=true]:bg-primary/20 
                       data-[active=true]:border-primary/80 
                       flex h-8 min-w-16 shrink-0 cursor-pointer 
                       items-center justify-center rounded-full 
                       border px-3 py-1 text-sm"
            data-active={searchParams.get("chat_type")?.toLowerCase() === title.toLowerCase()}
onClick={() => handleClick(title)}

          >
            {title}
          </div>
        ))}

      

        <AddPill />
      </section>
      <ScrollBar orientation="horizontal" className="mx-5" />
    </ScrollArea>
  );
}
