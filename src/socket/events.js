import EventEmitter from 'events'

export const EVENT_MESSAGE = `MESSAGE`

export const ADD_PHOTO_PUBLISHED = `photo.published:ADD`
export const REMOVE_PHOTO_PUBLISHED = `photo.published:REMOVE`

export const socketEvents = new EventEmitter()

export default socketEvents
