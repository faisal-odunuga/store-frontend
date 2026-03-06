type ClerkSession = {
  getToken: (options?: { template?: string }) => Promise<string | null>;
};

type ClerkGlobal = {
  loaded?: boolean;
  session?: ClerkSession | null;
  user?: { id?: string | null } | null;
};

declare global {
  interface Window {
    Clerk?: ClerkGlobal;
  }
}

const waitForClerk = (timeoutMs: number = 3000) =>
  new Promise<boolean>((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Clerk?.loaded) return resolve(true);

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      if (window.Clerk?.loaded) {
        window.clearInterval(timer);
        resolve(true);
        return;
      }
      if (Date.now() - startedAt >= timeoutMs) {
        window.clearInterval(timer);
        resolve(false);
      }
    }, 50);
  });

export const getClerkAuth = async () => {
  const loaded = await waitForClerk();
  if (!loaded) {
    return { token: null, userId: null };
  }

  const session = window.Clerk?.session || null;
  const userId = window.Clerk?.user?.id || null;

  if (!session?.getToken) {
    return { token: null, userId };
  }

  const template = process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE;
  const token = template ? await session.getToken({ template }) : await session.getToken();

  return { token, userId };
};
