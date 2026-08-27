import { Docs } from '@/components/layouts/docs';
import { Footer } from '@/components/footer';
import 'katex/dist/katex.min.css';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <>
      <Docs>{children}</Docs>
      {/* The docs grid ends exactly where the footer begins — measured at a 0px
          seam — so the prev/next cards sat flush against the ecosystem columns
          with nothing between them. The room belongs here rather than on the
          footer, which is byte-identical across every Hanzo property, or on the
          article, which would put it inside the scrolling column. */}
      <div className="pt-16 md:pt-24">
        <Footer />
      </div>
    </>
  );
}
