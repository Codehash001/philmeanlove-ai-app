import React, { useState } from "react";
import datasetData from '../data.json'
import {
    Accordion,
    AccordionHeader,
    AccordionBody,
  } from "@material-tailwind/react";
import Link from "next/link";

  export default function Sidebar(){

    const [open, setOpen] = useState(0);
   
    const handleOpen = (value: any) => {
      setOpen(open === value ? 0 : value);
    };
   
    const customAnimation = {
      mount: { opacity:1 },
      unmount: { opacity:0 },
    };

    return(
        <div className=" h-screen w-[400px] bg-slate-200 px-4 pt-10 flex flex-col space-y-5">
            <div className="flex flex-row justify-center">
                <div className="rounded-md mx-4 bg-black text-white px-4 py-2 mb-2">Current dataset details</div>
            </div>
            <div>
            </div>
            <div className="flex flex-row justify-center mt-5">
                <Link href="/ingest">
                <div className="rounded-md mx-4 bg-blue-400 text-white px-4 py-2 mb-2 hover:bg-blue-500">Create a new dataset</div>
                </Link>
            </div>
        </div>
    )
}


