import { TSessionProps } from "../../types/types";
import { useSession } from "next-auth/client";
import React from "react";
import Layout from "../components/layout/Layout";
import AccessDenied from "../components/auth/AccessDenied";

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
        <Layout>
          <AccessDenied />
        </Layout>
      );
    }

    return (
      <Layout>
        <Component session={session} {...props} />
      </Layout>
    );
  };
}
