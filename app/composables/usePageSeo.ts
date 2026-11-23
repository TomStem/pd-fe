const defaultDescription = 'Pour Decisions is a whisky club: tastings, whisky trips and everything about countries, regions, distilleries and whiskies. Bad decisions. Good whisky.';

interface PageSeoOptions {
  title: string;
  description?: string;
  image?: string;
  /** Overrides from the CMS (seoTitle, seoDescription, ogImage). */
  seo?: Seo;
}

export function usePageSeo({ title, description, image, seo }: PageSeoOptions) {
  const route = useRoute();
  const siteUrl = useSiteConfig().url;
  const pageTitle = seo?.seoTitle || title;
  const pageDescription = seo?.seoDescription || description || defaultDescription;
  const ogImage = seo?.ogImage || image;
  const url = `${siteUrl}${route.path}`;

  useSeoMeta({
    title: pageTitle,
    description: pageDescription,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogType: 'website',
    ogUrl: url,
    ogLocale: 'en_GB',
    ogSiteName: 'Pour Decisions',
    ogImage,
    twitterCard: ogImage ? 'summary_large_image' : 'summary',
  });
  useHead({ link: [{ rel: 'canonical', href: url }] });
}
