import { getServerSession, NextAuthOptions } from "next-auth";
import { CalendarIcon, Bell, Cat, Camera } from "lucide-react";
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
import { User } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
// Initialize Supabase client
const supabase = createServerComponentClient({ cookies });


export default async function Components() {

  const session = await getServerSession(authOptions as NextAuthOptions);
  const username = session?.user?.name || "Guest";
  if (!session) {
    return <p>Please log in</p>;
  }

  // Fetch `types_c` and `types_nc` from Supabase
  const { data, error } = session?.user?.email
    ? await supabase
        .from("users")
        .select("types_c, types_nc")
        .eq("email", session.user.email)
        .single()
    : { data: null, error: new Error("Session or user email is missing") };

  if (error) {
    console.error("Error fetching data:", error);
    return <p>Error loading components</p>;
  }

  const types_c: string[] = data?.types_c || [];
  const types_nc: string[] = data?.types_nc || [];

  async function handleSubmit(formData: FormData) {
    "use server"; // Ensures this runs server-side
    const selectedType = formData.get("componentType") as string;
    if (!selectedType) return;

    // Fetch the latest user data again inside the function
    const { data, error } = await supabase
      .from("users")
      .select("types_c, types_nc")
      .eq("email", session?.user?.email)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return;
    }

    const types_c: string[] = data?.types_c || [];
    const types_nc: string[] = data?.types_nc || [];

    // Update `types_c` and `types_nc`
    const updatedTypesC = [...types_c, selectedType];
    const updatedTypesNC = types_nc.filter((type) => type !== selectedType);

    const { error: updateError } = await supabase
      .from("users")
      .update({
        types_c: updatedTypesC,
        types_nc: updatedTypesNC,
      })
      .eq("email", session?.user?.email);

    if (updateError) {
      console.error("Error updating data:", updateError);
      return;
    }

    // Reload the page after updating
    redirect("/dashboard/components");
  }

  // Predefined component types and their associated UI
  const allComponents = [
    {
      type: "Avatars",
      element: (
        <button className="flex rounded-full font-semibold text-[18px] p-2 bg-gradient-to-t from-[#000000] to-[#fb00ff] w-[38px] h-[38px] items-center justify-center my-[88px] mx-[102px]">
          <User className="size-[20px] text-white" />
        </button>
      ),
    },
    {
      type: "Buttons",
      element: (
        <button className="flex text-white px-6 py-2 bg-black rounded-[6px] mx-16 my-[86px]">
          No, Cancel
        </button>
      ),
    },
    {
      type: "Calendars",
      element: (
        <button className="flex gap-32 items-center text-black px-2 py-2 bg-white rounded-[6px] mx-6 my-[86px] border-[#E6E6E6] border">
          Pick <CalendarIcon className="size-[20px] opacity-70" />
        </button>
      ),
    },
    {
      type: "Cards",
      element: (
        <button className="flex flex-col items-center justify-center gap-6 text-black px-[26px] py-2 bg-white rounded-[20px] mx-[60px] my-[40px]">
          <User className="size-[70px] text-purple-600" /> John
        </button>
      ),
    },
    {
      type: "Input fields",
      element: (
        <input
          placeholder="Enter email"
          className="w-56 flex justify-between text-white px-1 py-2 bg-white rounded-[6px] mx-2 my-[86px]"
        />
      ),
    },
    {
      type: "Icons",
      element: (
        <button className="flex gap-2 text-white px-6 py-2 rounded-[6px] mx-[45px] my-[88.2px]">
          <CalendarIcon className="size-[20px] text-black" />
          <Bell className="size-[20px] text-black" />
          <Cat className="size-[20px] text-black" />
          <Camera className="size-[20px] text-black" />
        </button>
      ),
    },
  ];

  return (
    <div className="h-[100vh] flex justify-between items-center">
      <div className="ml-[1vw] fixed">
        <Sidebar username={username} />
      </div>
      <div>
        <div className="w-[290px] h-[98vh]">.</div>
      </div>
      <div className="flex-grow flex-col h-full py-6">
        <h1 className="text-[32px] font-semibold">Components</h1>
        <h2 className="opacity-60">
          All component types can be seen and created here.
        </h2>

        {/* Grid for displaying connected component types */}
        <div className="flex flex-wrap gap-8 py-10">
          {/* Add new component button */}
          <div className="flex items-center justify-center w-[270px] h-[270px]">
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
                    Add new component type
                  </h1>
                </DialogHeader>
                <form action={handleSubmit}>
                  <div className="py-6">
                    <h1 className="opacity-60 text-[13px]">Type</h1>
                    <select
                      name="componentType"
                      className="border-[1px] border-[#E6E6E6] rounded-[6px] p-2 w-full my-1"
                      required
                    >
                      {types_nc.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end w-full gap-6">
                    <DialogClose>
                      <button className="flex py-2 px-[20px] rounded-[6px] bg-[#E6E6E6]">
                        Cancel
                      </button>
                    </DialogClose>
                    <DialogClose>
                      <button
                        type="submit"
                        className="py-2 px-[26px] text-white bg-[#AB00D6] rounded-[6px]"
                      >
                        Add
                      </button>
                    </DialogClose>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Display only components that exist in `types_c` */}
          {allComponents
            .filter((comp) => types_c.includes(comp.type))
            .map((comp) => (
              <Link
                key={comp.type}
                href={`/componentTypes/${comp.type.toLowerCase()}`}
                className="flex flex-col items-center justify-center h-[270px] w-[270px] border border-[#E6E6E6] rounded-[10px] hover:shadow-[0_2px_7px_2px_rgba(0,0,0,0.1)] transition cursor-pointer"
              >
                <div className="m-2 flex items-center justify-center rounded-[6px] bg-[#F0F0F0]">
                  {comp.element}
                </div>
                <h1>{comp.type}</h1>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}