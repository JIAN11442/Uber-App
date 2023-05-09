import { createClient } from "@sanity/client";
import imgUrlBuilder from "@sanity/image-url";
import { SANITY_EDIT_TOKENS_API } from "@env";

const client = createClient({
  projectId: "7zfh39j4",
  dataset: "production",
  token: SANITY_EDIT_TOKENS_API,
  useCdn: true,
  apiVersion: "2021-10-21",
});

const builder = imgUrlBuilder(client);
export const urlFor = (source) => builder.image(source);

export default client;
