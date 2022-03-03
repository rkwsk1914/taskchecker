import $ from 'jquery'

export class Fetch {
  doGet (url: string, headersOption?: {}): Promise<string> {
    // let result: object
    return new Promise((resolve) => {
      $.ajax({
        /* Ajaxリクエストの設定  設定の詳細はこちら => http://js.studio-kingdom.com/jquery/ajax/ajax#1 */
        type: 'GET', /* リクエストタイプ GETかPOSTか */
        url: url, /* Ajaxリクエストを送信するURL */
        dataType: 'text', /* csv、txtファイルなら「text」, jsonファイルなら「json」などなど */
        /* xhrFields: {
          withCredentials: false
        }, */
        headers: headersOption
      })
        .done((data, textStatus, jqXHR) => {
          /* 読み込みに成功した時に行う処理 */
          // console.log('textStatus', textStatus)
          // console.log('jqXHR', jqXHR)
          // console.log('ResponseHeaders: ', jqXHR.getAllResponseHeaders())
          resolve(data)
        })
        .fail((jqXHR, textStatus, errortdrown) => {
          /* 読み込みに失敗した時に行う処理 */
          console.log('jqXHR', jqXHR)
          console.log('textStatus', textStatus)
          console.log('errortdrown', errortdrown)
        })
        .always(() => {
          /* どんな場合でも行う処理 */
        })
    })
  }
}
