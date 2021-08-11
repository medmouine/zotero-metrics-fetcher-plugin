class MetricsNotAvailableError extends Error {
  constructor(publisher: string) {
    super(`Could not fetch metrics for publisher ${publisher}`)
    this.name = 'MetricsNotAvailableError'
    Object.setPrototypeOf(this, MetricsNotAvailableError.prototype)
  }
}


export { MetricsNotAvailableError }
