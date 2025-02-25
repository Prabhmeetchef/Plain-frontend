"use client";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Sidebar from "../../components/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Typefaces() {
  const { data: session, status } = useSession();
  const username = session?.user?.name || "Guest";
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [typefaces, setTypefaces] = useState<
    Array<{
      title: string;
      font: string;
      notes?: string;
    }>
  >([]);
  const [googleFonts, setGoogleFonts] = useState<string[]>([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (!session) return;

    const fetchTypefaces = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("typefaces")
        .eq("email", session.user?.email)
        .single();

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      setTypefaces(data?.typefaces || []);
    };

    fetchTypefaces();
  }, [session, supabase]);

  useEffect(() => {
    const fetchGoogleFonts = async () => {
      try {
        const response = await fetch(
          "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCV3KpoGTejtCVZQduxakAkVhESO4RaUJY"
        );
        const data = await response.json();
        setGoogleFonts(data.items.map((font: { family: string }) => font.family));
      } catch (error) {
        console.error("Error fetching Google Fonts:", error);
      }
    };

    fetchGoogleFonts();
  }, []);

  useEffect(() => {
    if (typefaces.length > 0) {
      const fontFamilies = typefaces.map((typeface) => typeface.font).join("|");
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css?family=${fontFamilies.replace(/ /g, "+")}`;
      link.rel = "stylesheet";
      link.onload = () => setFontsLoaded(true);
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [typefaces]);

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
    const font = formData.get("font") as string;
    const notes = formData.get("notes") as string;

    const newTypeface = { title, font, notes };

    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("typefaces")
      .eq("email", session?.user?.email)
      .single();

    if (fetchError) {
      console.error("Error fetching user data:", fetchError);
      return;
    }
    const updatedTypefaces = [...(userData?.typefaces || []), newTypeface];
    const { error: updateError } = await supabase
      .from("users")
      .update({ typefaces: updatedTypefaces })
      .eq("email", session?.user?.email);
    if (updateError) {
      console.error("Error updating data:", updateError);
      return;
    }
    setTypefaces(updatedTypefaces);
    (
      document.getElementById("add-typeface-dialog") as HTMLDialogElement
    ).close();
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
        <h1 className="text-[32px] font-semibold">Typeface</h1>
        <h2 className="opacity-60">
          All typeface components can be seen and created here.
        </h2>
        <div className="flex flex-wrap gap-8 py-10">
          <div className="flex items-center justify-center w-[300px] h-[300px]">
            <dialog
              id="add-typeface-dialog"
              className="rounded-lg p-6 w-[500px] min-w-[500px]"
            >
              <form onSubmit={handleSubmit}>
                <h1 className="text-[18px] font-semibold w-full mb-[19px]">
                  Add typeface
                </h1>
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
                  <h1 className="opacity-60 text-[13px]">Font (Google fonts)</h1>
                  <select
                    name="font"
                    className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                    required
                  >
                    {googleFonts.map((font, index) => (
                      <option key={index} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
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
                          "add-typeface-dialog"
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
                    "add-typeface-dialog"
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

          {typefaces.map((typeface, index) => (
            <div key={index}>
              <dialog
                id={`typeface-dialog-${index}`}
                className="rounded-lg p-6 w-[500px] min-w-[500px]"
              >
                <h1 className="mb-[10px] text-[#AB00D6] font-semibold text-[20px] w-[200px]">
                  {typeface.title}
                </h1>
                <div className="py-4">
                  <h1 className="opacity-60 text-[13px]">Font</h1>
                  <textarea
                    readOnly
                    value={typeface.font}
                    className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                  />
                </div>
                <div className="py-4">
                  <h1 className="opacity-60 text-[13px]">Notes</h1>
                  <textarea
                    readOnly
                    value={typeface.notes}
                    className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    (
                      document.getElementById(
                        `typeface-dialog-${index}`
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
                      `typeface-dialog-${index}`
                    ) as HTMLDialogElement
                  ).showModal()
                }
              >
                <div className="bg-[#e9e9e9] flex w-full rounded-[6px] items-center justify-center h-full text-center">
                  {fontsLoaded ? (
                    <h1
                      style={{ fontFamily: typeface.font }}
                      className="rounded-[6px] p-2 w-full my-1 max-w-[200px] text-[32px]"
                    >
                      {typeface.font}
                    </h1>
                  ) : (
                    <h1 className="rounded-[6px] p-2 w-full my-1 max-w-[200px] text-[32px]">
                      Loading font...
                    </h1>
                  )}
                </div>
                <h1 className="text-lg">{typeface.title}</h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}