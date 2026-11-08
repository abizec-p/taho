import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";

export default function Hero() {
  return (
    <>
      <div className="flex bg-neutral-100 relative justify-between h-full py-20 items-center px-40">
        <div className="w-150 ">
          <div>
            <h1 className="text-6xl text-green-900 font-bold">
              A Taste of Home, Wherever You Are.
            </h1>
            <p className="w-120 text-black/70 pt-2">
              Enjoy homemade meals from people nearby, made with love and
              delivered fresh to your door.
            </p>
          </div>
          <div className=" bg-white flex items-center gap-2 mt-10 w-120 border-black/10 rounded-xl px-4  justify-between py-2 relative">
            <div className="flex items-center gap-2">
              <CiSearch />

              <input
                type="text"
                className="outline-none text-sm w-80"
                placeholder="Search noodles, healthy or ..."
              />
            </div>
            <div>
              <button className="px-2 py-1 bg-green-800 text-sm text-white/90 font-bold rounded-md ">
                Search
              </button>
            </div>
          </div>
        </div>

        <div>
          <Image
            src="/momoimg.png"
            alt="Momo image"
            width={1000}
            height={1000}
            className="h-80 rounded-xl border border-black/10 w-auto"
          />
        </div>
        <div className="absolute animate-bounce left-1/2   bottom-5 ">
          {" "}
          <IoIosArrowDown  />
        </div>
      </div>
    </>
  );
}
