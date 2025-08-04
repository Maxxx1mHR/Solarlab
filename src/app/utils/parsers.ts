export function parseLinkHeader(header: string): Record<string, number> {
  const result: Record<string, number> = {};
  if (!header) return result;

  const parts = header.split(',');
  parts.forEach((part) => {
    const match = /<([^>]+)>;\s*rel="([^"]+)"/.exec(part.trim());
    if (match) {
      const url = match[1];
      const rel = match[2];
      try {
        const params = new URL(url).searchParams;
        const page = params.get('page');
        if (page) {
          result[rel] = Number(page);
        }
      } catch (error) {
        console.log('error', error);
      }
    }
  });

  return result;
}
