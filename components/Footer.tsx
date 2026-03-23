export function Footer() {
  return (
    <div className="mt-auto border-t px-6 py-4 text-sm">
      <div className="flex h-10 items-center justify-end text-gray-400">
        &copy; {new Date().getFullYear()} CollectStuff. All rights reserved.
      </div>
    </div>
  );
}
