interface DefaultValues {
  autoFetchMetrics: boolean
}

interface ApiConfig {
  issnFieldLabel: string;
  apiKeyHeaderLabel: string,
  apiKey: string,
  metadataApiUrl: string,
  metricsApiUrl: string,
}

interface PublisherMetricsConfigSchema {
  DefaultValues: DefaultValues
  ApiConfig: ApiConfig
}

export {PublisherMetricsConfigSchema, ApiConfig}
