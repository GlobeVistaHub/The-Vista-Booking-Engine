"use server";

export async function simulateServerErrorAction() {
  throw new Error("Sentry Test: Simulated Server Action Failure");
}
