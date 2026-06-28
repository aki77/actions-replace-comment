# @aki77/actions-replace-comment

## Install

```bash
npm install @aki77/actions-replace-comment
```

## How it works

Identifies a comment by the first line of `body`. If a matching comment exists, it is deleted and recreated; otherwise, a new comment is created.

## Usage

```javascript
import * as core from '@actions/core'
import * as github from '@actions/github'
import replaceComment from '@aki77/actions-replace-comment'

async function run(): Promise<void> {
  await replaceComment({
    token: core.getInput('token'),
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: github.context.issue.number,
    body: "# Title\n\nDescription...",
  })
}
```

## Options

| Field | Type | Description |
|---|---|---|
| `token` | `string` | GitHub token |
| `owner` | `string` | Repository owner |
| `repo` | `string` | Repository name |
| `issue_number` | `number` | Issue / PR number |
| `body` | `string` | Comment body (the first line is used as the key) |
