const GEMINI_MODELS = ["gemini-3.8-flash", "gemini-2.5-flash"];
const RETRYABLE = [429, 500, 502, 503, 504];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function geminiFetch(
  apiKey: string,
  init: RequestInit
): Promise<Response> {
  let last: Response | null = null;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          init
        );
        if (res.ok) return res;
        last = res;

        const text = await res.clone().text();
        const modelGone =
          res.status === 404 || text.includes("no longer available");
        if (modelGone) break;

        if (!RETRYABLE.includes(res.status)) return res;
      } catch {
        // tarmoq xatosi: qayta uriniladi
      }
      await sleep(1000 * 2 ** attempt + Math.random() * 500);
    }
  }

  if (last) return last;
  throw new Error("GEMINI_UNAVAILABLE");
}

export function friendlyGeminiError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (msg.includes("high demand") || msg.includes("GEMINI_UNAVAILABLE")) {
    return "Server hozir band. Iltimos, bir daqiqadan keyin qayta urinib ko'ring.";
  }
  if (msg.includes("API_KEY") || msg.includes("403")) {
    return "Xizmat sozlamasida xatolik bor. Iltimos, keyinroq urinib ko'ring.";
  }
  return "Tahlil vaqtincha ishlamadi. Iltimos, qayta urinib ko'ring.";
}