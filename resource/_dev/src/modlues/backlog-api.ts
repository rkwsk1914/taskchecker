import { Fetch } from './../common/fetch'
import { BACKLOG_API_KEY } from './../@types/env'

export class BackLogAPI extends Fetch {
  prefix: string
  apiKey: string
  viewPrefix: string
  wikiPrefix: string
  projectPrefix: string
  gitPrefix: string

  constructor () {
    super()
    this.prefix = 'https://sbweb.backlog.jp/api/v2/'
    this.apiKey = BACKLOG_API_KEY
    this.viewPrefix = 'https://sbweb.backlog.jp/view/'
    this.wikiPrefix = 'https://sbweb.backlog.jp/alias/wiki/'
    this.projectPrefix = 'https://sbweb.backlog.jp/projects/'
    this.gitPrefix = 'https://sbweb.backlog.jp/git/'
  }

  createGitProjectUrl (projectKey: string, repositoryName: string, ref: string): string {
    const tree: string = ref.replace('/refs/heads/', '')
    const url: string = `${this.gitPrefix}${projectKey}/${repositoryName}/tree/${tree}`
    return url
  }

  createGitRepositoryUrl (projectKey: string, repositoryName: string, rev: string): string {
    const url: string = `${this.gitPrefix}${projectKey}/${repositoryName}/commit/${rev}`
    return url
  }

  createWikiUrl (requestURL: string): string {
    const url: string = `${this.wikiPrefix}${requestURL}`
    return url
  }

  createViewUrl (requestURL: string): string {
    const url: string = `${this.viewPrefix}${requestURL}`
    return url
  }

  createViewIssueUrl (requestURL: string, commentId: string): string {
    const url: string = `${this.viewPrefix}${requestURL}#comment-${commentId}`
    return url
  }

  createProjcetUrl (requestURL: string): string {
    const url: string = `${this.projectPrefix}${requestURL}`
    return url
  }

  createURL (requestURL: string): string {
    const hasQueryParam = requestURL.match(/\?/)
    let url: string
    url = `${this.prefix}${requestURL}?apiKey=${this.apiKey}`

    if (hasQueryParam) {
      url = `${this.prefix}${requestURL}&apiKey=${this.apiKey}`
    }
    return url
  }

  async doGetData (requestURL: string, headersOption?: object): Promise<object> {
    const url: string = this.createURL(requestURL)
    // console.log(headersOption)
    const response: string = await this.doGet(url, headersOption)
    const data: object = JSON.parse(response)
    // console.log(data)
    return data
  }

  async doGetProject (): Promise<object> {
    const requestURL: string = 'projects'
    const data: object = await this.doGetData(requestURL)
    return data
  }

  async doGetProjectItem (projectId: string): Promise<object> {
    const requestURL: string = `projects/${projectId}`
    const data: object = await this.doGetData(requestURL)
    return data
  }

  async doGetIssues (): Promise<object> {
    const requestURL: string = 'issues'
    const data: object = await this.doGetData(requestURL)
    return data
  }

  async doGetIssueItem (issueId: string): Promise<object> {
    const requestURL: string = `issues/${issueId}`
    const data: object = await this.doGetData(requestURL)
    return data
  }

  async doGetIssueItemComment (issueId: string, commentId: string): Promise<object> {
    const requestURL: string = `issues/${issueId}/comments/${commentId}`
    const data: object = await this.doGetData(requestURL)
    return data
  }

  async doGetUsers (): Promise<object> {
    const requestURL: string = 'users'
    const data: object = await this.doGetData(requestURL)
    return data
  }

  async doGetUser (userId: string): Promise<object> {
    const requestURL: string = `users/${userId}`
    const data: object = await this.doGetData(requestURL)
    return data
  }

  async doGetUserActivities (userId: string): Promise<object> {
    // const activityTypeId: number[] = []
    const count: number = 50
    const requestURL: string = `users/${userId}/activities?count=${count}`
    const data: object = await this.doGetData(requestURL)
    return data
  }

  async doGetWiki (wikiId: string, projectIdOrKey: string): Promise<object> {
    const requestURL: string = `wikis/${wikiId}?projectIdOrKey=${projectIdOrKey}`
    const data: object = await this.doGetData(requestURL)
    return data
  }

  async doGetRateLimit (): Promise<object> {
    const requestURL: string = 'rateLimit'
    const data: object = await this.doGetData(requestURL)
    return data
  }

  async doGetGitrepository (projectId: string, repoId: string): Promise<object> {
    const requestURL: string = `projects/${projectId}/git/repositories/${repoId}`
    const data: object = await this.doGetData(requestURL)
    return data
  }
}
