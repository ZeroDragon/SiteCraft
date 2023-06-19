export const debouncer = {
  tracers: {},
  ex (file) {
    const now = new Date()
    if (this.tracers[file] && this.tracers[file] > now.getTime()) return false
    this.tracers[file] = now.getTime() + 1000
    return true
  }
}
