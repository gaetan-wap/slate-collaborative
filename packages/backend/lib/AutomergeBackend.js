'use strict'

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard')

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports['default'] = void 0

var _classCallCheck2 = _interopRequireDefault(
  require('@babel/runtime/helpers/classCallCheck')
)

var _createClass2 = _interopRequireDefault(
  require('@babel/runtime/helpers/createClass')
)

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty')
)

var Automerge = _interopRequireWildcard(require('automerge'))

var _bridge = require('@slate-collaborative/bridge')

/**
 * AutomergeBackend contains collaboration with Automerge
 */
var AutomergeBackend = /*#__PURE__*/ (function() {
  function AutomergeBackend() {
    var _this = this

    ;(0, _classCallCheck2['default'])(this, AutomergeBackend)
    ;(0, _defineProperty2['default'])(this, 'connections', {})
    ;(0, _defineProperty2['default'])(this, 'docSet', new Automerge.DocSet())
    ;(0, _defineProperty2['default'])(this, 'createConnection', function(
      id,
      send
    ) {
      if (_this.connections[id]) {
        console.warn(
          'Already has connection with id: '.concat(
            id,
            '. It will be terminated before creating new connection'
          )
        )

        _this.closeConnection(id)
      }

      _this.connections[id] = new Automerge.Connection(
        _this.docSet,
        (0, _bridge.toCollabAction)('operation', send)
      )
    })
    ;(0, _defineProperty2['default'])(this, 'openConnection', function(id) {
      return _this.connections[id].open()
    })
    ;(0, _defineProperty2['default'])(this, 'receiveOperation', function(
      id,
      data
    ) {
      try {
        _this.connections[id].receiveMsg(data.payload)
      } catch (e) {
        console.error('Unexpected error in receiveOperation', e)
      }
    })
    ;(0, _defineProperty2['default'])(this, 'getDocument', function(docId) {
      return _this.docSet.getDoc(docId)
    })
    ;(0, _defineProperty2['default'])(this, 'appendDocument', function(
      docId,
      data
    ) {
      try {
        if (_this.getDocument(docId)) {
          throw new Error('Already has document with id: '.concat(docId))
        }

        var sync = (0, _bridge.toSync)({
          cursors: {},
          children: data
        })
        var doc = Automerge.from(sync)

        _this.docSet.setDoc(docId, doc)
      } catch (e) {
        console.error(e, docId)
      }
    })
    ;(0, _defineProperty2['default'])(this, 'removeDocument', function(docId) {
      return _this.docSet.removeDoc(docId)
    })
    ;(0, _defineProperty2['default'])(this, 'garbageCursor', function(
      docId,
      id
    ) {
      try {
        var doc = _this.getDocument(docId)

        if (!doc.cursors) return
        var change = Automerge.change(doc, function(d) {
          delete d.cursors[id]
        })

        _this.docSet.setDoc(docId, change)
      } catch (e) {
        console.error('Unexpected error in garbageCursor', e)
      }
    })
  }

  ;(0, _createClass2['default'])(AutomergeBackend, [
    {
      key: 'closeConnection',

      /**
       * Close Automerge Connection and remove it from connections
       */
      value: function closeConnection(id) {
        var _this$connections$id

        ;(_this$connections$id = this.connections[id]) === null ||
        _this$connections$id === void 0
          ? void 0
          : _this$connections$id.close()
        delete this.connections[id]
      }
      /**
       * Receive and apply operation to Automerge Connection
       */
    }
  ])
  return AutomergeBackend
})()

