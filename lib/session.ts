import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { SessionPayload } from "@/lib/types/session-payload";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);

async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2d")
    .sign(encodedKey);
}

async function decrypt(session: string | undefined = "") {
  const { payload } = await jwtVerify(session, encodedKey, { algorithms: ["HS256"] });
  return payload;
}

export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const session = await encrypt(payload);
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  const session = await decrypt(sessionCookie);

  if (!sessionCookie || !session) {
    return null;
  }

  return session as SessionPayload;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
