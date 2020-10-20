'use strict'

var _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard')

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports['default'] = void 0

var _regenerator = _interopRequireDefault(require('@babel/runtime/regenerator'))

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator')
)

var _classCallCheck2 = _interopRequireDefault(
  require('@babel/runtime/helpers/classCallCheck')
)

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty')
)

var _socket = _interopRequireDefault(require('socket.io'))

var Automerge = _interopRequireWildcard(require('automerge'))

var _throttle = _interopRequireDefault(require('lodash/throttle'))

var _bridge = require('@slate-collaborative/bridge')

var _utils = require('./utils')

var _AutomergeBackend = _interopRequireDefault(require('./AutomergeBackend'))

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object)
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object)
    if (enumerableOnly)
      symbols = symbols.filter(function(sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable
      })
    keys.push.apply(keys, symbols)
  }
  return keys
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {}
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function(key) {
        ;(0, _defineProperty2['default'])(target, key, source[key])
      })
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
    } else {
      ownKeys(Object(source)).forEach(function(key) {
        Object.defineProperty(
          target,
          key,
          Object.getOwnPropertyDescriptor(source, key)
        )
      })
    }
  }
  return target
}

var SocketIOCollaboration =
  /**
   * Constructor
   */
  function SocketIOCollaboration(options) {
    var _this = this,
      _this$options

    ;(0, _classCallCheck2['default'])(this, SocketIOCollaboration)
    ;(0, _defineProperty2['default'])(this, 'io', void 0)
    ;(0, _defineProperty2['default'])(this, 'options', void 0)
    ;(0, _defineProperty2['default'])(this, 'backend', void 0)
    ;(0, _defineProperty2['default'])(this, 'configure', function() {
      return _this.io
        .of(_this.nspMiddleware)
        .use(_this.authMiddleware)
        .on('connect', _this.onConnect)
    })
    ;(0, _defineProperty2['default'])(
      this,
      'nspMiddleware',
      /*#__PURE__*/ (function() {
        var _ref = (0, _asyncToGenerator2['default'])(
          /*#__PURE__*/ _regenerator['default'].mark(function _callee(
            path,
            query,
            next
          ) {
            var onDocumentLoad, _doc

            return _regenerator['default'].wrap(function _callee$(_context) {
              while (1) {
                switch ((_context.prev = _context.next)) {
                  case 0:
                    onDocumentLoad = _this.options.onDocumentLoad

                    if (_this.backend.getDocument(path)) {
                      _context.next = 13
                      break
                    }

                    if (!onDocumentLoad) {
                      _context.next = 8
                      break
                    }

                    _context.next = 5
                    return onDocumentLoad(path, query)

                  case 5:
                    _context.t0 = _context.sent
                    _context.next = 9
                    break

                  case 8:
                    _context.t0 = _this.options.defaultValue

                  case 9:
                    _doc = _context.t0

                    if (_doc) {
                      _context.next = 12
                      break
                    }

                    return _context.abrupt('return', next(null, false))

                  case 12:
                    if (!_this.backend.getDocument(path)) {
                      _this.backend.appendDocument(path, _doc)
                    }

                  case 13:
                    return _context.abrupt('return', next(null, true))

                  case 14:
                  case 'end':
                    return _context.stop()
                }
              }
            }, _callee)
          })
        )

        return function(_x, _x2, _x3) {
          return _ref.apply(this, arguments)
        }
      })()
    )
    ;(0, _defineProperty2['default'])(
      this,
      'authMiddleware',
      /*#__PURE__*/ (function() {
        var _ref2 = (0, _asyncToGenerator2['default'])(
          /*#__PURE__*/ _regenerator['default'].mark(function _callee2(
            socket,
            next
          ) {
            var query, onAuthRequest, permit
            return _regenerator['default'].wrap(function _callee2$(_context2) {
              while (1) {
                switch ((_context2.prev = _context2.next)) {
                  case 0:
                    query = socket.handshake.query
                    onAuthRequest = _this.options.onAuthRequest

                    if (!onAuthRequest) {
                      _context2.next = 8
                      break
                    }

                    _context2.next = 5
                    return onAuthRequest(query, socket)

                  case 5:
                    permit = _context2.sent

                    if (permit) {
                      _context2.next = 8
                      break
                    }

                    return _context2.abrupt(
                      'return',
                      next(
                        new Error('Authentification error: '.concat(socket.id))
                      )
                    )

                  case 8:
                    return _context2.abrupt('return', next())

                  case 9:
                  case 'end':
                    return _context2.stop()
                }
              }
            }, _callee2)
          })
        )

        return function(_x4, _x5) {
          return _ref2.apply(this, arguments)
        }
      })()
    )
    ;(0, _defineProperty2['default'])(this, 'onConnect', function(socket) {
      var id = socket.id,
        conn = socket.conn
      var name = socket.nsp.name

      _this.backend.createConnection(id, function(_ref3) {
        var type = _ref3.type,
          payload = _ref3.payload
        socket.emit('msg', {
          type: type,
          payload: _objectSpread(
            {
              id: conn.id
            },
            payload
          )
        })
      })

      socket.on('msg', _this.onMessage(id, name))
      socket.on('disconnect', _this.onDisconnect(id, socket))
      socket.join(id, function() {
        var doc = _this.backend.getDocument(name)

        socket.emit('msg', {
          type: 'document',
          payload: Automerge.save(doc)
        })

        _this.backend.openConnection(id)
      })

      _this.garbageCursors(name)
    })
    ;(0, _defineProperty2['default'])(this, 'onMessage', function(id, name) {
      return function(data) {
        switch (data.type) {
          case 'operation':
            try {
              _this.backend.receiveOperation(id, data)

              _this.autoSaveDoc(name)

              _this.garbageCursors(name)
            } catch (e) {
              console.log(e)
            }
        }
      }
    })
    ;(0, _defineProperty2['default'])(
      this,
      'autoSaveDoc',
      (0, _throttle['default'])(
        /*#__PURE__*/ (function() {
          var _ref4 = (0, _asyncToGenerator2['default'])(
            /*#__PURE__*/ _regenerator['default'].mark(function _callee3(
              docId
            ) {
              return _regenerator['default'].wrap(function _callee3$(
                _context3
              ) {
                while (1) {
                  switch ((_context3.prev = _context3.next)) {
                    case 0:
                      return _context3.abrupt(
                        'return',
                        _this.backend.getDocument(docId) &&
                          _this.saveDocument(docId)
                      )

                    case 1:
                    case 'end':
                      return _context3.stop()
                  }
                }
              },
              _callee3)
            })
          )

          return function(_x6) {
            return _ref4.apply(this, arguments)
          }
        })(),
        ((_this$options = this.options) === null || _this$options === void 0
          ? void 0
          : _this$options.saveFrequency) || 2000
      )
    )
    ;(0, _defineProperty2['default'])(
      this,
      'saveDocument',
      /*#__PURE__*/ (function() {
        var _ref5 = (0, _asyncToGenerator2['default'])(
          /*#__PURE__*/ _regenerator['default'].mark(function _callee4(docId) {
            var onDocumentSave, _doc2

            return _regenerator['default'].wrap(
              function _callee4$(_context4) {
                while (1) {
                  switch ((_context4.prev = _context4.next)) {
                    case 0:
                      _context4.prev = 0
                      onDocumentSave = _this.options.onDocumentSave
                      _doc2 = _this.backend.getDocument(docId)

                      if (_doc2) {
                        _context4.next = 5
                        break
                      }

                      throw new Error(
                        "Can't receive document by id: ".concat(docId)
                      )

                    case 5:
                      _context4.t0 = onDocumentSave

                      if (!_context4.t0) {
                        _context4.next = 9
                        break
                      }

                      _context4.next = 9
                      return onDocumentSave(
                        docId,
                        (0, _bridge.toJS)(_doc2.children)
                      )

                    case 9:
                      _context4.next = 14
                      break

                    case 11:
                      _context4.prev = 11
                      _context4.t1 = _context4['catch'](0)
                      console.error(_context4.t1, docId)

                    case 14:
                    case 'end':
                      return _context4.stop()
                  }
                }
              },
              _callee4,
              null,
              [[0, 11]]
            )
          })
        )

        return function(_x7) {
          return _ref5.apply(this, arguments)
        }
      })()
    )
    ;(0, _defineProperty2['default'])(this, 'onDisconnect', function(
      id,
      socket
    ) {
      return /*#__PURE__*/ (0, _asyncToGenerator2['default'])(
        /*#__PURE__*/ _regenerator['default'].mark(function _callee5() {
          return _regenerator['default'].wrap(function _callee5$(_context5) {
            while (1) {
              switch ((_context5.prev = _context5.next)) {
                case 0:
                  _this.backend.closeConnection(id)

                  _context5.next = 3
                  return _this.saveDocument(socket.nsp.name)

                case 3:
                  _this.garbageCursors(socket.nsp.name)

                  socket.leave(id)

                  _this.garbageNsp()

                case 6:
                case 'end':
                  return _context5.stop()
              }
            }
          }, _callee5)
        })
      )
    })
    ;(0, _defineProperty2['default'])(this, 'garbageNsp', function() {
      Object.keys(_this.io.nsps)
        .filter(function(n) {
          return n !== '/'
        })
        .forEach(function(nsp) {
          ;(0, _utils.getClients)(_this.io, nsp).then(function(clientsList) {
            if (!clientsList.length) {
              _this.backend.removeDocument(nsp)

              delete _this.io.nsps[nsp]
            }
          })
        })
    })
    ;(0, _defineProperty2['default'])(this, 'garbageCursors', function(nsp) {
      var _Object$keys

      var doc = _this.backend.getDocument(nsp)

      if (!doc.cursors) return

      var namespace = _this.io.of(nsp)

      ;(_Object$keys = Object.keys(
        doc === null || doc === void 0 ? void 0 : doc.cursors
      )) === null || _Object$keys === void 0
        ? void 0
        : _Object$keys.forEach(function(key) {
            if (!namespace.sockets[key]) {
              _this.backend.garbageCursor(nsp, key)
            }
          })
    })
    ;(0, _defineProperty2['default'])(
      this,
      'destroy',
      /*#__PURE__*/ (0, _asyncToGenerator2['default'])(
        /*#__PURE__*/ _regenerator['default'].mark(function _callee6() {
          return _regenerator['default'].wrap(function _callee6$(_context6) {
            while (1) {
              switch ((_context6.prev = _context6.next)) {
                case 0:
                  _this.io.close()

                case 1:
                case 'end':
                  return _context6.stop()
              }
            }
          }, _callee6)
        })
      )
    )
    this.io = (0, _socket['default'])(options.entry, options.connectOpts)
    this.backend = new _AutomergeBackend['default']()
    this.options = options
    this.configure()
    return this
  }
