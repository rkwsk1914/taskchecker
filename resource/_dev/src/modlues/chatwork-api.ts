import { CHATWORK_API_TOKEN } from './../@types/env'

export class ChatWorkAPI {
  prefix: string
  token: string

  constructor () {
    this.prefix = 'https://api.chatwork.com/v2/rooms/'
    this.token = CHATWORK_API_TOKEN
  }

  createURL (roomId: string): string {
    const url: string = `${this.prefix}${roomId}/messages?force=0`
    return url
  }

  doGet (url: string): Promise<string> {
    // let result: object
    const token: string = this.token
    console.log('token', token)
    return new Promise((resolve) => {
      $.ajax({
        /* Ajaxリクエストの設定  設定の詳細はこちら => http://js.studio-kingdom.com/jquery/ajax/ajax#1 */
        type: 'GET', /* リクエストタイプ GETかPOSTか */
        url: url, /* Ajaxリクエストを送信するURL */
        dataType: 'text', /* csv、txtファイルなら「text」, jsonファイルなら「json」などなど */
        headers: {
          'X-HTTP-Method-Override': 'GET',
          'X-ChatWorkToken': token
        }
      })
        .done((data, textStatus, jqXHR) => {
          /* 読み込みに成功した時に行う処理 */
          // console.log('textStatus', textStatus)
          // console.log('jqXHR', jqXHR)
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

  async testChatWork (): Promise<void> {
    const roomId: string = '12114555'
    const url: string = this.createURL(roomId)
    const response: string = await this.doGet(url)
    const data: object = JSON.parse(response)
    console.log(data)
  }
}
