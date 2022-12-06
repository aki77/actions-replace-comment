/* eslint-disable @typescript-eslint/naming-convention */
import {Octokit} from '@octokit/rest';
import type {RestEndpointMethodTypes} from '@octokit/rest/dist-types';

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
  startsWith?: boolean;
  body: string;
};

type CreateCommentOptions = GeneralOptions & {
  body: string;
};

type ExistsCommentOptions = GeneralOptions & {
  body: string;
};

const issues = (auth: string) => new Octokit({auth}).issues;

export const findComment = async ({token, owner, repo, issue_number, body}: ExistsCommentOptions) => {
  const firstLine = body.split('\n', 1)[0];
  const {data: existingComments} = await issues(token).listComments({owner, repo, issue_number});
  const comment = existingComments.find(comment => comment.body?.startsWith(firstLine));

  return {
    comment_id: comment ? comment.id : undefined,
    exactMatch: comment && comment.body === body,
  };
};

export const deleteComment = async ({token, owner, repo, issue_number, body, startsWith = false}: Readonly<DeleteCommentOptions>): Promise<void> => {
  const {comment_id, exactMatch} = await findComment({token, owner, repo, issue_number, body});
  if (comment_id && (startsWith || exactMatch)) {
    await issues(token).deleteComment({owner, repo, comment_id});
  }
};

type CreateCommentResponse = Promise<RestEndpointMethodTypes['issues']['createComment']['response']['data']>;

export const createComment = async ({token, owner, repo, issue_number, body}: Readonly<CreateCommentOptions>): Promise<CreateCommentResponse> => {
  const responce = await issues(token).createComment({owner, repo, issue_number, body});
  return responce.data;
};

export default async function replaceComment({token, owner, repo, issue_number, body}: Readonly<ReplaceCommentOptions>): Promise<void | CreateCommentResponse> {
  const {comment_id, exactMatch} = await findComment({token, owner, repo, issue_number, body});
  if (exactMatch) {
    return;
  }

  if (comment_id) {
    await issues(token).deleteComment({owner, repo, comment_id});
  }

  return createComment({token, owner, repo, issue_number, body});
}
