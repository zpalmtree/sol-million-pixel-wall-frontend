/**
 * v0 by Vercel.
 * @see https://v0.dev/t/UexXVo7aNbl
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
    DialogTitle,
    DialogDescription,
    DialogContent,
} from "@/components/ui/dialog";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    Card,
} from "@/components/ui/card";

export function CheckoutDialog() {
    return (
        <DialogContent>
            <div className="max-w-full rounded-lg bg-[#1A1A1A] p-6 text-white border border-[#C19A6B]">
                <DialogTitle className="text-2xl font-semibold tracking-tighter text-[#C19A6B]">
                    Million Pixel Wall
                </DialogTitle>
                <DialogDescription className="mt-2 text-sm">
                    Create your masterpiece and immortalize it on our digital
                    canvas.
                </DialogDescription>
                <Tabs className="mt-6" defaultValue="create">
                    <TabsList className="grid w-full grid-cols-3 rounded-md bg-[#333333] px-1 sm:px-6 h-[60px] gap-1 sm:gap-2 border-2 border-[#C19A6B]">
                        <TabsTrigger
                            className="rounded-md py-2 hover:bg-[#444444] transition-colors duration-200 bg-[#333333] text-gray-400 text-xs sm:text-sm"
                            value="create"
                        >
                            <span className="block truncate sm:hidden">
                                Create
                            </span>
                            <span className="hidden sm:block">1. Create</span>
                        </TabsTrigger>
                        <TabsTrigger
                            className="rounded-md py-2 hover:bg-[#444444] transition-colors duration-200 bg-[#333333] text-gray-400 text-xs sm:text-sm"
                            value="purchase"
                        >
                            <span className="block truncate sm:hidden">
                                Purchase
                            </span>
                            <span className="hidden sm:block">2. Purchase</span>
                        </TabsTrigger>
                        <TabsTrigger
                            className="rounded-md py-2 hover:bg-[#444444] transition-colors duration-200 bg-[#333333] text-gray-400 text-xs sm:text-sm"
                            value="complete"
                        >
                            <span className="block truncate sm:hidden">
                                Complete
                            </span>
                            <span className="hidden sm:block">3. Complete</span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent
                        className="mt-6 w-full md:w-[825px] md:h-[625px]"
                        value="create"
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="md:h-[550px] flex items-center justify-center w-full md:w-[550px] rounded-md bg-[#333333] p-4 border border-[#C19A6B] aspect-square">
                                    <div className="flex h-full items-center justify-center">
                                        <span className="text-sm text-gray-400 text-center">
                                            Your masterpiece will be previewed
                                            here.
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full items-center md:w-[250px] p-4 border border-[#C19A6B] rounded-md flex flex-col justify-between">
                                <div className="flex flex-col gap-y-4">
                                    <div className="mb-4 flex flex-col gap-y-4 items-center justify-between">
                                        <Label
                                            className="text-sm font-medium"
                                            htmlFor="image"
                                        >
                                            Upload Image
                                        </Label>
                                        <Input
                                            accept="image/*"
                                            className="rounded-md bg-[#333333] px-3 py-2 text-white file:mr-4 file:rounded-md file:border-0 file:bg-[#C19A6B] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:bg-[#444444] transition-colors duration-200 h-full"
                                            id="image"
                                            type="file"
                                        />
                                    </div>

                                    <div className="bg-[#1A1A1A] rounded-lg p-4 border border-[#C19A6B]">
                                        <div className="grid grid-cols-4 gap-2">
                                            <div className="w-7 h-7 rounded-md bg-[#FF6B6B] cursor-pointer hover:ring-2 hover:ring-[#FF6B6B]" />
                                            <div className="w-7 h-7 rounded-md bg-[#FFC107] cursor-pointer hover:ring-2 hover:ring-[#FFC107]" />
                                            <div className="w-7 h-7 rounded-md bg-[#4CAF50] cursor-pointer hover:ring-2 hover:ring-[#4CAF50]" />
                                            <div className="w-7 h-7 rounded-md bg-[#2196F3] cursor-pointer hover:ring-2 hover:ring-[#2196F3]" />
                                            <div className="w-7 h-7 rounded-md bg-[#9B59B6] cursor-pointer hover:ring-2 hover:ring-[#9B59B6]" />
                                            <div className="w-7 h-7 rounded-md bg-[#E91E63] cursor-pointer hover:ring-2 hover:ring-[#E91E63]" />
                                            <div className="w-7 h-7 rounded-md bg-[#673AB7] cursor-pointer hover:ring-2 hover:ring-[#673AB7]" />
                                            <div className="w-7 h-7 rounded-md bg-[#03A9F4] cursor-pointer hover:ring-2 hover:ring-[#03A9F4]" />
                                            <div className="w-7 h-7 rounded-md bg-[#8BC34A] cursor-pointer hover:ring-2 hover:ring-[#8BC34A]" />
                                            <div className="w-7 h-7 rounded-md bg-[#FF9800] cursor-pointer hover:ring-2 hover:ring-[#FF9800]" />
                                            <div className="w-7 h-7 rounded-md bg-[#795548] cursor-pointer hover:ring-2 hover:ring-[#795548]" />
                                            <div className="w-7 h-7 rounded-md bg-[#607D8B] cursor-pointer hover:ring-2 hover:ring-[#607D8B]" />
                                            <div className="w-7 h-7 rounded-md bg-[#F44336] cursor-pointer hover:ring-2 hover:ring-[#F44336]" />
                                            <div className="w-7 h-7 rounded-md bg-[#9E9E9E] cursor-pointer hover:ring-2 hover:ring-[#9E9E9E]" />
                                            <div className="w-7 h-7 rounded-md bg-black cursor-pointer hover:ring-2 hover:ring-black border-gray-800" />
                                            <div className="w-7 h-7 rounded-md bg-white cursor-pointer hover:ring-2 hover:ring-white" />
                                        </div>
                                        <div className="mt-4 flex items-center justify-between gap-x-1">
                                            <Label
                                                className="text-sm"
                                                htmlFor="customColor"
                                            >
                                                Custom Color
                                            </Label>
                                            <Input
                                                className="bg-transparent border-none h-[48px] w-[60px] -mr-2"
                                                id="customColor"
                                                type="color"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center w-full">
                                    <Separator className="my-4 w-full bg-[#2d2d2d]" />
                                    <Button className="rounded-md border-none bg-red-500 px-12 py-2 text-white hover:bg-red-600 transition-colors duration-200 w-full max-w-[250px]">
                                        Clear Canvas
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <Button className="rounded-md bg-white px-12 py-2 text-black hover:bg-white hover:text-[#C19A6B] transition-colors duration-200 w-[150px]">
                                Continue
                            </Button>
                        </div>
                    </TabsContent>
                    <TabsContent
                        className="mt-6 w-full md:w-[825px] md:h-[625px]"
                        value="purchase"
                    >
                        <div className="">
                            <Card className="bg-[#333333] p-6 border border-[#C19A6B]">
                                <CardHeader>
                                    <CardTitle className="text-white">
                                        Solana Payment
                                    </CardTitle>
                                    <CardDescription className="text-white">
                                        Approve the transaction in your wallet
                                        to purchase your brick NFTs and upload
                                        your creation!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="text-4xl font-bold text-primary">
                                        0.5 SOL
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="mt-6">
                            <Button className="rounded-md bg-white px-12 py-2 text-black hover:bg-white hover:text-[#C19A6B] transition-colors duration-200 w-[150px]">
                                Pay
                            </Button>
                        </div>
                    </TabsContent>
                    <TabsContent
                        className="mt-6 w-full md:w-[825px] md:h-[625px]"
                        value="complete"
                    >
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <CircleCheckIcon className="mx-auto mb-4 h-16 w-16 text-[#C19A6B]" />
                                <h3 className="text-2xl font-semibold tracking-tighter">
                                    Congratulations!
                                </h3>
                                <p className="mt-2 text-gray-400">
                                    Your masterpiece has been immortalized on
                                    our digital canvas.
                                </p>
                                <Button variant="brown">View Wall</Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DialogContent>
    );
}

function CircleCheckIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
