'use client';
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Sidebar from "../../components/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

export default function Buttons() {
  const { data: session, status } = useSession(); // Add status to check loading state
  const username = session?.user?.name || "Guest";
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [buttons, setButtons] = useState<Array<{
    type: string;
    title: string;
    html?: string;
    css?: string;
    imgurl?: string;
    notes?: string;
  }>>([]);

  useEffect(() => {
    if (!session) return;

    const fetchButtons = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("buttons")
        .eq("email", session.user?.email)
        .single();

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      setButtons(data?.buttons || []);
    };

    fetchButtons();
  }, [session, supabase]);

  // Show loading state instead of "Please log in"
  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return <div className="h-screen flex items-center justify-center">Please log in</div>;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const type = formData.get("type") as string;
    const title = formData.get("title") as string;
    const notes = formData.get("notes") as string;
    let newButton;
    if (type === "html_css") {
      const html = formData.get("html") as string;
      const css = formData.get("css") as string;
      newButton = { type, title, html, css, notes };
    } else if (type === "image") {
      const imgurl = formData.get("imgurl") as string;
      newButton = { type, title, imgurl, notes };
    } else {
      return;
    }
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
    const { error: updateError } = await supabase
      .from("users")
      .update({ buttons: updatedButtons })
      .eq("email", session?.user?.email);

    if (updateError) {
      console.error("Error updating data:", updateError);
      return;
    }
    setButtons(updatedButtons);
    (document.getElementById("add-button-dialog") as HTMLDialogElement).close();
    router.refresh();
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
        <div className="flex flex-wrap gap-8 py-10">
          <div className="flex items-center justify-center w-[300px] h-[300px]">
            {/* Add min-width to dialog */}
            <dialog id="add-button-dialog" className="rounded-lg p-6 w-[500px] min-w-[500px]">
              <form onSubmit={handleSubmit}>
                <h1 className="text-[18px] font-semibold w-full mb-[19px]">
                  Add new button component
                </h1>
                <Tabs defaultValue="html_css" className="w-full"> {/* Set default value to html_css */}
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="html_css">HTML + CSS</TabsTrigger>
                    <TabsTrigger value="image">Image + Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="html_css">
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
                        className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1 bg-black text-green-500 min-h-32"
                      />
                      <h1 className="opacity-60 text-[13px]">CSS</h1>
                      <textarea
                        name="css"
                        className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1 bg-black text-green-500 min-h-32"
                      />
                    </div>
                    <div className="flex justify-end w-full gap-6">
                      <button
                        type="button"
                        onClick={() =>
                          (document.getElementById("add-button-dialog") as HTMLDialogElement).close()
                        }
                        className="flex py-2 px-[20px] rounded-[6px] bg-[#E6E6E6]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-2 px-[26px] text-white bg-[#AB00D6] rounded-[6px]"
                      >
                        Add
                      </button>
                    </div>
                  </TabsContent>
                  <TabsContent value="image">
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
                        required
                        type="url"
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
                      <button
                        type="button"
                        onClick={() =>
                          (document.getElementById("add-button-dialog") as HTMLDialogElement).close()
                        }
                        className="flex py-2 px-[20px] rounded-[6px] bg-[#E6E6E6]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="py-2 px-[26px] text-white bg-[#AB00D6] rounded-[6px]"
                      >
                        Add
                      </button>
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            </dialog>
            <button
              className="flex flex-col w-24 h-24 border-[1px] border-[#E6E6E6] items-center justify-center rounded-[10px] gap-2 hover:shadow-[0_0px_12px_2px_rgba(0,0,0,0.1)]"
              onClick={() =>
                (document.getElementById("add-button-dialog") as HTMLDialogElement).showModal()
              }
            >
              <Image
                src="/+.png"
                alt="yo"
                width={32}
                height={32}
                className="translate-y-2"
              />
              <h1 className="translate-y-1">Add new</h1>
            </button>
          </div>
          {buttons.map((button, index) => (
            <div key={index}>
              <dialog id={`button-dialog-${index}`} className="rounded-lg p-6 w-[500px] min-w-[500px]">
                <h1 className="mb-[10px] text-[#AB00D6] w-[62px] font-semibold text-[20px]">{button.title}</h1>
                {button.type === "html_css" ? (
                  <>
                    <div className="py-4">
                      <h1 className="opacity-60 text-[13px]">HTML</h1>
                      <textarea
                        readOnly
                        value={button.html}
                        className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1 bg-black text-white min-h-32"
                      />
                    </div>
                    <div className="py-4">
                      <h1 className="opacity-60 text-[13px]">CSS</h1>
                      <textarea
                        readOnly
                        value={button.css}
                        className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1 bg-black text-white min-h-32"
                      />
                    </div>
                    <div className="py-4">
                      <h1 className="opacity-60 text-[13px]">Notes</h1>
                      <textarea
                        readOnly
                        value={button.notes}
                        className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="py-4">
                      <h1 className="opacity-60 text-[13px]">Image URL</h1>
                      <input
                        readOnly
                        type="url"
                        value={button.imgurl}
                        className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                      />
                    </div>
                    <div className="py-4">
                      <h1 className="opacity-60 text-[13px]">Notes</h1>
                      <textarea
                        readOnly
                        value={button.notes}
                        className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                      />
                    </div>
                  </>
                )}
                <button
                  type="button"
                  onClick={() =>
                    (document.getElementById(`button-dialog-${index}`) as HTMLDialogElement).close()
                  }
                  className="flex py-2 px-[20px] rounded-[6px] bg-[#E6E6E6]"
                >
                  Close
                </button>
              </dialog>
              <div
                className="flex flex-col items-center justify-center h-[320px] w-[300px] border border-[#E6E6E6] rounded-[10px] hover:shadow-[0_2px_7px_2px_rgba(0,0,0,0.1)] transition cursor-pointer p-4 gap-2"
                onClick={() =>
                  (document.getElementById(`button-dialog-${index}`) as HTMLDialogElement).showModal()
                }
              >
                {button.type === "html_css" ? (
                  <>
                    <div className="flex-1 flex w-full overflow-auto bg-[#e9e9e9] rounded-[6px] items-center justify-center">
                      {/* Replace style and dangerouslySetInnerHTML with iframe */}
                      <iframe
                        srcDoc={`
                          <!DOCTYPE html>
                          <html>
                            <head>
                              <style>${button.css || ""}body {display: flex; align-items: center; justify-content: center; height: 92vh;}</style>
                            </head>
                            <body>${button.html || ""}</body>
                          </html>
                        `}
                        className="w-full h-full"
                      />
                    </div>
                    <h1 className="text-lg">{button.title}</h1>
                  </>
                ) : (
                  <>
                    <div className="flex w-full overflow-auto bg-[#e9e9e9] rounded-[6px] items-center justify-center h-full">
                      <Image
                        src={button.imgurl || "/default-image.png"}
                        alt={button.title}
                        width={200}
                        height={100}
                        className="max-h-[252px]"
                      />
                    </div>
                    <h1 className="text-lg">{button.title}</h1>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}