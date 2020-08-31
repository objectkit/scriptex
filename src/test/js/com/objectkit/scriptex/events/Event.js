class Event {

  static get STATUS () {
    return 0
  }

  constructor (object={}) {
    Object.assign(this, object)
  }

  get status () {
    return this.constructor.STATUS
  }

  sendAfterMilliseconds (any) {}
  sendAfterBeats (any) {}
  sendAtBeat (any) {}
  send() {}
}

export default Event
