import {Octokit} from '@octokit/rest';

type ReplaceCommentOptions = {
  token: string;
  owner: string;
  repo: string;
  issue_number: number;
  body: string;
};

export default async function replaceComment({token, owner, repo, issue_number, body}: Readonly<ReplaceCommentOptions>) {
  const issues = new Octokit({auth: token}).issues;
  const firstLine = body.split('\n', 2)[0];

  const findOldCommentId = async (): Promise<number | undefined> => {
    const {data: existingComments} = await issues.listComments({owner, repo, issue_number});
    const comment = existingComments.find(({body}: { readonly body: string }) => body.startsWith(firstLine));
    return comment?.id;
  };

  const deleteComment = async (id: number): Promise<void> => {
    await issues.deleteComment({owner, repo, comment_id: id});
  };

  const createComment = async () => {
    return issues.createComment({owner, repo, issue_number, body});
  };

  const oldCommentId = await findOldCommentId();
  if (oldCommentId) {
    await deleteComment(oldCommentId);
  }

  return createComment();
}
