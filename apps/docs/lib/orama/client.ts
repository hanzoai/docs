export const DataSourceId = 'hanzo-docs';

interface SearchResult {
  hits: { document: Record<string, unknown> }[];
}

export const orama = {
  async search(params: {
    term: string;
    datasources: string[];
    limit?: number;
  }): Promise<SearchResult> {
    return { hits: [] };
  },
};
