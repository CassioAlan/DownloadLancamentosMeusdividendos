// ==UserScript==
// @name         DownloadLancamentosMeusdividendos
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Faz download de lançamentos no site meusdividendos.com
// @author       GAC
// @match        https://www.meusdividendos.com/smartfolio
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

async function Consulta(x) {

    let endPoint = "https://www.meusdividendos.com/api/v2/smartfolio/ordem/historico?pagina=" + x + "&codigo=null&tipo=null&inicio=null&termino=null&sort=null";

    let response = await fetch(endPoint)
    let retorno = await response.text()
    let json1 = JSON.parse(retorno)
    const items = json1.dto

    if(items == ""){
        return ""
    }

    const replacer = (key, value) => value === null ? '' : value 
    const header = Object.keys(items[0])
    let csv = ""
    if(x == 0) {
        csv = [
            header.join(','), // header row first
            ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        ].join('\r\n')

    } else {
        csv = [
            //header.join(','), // header row first
            ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        ].join('\r\n')

    }

    return(csv)
}

(async () => {
    var x = 0
    var operacoes = ""
    do {
        var retorno = await Consulta(x)
        operacoes += retorno
        operacoes += "\n"
        x++
    } while(retorno != "" && x < 100)

    alert("CSV copiado para o clipboard!")

    GM_setClipboard(operacoes)
})()
