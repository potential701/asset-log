import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { SessionPayload } from "@/lib/types";
import { cookies } from "next/headers";
import { db } from "@/db/drizzle";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

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
  try {
    const { payload } = await jwtVerify(session, encodedKey, { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
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

  if (!sessionCookie || !session) return null;

  const sessionPayload = session as SessionPayload;

  const dbData = await db.select().from(user).where(eq(user.id, sessionPayload.id));

  if (dbData.length === 0) return null;

  return sessionPayload;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
