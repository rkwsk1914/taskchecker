import { BackLogAPI } from './backlog-api'
import { EventItem } from './../@types/interface'

export class TaskChecker {
  backlogAPI: BackLogAPI
  events: EventItem[]

  constructor () {
    this.backlogAPI = new BackLogAPI()
    this.events = []
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

    await Promise.all(
      dataKeys.map(async (key): Promise<void> => {
        const activity: any = data[key]
        // console.log(activity)
        await this.checkActiveType(activity)
      })
    )
    const events: EventItem[] = this.events.filter(Boolean)
    console.log(events)

    const result: EventItem[] = Array.from(
      new Map(events.map((evnet) => [evnet.id, evnet])).values()
    )
    return Promise.resolve(result)
  }

  async checkActiveType (activity: any): Promise<EventItem> {
    const type: number = activity.type
    const id: string = activity.content.id
    const projectId: string = activity.project.id
    let data: object
    let event: EventItem
    let eventOnTime: EventItem

    switch (type) {
      case 1: // 1:課題の追加
        // console.log('issue', type, activity)
        // console.log(await this.backlogAPI.doGetIssueItem(id))
        data = await this.backlogAPI.doGetIssueItem(id)
        event = this.getTicketIssueData(data)
        eventOnTime = this.getTicketIssueOnTimeData(data, activity, 'タスク追加')
        this.events.push(event)
        this.events.push(eventOnTime)
        break
      case 2: // 2:課題の更新
        // console.log('issue', type, activity)
        // console.log(await this.backlogAPI.doGetIssueItem(id))
        data = await this.backlogAPI.doGetIssueItem(id)
        event = this.getTicketIssueData(data)
        eventOnTime = this.getTicketIssueOnTimeData(data, activity, 'タスク更新')
        this.events.push(event)
        this.events.push(eventOnTime)
        break
      case 3: // 3:課題にコメント
        // console.log('issue', type, activity)
        // console.log(await this.backlogAPI.doGetIssueItem(id))
        data = await this.backlogAPI.doGetIssueItem(id)
        event = this.getTicketIssueData(data)
        eventOnTime = this.getTicketIssueOnTimeData(data, activity, 'コメント')
        this.events.push(event)
        this.events.push(eventOnTime)
        break
      case 4: // 4:課題の削除
        // console.log('issue', type, activity)
        // console.log(await this.backlogAPI.doGetIssueItem(id))
        data = await this.backlogAPI.doGetIssueItem(id)
        event = this.getTicketIssueData(data)
        eventOnTime = this.getTicketIssueOnTimeData(data, activity, 'タスク削除')
        this.events.push(event)
        this.events.push(eventOnTime)
        break
      case 5: // 5:Wikiを追加
        // console.log('wiki', type, activity)
        data = await this.backlogAPI.doGetWiki(id, projectId)
        event = this.getTicketWikiData(data, activity, 'Wiki追加')
        this.events.push(event)
        break
      case 6: // 6:Wikiを更新
        // console.log('wiki', type, activity)
        data = await this.backlogAPI.doGetWiki(id, projectId)
        event = this.getTicketWikiData(data, activity, 'Wiki更新')
        this.events.push(event)
        break
      case 7: // 7:Wikiを削除
        // console.log('wiki', type, activity)
        data = await this.backlogAPI.doGetWiki(id, projectId)
        event = this.getTicketWikiData(data, activity, 'Wiki削除')
        this.events.push(event)
        break
      case 8: // 8:共有ファイルを追加
      case 9: // 9:共有ファイルを更新
      case 10: // 10:共有ファイルを削除
        // console.log('file', type, activity)
        break
      case 11: // 11:Subversionコミット
        // console.log('Subversion', type, activity)
        break
      case 12: // 12:GITプッシュ
        // console.log('git', type, activity)
        data = await this.backlogAPI.doGetProjectItem(activity.project.id)
        event = this.getTicketGittData(data, activity)
        eventOnTime = this.getTicketGittONnTimeData(activity, 'GITプッシュ')
        this.events.push(event)
        this.events.push(eventOnTime)
        break
      case 13: // 13:GITリポジトリ作成
        // console.log('git', type, activity)
        data = await this.backlogAPI.doGetProjectItem(activity.project.id)
        event = this.getTicketGittData(data, activity)
        eventOnTime = this.getTicketGittONnTimeData(activity, 'GITリポジトリ作成')
        this.events.push(event)
        this.events.push(eventOnTime)
        break
      case 14: // 14:課題をまとめて更新
        // console.log('project updata', type, activity)
        break
      case 15: // 15:プロジェクトに参加
        // console.log('project asign', activity)
        data = await this.backlogAPI.doGetProjectItem(projectId)
        event = this.getTicketProjectData(data, activity, 'メンバー変更')
        this.events.push(event)
        break
      case 16: // 16:プロジェクトから脱退
        // console.log('project asign', activity)
        data = await this.backlogAPI.doGetProjectItem(projectId)
        event = this.getTicketProjectData(data, activity, 'メンバー変更')
        this.events.push(event)
        break
      case 17: // 17:コメントにお知らせを追加
        // console.log('commment news', type, activity)
        break
      case 18: // 18:プルリクエストの追加
        // console.log('git', type, activity)
        data = await this.backlogAPI.doGetIssueItem(activity.content.issue.id)
        event = this.getTicketIssueData(data)
        eventOnTime = this.getTicketIssueOnTimeData(data, activity, 'プルリクエスト追加')
        this.events.push(event)
        this.events.push(eventOnTime)
        break
      case 19: // 19:プルリクエストの更新
        // console.log('git', type, activity)
        data = await this.backlogAPI.doGetIssueItem(activity.content.issue.id)
        event = this.getTicketIssueData(data)
        eventOnTime = this.getTicketIssueOnTimeData(data, activity, 'プルリクエスト更新')
        this.events.push(event)
        this.events.push(eventOnTime)
        break
      case 20: // 20:プルリクエストにコメント
        // console.log('git', type, activity)
        data = await this.backlogAPI.doGetIssueItem(activity.content.issue.id)
        event = this.getTicketIssueData(data)
        eventOnTime = this.getTicketIssueOnTimeData(data, activity, 'プルリクエストにコメント')
        this.events.push(event)
        this.events.push(eventOnTime)
        break
      case 21: // 21:プルリクエストの削除
        // console.log('git', type, activity)
        data = await this.backlogAPI.doGetIssueItem(activity.content.issue.id)
        event = this.getTicketIssueData(data)
        eventOnTime = this.getTicketIssueOnTimeData(data, activity, 'プルリクエスト削除')
        this.events.push(event)
        this.events.push(eventOnTime)
        break
      case 22: // 22:マイルストーンの追加
      case 23: // 23:マイルストーンの更新
      case 24: // 24:マイルストーンの削除
        // console.log('mile stone', type, activity)
        break
      case 25: // 25:グループがプロジェクトに参加
      case 26: // 26:グループがプロジェクトから脱退
      default:
        // console.log('project', type, activity)
        // console.log(activity)
        // data = await this.backlogAPI.doGetIssueItem(id)
        // event = this.getTicketIssueData(data)
        break
    }
    return event
  }

