"use server";

export async function pingAction(payload: { echo: string }) {
  console.log("Ping action received:", payload);
  return { status: "ok", received: payload.echo };
}
