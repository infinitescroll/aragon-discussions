import cloneDeep from 'lodash.clonedeep'
import { ipfs } from '../ipfs'

/*
{
  discussions: {
    id1: {
      discussionId: {
        author:
        createdAt:
        postId:
        postCid:
      }
    }
  }
}

*/

export const handleHide = async (
  state,
  { returnValues: { author, discussionId, postId, hiddenAt } }
) => {
  const newState = cloneDeep(state)
  delete newState.discussions[discussionId][postId]
  return newState
}

export const handlePost = async (
  state,
  { returnValues: { author, createdAt, discussionId, postId, postCid } }
) => {
  const newState = cloneDeep(state)
  try {
    const {
      value: { text },
    } = await ipfs.dag.get(postCid)

    if (!newState.discussions[discussionId]) {
      newState.discussions[discussionId] = {}
    }

    newState.discussions[discussionId][postId] = {
      author,
      createdAt,
      text,
    }
    return newState
  } catch (error) {
    console.error(error)
  }
}
