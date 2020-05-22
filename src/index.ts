import {Octokit} from '@octokit/rest';

type GeneralOptions = {
  token: string;
  owner: string;
  repo: string;
  issue_number: number;
};

type ReplaceCommentOptions = GeneralOptions & {
  body: string;
};

type DeleteCommentOptions = GeneralOptions & {
  startsWith: string;
};

type CreateCommentOptions = GeneralOptions & {
  body: string;
};

const issues = (auth: string) => {
  return new Octokit({auth}).issues;
};

export const deleteComment = async ({token, owner, repo, issue_number, startsWith}: Readonly<DeleteCommentOptions>): Promise<void> => {
  const findCommentId = async (): Promise<number | undefined> => {
    const {data: existingComments} = await issues(token).listComments({owner, repo, issue_number});
    const comment = existingComments.find(({body}: { readonly body: string }) => body.startsWith(startsWith));
    return comment?.id;
  };

  const id = await findCommentId();
  if (id) {
    await issues(token).deleteComment({owner, repo, comment_id: id});
  }
};

export const createComment = async ({token, owner, repo, issue_number, body}: Readonly<CreateCommentOptions>) => {
  return issues(token).createComment({owner, repo, issue_number, body});
};

export default async function replaceComment({token, owner, repo, issue_number, body}: Readonly<ReplaceCommentOptions>) {
  const firstLine = body.split('\n', 1)[0];

  await deleteComment({token, owner, repo, issue_number, startsWith: firstLine});
  return createComment({token, owner, repo, issue_number, body});
}