var _default = AutomergeBackend
exports['default'] = _default
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9BdXRvbWVyZ2VCYWNrZW5kLnRzIl0sIm5hbWVzIjpbIkF1dG9tZXJnZUJhY2tlbmQiLCJBdXRvbWVyZ2UiLCJEb2NTZXQiLCJpZCIsInNlbmQiLCJjb25uZWN0aW9ucyIsImNvbnNvbGUiLCJ3YXJuIiwiY2xvc2VDb25uZWN0aW9uIiwiQ29ubmVjdGlvbiIsImRvY1NldCIsIm9wZW4iLCJkYXRhIiwicmVjZWl2ZU1zZyIsInBheWxvYWQiLCJlIiwiZXJyb3IiLCJkb2NJZCIsImdldERvYyIsImdldERvY3VtZW50IiwiRXJyb3IiLCJzeW5jIiwiY3Vyc29ycyIsImNoaWxkcmVuIiwiZG9jIiwiZnJvbSIsInNldERvYyIsInJlbW92ZURvYyIsImNoYW5nZSIsImQiLCJjbG9zZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFJQTs7QUFXQTtBQUNBO0FBQ0E7SUFFTUEsZ0I7Ozs7OzBEQUN1QixFO3FEQUVTLElBQUlDLFNBQVMsQ0FBQ0MsTUFBZCxFOytEQU1qQixVQUFDQyxFQUFELEVBQWFDLElBQWIsRUFBMkI7QUFDNUMsVUFBSSxLQUFJLENBQUNDLFdBQUwsQ0FBaUJGLEVBQWpCLENBQUosRUFBMEI7QUFDeEJHLFFBQUFBLE9BQU8sQ0FBQ0MsSUFBUiwyQ0FDcUNKLEVBRHJDOztBQUlBLFFBQUEsS0FBSSxDQUFDSyxlQUFMLENBQXFCTCxFQUFyQjtBQUNEOztBQUVELE1BQUEsS0FBSSxDQUFDRSxXQUFMLENBQWlCRixFQUFqQixJQUF1QixJQUFJRixTQUFTLENBQUNRLFVBQWQsQ0FDckIsS0FBSSxDQUFDQyxNQURnQixFQUVyQiw0QkFBZSxXQUFmLEVBQTRCTixJQUE1QixDQUZxQixDQUF2QjtBQUlELEs7NkRBTWdCLFVBQUNELEVBQUQ7QUFBQSxhQUFnQixLQUFJLENBQUNFLFdBQUwsQ0FBaUJGLEVBQWpCLEVBQXFCUSxJQUFyQixFQUFoQjtBQUFBLEs7K0RBZ0JFLFVBQUNSLEVBQUQsRUFBYVMsSUFBYixFQUFvQztBQUNyRCxVQUFJO0FBQ0YsUUFBQSxLQUFJLENBQUNQLFdBQUwsQ0FBaUJGLEVBQWpCLEVBQXFCVSxVQUFyQixDQUFnQ0QsSUFBSSxDQUFDRSxPQUFyQztBQUNELE9BRkQsQ0FFRSxPQUFPQyxDQUFQLEVBQVU7QUFDVlQsUUFBQUEsT0FBTyxDQUFDVSxLQUFSLENBQWMsc0NBQWQsRUFBc0RELENBQXREO0FBQ0Q7QUFDRixLOzBEQU1hLFVBQUNFLEtBQUQ7QUFBQSxhQUFtQixLQUFJLENBQUNQLE1BQUwsQ0FBWVEsTUFBWixDQUFtQkQsS0FBbkIsQ0FBbkI7QUFBQSxLOzZEQU1HLFVBQUNBLEtBQUQsRUFBZ0JMLElBQWhCLEVBQWlDO0FBQ2hELFVBQUk7QUFDRixZQUFJLEtBQUksQ0FBQ08sV0FBTCxDQUFpQkYsS0FBakIsQ0FBSixFQUE2QjtBQUMzQixnQkFBTSxJQUFJRyxLQUFKLHlDQUEyQ0gsS0FBM0MsRUFBTjtBQUNEOztBQUVELFlBQU1JLElBQUksR0FBRyxvQkFBTztBQUFFQyxVQUFBQSxPQUFPLEVBQUUsRUFBWDtBQUFlQyxVQUFBQSxRQUFRLEVBQUVYO0FBQXpCLFNBQVAsQ0FBYjtBQUVBLFlBQU1ZLEdBQUcsR0FBR3ZCLFNBQVMsQ0FBQ3dCLElBQVYsQ0FBd0JKLElBQXhCLENBQVo7O0FBRUEsUUFBQSxLQUFJLENBQUNYLE1BQUwsQ0FBWWdCLE1BQVosQ0FBbUJULEtBQW5CLEVBQTBCTyxHQUExQjtBQUNELE9BVkQsQ0FVRSxPQUFPVCxDQUFQLEVBQVU7QUFDVlQsUUFBQUEsT0FBTyxDQUFDVSxLQUFSLENBQWNELENBQWQsRUFBaUJFLEtBQWpCO0FBQ0Q7QUFDRixLOzZEQU1nQixVQUFDQSxLQUFEO0FBQUEsYUFBbUIsS0FBSSxDQUFDUCxNQUFMLENBQVlpQixTQUFaLENBQXNCVixLQUF0QixDQUFuQjtBQUFBLEs7NERBTUQsVUFBQ0EsS0FBRCxFQUFnQmQsRUFBaEIsRUFBK0I7QUFDN0MsVUFBSTtBQUNGLFlBQU1xQixHQUFHLEdBQUcsS0FBSSxDQUFDTCxXQUFMLENBQWlCRixLQUFqQixDQUFaOztBQUVBLFlBQUksQ0FBQ08sR0FBRyxDQUFDRixPQUFULEVBQWtCO0FBRWxCLFlBQU1NLE1BQU0sR0FBRzNCLFNBQVMsQ0FBQzJCLE1BQVYsQ0FBaUJKLEdBQWpCLEVBQXNCLFVBQUNLLENBQUQsRUFBWTtBQUMvQyxpQkFBT0EsQ0FBQyxDQUFDUCxPQUFGLENBQVVuQixFQUFWLENBQVA7QUFDRCxTQUZjLENBQWY7O0FBSUEsUUFBQSxLQUFJLENBQUNPLE1BQUwsQ0FBWWdCLE1BQVosQ0FBbUJULEtBQW5CLEVBQTBCVyxNQUExQjtBQUNELE9BVkQsQ0FVRSxPQUFPYixDQUFQLEVBQVU7QUFDVlQsUUFBQUEsT0FBTyxDQUFDVSxLQUFSLENBQWMsbUNBQWQsRUFBbURELENBQW5EO0FBQ0Q7QUFDRixLOzs7Ozs7QUF4RUQ7QUFDRjtBQUNBO29DQUVrQlosRSxFQUFZO0FBQUE7O0FBQzFCLG1DQUFLRSxXQUFMLENBQWlCRixFQUFqQiwrRUFBc0IyQixLQUF0QjtBQUVBLGFBQU8sS0FBS3pCLFdBQUwsQ0FBaUJGLEVBQWpCLENBQVA7QUFDRDtBQUVEO0FBQ0Y7QUFDQTs7Ozs7O2VBK0RlSCxnQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEF1dG9tZXJnZSBmcm9tICdhdXRvbWVyZ2UnXG5cbmltcG9ydCB7IE5vZGUgfSBmcm9tICdzbGF0ZSdcblxuaW1wb3J0IHtcbiAgdG9Db2xsYWJBY3Rpb24sXG4gIHRvU3luYyxcbiAgU3luY0RvYyxcbiAgQ29sbGFiQWN0aW9uXG59IGZyb20gJ0BzbGF0ZS1jb2xsYWJvcmF0aXZlL2JyaWRnZSdcblxuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0aW9ucyB7XG4gIFtrZXk6IHN0cmluZ106IEF1dG9tZXJnZS5Db25uZWN0aW9uPFN5bmNEb2M+XG59XG5cbi8qKlxuICogQXV0b21lcmdlQmFja2VuZCBjb250YWlucyBjb2xsYWJvcmF0aW9uIHdpdGggQXV0b21lcmdlXG4gKi9cblxuY2xhc3MgQXV0b21lcmdlQmFja2VuZCB7XG4gIGNvbm5lY3Rpb25zOiBDb25uZWN0aW9ucyA9IHt9XG5cbiAgZG9jU2V0OiBBdXRvbWVyZ2UuRG9jU2V0PFN5bmNEb2M+ID0gbmV3IEF1dG9tZXJnZS5Eb2NTZXQoKVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgQXV0bW9yZ2UgQ29ubmVjdGlvblxuICAgKi9cblxuICBjcmVhdGVDb25uZWN0aW9uID0gKGlkOiBzdHJpbmcsIHNlbmQ6IGFueSkgPT4ge1xuICAgIGlmICh0aGlzLmNvbm5lY3Rpb25zW2lkXSkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBgQWxyZWFkeSBoYXMgY29ubmVjdGlvbiB3aXRoIGlkOiAke2lkfS4gSXQgd2lsbCBiZSB0ZXJtaW5hdGVkIGJlZm9yZSBjcmVhdGluZyBuZXcgY29ubmVjdGlvbmBcbiAgICAgIClcblxuICAgICAgdGhpcy5jbG9zZUNvbm5lY3Rpb24oaWQpXG4gICAgfVxuXG4gICAgdGhpcy5jb25uZWN0aW9uc1tpZF0gPSBuZXcgQXV0b21lcmdlLkNvbm5lY3Rpb24oXG4gICAgICB0aGlzLmRvY1NldCxcbiAgICAgIHRvQ29sbGFiQWN0aW9uKCdvcGVyYXRpb24nLCBzZW5kKVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCBBdXRvbWVyZ2UgQ29ubmVjdGlvblxuICAgKi9cblxuICBvcGVuQ29ubmVjdGlvbiA9IChpZDogc3RyaW5nKSA9PiB0aGlzLmNvbm5lY3Rpb25zW2lkXS5vcGVuKClcblxuICAvKipcbiAgICogQ2xvc2UgQXV0b21lcmdlIENvbm5lY3Rpb24gYW5kIHJlbW92ZSBpdCBmcm9tIGNvbm5lY3Rpb25zXG4gICAqL1xuXG4gIGNsb3NlQ29ubmVjdGlvbihpZDogc3RyaW5nKSB7XG4gICAgdGhpcy5jb25uZWN0aW9uc1tpZF0/LmNsb3NlKClcblxuICAgIGRlbGV0ZSB0aGlzLmNvbm5lY3Rpb25zW2lkXVxuICB9XG5cbiAgLyoqXG4gICAqIFJlY2VpdmUgYW5kIGFwcGx5IG9wZXJhdGlvbiB0byBBdXRvbWVyZ2UgQ29ubmVjdGlvblxuICAgKi9cblxuICByZWNlaXZlT3BlcmF0aW9uID0gKGlkOiBzdHJpbmcsIGRhdGE6IENvbGxhYkFjdGlvbikgPT4ge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb25zW2lkXS5yZWNlaXZlTXNnKGRhdGEucGF5bG9hZClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdVbmV4cGVjdGVkIGVycm9yIGluIHJlY2VpdmVPcGVyYXRpb24nLCBlKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgZG9jdW1lbnQgZnJvbSBBdXRvbWVyZ2UgRG9jU2V0XG4gICAqL1xuXG4gIGdldERvY3VtZW50ID0gKGRvY0lkOiBzdHJpbmcpID0+IHRoaXMuZG9jU2V0LmdldERvYyhkb2NJZClcblxuICAvKipcbiAgICogQXBwZW5kIGRvY3VtZW50IHRvIEF1dG9tZXJnZSBEb2NTZXRcbiAgICovXG5cbiAgYXBwZW5kRG9jdW1lbnQgPSAoZG9jSWQ6IHN0cmluZywgZGF0YTogTm9kZVtdKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0aGlzLmdldERvY3VtZW50KGRvY0lkKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgaGFzIGRvY3VtZW50IHdpdGggaWQ6ICR7ZG9jSWR9YClcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3luYyA9IHRvU3luYyh7IGN1cnNvcnM6IHt9LCBjaGlsZHJlbjogZGF0YSB9KVxuXG4gICAgICBjb25zdCBkb2MgPSBBdXRvbWVyZ2UuZnJvbTxTeW5jRG9jPihzeW5jKVxuXG4gICAgICB0aGlzLmRvY1NldC5zZXREb2MoZG9jSWQsIGRvYylcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGUsIGRvY0lkKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZG9jdW1lbnQgZnJvbSBBdXRvbWVyZ2UgRG9jU2V0XG4gICAqL1xuXG4gIHJlbW92ZURvY3VtZW50ID0gKGRvY0lkOiBzdHJpbmcpID0+IHRoaXMuZG9jU2V0LnJlbW92ZURvYyhkb2NJZClcblxuICAvKipcbiAgICogUmVtb3ZlIGNsaWVudCBjdXJzb3IgZGF0YVxuICAgKi9cblxuICBnYXJiYWdlQ3Vyc29yID0gKGRvY0lkOiBzdHJpbmcsIGlkOiBzdHJpbmcpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZG9jID0gdGhpcy5nZXREb2N1bWVudChkb2NJZClcblxuICAgICAgaWYgKCFkb2MuY3Vyc29ycykgcmV0dXJuXG5cbiAgICAgIGNvbnN0IGNoYW5nZSA9IEF1dG9tZXJnZS5jaGFuZ2UoZG9jLCAoZDogYW55KSA9PiB7XG4gICAgICAgIGRlbGV0ZSBkLmN1cnNvcnNbaWRdXG4gICAgICB9KVxuXG4gICAgICB0aGlzLmRvY1NldC5zZXREb2MoZG9jSWQsIGNoYW5nZSlcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdVbmV4cGVjdGVkIGVycm9yIGluIGdhcmJhZ2VDdXJzb3InLCBlKVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBdXRvbWVyZ2VCYWNrZW5kXG4iXX0=
