import { cx } from "class-variance-authority"
import type { ReactNode } from "react"
import Breadcrumbs from "./Breadcrumbs"
import Logo from "./Logo"

export function PageTitleContent({
  breadcrumbs,
  title,
  children: RightContent,
  mobile,
}: {
  breadcrumbs: Array<{
    name: string
    href: string
  }>
  title: string
  children?: ReactNode
  mobile?: boolean
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
              ? "md:hidden"
              : "md:block md:text-left md:text-4xl lg:text-5xl hidden",
            "text-4xl font-bold tracking-tight text-primary leading-[1]"
          )}
        >
          {title}
        </h1>
      </div>

      <div
        className={
          mobile
            ? "mt-4 px-6 md:hidden empty:hidden"
            : "md:block mb-1 ml-6 hidden self-end"
        }
      >
        {RightContent}
      </div>

      {!mobile && (
        <div className="gap-2 md:hidden flex">
          <Logo />
        </div>
      )}
    </>
  )
}
