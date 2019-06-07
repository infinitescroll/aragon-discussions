import React, { useState } from 'react'
import { useAragonApi } from '@aragon/api-react'
import { Main, Button, TextInput } from '@aragon/ui'
import styled from 'styled-components'

import { ipfs } from './ipfs'

function App() {
  const { api, appState, connectedAccount } = useAragonApi()
  const { syncing } = appState

  const [text, setText] = useState('')

  console.log('APP STATE', appState)
  const post = async () => {
    const discussionPost = {
      author: connectedAccount,
      mentions: [],
      type: 'DiscussionPost',
      text,
    }

    try {
      const result = await ipfs.dag.put(discussionPost, {})
      const cid = result.toBaseEncodedString()
      await api.post(connectedAccount, cid, '123').toPromise()
      setText('')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Main>
      <BaseLayout>
        {syncing && <Syncing />}
        <TextInput value={text} onChange={e => setText(e.target.value)} />
        <Buttons>
          <Button mode="secondary" onClick={post}>
            Make post
          </Button>
        </Buttons>
      </BaseLayout>
    </Main>
  )
}

const BaseLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
`

const Buttons = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 40px;
  margin-top: 20px;
`

const Syncing = styled.div.attrs({ children: 'Syncing…' })`
  position: absolute;
  top: 15px;
  right: 20px;
`

export default App
