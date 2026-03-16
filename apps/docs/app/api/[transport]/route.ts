import { NextResponse } from 'next/server';

// TODO: Replace with @hanzo/search integration using api.hanzo.ai
// This was upstream's Orama/Inkeep MCP handler — needs Hanzo equivalent

export function GET() {
  return NextResponse.json({ status: 'search endpoint not configured' }, { status: 501 });
}

export function POST() {
  return NextResponse.json({ status: 'search endpoint not configured' }, { status: 501 });
}

export function DELETE() {
  return NextResponse.json({ status: 'search endpoint not configured' }, { status: 501 });
}
