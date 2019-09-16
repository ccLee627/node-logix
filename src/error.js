"use strict";

const cipErrorCodes = {
  0x00: "Success",
  0x01: "Connection failure",
  0x02: "Resource unavailable",
  0x03: "Invalid parameter value",
  0x04: "Path segment error",
  0x05: "Path destination unknown",
  0x06: "Partial transfer",
  0x07: "Connection lost",
  0x08: "Service not supported",
  0x09: "Invalid Attribute",
  0x0a: "Attribute list error",
  0x0b: "Already in requested mode/state",
  0x0c: "Object state conflict",
  0x0d: "Object already exists",
  0x0e: "Attribute not settable",
  0x0f: "Privilege violation",
  0x10: "Device state conflict",
  0x11: "Reply data too large",
  0x12: "Fragmentation of a premitive value",
  0x13: "Not enough data",
  0x14: "Attribute not supported",
  0x15: "Too much data",
  0x16: "Object does not exist",
  0x17: "Service fragmentation sequence not in progress",
  0x18: "No stored attribute data",
  0x19: "Store operation failure",
  0x1a: "Routing failure, request packet too large",
  0x1b: "Routing failure, response packet too large",
  0x1c: "Missing attribute list entry data",
  0x1d: "Invalid attribute value list",
  0x1e: "Embedded service error",
  0x1f: "Vendor specific",
  0x20: "Invalid Parameter",
  0x21: "Write once value or medium already written",
  0x22: "Invalid reply received",
  0x23: "Buffer overflow",
  0x24: "Invalid message format",
  0x25: "Key failure in path",
  0x26: "Path size invalid",
  0x27: "Unexpected attribute in list",
  0x28: "Invalid member ID",
  0x29: "Member not settable",
  0x2a: "Group 2 only server general failure",
  0x2b: "Unknown Modbus error",
  0x2c: "Attribute not gettable"
};

class ValueError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValueError";
  }
}

class LogixError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "LogixError";
    this.code = code || null;
  }
}

class ConnectionError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConnectionError";
  }
}

class ConnectionTimeout extends Error {
  constructor(message, timeout) {
    super(message + " timeout at " + timeout + "ms");
    this.name = "ConnectionTimeout";
    this.timeout = timeout;
  }
}

class DisconnectedError extends Error {
  constructor() {
    super("Failed to send data, PLC was disconnected or no connected yet");
    this.name = "DisconnectedError";
  }
}

class UnReachableError extends Error {
  constructor(port = "", ip = "") {
    super(ip + " IP not reachable or PLC not connected");
    this.name = "UnReachableError";
    if (ip !== "" && port !== "") {
      this.ip = ip;
      this.port = port;
    }
  }
}

class RegisterSessionError extends ConnectionError {
  constructor() {
    super("Failed to register session");
  }
}

class ConnectionLostError extends ConnectionError {
  constructor() {
    super(cipErrorCodes[7]);
    this.status = 7;
  }
}

class ForwarOpenError extends ConnectionError {
  constructor() {
    super("Forward open Failed");
  }
}

class PinMappingError extends Error {
  constructor(message) {
    super("Pin mapping error: " + message);
    this.name = "PinMappingError";
  }
}

const defaultErrors = {
  PinMappingError,
  ForwarOpenError,
  ConnectionLostError,
  RegisterSessionError,
  UnReachableError,
  DisconnectedError,
  ConnectionTimeout,
  LogixError,
  ValueError,
  ConnectionError,
  cipErrorCodes
};

exports.PinMappingError = PinMappingError;
exports.ForwarOpenError = ForwarOpenError;
exports.ConnectionLostError = ConnectionLostError;
exports.RegisterSessionError = RegisterSessionError;
exports.UnReachableError = UnReachableError;
exports.DisconnectedError = DisconnectedError;
exports.ConnectionTimeout = ConnectionTimeout;
exports.LogixError = LogixError;
exports.ValueError = ValueError;
exports.ConnectionError = ConnectionError;
exports.cipErrorCodes = cipErrorCodes;

module.exports = defaultErrors;
exports.default = defaultErrors;