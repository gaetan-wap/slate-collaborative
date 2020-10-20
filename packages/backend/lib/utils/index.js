'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.getClients = void 0

var getClients = function getClients(io, nsp) {
  return new Promise(function(r, j) {
    io.of(nsp).clients(function(e, c) {
      return e ? j(e) : r(c)
    })
  })
}

exports.getClients = getClients
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9pbmRleC50cyJdLCJuYW1lcyI6WyJnZXRDbGllbnRzIiwiaW8iLCJuc3AiLCJQcm9taXNlIiwiciIsImoiLCJvZiIsImNsaWVudHMiLCJlIiwiYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFPLElBQU1BLFVBQVUsR0FBRyxTQUFiQSxVQUFhLENBQUNDLEVBQUQsRUFBc0JDLEdBQXRCO0FBQUEsU0FDeEIsSUFBSUMsT0FBSixDQUFZLFVBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFVO0FBQ3BCSixJQUFBQSxFQUFFLENBQUNLLEVBQUgsQ0FBTUosR0FBTixFQUFXSyxPQUFYLENBQW1CLFVBQUNDLENBQUQsRUFBU0MsQ0FBVDtBQUFBLGFBQXFCRCxDQUFDLEdBQUdILENBQUMsQ0FBQ0csQ0FBRCxDQUFKLEdBQVVKLENBQUMsQ0FBQ0ssQ0FBRCxDQUFqQztBQUFBLEtBQW5CO0FBQ0QsR0FGRCxDQUR3QjtBQUFBLENBQW5CIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGdldENsaWVudHMgPSAoaW86IFNvY2tldElPLlNlcnZlciwgbnNwOiBzdHJpbmcpID0+XG4gIG5ldyBQcm9taXNlKChyLCBqKSA9PiB7XG4gICAgaW8ub2YobnNwKS5jbGllbnRzKChlOiBhbnksIGM6IGFueSkgPT4gKGUgPyBqKGUpIDogcihjKSkpXG4gIH0pXG4iXX0=
