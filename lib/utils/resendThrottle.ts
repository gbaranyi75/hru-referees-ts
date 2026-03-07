import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Resend limit: 2 requests per second. Space sends so we stay under limit within one instance. */
const MIN_INTERVAL_MS = 550;
/** When Resend returns 429, wait this long before retry (past the 1s window). */
const RETRY_DELAY_MS = 1100;
const MAX_RETRIES = 3;

function isRateLimitError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err &&
    (err as { statusCode?: number }).statusCode === 429
  );
}

let lastSendTime = 0;
type ResendSendResult = Awaited<ReturnType<Resend["emails"]["send"]>>;
let sendChain: Promise<ResendSendResult> = Promise.resolve(
  undefined as unknown as ResendSendResult
);

/**
 * Sends an email via Resend with:
 * - Throttle (550ms between sends) when multiple sends happen in the same process.
 * - Retry on 429: if Resend returns rate_limit_exceeded, wait 1.1s and retry (up to MAX_RETRIES).
 *   This handles serverless where each request can be a different instance and throttle is not shared.
 */
export async function throttledResendSend(
  options: Parameters<Resend["emails"]["send"]>[0]
): Promise<ResendSendResult> {
  sendChain = sendChain.then(async () => {
    const now = Date.now();
    const elapsed = now - lastSendTime;
    if (elapsed < MIN_INTERVAL_MS) {
      await new Promise((r) =>
        setTimeout(r, MIN_INTERVAL_MS - elapsed)
      );
    }
    lastSendTime = Date.now();

    let lastResult: ResendSendResult = await resend.emails.send(options);
    let attempts = 1;

    while (
      lastResult?.error &&
      isRateLimitError(lastResult.error) &&
      attempts < MAX_RETRIES
    ) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      lastSendTime = Date.now();
      lastResult = await resend.emails.send(options);
      attempts += 1;
    }

    return lastResult;
  });
  return sendChain;
}
