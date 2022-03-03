import { Fetch } from './../common/fetch'
import { BackLogAPI } from './backlog-api'
import { ChatWorkAPI } from './chatwork-api'
import { TaskChecker } from './task-checker'

import { EventItem } from './../@types/interface'

import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import bootstrap5Plugin from '@fullcalendar/bootstrap5'

import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

export class CalendarCrelater extends Fetch {
  backlogAPI: BackLogAPI
  chatWorkAPI: ChatWorkAPI
  taskChecker: TaskChecker
  events: EventItem[]

  constructor () {
    super()
    this.backlogAPI = new BackLogAPI()
    this.chatWorkAPI = new ChatWorkAPI()
    this.taskChecker = new TaskChecker()
    this.events = []
  }

  async createCalendar (userId: string): Promise<void> {
    if (!userId || userId === '') {
      return
    }

    this.events = await this.taskChecker.doGetUserActivities(userId)
    await this.getHoliday()

    console.log(this.events)
    const calendarEl: HTMLElement = document.getElementById('calendar')!
    const calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, bootstrap5Plugin],
      locale: 'ja',
      themeSystem: 'bootstrap5',
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek,dayGridWeek'
      },
      showNonCurrentDates: false,
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday
        startTime: '10:00', // a start time (10am in this example)
        endTime: '19:00' // an end time (6pm in this example)
      },
      eventDidMount: (e) => { // カレンダーに配置された時のイベント
        tippy(e.el, { // TippyでTooltipを設定する
          content: e.event.title
        })
      },
      events: this.events
    })
    calendar.render()
  }

  async getHoliday (): Promise<void> {
    const today = new Date()
    const year = today.getFullYear()
    const holidays: any = await this.doGet(`https://holidays-jp.github.io/api/v1/${year}/date.json`)
    console.log(JSON.parse(holidays))
    await this.getHolidayEvent(JSON.parse(holidays))
    return Promise.resolve()
  }

  getHolidayEvent (holidays: object): Promise<void> {
    return new Promise((resolve) => {
      const holidaysKey = Object.keys(holidays)
      // console.log(holidaysKey)

      holidaysKey.forEach(key => {
        const event :EventItem = {
          id: String(key),
          title: holidays[key],
          start: this.formatDate(String(key)),
          classNames: 'holiday',
          holiday: holidays[key],
          display: 'background',
          allDay: true
        }
        this.events.push(event)
      })
      resolve()
    })
  }

  formatUnixtimeDate (unixtime: number): string {
    const date = new Date(unixtime)
    const result: string = date.toISOString()
    return result
  }

  formatDate (day: string): string {
    console.log(day)
    const date = new Date(day)
    const result: string = date.toISOString()
    return result
  }
}