  getTicketGittONnTimeData (activity: any, action: string): EventItem {
    // console.log(data)
    // console.log(activity.content.revisions[0])
    const rev: string = activity.content.revisions[0].rev
    const repositoryName: string = activity.content.repository.name
    const projectKey: string = activity.project.projectKey
    const projectName: string = activity.project.name

    const enddate = activity.dueDate
      ? new Date(activity.dueDate)
      : new Date(activity.created)
    enddate.setDate(enddate.getDate() + 1)
    const event: EventItem = {
      id: activity.id,
      title: `${projectName} ${action}`,
      start: activity.created,
      end: activity.created,
      allDay: false,
      url: this.backlogAPI.createGitRepositoryUrl(projectKey, repositoryName, rev),
      backgroundColor: 'red'
      // editable: true
    }
    return event
  }

  getTicketGittData (data: any, activity: any): EventItem {
    const ref: string = activity.content.ref
    const repositoryName: string = activity.content.repository.name
    const projectKey: string = activity.project.projectKey
    const projectName: string = activity.project.name
    // console.log(data)
    const enddate = activity.dueDate
      ? new Date(activity.dueDate)
      : new Date(activity.created)
    enddate.setDate(enddate.getDate() + 1)
    const event: EventItem = {
      id: data.id,
      title: `${projectKey} ${projectName}`,
      start: activity.created,
      end: activity.created,
      allDay: true,
      url: this.backlogAPI.createGitProjectUrl(projectKey, repositoryName, ref),
      backgroundColor: 'red'
      // editable: true
    }
    return event
  }

  getTicketWikiData (data: any, activity: any, action: string): EventItem {
    // console.log(data)
    const event: EventItem = {
      id: activity.id,
      title: `${action} ${data.name}`,
      start: data.created,
      end: data.created,
      allDay: false,
      url: this.backlogAPI.createWikiUrl(data.id),
      backgroundColor: 'orange'
      // editable: true
    }
    return event
  }

  getTicketProjectData (data: any, activity: any, action: string): EventItem {
    // console.log(data)
    const enddate = data.dueDate
      ? new Date(data.dueDate)
      : new Date(activity.created)
    enddate.setDate(enddate.getDate() + 1)
    const event: EventItem = {
      id: data.id,
      title: `${action} ${data.name}`,
      start: activity.created,
      end: activity.created,
      allDay: false,
      url: this.backlogAPI.createProjcetUrl(data.projectKey),
      backgroundColor: 'red'
      // editable: true
    }
    return event
  }

  getTicketIssueOnTimeData (data: any, activity: any, action: string): EventItem {
    const assignee: string = data.assignee.name
    const enddate = data.dueDate
      ? new Date(data.dueDate)
      : new Date(data.created)
    enddate.setDate(enddate.getDate() + 1)
    const event: EventItem = {
      id: activity.content.comment.id,
      title: `${data.summary}  ★FD { ${assignee} } ${action}`,
      start: activity.created,
      end: activity.created,
      allDay: false,
      url: this.backlogAPI.createViewIssueUrl(data.issueKey, activity.content.comment.id)
    // backgroundColor: 'blue'
    // editable: true
    }
    return event
  }

  getTicketIssueData (data: any): EventItem {
    if (data.status.name === '完了') {
      return
    }

    // console.log(data)
    const assignee: string = data.assignee.name
    // console.log(data)
    const enddate = data.dueDate
      ? new Date(data.dueDate)
      : null
    // enddate.setDate(enddate.getDate() + 1)
    const event: EventItem = {
      id: data.id,
      title: `${data.summary}  ★FD { ${assignee} }`,
      start: data.created,
      end: enddate ? enddate.toISOString() : null,
      allDay: true,
      url: this.backlogAPI.createViewUrl(data.issueKey)
      // backgroundColor: 'blue'
      // editable: true
    }
    return event
  }
}
