import { type ReactNode } from "react";
import { Hamburger } from "./Hamburger";
import { PageTitleContent } from "./PageTitleContent";

export function PageTitle({
  breadcrumbs = [],
  title,
  children: RightContent,
}: {
  breadcrumbs?: Array<{
    name: string;
    href: string;
  }>;
  title: string;
  children?: ReactNode;
}) {
  return (
    <>
      <div className="top-0 px-6 py-4 text-primary backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky flex items-center border-b">
        <Hamburger />

        <PageTitleContent breadcrumbs={breadcrumbs} title={title}>
          {RightContent}
        </PageTitleContent>
      </div>

      <PageTitleContent breadcrumbs={breadcrumbs} title={title} mobile>
        {RightContent}
      </PageTitleContent>
    </>
  );
}
