'use strict'
module.exports = exports;
exports.DBError = class DBError extends Error {};
exports.IllegalAccessError = class IllegalAccessError extends Error {};
exports.InvalidFormatError =  class InvalidFormatError extends Error {};
exports.SocketError = class SocketError extends Error {};
exports.UntreatableError = class UntreatableError extends Error {};
exports.HostConnectionError = class HostConnectionError extends Error {};