import { createHmac, randomInt, timingSafeEqual } from "crypto";

const CAPTCHA_MAX_AGE_MS = 20 * 60 * 1000;
const DEFAULT_CAPTCHA_SECRET = "temporary-bespoke-cms-captcha-secret";

type CaptchaPayload = {
  answer: number;
  issuedAt: number;
  left: number;
  right: number;
};

export type MathCaptcha = {
  question: string;
  token: string;
};

export function createMathCaptcha(): MathCaptcha {
  const left = randomInt(3, 13);
  const right = randomInt(2, 10);
  const payload: CaptchaPayload = {
    answer: left + right,
    issuedAt: Date.now(),
    left,
    right,
  };
  const encodedPayload = encodePayload(payload);

  return {
    question: `What is ${left} + ${right}?`,
    token: `${encodedPayload}.${sign(encodedPayload)}`,
  };
}

export function verifyMathCaptcha(token: string, submittedAnswer: string) {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature || !safeCompare(signature, sign(encodedPayload))) {
    return false;
  }

  const payload = decodePayload(encodedPayload);

  if (!payload || Date.now() - payload.issuedAt > CAPTCHA_MAX_AGE_MS) {
    return false;
  }

  return Number(submittedAnswer.trim()) === payload.answer;
}

function getCaptchaSecret() {
  return (
    process.env.BESPOKE_CMS_CAPTCHA_SECRET ||
    process.env.BESPOKE_CMS_ADMIN_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    DEFAULT_CAPTCHA_SECRET
  );
}

function sign(value: string) {
  return createHmac("sha256", getCaptchaSecret()).update(value).digest("hex");
}

function encodePayload(payload: CaptchaPayload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function decodePayload(value: string): CaptchaPayload | null {
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<CaptchaPayload>;

    if (
      typeof parsed.answer !== "number" ||
      typeof parsed.issuedAt !== "number" ||
      typeof parsed.left !== "number" ||
      typeof parsed.right !== "number"
    ) {
      return null;
    }

    return parsed as CaptchaPayload;
  } catch {
    return null;
  }
}

function safeCompare(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

