import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const clean = (v: unknown, max: number) =>
  String(v ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, max);

function splitName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { name: "Neuvedené", surname: "-" };
  if (parts.length === 1) return { name: parts[0], surname: "-" };
  return { name: parts[0], surname: parts.slice(1).join(" ") };
}

function formatPayload(data: Record<string, unknown>) {
  const lines = [`Zdroj: ${clean(data.source, 80)}`, `Čas: ${clean(data.createdAt, 40)}`];
  if (data.inputs) lines.push("", "Vstupy:", JSON.stringify(data.inputs, null, 2));
  if (data.results) lines.push("", "Výsledky:", JSON.stringify(data.results, null, 2));
  if (data.consentText) lines.push("", `Súhlas: ${clean(data.consentText, 400)}`);
  return lines.join("\n").slice(0, 8000);
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    let data: Record<string, unknown>;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    if (data.website) {
      return NextResponse.json({ ok: true });
    }

    const fullName = clean(data.name, 120);
    const email = clean(data.email, 200);
    const phone = clean(data.phone, 40);

    if (data.consent !== true || (!email && !phone)) {
      return NextResponse.json({ ok: false }, { status: 422 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ ok: false }, { status: 422 });
    }

    const { name, surname } = splitName(fullName);
    const emailForDb = email || "nezadany@kalkulacka.local";

    await prisma.contactSubmission.create({
      data: {
        name,
        surname,
        email: emailForDb,
        phone: phone || null,
        message: formatPayload(data),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("kalkulacka-kontakt error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
