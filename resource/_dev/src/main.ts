import $ from 'jquery'
import { CalendarCrelater } from './modlues/calendar-crelater'
import { RelayParameter } from './common/relay-parameter'

import './css/substyle.scss'

class App extends RelayParameter {
  paramId: string
  calendarCrelater: CalendarCrelater

  constructor () {
    super()
    this.paramId = 'userId'
    this.calendarCrelater = new CalendarCrelater()
  }

  async doing (): Promise<any> {
    await this.getParam()
    const userId: string = this.paramData[this.paramId]
    await this.calendarCrelater.createCalendar(userId)
  }
}

$(window).on('load', ():void => {
  const a = new App()
  a.doing()

  const userName: string = a.paramData.staffName ? decodeURI(a.paramData.staffName) : 'Coder Staff'
  $('.js-title').text(userName)
})
