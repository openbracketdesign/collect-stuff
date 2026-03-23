import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowRightCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  return (
    <main className='flex grow flex-col'>
      <div className='flex grow flex-col px-8 pb-8 pt-12 sm:p-12 md:p-16'>
        <h1 className='text-[4.5rem] font-extrabold leading-[0.8em] tracking-tight xs:text-[6rem] sm:text-[9rem] md:text-[12rem] lg:text-[15rem]'>
          <span className='text-gray-700'>Collect</span>
          <br />
          <span className='text-primary'>Stuff</span>
        </h1>

        <div className='mt-12 flex flex-col-reverse gap-8 lg:mt-auto lg:flex-row lg:justify-between'>
          <p className='text-sm text-gray-700 lg:self-end'>
            {/* Manage, share and discover stuff. */}
            &copy; {new Date().getFullYear()} CollectStuff. All rights reserved.
          </p>

          <div className='lg:mt-auto lg:self-end lg:text-right'>
            <SignedOut>
              <h2 className='text-xl text-primary sm:mb-1'>
                Sign in to see your stuff
              </h2>

              <h2 className='mb-4 text-xl text-primary'>
                or sign up to start collecting
              </h2>

              <SignInButton forceRedirectUrl='/collections'>
                <Button size='lg'>
                  Start here <LogIn />
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <h2 className='mb-4 text-xl text-primary'>
                Go and check out your stuff
              </h2>

              <Link href='/collections' className='lg:mt-auto lg:self-end'>
                <Button size='lg'>
                  My Collections <ArrowRightCircle />
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </div>
    </main>
  );
}
