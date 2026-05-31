import Link from 'next/link';
import { ArrowRight, ExternalLink, Github, BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative border-b border-fd-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-fd-primary/5 to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 md:py-36 text-center">
          <div className="inline-flex items-center rounded-full border border-fd-border px-4 py-1.5 text-xs text-fd-muted-foreground mb-8 font-mono">
            NIST MPTC submission package
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none">
            Pulsar
          </h1>
          <p className="text-lg md:text-xl text-fd-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            Threshold ML-DSA-65.
          </p>
          <p className="text-base md:text-lg text-fd-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            A 2-round threshold signing and DKG system whose per-party-aggregated
            signature is bit-identical to a single-party FIPS 204 ML-DSA
            signature on the same message and group public key.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-fd-primary px-8 py-4 text-base font-semibold text-fd-primary-foreground hover:opacity-90 transition shadow-lg"
            >
              <BookOpen className="h-5 w-5" />
              Read the docs
            </Link>
            <a
              href="https://github.com/luxfi/pulsar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-fd-border bg-fd-background px-8 py-4 text-base font-semibold hover:bg-fd-muted transition"
            >
              <Github className="h-5 w-5" />
              luxfi/pulsar
            </a>
          </div>
          <p className="text-sm text-fd-muted-foreground">
            Apache-2.0 &middot; Module-LWE &middot; targeting NIST MPTC Class N1 + N4
          </p>
        </div>
      </section>

      {/* Headline claim */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FactCard
            label="Output interchange"
            title="Byte-equal to FIPS 204"
            body="Every signature produced by a Pulsar threshold ceremony verifies under unmodified FIPS 204 ML-DSA.Verify — same wire bytes, no verifier changes."
          />
          <FactCard
            label="Trust footprint"
            title="22 named axioms"
            body="17 narrow implementation-refinement axioms (14 byte-walk + 1 codec round-trip + 2 honest-execution no-reject) plus 5 Lean-bridged algebraic axioms. Zero admits across 13 EasyCrypt files."
          />
          <FactCard
            label="Side channels"
            title="Jasmin-CT blocking"
            body="Threshold layer (round1, round2, combine) is constant-time clean under the verified Jasmin compiler. libjade single-party ML-DSA-65 baseline is pinned."
          />
        </div>
      </section>

      {/* Quick navigation */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Start here</h2>
            <p className="text-fd-muted-foreground">
              The docs are sourced from the pulsar repository at HEAD.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <NavCard
              href="/docs/getting-started"
              title="Getting started"
              body="Install the Go reference, sign with a single party, then run a 3-of-5 threshold ceremony locally."
            />
            <NavCard
              href="/docs/protocol/overview"
              title="Protocol"
              body="2-round threshold sketch, system model, FIPS 204 relationship, Pedersen DKG, parameter sets."
            />
            <NavCard
              href="/docs/proofs/overview"
              title="Proofs"
              body="EasyCrypt theories, Lean Mathlib bridge, byte-walk extraction roadmaps, the 22-axiom inventory."
            />
            <NavCard
              href="/docs/reference/api"
              title="Reference"
              body="Go API surface, KAT format, interoperability harness against cloudflare/circl and pq-crystals."
            />
            <NavCard
              href="/docs/security"
              title="Security"
              body="Disclosure policy, in-scope vs out-of-scope findings, CVE assignment, MPTC public analysis."
            />
            <NavCard
              href="/docs/nist-mptc"
              title="NIST MPTC"
              body="Cover sheet: what NIST receives, target dates (2026-Jul-20 preview, 2026-Nov-16 submission), how to evaluate."
            />
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Why threshold ML-DSA</h2>
        </div>
        <div className="space-y-6 max-w-3xl mx-auto text-fd-muted-foreground leading-relaxed">
          <p>
            NIST FIPS 204 (ML-DSA) is the only NIST-approved post-quantum
            digital signature in 2026. Threshold variants are not yet
            standardized; NIST&apos;s Multi-Party Threshold Cryptography project is
            collecting them now (IR 8214C, January 2026), with the first call
            package deadline expected 2026-Nov-16.
          </p>
          <p>
            Pulsar enters that process with a credible, output-interchangeable
            threshold ML-DSA candidate. The 2-round protocol skeleton is the
            same one Lux ships in production for Ring-LWE in luxfi/corona,
            retargeted to ML-DSA&apos;s polynomial-vector algebra. The resulting
            per-party-aggregated signature (under the v0.3 algebraic
            aggregator) is bit-identical to a single-party FIPS 204 ML-DSA
            signature on the same message and public key.
          </p>
          <p className="text-fd-foreground font-medium">
            The win, if Pulsar&apos;s Sign output is byte-equal to FIPS 204 Sign:
            threshold-produced signatures verify under unmodified FIPS 204
            verifiers, existing FIPS-validated ML-DSA modules consume Pulsar
            certs without code changes, and the threshold layer can be
            Class-N-claimed at NIST without a parallel algorithm standardization
            track.
          </p>
        </div>
      </section>

      {/* Repository tour */}
      <section className="border-t border-fd-border bg-fd-muted/30">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-3">What ships in the submission</h2>
            <p className="text-fd-muted-foreground">
              The pulsar repository is the single canonical home for the
              submission: code, spec, proofs, KAT, tarball-cut tooling.
            </p>
          </div>
          <div className="rounded-xl border border-fd-border bg-fd-background overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-fd-muted/50 border-b border-fd-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Element</th>
                  <th className="text-left px-4 py-3 font-semibold">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-fd-border">
                <RepoRow element="Technical specification" path="spec/pulsar.{tex,pdf}" />
                <RepoRow element="Reference implementation (Go)" path="ref/go/pkg/pulsar/" />
                <RepoRow element="KAT vectors" path="vectors/{dkg,keygen,sign,threshold-sign,verify}.json" />
                <RepoRow element="Class N1 interop harness" path="test/interoperability/n1_class_test.go" />
                <RepoRow element="EasyCrypt theories (13 files)" path="proofs/easycrypt/" />
                <RepoRow element="Lean ↔ EC bridge" path="proofs/lean-easycrypt-bridge.md" />
                <RepoRow element="Jasmin sources" path="jasmin/threshold/{round1,round2,combine}.jazz" />
                <RepoRow element="Constant-time evidence" path="ct/dudect/" />
                <RepoRow element="Lattice estimator scripts" path="estimator/" />
                <RepoRow element="Benchmark harness" path="bench/" />
                <RepoRow element="Per-push gate orchestrator" path="scripts/check-high-assurance.sh" />
                <RepoRow element="Tarball cut tool" path="scripts/cut-submission.sh" />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-fd-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div className="lg:col-span-2">
              <div className="text-lg font-bold mb-3">Pulsar</div>
              <p className="text-sm text-fd-muted-foreground mb-4 max-w-md">
                Threshold ML-DSA-65 by Lux Industries. Apache-2.0. Targeting
                NIST MPTC Class N1 (signing) + N4 (key generation).
              </p>
              <div className="flex gap-4 text-sm">
                <a
                  href="https://github.com/luxfi/pulsar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fd-muted-foreground hover:text-fd-foreground inline-flex items-center gap-1"
                >
                  <Github className="h-3.5 w-3.5" /> luxfi/pulsar
                </a>
                <a
                  href="https://github.com/luxfi/corona"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fd-muted-foreground hover:text-fd-foreground inline-flex items-center gap-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> luxfi/corona (R-LWE sibling)
                </a>
              </div>
            </div>
            <FooterColumn
              title="Read"
              links={[
                { text: 'Getting started', href: '/docs/getting-started' },
                { text: 'Protocol overview', href: '/docs/protocol/overview' },
                { text: 'API reference', href: '/docs/reference/api' },
                { text: 'KAT format', href: '/docs/reference/kat' },
              ]}
            />
            <FooterColumn
              title="Audit"
              links={[
                { text: 'Axiom inventory', href: '/docs/proofs/axiom-inventory' },
                { text: 'Lean ↔ EC bridge', href: '/docs/proofs/lean-bridge' },
                { text: 'Security policy', href: '/docs/security' },
                { text: 'NIST MPTC cover', href: '/docs/nist-mptc' },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-fd-border pt-6 text-xs text-fd-muted-foreground">
            <span>&copy; 2026 Lux Industries, Inc. Apache-2.0.</span>
            <div className="flex gap-4">
              <a href="https://github.com/luxfi/pulsar/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-fd-foreground">License</a>
              <a href="https://github.com/luxfi/pulsar/blob/main/SECURITY.md" target="_blank" rel="noopener noreferrer" className="hover:text-fd-foreground">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FactCard({ label, title, body }: { label: string; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-fd-border bg-fd-background p-6">
      <div className="text-[10px] font-semibold tracking-widest uppercase text-fd-primary mb-2">
        {label}
      </div>
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <p className="text-sm text-fd-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function NavCard({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-fd-border bg-fd-background p-5 hover:bg-fd-muted/30 transition block"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        <ArrowRight className="h-4 w-4 text-fd-muted-foreground group-hover:translate-x-1 transition-transform" />
      </div>
      <p className="text-sm text-fd-muted-foreground leading-relaxed">{body}</p>
    </Link>
  );
}

function RepoRow({ element, path }: { element: string; path: string }) {
  return (
    <tr>
      <td className="px-4 py-2.5">{element}</td>
      <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">{path}</td>
    </tr>
  );
}

function FooterColumn({ title, links }: { title: string; links: { text: string; href: string }[] }) {
  return (
    <div>
      <h4 className="font-semibold text-sm mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.text}>
            <Link
              href={link.href}
              className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition"
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
