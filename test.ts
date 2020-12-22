import { config } from 'dotenv'

config()

// でたらめな変数名．環境変数にないのでundefinedになる
const environ = process.env.A_VAR_NOT_EXIST
// (1) ||は左辺がfalsyなら右辺を返す
const port = parseInt(environ as string, 10) || 5000
// (2) ??は||と違い，nullとundefined以外のfalsyな値のときには左の値を返す
// (当然だが左の値がtruthyなら左の値を返す)
// つまり左辺がfalsyでも0,-0,NaN,false,''は採用される
// const port = parseInt(environ as string, 10) ?? 5000

console.log(environ) // undefined
console.log(typeof environ) // 'undefined'

const nullval = null
console.log(nullval) // null
console.log(typeof nullval) // object

console.log(parseInt(environ as string, 10)) // NaN
console.log(isNaN(parseInt(environ as string, 10))) // true
// isNaN()よりはNumber.isNaN()のほうが厳密らしい
console.log(Number.isNaN(parseInt(environ as string, 10))) // true <- ???
console.log(typeof parseInt(environ as string, 10)) // 'number'

console.log(port) // (1) 5000 (2) NaN
console.log(typeof port) // (1) 'number' (2) NaNも(Not-A-Numberのくせに)number型ではあるので'number'

console.assert(Number.isFinite(parseInt(environ as string)),
  '"NaN"はダメ．有限数にしてください') // Assertion failed: "NaN"はダメ．有限数にしてください
