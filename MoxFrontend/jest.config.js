import { createDefaultPreset } from 'ts-jest'

const tsJestTransformCfg = createDefaultPreset().transform

// jest.config.js
export const testEnvironment = 'jsdom'
export const transform = {
  ...tsJestTransformCfg
}
export const globals = {
  'ts-jest': {
    tsconfig: 'tsconfig.web.json'
  }
}
