import { DynamicLink } from '@hanzo/docs-core/dynamic-link';

const copy: Record<string, { title: string; before: string; after: string }> = {
  en: { title: 'Hello World', before: 'You can open', after: 'and see the documentation.' },
  es: { title: 'Hola mundo', before: 'Puedes abrir', after: 'y ver la documentación.' },
  fr: { title: 'Bonjour', before: 'Vous pouvez ouvrir', after: 'et lire la documentation.' },
  de: { title: 'Hallo Welt', before: 'Öffnen Sie', after: 'und lesen Sie die Dokumentation.' },
  it: { title: 'Ciao mondo', before: 'Puoi aprire', after: 'e leggere la documentazione.' },
  'pt-BR': { title: 'Olá, mundo', before: 'Você pode abrir', after: 'e ver a documentação.' },
  ru: { title: 'Привет, мир', before: 'Откройте', after: 'и посмотрите документацию.' },
  tr: {
    title: 'Merhaba dünya',
    before: 'Şunu açabilirsiniz:',
    after: 've belgeleri görebilirsiniz.',
  },
  ar: { title: 'مرحباً بالعالم', before: 'يمكنك فتح', after: 'ومشاهدة التوثيق.' },
  hi: { title: 'नमस्ते दुनिया', before: 'आप खोल सकते हैं', after: 'और दस्तावेज़ देख सकते हैं.' },
  id: { title: 'Halo dunia', before: 'Anda dapat membuka', after: 'dan melihat dokumentasinya.' },
  vi: { title: 'Xin chào', before: 'Bạn có thể mở', after: 'và xem tài liệu.' },
  th: { title: 'สวัสดีชาวโลก', before: 'คุณเปิด', after: 'แล้วดูเอกสารได้' },
  ja: { title: 'こんにちは', before: 'こちらを開くと', after: 'ドキュメントを読めます。' },
  ko: { title: '안녕하세요', before: '다음을 열면', after: '문서를 볼 수 있습니다.' },
  'zh-CN': { title: '你好，世界', before: '你可以打开', after: '并查看文档。' },
  'zh-TW': { title: '你好，世界', before: '你可以打開', after: '並查看文件。' },
};

export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params;
  const text = copy[lang] ?? copy.en!;

  return (
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        justifyContent: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
        }}
      >
        {text.title}
      </h1>
      <p>
        {text.before}{' '}
        <DynamicLink
          href="/[lang]/docs"
          style={{
            fontWeight: '600',
            textDecoration: 'underline',
          }}
        >
          /docs
        </DynamicLink>{' '}
        {text.after}
      </p>
    </main>
  );
}
