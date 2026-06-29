import React from "react";

export default function Skeleton({ className = "", type = "text" }) {
 const baseClass = "animate-pulse bg-neutral-200 rounded";
 if (type === "card") {
 return (
 <div className={`flex flex-col gap-3 ${className}`}>
 <div className={`${baseClass} aspect-[3/4] w-full rounded-xl`} />
 <div className={`${baseClass} h-4 w-3/4 mt-2`} />
 <div className={`${baseClass} h-4 w-1/2`} />
 <div className={`${baseClass} h-5 w-1/3 mt-1`} />
 </div>
 );
 }

 return <div className={`${baseClass} ${className}`} />;
}
