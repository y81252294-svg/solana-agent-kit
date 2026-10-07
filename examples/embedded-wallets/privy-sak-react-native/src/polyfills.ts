// src/polyfills.ts
// This file provides polyfills for Node.js built-ins used by various crypto libraries

import { Buffer } from 'buffer';
import { Platform } from 'react-native';
global.Buffer = Buffer;

// Import core crypto functionality
import 'react-native-get-random-values';
import 'react-native-quick-crypto';

// Ensure process is available
import process from 'process';
if (!global.process) {
  global.process = process;
}

// Additional globals that might be needed
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('text-encoding').TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = require('text-encoding').TextDecoder;
}

// Add ReadableStream polyfill
if (typeof global.ReadableStream === 'undefined') {
  const { ReadableStream } = require('web-streams-polyfill');
  global.ReadableStream = ReadableStream;
}

// Ensure EXPO_OS is defined
if (typeof process.env.EXPO_OS === 'undefined') {
  process.env.EXPO_OS = Platform.OS;
}

// Export a function that ensures Buffer is available
export const ensureBuffer = () => {
  if (typeof global.Buffer === 'undefined') {
    console.warn('Buffer is not defined, attempting to polyfill again');
    global.Buffer = Buffer;
  }
  return global.Buffer;
}; 