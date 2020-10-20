/// <reference types="socket.io" />
import { Node } from 'slate'
export interface SocketIOCollaborationOptions {
  entry: number
  connectOpts?: SocketIO.ServerOptions
  defaultValue?: Node[]
  saveFrequency?: number
  onAuthRequest?: (
    query: Object,
    socket?: SocketIO.Socket
  ) => Promise<boolean> | boolean
  onDocumentLoad?: (
    pathname: string,
    query?: Object
  ) => Promise<Node[]> | Node[]
  onDocumentSave?: (pathname: string, doc: Node[]) => Promise<void> | void
}
export default class SocketIOCollaboration {
  private io
  private options
  private backend
  /**
   * Constructor
   */
  constructor(options: SocketIOCollaborationOptions)
  /**
   * Initial IO configuration
   */
  private configure
  /**
   * Namespace SocketIO middleware. Load document value and append it to CollaborationBackend.
   */
  private nspMiddleware
  /**
   * SocketIO auth middleware. Used for user authentification.
   */
  private authMiddleware
  /**
   * On 'connect' handler.
   */
  private onConnect
  /**
   * On 'message' handler
   */
  private onMessage
  /**
   * Save document with throttle
   */
  private autoSaveDoc
  /**
   * Save document
   */
  private saveDocument
  /**
   * On 'disconnect' handler
   */
  private onDisconnect
  /**
   * Clean up unused SocketIO namespaces.
   */
  garbageNsp: () => void
  /**
   * Clean up unused cursor data.
   */
  garbageCursors: (nsp: string) => void
  /**
   * Destroy SocketIO connection
   */
  destroy: () => Promise<void>
}
//# sourceMappingURL=SocketIOConnection.d.ts.map
