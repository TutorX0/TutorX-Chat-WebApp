import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";

export function Medias() {
    return (
        <Tabs defaultValue="media" className="w-full">
            <TabsList className="h-full w-full bg-transparent p-0">
                <TabsTrigger
                    value="media"
                    className="data-[state=active]:text-primary data-[state=active]:border-b-primary cursor-pointer rounded-none border-2 pb-2"
                >
                    Media
                </TabsTrigger>
                <TabsTrigger
                    value="links"
                    className="data-[state=active]:text-primary data-[state=active]:border-b-primary cursor-pointer rounded-none border-2 pb-2"
                >
                    Links
                </TabsTrigger>
                <TabsTrigger
                    value="docs"
                    className="data-[state=active]:text-primary data-[state=active]:border-b-primary cursor-pointer rounded-none border-2 pb-2"
                >
                    Docs
                </TabsTrigger>
            </TabsList>
            <TabsContent value="media">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam, excepturi!</TabsContent>
            <TabsContent value="links">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel fugit consequuntur, harum voluptatem sapiente ut
                officia quia repellat quos ipsam?
            </TabsContent>
            <TabsContent value="docs">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. At voluptas est repudiandae eos quibusdam molestias
                praesentium. Fugit, enim? Unde odio laudantium nostrum sapiente veniam expedita dolorem dolore asperiores commodi
                libero?
            </TabsContent>
        </Tabs>
    );
}
