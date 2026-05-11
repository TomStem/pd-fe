import { createClient } from "contentful";

export const useContentful = () => {
  const config = useRuntimeConfig();

  const client = createClient({
    space: config.public.contentfulSpaceId,
    accessToken: config.public.contentfulAccessToken,
  });

  return { client };
};
