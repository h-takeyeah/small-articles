const mysql = require('mysql2/promise')

const main =  async () => {
  try {
    console.log('QUERY BEGIN\n')
    const [row2, _] = await con.query('SELECT * FROM users_in_room')
    formatAsTable(row1, _)
    const [row2, _] = await con.query('SELECT code, surfacearea FROM country LIMIT 10')
    formatAsTable(row2, _)
  } catch (e) {
    console.error(e)
  } finally {
    con.close()
    console.log('\nQUERY END')
  }
}

function formatAsTable(row, field=null) {
  if (!Array.isArray(row)) return
  console.log('Length of returned array :', row.length)
  if (row.length === 0) return
  // 何行目でも同じなのだけれど, ここでは1行目の列情報を利用する
  const colNames = Object.keys(row[0])
  // テーブルに整形するための前準備
  let preSearchMemo = new Map()
  colNames.forEach(colName => preSearchMemo.set(colName, 0))
  row.forEach(tuple => {
    colNames.forEach(colName => {
      const data = tuple[colName]
      // console.log(colName, data)
      const champion = preSearchMemo.get(colName)
      // console.log('champion', champion)
      let challenger = 0
      if (data !== null && data.constructor === Date) challenger = data.toISOString().length
      else challenger = String(data).length
      // console.log(challenger)

      const winner = challenger > champion ? challenger : champion
      // console.log('winner', winner)
      preSearchMemo.set(colName, winner)
    })
    // console.log(preSearchMemo.entries())
  })

  const result = new Map()

  preSearchMemo.forEach((maximumRecord, colName) => {
    const sub = maximumRecord - colName.length
    if (sub <= 0) result.set(colName, [true, Math.abs(sub), maximumRecord])  // レコードの欄を列名の欄の幅に合わせる
    else result.set(colName, [false, sub, maximumRecord])                    // 列名の欄の幅をレコードの枠の幅に合わせる
  })
  // console.log(result)

  let dividerAlongWithColNames = []
  let labelPre = []
  // 区切り線の長さ(= 枠の幅)を列ごとに決める
  result.forEach((v, colName) => {
    let line = ''
    if (v[0]) {
      // レコードの方をパディングして調整するので区切り線は列名に合わせた長さにする
      // 左右の空白の2文字分を足す
      for (let i = 0; i < colName.length + 2; i++) line += '-'

      // 列名を表示する行を作る
      labelPre.push(' ' + colName + ' ')
    } else {
      // 列名の方をパディングして調整するので区切り線はレコードの最大長に合わせた長さにする
      // 同じく左右の空白の2文字分を足す
      for (let i = 0; i < v[2] + 2; i++) line += '-'

      // 列名を表示する行を作る
      // 左詰めにするので列名(colName), パディングする分の空白の順に並べる
      let blank = ''
      for (let i = 0; i < v[1]; i++) blank += ' '
      labelPre.push(' ' + colName + blank + ' ')
    }
    dividerAlongWithColNames.push(line)
  })

  // 区切り線(divider)完成
  const divider = '+' + dividerAlongWithColNames.join('+') + '+'

  // 列名(label)完成
  const label = '|' + labelPre.join('|') + '|'

  // 行ごとに整形し, 1つの文字列としてまとめておく
  let rowAsString = []
  row.forEach(tuple => {
    let rowValues = []
    result.forEach((v, colName) => {
      const data = tuple[colName]
      let strExp = ''
      if (data !== null && data.constructor === Date) {
        strExp = data.toISOString()
      } else {
        if (data === null) strExp = String(data).toUpperCase() // nullではなくNULLと表示させる
        else strExp = String(data)
      }

      const diffBetweenMax = v[2] - strExp.length
      let blank = ''
      if (v[0]) {
        for (let i = 0; i < v[1] + diffBetweenMax; i++) blank += ' '
      } else {
        for (let i = 0; i < diffBetweenMax; i++) blank += ' '
      }

      if (data !== null) {
        if (data.constructor === Number) rowValues.push(blank + strExp)
        else {
          const doublePattern = /^\d+\.\d+$/g // 数字は数字でも小数は文字列で来ちゃうので正規表現で判定する
          if(strExp.match(doublePattern)) rowValues.push(blank + strExp)
          else rowValues.push(strExp + blank)
        }
      } else {
        rowValues.push(blank + strExp)
      }
    })
    rowAsString.push('| ' + rowValues.join(' | ') + ' |')
  })

  if (field && field[0]) console.log('table name:', field[0].table)
  console.log(divider)
  console.log(label)
  console.log(divider)
  rowAsString.forEach(r => console.log(r))
  console.log(divider)
}

let dataA = [
  {userId: 123, userName: 'John Tanaka'},
  {userId: 124, userName: 'Mike Suzuki'},
  {userId: 125, userName: 'Bob Hori'},
  {userId: 126, userName: 'Alice Mukaide'},
  {userId: 127, userName: 'Micel Kikuchi'},
  {userId: 128, userName: 'Hanson Sato'},
  {userId: 129, userName: 'Gordon Urushibara'},
]

const dataB = [
  {userId: 10000001, userName: 'Taro'},
  {userId: 11000001, userName: 'Jiro'},
  {userId: 10100001, userName: 'Saburo'},
  {userId: 10010001, userName: 'Shiro'},
  {userId: 10001001, userName: 'Goro'},
  {userId: 10000101, userName: 'Ai'},
  {userId: 10000011, userName: 'Mika'},
  {userId: 20000101, userName: 'Sakura'},
  {userId: 20001001, userName: 'Haruka'},
  {userId: 20010001, userName: 'Yuna'},
]

// SQL Query
main()

// formatting test
formatAsTable(dataA)
console.log()
formatAsTable(dataB)
console.log()
formatAsTable(dataA.concat(dataB))