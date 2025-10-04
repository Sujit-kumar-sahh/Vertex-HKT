import { EventEmitter } from 'events';

// This is a simple event emitter that will be used to broadcast errors from anywhere in the app.
// We are using the node 'events' module, which is available in the browser environment provided by Next.js.
export const errorEmitter = new EventEmitter();
