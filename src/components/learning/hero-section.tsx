"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="rounded-2xl bg-gradient-to-b from-sky-100 to-white p-6 sm:p-8">
      <p className="text-sm font-medium text-primary">零基础上班族英语，从听得懂开始</p>
      <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
        戴上耳机，跟着英文、中文、发音提示反复听
      </h1>
      <p className="mt-3 text-base text-slate-600">
        手机端优先设计，适合 iPhone 竖屏，碎片时间每天 10 分钟也能稳步进步。
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/courses" className={buttonVariants({ size: "lg" })}>
          立即开始
        </Link>
        <Link
          href="/listen/office-greeting"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          试听连续听
        </Link>
      </div>
    </section>
  );
}
