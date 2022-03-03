import { BackLogAPI } from './backlog-api'
import { EventItem } from './../@types/interface'

export class TaskChecker {
  backlogAPI: BackLogAPI

  constructor () {
    this.backlogAPI = new BackLogAPI()
  }

  getIssuId (activity: any): string {
    const keyId: string = activity.content.key_id
    const projectKey: string = activity.project.projectKey
    const issuId: string = `${projectKey}-${keyId}`
    return issuId
  }

  async doGetUserActivities (userId: string): Promise<any> {
    const data: object = await this.backlogAPI.doGetUserActivities(userId)
    const dataKeys = Object.keys(data)

    const events: EventItem[] = await Promise.all(
      dataKeys.map(async (key): Promise<EventItem> => {
        const activity: any = data[key]
        const event :EventItem = await this.checkActiveType(activity)
        // console.log(event)
        return event
      })
    )

    const result: EventItem[] = Array.from(
      new Map(events.map((evnet) => [evnet.id, evnet])).values()
    )

    // console.log(events)
    return Promise.resolve(result)
  }

  async checkActiveType (activity: any): Promise<EventItem> {
    const type: number = activity.type
    const id: string = activity.content.id
    const projectId: string = activity.project.id
    let data: object
    let event: EventItem

    switch (type) {
      case 5:
      case 6:
      case 7:
        // console.log('wiki', type)
        data = await this.backlogAPI.doGetWiki(id, projectId)
        event = this.getTicketWikiData(data)
        break
      default:
        // console.log('issue', type)
        data = await this.backlogAPI.doGetIssueItem(id)
        event = this.getTicketIssueData(data)
        break
    }

    return event
  }

  getTicketWikiData (data: any): EventItem {
    // console.log(data)
    const event :EventItem = {
      id: data.id,
      title: data.name,
      start: data.created,
      end: data.created,
      allDay: true,
      url: this.backlogAPI.createWikiUrl(data.id),
      backgroundColor: 'green'
      // editable: true
    }
    return event
  }

  getTicketIssueData (data: any): EventItem {
    // console.log(data)
    const enddate = new Date(data.dueDate)
    enddate.setDate(enddate.getDate() + 1)
    const event :EventItem = {
      id: data.id,
      title: data.summary,
      start: data.created,
      end: enddate.toISOString(),
      allDay: true,
      url: this.backlogAPI.createViewUrl(data.issueKey)
      // backgroundColor: 'blue'
      // editable: true
    }
    return event
  }
}
