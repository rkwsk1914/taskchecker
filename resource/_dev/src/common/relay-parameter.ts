export class RelayParameter {
  paramData: any

  constructor () {
    this.paramData = {}
  }

  getParam ():Promise<void> {
    return new Promise((resolve) => {
      const urlParam: string = location.search.substring(1)

      if (urlParam) {
        const param: string[] = urlParam.split('&')
        for (let i = 0; i < param.length; i++) {
          const paramItem: string[] = param[i].split('=')
          this.paramData[paramItem[0]] = paramItem[1]
        }
      }
      // console.log(this.paramData)
      resolve()
    })
  }
}
