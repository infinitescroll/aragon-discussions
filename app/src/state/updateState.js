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

export const updateState = (action, state, event) => {
  if (action === 'Post') return handlePost(state, event)
  return state
}

const handlePost = async (
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
