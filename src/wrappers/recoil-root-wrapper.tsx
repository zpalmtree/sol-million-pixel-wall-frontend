"use client";

import React from "react";
import { RecoilRoot } from "recoil";

export function RecoilRootWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return <RecoilRoot >{children}</RecoilRoot>;
}
