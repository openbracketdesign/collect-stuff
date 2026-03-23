import { cx } from "class-variance-authority";
import type { ReactNode } from "react";
import Breadcrumbs from "./Breadcrumbs";
import Logo from "./Logo";

export function PageTitleContent({
  breadcrumbs,
  title,
  children: RightContent,
  mobile,
}: {
  breadcrumbs: Array<{
    name: string;
    href: string;
  }>;
  title: string;
  children?: ReactNode;
  mobile?: boolean;
}) {
  return (
    <>
      <div className={mobile ? "px-6 pt-6 md:hidden" : "grow"}>
        {breadcrumbs.length > 0 && (
          <Breadcrumbs crumbs={breadcrumbs} mobile={mobile} />
        )}

        <h1
          className={cx(
            mobile
              ? "leading-8 md:hidden"
              : "hidden leading-6 md:block md:text-left md:text-4xl lg:text-5xl",
            "text-4xl font-bold tracking-tight text-primary",
          )}
        >
          {title}
        </h1>
      </div>

      <div
        className={
          mobile ? "mt-6 px-6 empty:hidden md:hidden" : "hidden md:block"
        }
      >
        {RightContent}
      </div>

      {!mobile && (
        <div className='flex gap-2 md:hidden'>
          <Logo />
        </div>
      )}
    </>
  );
}
