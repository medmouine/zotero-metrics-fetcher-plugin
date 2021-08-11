import {ZoteroItem} from '../typings/zotero'
import PublisherMetricsFetcher from './publisher_metrics_fetcher'
import {MetricsNotAvailableError} from './publisher_metrics'
import {ZoteroDisplayUtils} from './zotero_utils'

export default class ItemUpdater {

  constructor(metricsFetcher: PublisherMetricsFetcher) {
    this.metricsFetcher = metricsFetcher
  }

  private metricsFetcher: PublisherMetricsFetcher

  public async update(items: [ZoteroItem]): Promise<void> {
    for (const item of ItemUpdater.getRegularItemsWithPublisherField(items)) {
      try {
        await this.updateItem(item)
      }
      catch (error) {
        ItemUpdater.handleError(error, item)
      }
    }
  }

  private static handleError(error: MetricsNotAvailableError, item: ZoteroItem) {
    if (error instanceof MetricsNotAvailableError) {
      ZoteroDisplayUtils.showPopup(error.message, `Try again later.\n"${ItemUpdater.getItemTitle(item)}"`, true)
      return
    }
    alert(`Unknown error: Could not update item "${ItemUpdater.getItemTitle(item)}".\n Error message: ${error}`)
  }

  private static getRegularItemsWithPublisherField(items: [ZoteroItem]) {
    return items.filter(item => !item.isRegularItem() || item.isCollection())
  }

  private static getItemTitle(item: ZoteroItem) {
    return item.getField('title')
  }

  private async updateItem(item: ZoteroItem) {
    ZoteroDisplayUtils.showPopup('Fetching metrics', item.getField('title'))
    const metrics = await this.metricsFetcher.fetchMetricsForItem(item)
  }
}
