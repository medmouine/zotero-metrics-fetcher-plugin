import {IZotero} from '../typings/zotero'

const POPUP_TIMEOUT_DEFAULT = 5

export abstract class ZoteroDisplayUtils {
  private static zotero: IZotero

  public static showPopup(title: string, body: string, isError = false, timeout = POPUP_TIMEOUT_DEFAULT): void {
    const seconds = 1000
    const pw = new (this.zotero).ProgressWindow()
    if (isError) {
      pw.changeHeadline('Error', 'chrome://zotero/skin/cross.png', `Publisher Metrics: ${title}`)
    }
    else {
      pw.changeHeadline(`Publisher Metrics: ${title}`)
    }
    pw.addDescription(body)
    pw.show()
    pw.startCloseTimer(timeout * seconds)
  }
}
