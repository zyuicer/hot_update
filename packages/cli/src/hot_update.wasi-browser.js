import {
  instantiateNapiModuleSync as __emnapiInstantiateNapiModuleSync,
  getDefaultContext as __emnapiGetDefaultContext,
  WASI as __WASI,
  createOnMessage as __wasmCreateOnMessageForFsProxy,
} from '@napi-rs/wasm-runtime'

import __wasmUrl from './hot_update.wasm32-wasi.wasm?url'

const __wasi = new __WASI({
  version: 'preview1',
})

const __emnapiContext = __emnapiGetDefaultContext()

const __sharedMemory = new WebAssembly.Memory({
  initial: 4000,
  maximum: 65536,
  shared: true,
})

const __wasmFile = await fetch(__wasmUrl).then((res) => res.arrayBuffer())

const {
  instance: __napiInstance,
  module: __wasiModule,
  napiModule: __napiModule,
} = __emnapiInstantiateNapiModuleSync(__wasmFile, {
  context: __emnapiContext,
  asyncWorkPoolSize: 4,
  wasi: __wasi,
  onCreateWorker() {
    const worker = new Worker(new URL('./wasi-worker-browser.mjs', import.meta.url), {
      type: 'module',
    })

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
  },
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
export const AndroidClient = __napiModule.exports.AndroidClient
export const CreateAppModal = __napiModule.exports.CreateAppModal
export const loginCommand = __napiModule.exports.loginCommand
export const PlatformEnum = __napiModule.exports.PlatformEnum
