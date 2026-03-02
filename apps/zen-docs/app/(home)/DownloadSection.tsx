'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const MODELS = [
  {
    id: 'zen-nano',
    name: 'Zen Nano',
    size: '0.6B',
    ram: '~1 GB RAM',
    hf: 'zenlm/zen-nano-0.6b',
    ollama: 'ollama run hf.co/zenlm/zen-nano-0.6b',
    lmstudio: 'zenlm/zen-nano-0.6b',
    gguf: 'https://huggingface.co/zenlm/zen-nano-0.6b',
  },
  {
    id: 'zen-eco',
    name: 'Zen Eco',
    size: '4B',
    ram: '~3 GB RAM',
    hf: 'zenlm/zen-eco-4b',
    ollama: 'ollama run hf.co/zenlm/zen-eco-4b',
    lmstudio: 'zenlm/zen-eco-4b',
    gguf: 'https://huggingface.co/zenlm/zen-eco-4b',
  },
  {
    id: 'zen',
    name: 'Zen (8B)',
    size: '8B',
    ram: '~5 GB RAM',
    hf: 'zenlm/zen-8b',
    ollama: 'ollama run hf.co/zenlm/zen-8b',
    lmstudio: 'zenlm/zen-8b',
    gguf: 'https://huggingface.co/zenlm/zen-8b',
  },
  {
    id: 'zen-pro',
    name: 'Zen Pro',
    size: '32B',
    ram: '~20 GB RAM',
    hf: 'zenlm/zen-pro-32b',
    ollama: 'ollama run hf.co/zenlm/zen-pro-32b',
    lmstudio: 'zenlm/zen-pro-32b',
    gguf: 'https://huggingface.co/zenlm/zen-pro-32b',
  },
  {
    id: 'zen-coder',
    name: 'Zen Coder',
    size: '32B',
    ram: '~20 GB RAM',
    hf: 'zenlm/zen-coder',
    ollama: 'ollama run hf.co/zenlm/zen-coder',
    lmstudio: 'zenlm/zen-coder',
    gguf: 'https://huggingface.co/zenlm/zen-coder',
  },
  {
    id: 'zen-max',
    name: 'Zen Max',
    size: '235B MoE',
    ram: '~48 GB RAM',
    hf: 'zenlm/zen-max',
    ollama: 'ollama run hf.co/zenlm/zen-max',
    lmstudio: 'zenlm/zen-max',
    gguf: 'https://huggingface.co/zenlm/zen-max',
  },
];

type Tab = 'ollama' | 'lmstudio' | 'gguf';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="shrink-0 rounded-lg p-1.5 text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-border transition"
      aria-label="Copy"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function DownloadSection() {
  const [tab, setTab] = useState<Tab>('ollama');
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'ollama', label: 'Ollama' },
    { id: 'lmstudio', label: 'LM Studio' },
    { id: 'gguf', label: 'GGUF / Direct' },
  ];

  return (
    <div className="rounded-2xl border border-fd-border bg-fd-background overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-fd-border px-4 py-3 bg-fd-muted/50">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
              tab === t.id
                ? 'bg-fd-background text-fd-foreground shadow-sm border border-fd-border'
                : 'text-fd-muted-foreground hover:text-fd-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-fd-muted-foreground hidden sm:block">Pick a model →</span>
      </div>

      <div className="grid md:grid-cols-[280px_1fr]">
        {/* Model list */}
        <div className="border-b md:border-b-0 md:border-r border-fd-border p-3 flex md:flex-col gap-2">
          {MODELS.map(m => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m)}
              className={`text-left rounded-xl px-3 py-2.5 transition flex-1 md:flex-none ${
                selectedModel.id === m.id
                  ? 'bg-fd-muted border border-fd-border'
                  : 'hover:bg-fd-muted/50'
              }`}
            >
              <div className="font-medium text-sm">{m.name}</div>
              <div className="text-xs text-fd-muted-foreground">{m.size} · {m.ram}</div>
            </button>
          ))}
        </div>

        {/* Instructions */}
        <div className="p-6 md:p-8">
          {tab === 'ollama' && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-fd-muted-foreground mb-1">1. Install Ollama</p>
                <a
                  href="https://ollama.com/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-fd-primary hover:underline"
                >
                  Download Ollama from ollama.com →
                </a>
              </div>
              <div>
                <p className="text-sm text-fd-muted-foreground mb-2">2. Run {selectedModel.name}</p>
                <div className="flex items-center gap-2 rounded-xl bg-fd-muted border border-fd-border px-4 py-3">
                  <code className="text-sm font-mono flex-1 overflow-x-auto">{selectedModel.ollama}</code>
                  <CopyButton text={selectedModel.ollama} />
                </div>
              </div>
              <p className="text-xs text-fd-muted-foreground">
                Ollama will download the model from HuggingFace automatically on first run. Requires {selectedModel.ram}.
              </p>
            </div>
          )}

          {tab === 'lmstudio' && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-fd-muted-foreground mb-1">1. Install LM Studio</p>
                <a
                  href="https://lmstudio.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-fd-primary hover:underline"
                >
                  Download LM Studio from lmstudio.ai →
                </a>
              </div>
              <div>
                <p className="text-sm text-fd-muted-foreground mb-2">2. Search for model in the Discover tab</p>
                <div className="flex items-center gap-2 rounded-xl bg-fd-muted border border-fd-border px-4 py-3">
                  <code className="text-sm font-mono flex-1">{selectedModel.lmstudio}</code>
                  <CopyButton text={selectedModel.lmstudio} />
                </div>
              </div>
              <div>
                <p className="text-sm text-fd-muted-foreground mb-2">3. Or open directly on HuggingFace</p>
                <a
                  href={`https://huggingface.co/${selectedModel.hf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-fd-primary hover:underline break-all"
                >
                  huggingface.co/{selectedModel.hf} →
                </a>
              </div>
              <p className="text-xs text-fd-muted-foreground">
                LM Studio has a built-in model browser. Search for the model ID above in the Discover tab. Requires {selectedModel.ram}.
              </p>
            </div>
          )}

          {tab === 'gguf' && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-fd-muted-foreground mb-2">HuggingFace repository</p>
                <a
                  href={selectedModel.gguf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-fd-muted border border-fd-border px-4 py-3 text-sm font-medium hover:bg-fd-border transition w-full"
                >
                  huggingface.co/{selectedModel.hf} →
                </a>
              </div>
              <div>
                <p className="text-sm text-fd-muted-foreground mb-2">Available formats</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Q4_K_M (recommended)', 'Q5_K_M', 'Q8_0', 'F16 (full)'].map(f => (
                    <div key={f} className="rounded-lg bg-fd-muted border border-fd-border px-3 py-2 text-xs font-mono">
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-fd-muted-foreground mb-2">Run with llama.cpp</p>
                <div className="flex items-center gap-2 rounded-xl bg-fd-muted border border-fd-border px-4 py-3">
                  <code className="text-sm font-mono flex-1 overflow-x-auto">{`./llama-cli -m ${selectedModel.id}-q4_k_m.gguf -p "Hello"`}</code>
                  <CopyButton text={`./llama-cli -m ${selectedModel.id}-q4_k_m.gguf -p "Hello"`} />
                </div>
              </div>
              <p className="text-xs text-fd-muted-foreground">
                Download the GGUF file from the HuggingFace repo above. Works with llama.cpp, Ollama, LM Studio, Jan, and any other GGUF-compatible runtime.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
