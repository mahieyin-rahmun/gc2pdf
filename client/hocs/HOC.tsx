import { TSessionProps } from "../../types/types";
import { signIn, signOut, useSession } from "next-auth/client";
import React from "react";

export function withAuth<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
) {
  return function (props: Exclude<P, TSessionProps>) {
    const [session, loading] = useSession();

    if (typeof window !== undefined && loading) {
      return null;
    }

    if (!loading && !session) {
      return (
        <>
          <h2>You don't seem to be logged in</h2>
          <button onClick={() => signIn()}>
            Sign In To Your Google Account
          </button>
        </>
      );
    }

    return (
      <>
        <button onClick={() => signOut()}>Sign Out</button>
        <Component session={session} {...props} />
      </>
    );
  };
}
