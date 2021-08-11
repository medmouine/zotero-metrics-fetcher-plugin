import {IZotero, ZoteroObserver} from '../typings/zotero'
import PublisherMetricsConfig from './publisher_metrics_config'
import ItemUpdater from './item_updater'

export default class ItemObserver implements ZoteroObserver {
  private zotero: IZotero
  private config: PublisherMetricsConfig
  private id: number
  private itemUpdater: ItemUpdater

  constructor(zotero: IZotero, config: PublisherMetricsConfig, itemUpdater: ItemUpdater) {
    this.zotero = zotero
    this.config = config
    this.itemUpdater = itemUpdater
  }

  public async notify(event: string, _type: string, ids: [number], _extraData: Record<string, any>) {
    const autoFetchMetrics = this.config.isAutomaticMetricFetchEnabled()

    if (event === 'add' && autoFetchMetrics) {
      const items = await this.zotero.Items.getAsync(ids)
      await this.itemUpdater.update(items)
    }
  }

  public getId(): number {
    return this.id
  }

  public setId(id: number): void {
    this.id = id
  }
}
