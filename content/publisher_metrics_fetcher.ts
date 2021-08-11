import {IZotero, ZoteroItem} from '../typings/zotero'
import {ApiConfig} from '../typings/config'
import {MetricsNotAvailableError} from './publisher_metrics'

const METADATA_ENDPOINT = '/search/scopus'
const METRICS_ENDPOINT = '/serial/title'

const HTTP_OK = 200
export default class PublisherMetricsFetcher {
  private zotero: IZotero
  private apiConfig: ApiConfig
  private headers: {}

  constructor(zotero: IZotero, apiConfig: ApiConfig) {
    this.zotero = zotero
    this.apiConfig = apiConfig
    this.headers = this.buildHeaders()
  }

  async fetchMetricsForItem(item: ZoteroItem) {
    const issn = await this.fetchItemMetadata(item)
    return this.fetchItemMetrics(item, issn)
  }

  private async fetchItemMetadata(item: ZoteroItem): Promise<string> {
    const metadataUrl: URL = this.buildPublicationMetadataUrl(item.getField('title'))
    const xhr = await this.zotero.HTTP.request('GET', metadataUrl.href, this.headers)
    const body = xhr.responseXML?.querySelector('body')
    if (xhr.status === HTTP_OK && !!body) {
      const entry = body['search-results'].entry[0]
      if (!entry[this.apiConfig.issnFieldLabel]) {
        throw new MetricsNotAvailableError(item.getField('title'))
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return entry[this.apiConfig.issnFieldLabel]
    }
    else {
      this.zotero.debug(`PublisherMetrics: failed to fetch item (${item.getField('title')}) metadata from "${this.apiConfig.metadataApiUrl}"`)
      throw new Error(xhr.statusText)
    }
  }

  private buildHeaders() {
    const headers = {}
    headers[this.apiConfig.apiKeyHeaderLabel] = this.apiConfig.apiKey
    return headers
  }

  private async fetchItemMetrics(item: ZoteroItem, issn: string) {
    const metricsUrl: URL = this.buildPublicationMetricsUrl(issn)
    const headers = this.buildHeaders()
    const xhr = await this.zotero.HTTP.request('GET', metricsUrl.href, headers)
    const body = xhr.responseXML?.querySelector('body')
    if (xhr.status === HTTP_OK && !!body) {
      const metrics = body['serial-metadata-response'].entry?.[0]
      if (!metrics) {
        throw new MetricsNotAvailableError(item.getField('title'))
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return metrics
    }
    else {
      this.zotero.debug(`PublisherMetrics: failed to fetch item (${item.getField('title')}) metrics from "${this.apiConfig.metricsApiUrl}"`)
      throw new Error(xhr.statusText)
    }
  }

  private buildPublicationMetadataUrl(itemTitle: string) {
    const url = new URL(METADATA_ENDPOINT, this.apiConfig.metadataApiUrl)
    url.searchParams.append('query', `title=(${itemTitle})`)
    url.searchParams.append('field', `field=${this.apiConfig.issnFieldLabel}`)
    return url
  }

  private buildPublicationMetricsUrl(issn: string) {
    const url = new URL(METRICS_ENDPOINT, this.apiConfig.metricsApiUrl)
    url.searchParams.append('issn', issn)
    url.searchParams.append('field', 'field=SJRList,citeScoreYearInfoList,SNIPList')
    return url
  }
}
