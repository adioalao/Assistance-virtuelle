'use client';

import { usePathname } from "next/navigation";
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ReactNode } from "react";

export default function Pathname() {
    const pathname = (usePathname() ?? '').split('/').filter(s => s !== '');
    let arrayPathname: ReactNode[] = [];
    pathname.map((s) => {
        arrayPathname.push(<BreadcrumbSeparator key={`sep-${s}`} className="hidden md:block" />)
        arrayPathname.push(<BreadcrumbItem key={`item-${s}`} className="hidden md:block"><BreadcrumbPage>{s}</BreadcrumbPage></BreadcrumbItem>)
    })

    return (
        < BreadcrumbList >
            <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                    Home
                </BreadcrumbLink>
            </BreadcrumbItem>
            {arrayPathname}
        </BreadcrumbList >
    )
}