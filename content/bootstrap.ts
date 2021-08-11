import ItemObserver from './item_observer'
import {IZotero} from '../typings/zotero'
import PublisherMetricsConfig from './publisher_metrics_config'
import ItemUpdater from './item_updater'
import PublisherMetricsFetcher from './publisher_metrics_fetcher'
import {ApiConfig} from '../typings/config'

declare const Zotero: IZotero

const monkey_patch_marker = 'PublisherMetricsPluginMonkeyPatched'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function patch(object, method, patcher) {
  if (object[method][monkey_patch_marker]) return
  object[method] = patcher(object[method])
  object[method][monkey_patch_marker] = true
}

class Bootstrap {
  private initialized = false
  private publisherMetricsConfig: PublisherMetricsConfig
  private observer: ItemObserver
  private itemUpdater: ItemUpdater

  constructor() {
    this.publisherMetricsConfig = new PublisherMetricsConfig(Zotero)
    this.itemUpdater = new ItemUpdater(new PublisherMetricsFetcher(Zotero, {} as ApiConfig))
  }

  public load(): void {
    if (this.initialized) return
    this.observer = new ItemObserver(Zotero, this.publisherMetricsConfig, this.itemUpdater)
    this.observer.setId(Zotero.Notifier.registerObserver(this.observer, ['item'], 'PublisherMetrics'))
    this.initialized = true
  }

  public unload(): void {
    if (this.observer) {
      Zotero.Notifier.unregisterObserver(this.observer.getId())
    }
  }
}

Zotero.PublisherMetrics = new Bootstrap

window.addEventListener('load', _ => {
  void Zotero.PublisherMetrics.load()
}, false)
window.addEventListener('unload', _ => {
  Zotero.PublisherMetrics.unload()
}, false)


export {Bootstrap}
