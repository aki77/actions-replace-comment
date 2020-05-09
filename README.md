# @aki77/actions-replace-comment

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
