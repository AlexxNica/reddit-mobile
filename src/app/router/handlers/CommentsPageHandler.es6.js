import { BaseHandler, METHODS } from '@r/platform/router';
import { models } from '@r/api-client';
import { cleanObject } from '../../../lib/cleanObject';
import * as commentsPageActions from '../../actions/commentsPageActions';

const { POST_TYPE } = models.ModelTypes;
const PostIdRegExp = new RegExp(`^${POST_TYPE}_`);

const ensurePostTypePrefix = postId => {
  if (PostIdRegExp.test(postId)) { return postId; }

  return `${POST_TYPE}_${postId}`;
};

export default class CommentsPageHandler extends BaseHandler {
  static PageParamsToCommentsPageParams({ urlParams, queryParams}) {
    let { postId } = urlParams;
    const { commentId } = urlParams;
    const { sort, context } = queryParams;

    postId = ensurePostTypePrefix(postId);

    let query;
    if (commentId) {
      query = {
        comment: commentId,
        context,
      };
    }

    return cleanObject({
      id: postId,
      sort,
      query,
    });
  }

  async [METHODS.GET](dispatch/*, getState, utils*/) {
    const commentsPageParams = CommentsPageHandler.PageParamsToCommentsPageParams(this);

    dispatch(commentsPageActions.fetchCommentsPage(commentsPageParams));
  }
}