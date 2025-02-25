"use client";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Sidebar from "../../components/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Colors() {
  const { data: session, status } = useSession(); // Add status to check loading state
  const username = session?.user?.name || "Guest";
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [colors, setColors] = useState<
    Array<{
      title: string;
      colortag?: string;
      notes?: string;
    }>
  >([]);

  useEffect(() => {
    if (!session) return;

    const fetchColors = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("colors")
        .eq("email", session.user?.email)
        .single();

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      setColors(data?.colors || []);
    };

    fetchColors();
  }, [session, supabase]);

  // Show loading state instead of "Please log in"
  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center">
        Please log in
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const title = formData.get("title") as string;
    const notes = formData.get("notes") as string;

    const colortag = formData.get("colortag") as string;
    const newColor = { title, colortag, notes };

    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("colors")
      .eq("email", session?.user?.email)
      .single();

    if (fetchError) {
      console.error("Error fetching user data:", fetchError);
      return;
    }

    const updatedColors = [...(userData?.colors || []), newColor];

    const { error: updateError } = await supabase
      .from("users")
      .update({ colors: updatedColors })
      .eq("email", session?.user?.email);

    if (updateError) {
      console.error("Error updating data:", updateError);
      return;
    }

    setColors(updatedColors);
    (document.getElementById("add-color-dialog") as HTMLDialogElement).close();
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
        <h1 className="text-[32px] font-semibold">Colors</h1>
        <h2 className="opacity-60">
          All color components can be seen and created here.
        </h2>

        <div className="flex flex-wrap gap-8 py-10">
          <div className="flex items-center justify-center w-[300px] h-[300px]">
            {/* Add min-width to dialog */}
            <dialog
              id="add-color-dialog"
              className="rounded-lg p-6 w-[500px] min-w-[500px]"
            >
              <form onSubmit={handleSubmit}>
                <h1 className="text-[18px] font-semibold w-full mb-[19px]">
                  Add color 
                </h1>
                <div id="image_fields" className="py-4">
                  <h1 className="opacity-60 text-[13px]">
                    {" "}
                    Color code (Hex or RGB)
                  </h1>
                  <input
                    required
                    type="text"
                    name="colortag"
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
                      (
                        document.getElementById(
                          "add-color-dialog"
                        ) as HTMLDialogElement
                      ).close()
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
              </form>
            </dialog>
            <button
              className="flex flex-col w-24 h-24 border-[1px] border-[#E6E6E6] items-center justify-center rounded-[10px] gap-2 hover:shadow-[0_0px_12px_2px_rgba(0,0,0,0.1)]"
              onClick={() =>
                (
                  document.getElementById(
                    "add-color-dialog"
                  ) as HTMLDialogElement
                ).showModal()
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

          {colors.map((color, index) => (
            <div key={index}>
              <dialog
                id={`color-dialog-${index}`}
                className="rounded-lg p-6 w-[500px] min-w-[500px]"
              >
                <h1 className="mb-[10px] text-[#AB00D6] font-semibold text-[20px] w-[200px]">
                  {color.title}
                </h1>

                <div className="py-4">
                  <h1 className="opacity-60 text-[13px]">Color code</h1>
                  <input
                    readOnly
                    type="text"
                    value={color.colortag}
                    className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                  />
                </div>
                <div className="py-4">
                  <h1 className="opacity-60 text-[13px]">Notes</h1>
                  <textarea
                    readOnly
                    value={color.notes}
                    className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    (
                      document.getElementById(
                        `color-dialog-${index}`
                      ) as HTMLDialogElement
                    ).close()
                  }
                  className="flex py-2 px-[20px] rounded-[6px] bg-[#E6E6E6]"
                >
                  Close
                </button>
              </dialog>
              <div
                className="flex flex-col items-center justify-center h-[320px] w-[300px] border border-[#E6E6E6] rounded-[10px] hover:shadow-[0_2px_7px_2px_rgba(0,0,0,0.1)] transition cursor-pointer p-4 gap-2"
                onClick={() =>
                  (
                    document.getElementById(
                      `color-dialog-${index}`
                    ) as HTMLDialogElement
                  ).showModal()
                }
              >
                <div className="flex w-full bg-[#e9e9e9] rounded-[6px] items-center justify-center h-full">
                  <div
                    className={`flex items-center justify-center rounded-[6px] w-full h-full bg-[${color.colortag}]`}
                  >{color.colortag}</div>
                </div>
                <h1 className="text-lg">{color.title}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
