import winston from 'winston'
import CPUConfig from './emu/CPUConfig'
import CPU8086 from './emu/8086.js'
import {
  regAH, regAL, regBH, regBL, regCH, regCL, regDH, regDL,
  regAX, regBX, regCX, regDX,
  regSI, regDI, regBP, regSP, regIP,
  regCS, regDS, regES, regSS,
  regFlags,
  FLAG_CF_MASK, FLAG_PF_MASK, FLAG_AF_MASK, FLAG_ZF_MASK, FLAG_SF_MASK,
  FLAG_TF_MASK, FLAG_IF_MASK, FLAG_DF_MASK, FLAG_OF_MASK,
} from './emu/Constants';
import { binString8, binString16, hexString8, hexString16, formatOpcode} from './emu/Debug'

winston.level = 'debug';

let codegolf = [
  0x81, 0xFC, 0x00, 0x01, 0x74, 0x01, 0xF4, 0xBC, 0x00, 0x10, 0xB0, 0x2E, 0xBB,
  0x00, 0x00, 0x4B, 0x83, 0xFB, 0xFF, 0x75, 0xF1, 0xE8, 0x51, 0x01, 0x43, 0x75,
  0xEB, 0xE8, 0x4B, 0x01, 0x31, 0xC9, 0x09, 0xCB, 0x75, 0xE2, 0x72, 0xE0, 0xE8,
  0x40, 0x01, 0xB9, 0x00, 0x80, 0x39, 0xD9, 0x76, 0xD6, 0xE8, 0x36, 0x01, 0x01,
  0xCB, 0x72, 0xCF, 0xE8, 0x2F, 0x01, 0x01, 0xDB, 0x83, 0xD1, 0x00, 0x79, 0xC5,
  0x72, 0xC3, 0x51, 0x83, 0xE1, 0x01, 0x74, 0xBD, 0xE8, 0x1D, 0x01, 0x59, 0xF9,
  0xBB, 0x00, 0x80, 0x19, 0xD9, 0x75, 0xB1, 0x72, 0xAF, 0xE8, 0x0F, 0x01, 0xE8,
  0x00, 0x00, 0x5B, 0x81, 0xFB, 0x5D, 0x00, 0x75, 0xA2, 0x81, 0xFC, 0x00, 0x10,
  0x75, 0x9C, 0xE8, 0xFC, 0x00, 0xBB, 0x72, 0x00, 0x53, 0xC3, 0x81, 0xFC, 0x00,
  0x10, 0x75, 0x8E, 0xE8, 0xEE, 0x00, 0x90, 0x90, 0x90, 0xEB, 0x01, 0xF4, 0xE8,
  0xF8, 0x00, 0xB8, 0xC5, 0x01, 0xE8, 0xCA, 0x00, 0xE8, 0xEF, 0x00, 0xB0, 0x30,
  0xE8, 0xD7, 0x00, 0xFE, 0xC0, 0x3C, 0x7F, 0x75, 0xF7, 0xB0, 0x23, 0xC7, 0x06,
  0xD3, 0x01, 0x90, 0x01, 0xB1, 0x50, 0xE8, 0xC4, 0x00, 0xFE, 0xC9, 0x75, 0xF9,
  0x81, 0x3E, 0xD3, 0x01, 0xE0, 0x01, 0x75, 0x0A, 0xB1, 0x50, 0xC7, 0x06, 0xD3,
  0x01, 0x80, 0x07, 0xEB, 0xE7, 0xC7, 0x06, 0xD3, 0x01, 0xE0, 0x01, 0xB1, 0x12,
  0xE8, 0xA3, 0x00, 0xE8, 0xA0, 0x00, 0x83, 0x06, 0xD3, 0x01, 0x4C, 0xE8, 0x98,
  0x00, 0xE8, 0x95, 0x00, 0xFE, 0xC9, 0x75, 0xEB, 0xC7, 0x06, 0xD3, 0x01, 0x34,
  0x02, 0x31, 0xC0, 0xBA, 0x01, 0x00, 0xB9, 0x11, 0x00, 0x01, 0xC2, 0xE8, 0x9F,
  0x00, 0x50, 0xB8, 0x20, 0x00, 0xE8, 0x77, 0x00, 0x58, 0x92, 0x49, 0x75, 0xEF,
  0xC7, 0x06, 0xD3, 0x01, 0xD4, 0x02, 0xB9, 0x00, 0x00, 0x89, 0xC8, 0xE8, 0x3F,
  0x00, 0xE8, 0x82, 0x00, 0xB8, 0x20, 0x00, 0xE8, 0x5B, 0x00, 0x41, 0x83, 0xF9,
  0x14, 0x76, 0xEC, 0xC7, 0x06, 0xD3, 0x01, 0x74, 0x03, 0xBB, 0x02, 0x00, 0x80,
  0x8F, 0xD5, 0x01, 0x00, 0x75, 0x19, 0x89, 0xD8, 0xE8, 0x61, 0x00, 0xB8, 0x20,
  0x00, 0xE8, 0x3A, 0x00, 0x89, 0xDF, 0x80, 0x8D, 0xD5, 0x01, 0x01, 0x01, 0xDF,
  0x83, 0xFF, 0x65, 0x76, 0xF4, 0x43, 0x83, 0xFB, 0x64, 0x76, 0xDA, 0xF4, 0x89,
  0xC3, 0x31, 0xD2, 0x09, 0xDB, 0x74, 0x05, 0x01, 0xC2, 0x4B, 0xEB, 0xF9, 0x89,
  0xD0, 0xC3, 0x53, 0x52, 0x89, 0xC3, 0x8A, 0x17, 0x43, 0x86, 0xC2, 0xE8, 0x09,
  0x00, 0x86, 0xC2, 0x20, 0xD2, 0x75, 0xF2, 0x5A, 0x5B, 0xC3, 0x53, 0x57, 0xBB,
  0x00, 0x80, 0x8B, 0x3E, 0xD3, 0x01, 0x88, 0x01, 0x47, 0x89, 0x3E, 0xD3, 0x01,
  0x5F, 0x5B, 0xC3, 0x8B, 0x3E, 0xD3, 0x01, 0x83, 0xEF, 0x50, 0x79, 0xFB, 0x29,
  0x3E, 0xD3, 0x01, 0xC3, 0x53, 0x50, 0xB3, 0x30, 0x83, 0xF8, 0x09, 0x76, 0x2A,
  0x83, 0xF8, 0x63, 0x76, 0x13, 0x83, 0xE8, 0x64, 0xFE, 0xC3, 0x83, 0xF8, 0x63,
  0x77, 0xF6, 0x86, 0xD8, 0xE8, 0xC2, 0xFF, 0x86, 0xD8, 0xB3, 0x30, 0x83, 0xF8,
  0x09, 0x76, 0x06, 0x83, 0xE8, 0x0A, 0x43, 0xEB, 0xF5, 0x86, 0xC3, 0xE8, 0xAE,
  0xFF, 0x88, 0xD8, 0x04, 0x30, 0xE8, 0xA7, 0xFF, 0x58, 0x5B, 0xC3, 0x48, 0x65,
  0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x77, 0x6F, 0x72, 0x6C, 0x64, 0x21, 0x00, 0x00,
  0x00];

let config = new CPUConfig({
  memorySize: 1024,
});
let cpu = new CPU8086(config);

for (let i = 0; i < codegolf.length; i++) {
  cpu.mem8[i] = codegolf[i];
}
cpu.reg16[regIP] = 0;
cpu.reg16[regSP] = 0x100;

cpu.cycle();
// cpu.cycle();
