import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/clerk-react";

export default function Dashboard() {
  return (
    <div className="p-5">
      <SignedIn>
        <h1 className="text-2xl font-bold text-center">Welcome to Dashboard 🎉</h1>
        <div className="flex justify-center mt-4">
          <UserButton />
        </div>
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
}
