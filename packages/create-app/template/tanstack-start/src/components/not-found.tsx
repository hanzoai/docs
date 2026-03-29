import { baseOptions } from '@/lib/layout.shared';
import { HomeLayout } from '@hanzo/docs-ui/layouts/home';
import { DefaultNotFound } from '@hanzo/docs-ui/layouts/home/not-found';

export function NotFound() {
  return (
    <HomeLayout {...baseOptions()}>
      <DefaultNotFound />
    </HomeLayout>
  );
}