/**
 * Initial IO configuration
 */
exports['default'] = SocketIOCollaboration
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Tb2NrZXRJT0Nvbm5lY3Rpb24udHMiXSwibmFtZXMiOlsiU29ja2V0SU9Db2xsYWJvcmF0aW9uIiwib3B0aW9ucyIsImlvIiwib2YiLCJuc3BNaWRkbGV3YXJlIiwidXNlIiwiYXV0aE1pZGRsZXdhcmUiLCJvbiIsIm9uQ29ubmVjdCIsInBhdGgiLCJxdWVyeSIsIm5leHQiLCJvbkRvY3VtZW50TG9hZCIsImJhY2tlbmQiLCJnZXREb2N1bWVudCIsImRlZmF1bHRWYWx1ZSIsImRvYyIsImFwcGVuZERvY3VtZW50Iiwic29ja2V0IiwiaGFuZHNoYWtlIiwib25BdXRoUmVxdWVzdCIsInBlcm1pdCIsIkVycm9yIiwiaWQiLCJjb25uIiwibmFtZSIsIm5zcCIsImNyZWF0ZUNvbm5lY3Rpb24iLCJ0eXBlIiwicGF5bG9hZCIsImVtaXQiLCJvbk1lc3NhZ2UiLCJvbkRpc2Nvbm5lY3QiLCJqb2luIiwiQXV0b21lcmdlIiwic2F2ZSIsIm9wZW5Db25uZWN0aW9uIiwiZ2FyYmFnZUN1cnNvcnMiLCJkYXRhIiwicmVjZWl2ZU9wZXJhdGlvbiIsImF1dG9TYXZlRG9jIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJkb2NJZCIsInNhdmVEb2N1bWVudCIsInNhdmVGcmVxdWVuY3kiLCJvbkRvY3VtZW50U2F2ZSIsImNoaWxkcmVuIiwiZXJyb3IiLCJjbG9zZUNvbm5lY3Rpb24iLCJsZWF2ZSIsImdhcmJhZ2VOc3AiLCJPYmplY3QiLCJrZXlzIiwibnNwcyIsImZpbHRlciIsIm4iLCJmb3JFYWNoIiwidGhlbiIsImNsaWVudHNMaXN0IiwibGVuZ3RoIiwicmVtb3ZlRG9jdW1lbnQiLCJjdXJzb3JzIiwibmFtZXNwYWNlIiwia2V5Iiwic29ja2V0cyIsImdhcmJhZ2VDdXJzb3IiLCJjbG9zZSIsImVudHJ5IiwiY29ubmVjdE9wdHMiLCJBdXRvbWVyZ2VCYWNrZW5kIiwiY29uZmlndXJlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7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QUE7O0FBQ2hDLFFBQU1WLEdBQUcsR0FBRyxLQUFJLENBQUNILE9BQUwsQ0FBYUMsV0FBYixDQUF5QlksR0FBekIsQ0FBWjs7QUFFQSxRQUFJLENBQUNWLEdBQUcsQ0FBQytDLE9BQVQsRUFBa0I7O0FBRWxCLFFBQU1DLFNBQVMsR0FBRyxLQUFJLENBQUM5RCxFQUFMLENBQVFDLEVBQVIsQ0FBV3VCLEdBQVgsQ0FBbEI7O0FBRUEsb0JBQUEyQixNQUFNLENBQUNDLElBQVAsQ0FBWXRDLEdBQVosYUFBWUEsR0FBWix1QkFBWUEsR0FBRyxDQUFFK0MsT0FBakIsK0RBQTJCTCxPQUEzQixDQUFtQyxVQUFBTyxHQUFHLEVBQUk7QUFDeEMsVUFBSSxDQUFDRCxTQUFTLENBQUNFLE9BQVYsQ0FBa0JELEdBQWxCLENBQUwsRUFBNkI7QUFDM0IsUUFBQSxLQUFJLENBQUNwRCxPQUFMLENBQWFzRCxhQUFiLENBQTJCekMsR0FBM0IsRUFBZ0N1QyxHQUFoQztBQUNEO0FBQ0YsS0FKRDtBQUtELEdBbE1rRDtBQUFBLCtJQXdNekM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNSLFlBQUEsS0FBSSxDQUFDL0QsRUFBTCxDQUFRa0UsS0FBUjs7QUFEUTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQXhNeUM7QUFDakQsT0FBS2xFLEVBQUwsR0FBVSx3QkFBR0QsT0FBTyxDQUFDb0UsS0FBWCxFQUFrQnBFLE9BQU8sQ0FBQ3FFLFdBQTFCLENBQVY7QUFFQSxPQUFLekQsT0FBTCxHQUFlLElBQUkwRCw0QkFBSixFQUFmO0FBRUEsT0FBS3RFLE9BQUwsR0FBZUEsT0FBZjtBQUVBLE9BQUt1RSxTQUFMO0FBRUEsU0FBTyxJQUFQO0FBQ0Q7QUFFRDtBQUNGO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW8gZnJvbSAnc29ja2V0LmlvJ1xuaW1wb3J0ICogYXMgQXV0b21lcmdlIGZyb20gJ2F1dG9tZXJnZSdcbmltcG9ydCB7IE5vZGUgfSBmcm9tICdzbGF0ZSdcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJ2h0dHAnXG5cbmltcG9ydCB0aHJvdHRsZSBmcm9tICdsb2Rhc2gvdGhyb3R0bGUnXG5cbmltcG9ydCB7IFN5bmNEb2MsIENvbGxhYkFjdGlvbiwgdG9KUyB9IGZyb20gJ0BzbGF0ZS1jb2xsYWJvcmF0aXZlL2JyaWRnZSdcblxuaW1wb3J0IHsgZ2V0Q2xpZW50cyB9IGZyb20gJy4vdXRpbHMnXG5cbmltcG9ydCBBdXRvbWVyZ2VCYWNrZW5kIGZyb20gJy4vQXV0b21lcmdlQmFja2VuZCdcblxuZXhwb3J0IGludGVyZmFjZSBTb2NrZXRJT0NvbGxhYm9yYXRpb25PcHRpb25zIHtcbiAgZW50cnk6IG51bWJlciAvL3wgU2VydmVyXG4gIGNvbm5lY3RPcHRzPzogU29ja2V0SU8uU2VydmVyT3B0aW9uc1xuICBkZWZhdWx0VmFsdWU/OiBOb2RlW11cbiAgc2F2ZUZyZXF1ZW5jeT86IG51bWJlclxuICBvbkF1dGhSZXF1ZXN0PzogKFxuICAgIHF1ZXJ5OiBPYmplY3QsXG4gICAgc29ja2V0PzogU29ja2V0SU8uU29ja2V0XG4gICkgPT4gUHJvbWlzZTxib29sZWFuPiB8IGJvb2xlYW5cbiAgb25Eb2N1bWVudExvYWQ/OiAoXG4gICAgcGF0aG5hbWU6IHN0cmluZyxcbiAgICBxdWVyeT86IE9iamVjdFxuICApID0+IFByb21pc2U8Tm9kZVtdPiB8IE5vZGVbXVxuICBvbkRvY3VtZW50U2F2ZT86IChwYXRobmFtZTogc3RyaW5nLCBkb2M6IE5vZGVbXSkgPT4gUHJvbWlzZTx2b2lkPiB8IHZvaWRcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29ja2V0SU9Db2xsYWJvcmF0aW9uIHtcbiAgcHJpdmF0ZSBpbzogU29ja2V0SU8uU2VydmVyXG4gIHByaXZhdGUgb3B0aW9uczogU29ja2V0SU9Db2xsYWJvcmF0aW9uT3B0aW9uc1xuICBwcml2YXRlIGJhY2tlbmQ6IEF1dG9tZXJnZUJhY2tlbmRcblxuICAvKipcbiAgICogQ29uc3RydWN0b3JcbiAgICovXG5cbiAgY29uc3RydWN0b3Iob3B0aW9uczogU29ja2V0SU9Db2xsYWJvcmF0aW9uT3B0aW9ucykge1xuICAgIHRoaXMuaW8gPSBpbyhvcHRpb25zLmVudHJ5LCBvcHRpb25zLmNvbm5lY3RPcHRzKVxuXG4gICAgdGhpcy5iYWNrZW5kID0gbmV3IEF1dG9tZXJnZUJhY2tlbmQoKVxuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuXG4gICAgdGhpcy5jb25maWd1cmUoKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsIElPIGNvbmZpZ3VyYXRpb25cbiAgICovXG5cbiAgcHJpdmF0ZSBjb25maWd1cmUgPSAoKSA9PlxuICAgIHRoaXMuaW9cbiAgICAgIC5vZih0aGlzLm5zcE1pZGRsZXdhcmUpXG4gICAgICAudXNlKHRoaXMuYXV0aE1pZGRsZXdhcmUpXG4gICAgICAub24oJ2Nvbm5lY3QnLCB0aGlzLm9uQ29ubmVjdClcblxuICAvKipcbiAgICogTmFtZXNwYWNlIFNvY2tldElPIG1pZGRsZXdhcmUuIExvYWQgZG9jdW1lbnQgdmFsdWUgYW5kIGFwcGVuZCBpdCB0byBDb2xsYWJvcmF0aW9uQmFja2VuZC5cbiAgICovXG5cbiAgcHJpdmF0ZSBuc3BNaWRkbGV3YXJlID0gYXN5bmMgKHBhdGg6IHN0cmluZywgcXVlcnk6IGFueSwgbmV4dDogYW55KSA9PiB7XG4gICAgY29uc3QgeyBvbkRvY3VtZW50TG9hZCB9ID0gdGhpcy5vcHRpb25zXG5cbiAgICBpZiAoIXRoaXMuYmFja2VuZC5nZXREb2N1bWVudChwYXRoKSkge1xuICAgICAgY29uc3QgZG9jID0gb25Eb2N1bWVudExvYWRcbiAgICAgICAgPyBhd2FpdCBvbkRvY3VtZW50TG9hZChwYXRoLCBxdWVyeSlcbiAgICAgICAgOiB0aGlzLm9wdGlvbnMuZGVmYXVsdFZhbHVlXG5cbiAgICAgIGlmICghZG9jKSByZXR1cm4gbmV4dChudWxsLCBmYWxzZSlcblxuICAgICAgaWYgKCF0aGlzLmJhY2tlbmQuZ2V0RG9jdW1lbnQocGF0aCkpIHtcbiAgICAgICAgdGhpcy5iYWNrZW5kLmFwcGVuZERvY3VtZW50KHBhdGgsIGRvYylcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dChudWxsLCB0cnVlKVxuICB9XG5cbiAgLyoqXG4gICAqIFNvY2tldElPIGF1dGggbWlkZGxld2FyZS4gVXNlZCBmb3IgdXNlciBhdXRoZW50aWZpY2F0aW9uLlxuICAgKi9cblxuICBwcml2YXRlIGF1dGhNaWRkbGV3YXJlID0gYXN5bmMgKFxuICAgIHNvY2tldDogU29ja2V0SU8uU29ja2V0LFxuICAgIG5leHQ6IChlPzogYW55KSA9PiB2b2lkXG4gICkgPT4ge1xuICAgIGNvbnN0IHsgcXVlcnkgfSA9IHNvY2tldC5oYW5kc2hha2VcbiAgICBjb25zdCB7IG9uQXV0aFJlcXVlc3QgfSA9IHRoaXMub3B0aW9uc1xuXG4gICAgaWYgKG9uQXV0aFJlcXVlc3QpIHtcbiAgICAgIGNvbnN0IHBlcm1pdCA9IGF3YWl0IG9uQXV0aFJlcXVlc3QocXVlcnksIHNvY2tldClcblxuICAgICAgaWYgKCFwZXJtaXQpXG4gICAgICAgIHJldHVybiBuZXh0KG5ldyBFcnJvcihgQXV0aGVudGlmaWNhdGlvbiBlcnJvcjogJHtzb2NrZXQuaWR9YCkpXG4gICAgfVxuXG4gICAgcmV0dXJuIG5leHQoKVxuICB9XG5cbiAgLyoqXG4gICAqIE9uICdjb25uZWN0JyBoYW5kbGVyLlxuICAgKi9cblxuICBwcml2YXRlIG9uQ29ubmVjdCA9IChzb2NrZXQ6IFNvY2tldElPLlNvY2tldCkgPT4ge1xuICAgIGNvbnN0IHsgaWQsIGNvbm4gfSA9IHNvY2tldFxuICAgIGNvbnN0IHsgbmFtZSB9ID0gc29ja2V0Lm5zcFxuXG4gICAgdGhpcy5iYWNrZW5kLmNyZWF0ZUNvbm5lY3Rpb24oaWQsICh7IHR5cGUsIHBheWxvYWQgfTogQ29sbGFiQWN0aW9uKSA9PiB7XG4gICAgICBzb2NrZXQuZW1pdCgnbXNnJywgeyB0eXBlLCBwYXlsb2FkOiB7IGlkOiBjb25uLmlkLCAuLi5wYXlsb2FkIH0gfSlcbiAgICB9KVxuXG4gICAgc29ja2V0Lm9uKCdtc2cnLCB0aGlzLm9uTWVzc2FnZShpZCwgbmFtZSkpXG5cbiAgICBzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCB0aGlzLm9uRGlzY29ubmVjdChpZCwgc29ja2V0KSlcblxuICAgIHNvY2tldC5qb2luKGlkLCAoKSA9PiB7XG4gICAgICBjb25zdCBkb2MgPSB0aGlzLmJhY2tlbmQuZ2V0RG9jdW1lbnQobmFtZSlcblxuICAgICAgc29ja2V0LmVtaXQoJ21zZycsIHtcbiAgICAgICAgdHlwZTogJ2RvY3VtZW50JyxcbiAgICAgICAgcGF5bG9hZDogQXV0b21lcmdlLnNhdmU8U3luY0RvYz4oZG9jKVxuICAgICAgfSlcblxuICAgICAgdGhpcy5iYWNrZW5kLm9wZW5Db25uZWN0aW9uKGlkKVxuICAgIH0pXG5cbiAgICB0aGlzLmdhcmJhZ2VDdXJzb3JzKG5hbWUpXG4gIH1cblxuICAvKipcbiAgICogT24gJ21lc3NhZ2UnIGhhbmRsZXJcbiAgICovXG5cbiAgcHJpdmF0ZSBvbk1lc3NhZ2UgPSAoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nKSA9PiAoZGF0YTogYW55KSA9PiB7XG4gICAgc3dpdGNoIChkYXRhLnR5cGUpIHtcbiAgICAgIGNhc2UgJ29wZXJhdGlvbic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhpcy5iYWNrZW5kLnJlY2VpdmVPcGVyYXRpb24oaWQsIGRhdGEpXG5cbiAgICAgICAgICB0aGlzLmF1dG9TYXZlRG9jKG5hbWUpXG5cbiAgICAgICAgICB0aGlzLmdhcmJhZ2VDdXJzb3JzKG5hbWUpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlKVxuICAgICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgZG9jdW1lbnQgd2l0aCB0aHJvdHRsZVxuICAgKi9cblxuICBwcml2YXRlIGF1dG9TYXZlRG9jID0gdGhyb3R0bGUoXG4gICAgYXN5bmMgKGRvY0lkOiBzdHJpbmcpID0+XG4gICAgICB0aGlzLmJhY2tlbmQuZ2V0RG9jdW1lbnQoZG9jSWQpICYmIHRoaXMuc2F2ZURvY3VtZW50KGRvY0lkKSxcbiAgICB0aGlzLm9wdGlvbnM/LnNhdmVGcmVxdWVuY3kgfHwgMjAwMFxuICApXG5cbiAgLyoqXG4gICAqIFNhdmUgZG9jdW1lbnRcbiAgICovXG5cbiAgcHJpdmF0ZSBzYXZlRG9jdW1lbnQgPSBhc3luYyAoZG9jSWQ6IHN0cmluZykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IG9uRG9jdW1lbnRTYXZlIH0gPSB0aGlzLm9wdGlvbnNcblxuICAgICAgY29uc3QgZG9jID0gdGhpcy5iYWNrZW5kLmdldERvY3VtZW50KGRvY0lkKVxuXG4gICAgICBpZiAoIWRvYykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbid0IHJlY2VpdmUgZG9jdW1lbnQgYnkgaWQ6ICR7ZG9jSWR9YClcbiAgICAgIH1cblxuICAgICAgb25Eb2N1bWVudFNhdmUgJiYgKGF3YWl0IG9uRG9jdW1lbnRTYXZlKGRvY0lkLCB0b0pTKGRvYy5jaGlsZHJlbikpKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSwgZG9jSWQpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE9uICdkaXNjb25uZWN0JyBoYW5kbGVyXG4gICAqL1xuXG4gIHByaXZhdGUgb25EaXNjb25uZWN0ID0gKGlkOiBzdHJpbmcsIHNvY2tldDogU29ja2V0SU8uU29ja2V0KSA9PiBhc3luYyAoKSA9PiB7XG4gICAgdGhpcy5iYWNrZW5kLmNsb3NlQ29ubmVjdGlvbihpZClcblxuICAgIGF3YWl0IHRoaXMuc2F2ZURvY3VtZW50KHNvY2tldC5uc3AubmFtZSlcblxuICAgIHRoaXMuZ2FyYmFnZUN1cnNvcnMoc29ja2V0Lm5zcC5uYW1lKVxuXG4gICAgc29ja2V0LmxlYXZlKGlkKVxuXG4gICAgdGhpcy5nYXJiYWdlTnNwKClcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbiB1cCB1bnVzZWQgU29ja2V0SU8gbmFtZXNwYWNlcy5cbiAgICovXG5cbiAgZ2FyYmFnZU5zcCA9ICgpID0+IHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmlvLm5zcHMpXG4gICAgICAuZmlsdGVyKG4gPT4gbiAhPT0gJy8nKVxuICAgICAgLmZvckVhY2gobnNwID0+IHtcbiAgICAgICAgZ2V0Q2xpZW50cyh0aGlzLmlvLCBuc3ApLnRoZW4oKGNsaWVudHNMaXN0OiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoIWNsaWVudHNMaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5iYWNrZW5kLnJlbW92ZURvY3VtZW50KG5zcClcblxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuaW8ubnNwc1tuc3BdXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbiB1cCB1bnVzZWQgY3Vyc29yIGRhdGEuXG4gICAqL1xuXG4gIGdhcmJhZ2VDdXJzb3JzID0gKG5zcDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgZG9jID0gdGhpcy5iYWNrZW5kLmdldERvY3VtZW50KG5zcClcblxuICAgIGlmICghZG9jLmN1cnNvcnMpIHJldHVyblxuXG4gICAgY29uc3QgbmFtZXNwYWNlID0gdGhpcy5pby5vZihuc3ApXG5cbiAgICBPYmplY3Qua2V5cyhkb2M/LmN1cnNvcnMpPy5mb3JFYWNoKGtleSA9PiB7XG4gICAgICBpZiAoIW5hbWVzcGFjZS5zb2NrZXRzW2tleV0pIHtcbiAgICAgICAgdGhpcy5iYWNrZW5kLmdhcmJhZ2VDdXJzb3IobnNwLCBrZXkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IFNvY2tldElPIGNvbm5lY3Rpb25cbiAgICovXG5cbiAgZGVzdHJveSA9IGFzeW5jICgpID0+IHtcbiAgICB0aGlzLmlvLmNsb3NlKClcbiAgfVxufVxuIl19
