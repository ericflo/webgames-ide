export const isProd: boolean = process.env.NEXT_PUBLIC_IS_PROD === 't';
export const cleanPortalUrl = (url: string): string =>
  url.endsWith('/') ? url : url + '/';
