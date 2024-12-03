/* eslint-disable */
/* prettier-ignore */

/* auto-generated by NAPI-RS */

const __nodeFs = require('node:fs')
const __nodePath = require('node:path')
const { WASI: __nodeWASI } = require('node:wasi')
const { Worker } = require('node:worker_threads')

const {
  instantiateNapiModuleSync: __emnapiInstantiateNapiModuleSync,
  getDefaultContext: __emnapiGetDefaultContext,
  createOnMessage: __wasmCreateOnMessageForFsProxy,
} = require('@napi-rs/wasm-runtime')

const __rootDir = __nodePath.parse(process.cwd()).root

const __wasi = new __nodeWASI({
  version: 'preview1',
  env: process.env,
  preopens: {
    [__rootDir]: __rootDir,
  }
})

const __emnapiContext = __emnapiGetDefaultContext()

const __sharedMemory = new WebAssembly.Memory({
  initial: 4000,
  maximum: 65536,
  shared: true,
})

let __wasmFilePath = __nodePath.join(__dirname, 'hot_update.wasm32-wasi.wasm')
const __wasmDebugFilePath = __nodePath.join(__dirname, 'hot_update.wasm32-wasi.debug.wasm')

if (__nodeFs.existsSync(__wasmDebugFilePath)) {
  __wasmFilePath = __wasmDebugFilePath
} else if (!__nodeFs.existsSync(__wasmFilePath)) {
  try {
    __wasmFilePath = __nodePath.resolve('hot_update-wasm32-wasi')
  } catch {
    throw new Error('Cannot find hot_update.wasm32-wasi.wasm file, and hot_update-wasm32-wasi package is not installed.')
  }
}

const { instance: __napiInstance, module: __wasiModule, napiModule: __napiModule } = __emnapiInstantiateNapiModuleSync(__nodeFs.readFileSync(__wasmFilePath), {
  context: __emnapiContext,
  asyncWorkPoolSize: (function() {
    const threadsSizeFromEnv = Number(process.env.NAPI_RS_ASYNC_WORK_POOL_SIZE ?? process.env.UV_THREADPOOL_SIZE)
    // NaN > 0 is false
    if (threadsSizeFromEnv > 0) {
      return threadsSizeFromEnv
    } else {
      return 4
    }
  })(),
  wasi: __wasi,
  onCreateWorker() {
    const worker = new Worker(__nodePath.join(__dirname, 'wasi-worker.mjs'), {
      env: process.env,
      execArgv: ['--experimental-wasi-unstable-preview1'],
    })
    worker.onmessage = ({ data }) => {
      __wasmCreateOnMessageForFsProxy(__nodeFs)(data)
    }
    return worker
  },
  overwriteImports(importObject) {
    importObject.env = {
      ...importObject.env,
      ...importObject.napi,
      ...importObject.emnapi,
      memory: __sharedMemory,
    }
    return importObject
  },
  beforeInit({ instance }) {
    __napi_rs_initialize_modules(instance)
  }
})

function __napi_rs_initialize_modules(__napiInstance) {
  __napiInstance.exports['__napi_register__CreateAppModal_struct_0']?.()
  __napiInstance.exports['__napi_register__AndroidClient_struct_1']?.()
  __napiInstance.exports['__napi_register__AndroidClient_impl_4']?.()
  __napiInstance.exports['__napi_register__LoginParams_struct_5']?.()
  __napiInstance.exports['__napi_register__login_command_6']?.()
  __napiInstance.exports['__napi_register__InputClientOptions_struct_7']?.()
  __napiInstance.exports['__napi_register__PlatformEnum_8']?.()
  __napiInstance.exports['__napi_register__BindingInputOptions_struct_9']?.()
}
module.exports.AndroidClient = __napiModule.exports.AndroidClient
module.exports.CreateAppModal = __napiModule.exports.CreateAppModal
module.exports.loginCommand = __napiModule.exports.loginCommand
module.exports.PlatformEnum = __napiModule.exports.PlatformEnum
