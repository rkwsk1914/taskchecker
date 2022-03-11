import $ from 'jquery'
import { CalendarCrelater } from './modlues/calendar-crelater'
import { RelayParameter } from './common/relay-parameter'

import { BackLogAPI } from './modlues/backlog-api'
import { TaskChecker } from './modlues/task-checker'
import './css/substyle.scss'

class App extends RelayParameter {
  paramId: string
  calendarCrelater: CalendarCrelater
  taskChecker: TaskChecker
  backlogAPI: BackLogAPI

  constructor () {
    super()
    this.paramId = 'userId'
    this.calendarCrelater = new CalendarCrelater()
    this.backlogAPI = new BackLogAPI()
    this.taskChecker = new TaskChecker()
  }

  async doing (): Promise<string> {
    await this.getParam()
    const userId: string = this.paramData[this.paramId]
    const result: string = await this.calendarCrelater.createCalendar(userId)
    return result
  }

  async test (): Promise<void> {
    await this.getParam()
    const userId: string = this.paramData[this.paramId]
    console.log('comment: ', await this.backlogAPI.doGetIssueItem('SPECIAL-1741'))
    // console.log('comment: ', await this.backlogAPI.doGetIssueItemComment('YBB-1628', '88102261'))
    // console.log('git: ', await this.backlogAPI.doGetGitrepository('56949', '24629'))
    // console.log('Project: ', await this.backlogAPI.doGetProjectItem('56949'))
    // await this.taskChecker.testGetUserActivities(userId)
    await this.calendarCrelater.createCalendar(userId)
  }
}

$(window).on('load', async ():Promise<void> => {
  const a = new App()
  const result: string = await a.doing()
  // a.test()
  console.log(result)
  if (result !== '') {
    $('#status').text(result)
  } else {
    $('#status').remove()
  }

  const userName: string = a.paramData.staffName ? decodeURI(a.paramData.staffName) : 'Coder Staff'
  $('.js-title').text(userName)
})
