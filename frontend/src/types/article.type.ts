export type ArticleType = {
  text: string,
  comments: ArticleCommentType[],
  commentsCount: number,
  id: string,
  title: string,
  description: string,
  image: string,
  date: string,
  category: string,
  url: string
}

export type ArticleCommentsType = {
  allCount: number,
  comments: ArticleCommentType[]
}

export type ArticleCommentType = {
  id: string,
  text: string,
  date: string,
  likesCount: number,
  dislikesCount: number,
  user: {
    id: string,
    name: string
  }
  likeActive?: boolean,
  dislikeActive?: boolean,
}
