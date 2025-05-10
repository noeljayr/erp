
export type label = {
  id: number,
  name: string
}

type user = {
  login: string,
  avatar_url: string
}

type assignee = {
  login: string,
  avatar_url: string
}

type repository = {
  name: string
}

export interface GithubIssue {
  title: string,
  body: string,
  labels: label[],
  state: string,
  assignees: assignee[],
  repository: repository;
  user: user
}