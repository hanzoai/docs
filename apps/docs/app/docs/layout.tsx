import { Docs } from '@/components/layouts/docs';
import { Footer } from '@/components/footer';
import 'katex/dist/katex.min.css';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <>
      <Docs>{children}</Docs>
      <Footer />
    </>
  );
}
