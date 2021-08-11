import {IZotero} from '../typings/zotero'

const DEFAULT_VALUES = {
  autoFetchMetrics: true,
  metricsApiUrl: 'https://api.clarivate.com/apis/wos-journals/v1',
}

export default class PublisherMetricsConfig {
  private zotero: IZotero

  constructor(zotero: IZotero) {
    this.zotero = zotero
  }

  public isAutomaticMetricFetchEnabled() {
    if (this.zotero.Prefs.get('zoteropubmetrics.auto_fetch_metrics') === undefined) {
      this.zotero.Prefs.set('zoteropubmetrics.auto_fetch_metrics', DEFAULT_VALUES.autoFetchMetrics)
    }

    return this.zotero.Prefs.get('zoteropubmetrics.auto_fetch_metrics') as boolean
  }

  public getMetricApiUrl() {
    if (this.zotero.Prefs.get('zoteropubmetrics.metrics_api_url') === undefined) {
      this.zotero.Prefs.set('zoteropubmetrics.metrics_api_url', DEFAULT_VALUES.metricsApiUrl)
    }

    return this.zotero.Prefs.get('zoteropubmetrics.metrics_api_url') as boolean
  }
}
