import * as Automerge from 'automerge'
import { Node } from 'slate'
import { SyncDoc, CollabAction } from '@slate-collaborative/bridge'
export interface Connections {
  [key: string]: Automerge.Connection<SyncDoc>
}
/**
 * AutomergeBackend contains collaboration with Automerge
 */
declare class AutomergeBackend {
  connections: Connections
  docSet: Automerge.DocSet<SyncDoc>
  /**
   * Create Autmorge Connection
   */
  createConnection: (id: string, send: any) => void
  /**
   * Start Automerge Connection
   */
  openConnection: (id: string) => void
  /**
   * Close Automerge Connection and remove it from connections
   */
  closeConnection(id: string): void
  /**
   * Receive and apply operation to Automerge Connection
   */
  receiveOperation: (id: string, data: CollabAction) => void
  /**
   * Get document from Automerge DocSet
   */
  getDocument: (
    docId: string
  ) => Automerge.FreezeObject<
    Automerge.FreezeObject<{
      children: import('../../bridge/lib').SyncValue
      cursors: import('../../bridge/lib').Cursors
    }>
  >
  /**
   * Append document to Automerge DocSet
   */
  appendDocument: (docId: string, data: Node[]) => void
  /**
   * Remove document from Automerge DocSet
   */
  removeDocument: (docId: string) => void
  /**
   * Remove client cursor data
   */
  garbageCursor: (docId: string, id: string) => void
}
export default AutomergeBackend
//# sourceMappingURL=AutomergeBackend.d.ts.map
