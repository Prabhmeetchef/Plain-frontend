import { getServerSession, NextAuthOptions } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Sidebar from "../../components/sidebar";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Initialize Supabase client
const supabase = createServerComponentClient({ cookies });

export default async function Buttons() {
  const session = await getServerSession(authOptions as NextAuthOptions);
  const username = session?.user?.name || "Guest";

  if (!session) {
    return <p>Please log in</p>;
  }

  // Fetch buttons from Supabase
  const { data, error } = session?.user?.email
    ? await supabase
        .from("users")
        .select("buttons")
        .eq("email", session.user.email)
        .single()
    : { data: null, error: new Error("Session or user email is missing") };

  if (error) {
    console.error("Error fetching data:", error);
    return <p>Error loading components</p>;
  }

  const buttons: Array<{
    type: string;
    title: string;
    html?: string;
    css?: string;
    imgurl?: string;
    notes?: string;
  }> = data?.buttons || [];

  async function handleSubmit(formData: FormData) {
    "use server"; // Ensures this runs server-side

    const type = formData.get("type") as string;
    const title = formData.get("title") as string;
    const notes = formData.get("notes") as string;

    let newButton: any;

    if (type === "html_css") {
      const html = formData.get("html") as string;
      const css = formData.get("css") as string;
      newButton = { type, title, html, css, notes };
    } else if (type === "image") {
      const imgurl = formData.get("imgurl") as string;
      newButton = { type, title, imgurl, notes };
    } else {
      return; // Invalid type
    }

    // Fetch the latest user data again inside the function
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("buttons")
      .eq("email", session?.user?.email)
      .single();

    if (fetchError) {
      console.error("Error fetching user data:", fetchError);
      return;
    }

    const updatedButtons = [...(userData?.buttons || []), newButton];

    // Update buttons in Supabase
    const { error: updateError } = await supabase
      .from("users")
      .update({ buttons: updatedButtons })
      .eq("email", session?.user?.email);

    if (updateError) {
      console.error("Error updating data:", updateError);
      return;
    }

    // Reload the page after updating
    redirect("/componentTypes/buttons");
  }

  return (
    <div className="h-[100vh] flex justify-between items-center">
      <div className="ml-[1vw] fixed">
        <Sidebar username={username} />
      </div>
      <div>
        <div className="w-[290px] h-[98vh]">.</div>
      </div>
      <div className="flex-grow flex-col h-full py-6 pr-1">
        <h1 className="text-[32px] font-semibold">Buttons</h1>
        <h2 className="opacity-60">
          All button components can be seen and created here.
        </h2>

        {/* Grid for displaying buttons */}
        <div className="flex flex-wrap gap-8 py-10">
          {/* Add new button */}
          <div className="flex items-center justify-center w-[300px] h-[300px]">
            <Dialog>
              <DialogTrigger>
                <button className="flex flex-col w-24 h-24 border-[1px] border-[#E6E6E6] items-center justify-center rounded-[10px] gap-2 hover:shadow-[0_0px_12px_2px_rgba(0,0,0,0.1)]">
                  <Image
                    src="/+.png"
                    alt="yo"
                    width={32}
                    height={32}
                    className="translate-y-2"
                  />
                  <h1 className="translate-y-1">Add new</h1>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <h1 className="text-[18px] font-semibold">
                    Add new button component
                  </h1>
                </DialogHeader>

                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="html_css">HTML + CSS</TabsTrigger>
                    <TabsTrigger value="image">Image + Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="html_css">
                    <form action={handleSubmit}>
                      <select
                        name="type"
                        className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1 hidden"
                        required
                      >
                        <option value="html_css">HTML + CSS</option>
                      </select>
                      <div className="py-4">
                        <h1 className="opacity-60 text-[13px]">Title</h1>
                        <input
                          type="text"
                          name="title"
                          className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                          required
                        />
                      </div>
                      <div className="py-4">
                        <h1 className="opacity-60 text-[13px]">Notes</h1>
                        <textarea
                          name="notes"
                          className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                        />
                      </div>
                      <div id="html_css_fields" className="py-4">
                        <h1 className="opacity-60 text-[13px]">HTML</h1>
                        <textarea
                          name="html"
                          className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                        />
                        <h1 className="opacity-60 text-[13px]">CSS</h1>
                        <textarea
                          name="css"
                          className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                        />
                      </div>
                      <div className="flex justify-end w-full gap-6">
                        <DialogClose>
                          <button className="flex py-2 px-[20px] rounded-[6px] bg-[#E6E6E6]">
                            Cancel
                          </button>
                        </DialogClose>
                        <button
                          type="submit"
                          className="py-2 px-[26px] text-white bg-[#AB00D6] rounded-[6px]"
                        >
                          Add
                        </button>
                      </div>
                    </form>
                  </TabsContent>
                  <TabsContent value="image">
                    <form action={handleSubmit}>
                      <select
                        name="type"
                        className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1 hidden"
                        required
                      >
                        <option value="image">Image</option>
                      </select>
                      <div id="image_fields" className="py-4">
                        <h1 className="opacity-60 text-[13px]">Image URL</h1>
                        <input
                          type="text"
                          name="imgurl"
                          className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                        />
                      </div>
                      <div className="py-4">
                        <h1 className="opacity-60 text-[13px]">Title</h1>
                        <input
                          type="text"
                          name="title"
                          className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                          required
                        />
                      </div>
                      <div className="py-4">
                        <h1 className="opacity-60 text-[13px]">Notes</h1>
                        <textarea
                          name="notes"
                          className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                        />
                      </div>
                      <div className="flex justify-end w-full gap-6">
                        <DialogClose>
                          <button className="flex py-2 px-[20px] rounded-[6px] bg-[#E6E6E6]">
                            Cancel
                          </button>
                        </DialogClose>
                        <button
                          type="submit"
                          className="py-2 px-[26px] text-white bg-[#AB00D6] rounded-[6px]"
                        >
                          Add
                        </button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>

          {/* Display buttons */}
          {buttons.map((button, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center h-[320px] w-[300px] border border-[#E6E6E6] rounded-[10px] hover:shadow-[0_2px_7px_2px_rgba(0,0,0,0.1)] transition cursor-pointer p-4 gap-2"
            >
              {button.type === "html_css" ? (
                <>
                  <div className="flex-1 flex w-full overflow-auto bg-[#e9e9e9] rounded-[6px] objects-center justify-center">
                    <style>{button.css}</style>
                    <div
                      dangerouslySetInnerHTML={{ __html: button.html || "" }}
                    />
                  </div>
                  <h1 className="text-lg">{button.title}</h1>
                </>
              ) : (
                <>
                  <div className="h-full flex w-full overflow-auto bg-[#e9e9e9] rounded-[6px] objects-center justify-center">
                    <img
                      src={button.imgurl}
                      alt={button.title}
                      className="w-full h-auto rounded-[6px]"
                    />
                  </div>
                  <h1 className="text-lg">{button.title}</h1>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
