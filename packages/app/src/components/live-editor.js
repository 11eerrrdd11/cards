import { useState, useEffect, useRef } from 'react'
import Monaco, { monaco } from '@monaco-editor/react'
import styled from 'styled-components'
import { Text } from 'theme-ui'
import {
  LiveProvider as BaseProvider,
  LiveError as BaseError,
  LivePreview as BasePreview
} from 'react-live'

import { editorThemes, theme } from '@/theme'

import * as scope from './presets/scope'

const LivePreviewWrapper = styled('div')`
  height: 100%;
  width: 100%;
  margin: auto;
  overflow: hidden;
  user-select: none;
  position: relative;

  > * {
    pointer-events: none;
  }

  ${({ isEditor }) =>
    isEditor &&
    `
  box-shadow: rgba(0, 0, 0, 0.12) 0px 5px 10px 0px;
  cursor: pointer;`}
`

LivePreviewWrapper.defaultProps = {
  id: 'screenshot'
}

export const LiveError = styled(BaseError)`
  background: #ff5555;
  color: #f8f8f2;
  font-family: ${theme.fonts.mono};
  font-size: ${theme.fontSizes[2]};
  margin: 0;
  padding: ${theme.space[3]};
  text-align: left;
  white-space: pre-wrap;
`

export const LivePreview = styled(BasePreview)`
  > div {
    height: inherit;
    width: inherit;
  }
`

LivePreview.defaultProps = {
  Component: LivePreviewWrapper
}

const LiveProviderBase = styled(BaseProvider)``

LiveProviderBase.defaultProps = {
  scope,
  theme: undefined,
  noInline: false
}

export const LiveProvider = ({ queryVariables: query, ...props }) => {
  const extendedScope = { ...scope, query }
  return <LiveProviderBase {...props} scope={extendedScope} />
}

const LiveEditorBase = styled(Monaco)``

const Loading = () => (
  <Text sx={{ fontFamily: 'mono', color: theme.color }}>Loading...</Text>
)

export const LiveEditor = ({ code, onChange, themeKey, theme }) => {
  const editorRef = useRef(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    monaco.init().then(monaco => {
      Object.keys(editorThemes).forEach(key => {
        const value = editorThemes[key]
        monaco.editor.defineTheme(key, value)
      })
      setIsReady(true)
    })
  }, [])

  const handleEditorDidMount = (getEditorValue, monaco) => {
    monaco.onDidChangeModelContent(() => onChange(getEditorValue()))
    editorRef.current = monaco
  }

  if (!isReady) return <Loading theme={theme} />

  return (
    <LiveEditorBase
      value={code}
      language='javascript'
      theme={themeKey}
      editorDidMount={handleEditorDidMount}
      loading={<Loading theme={theme} />}
      options={{
        fontSize: 14,
        scrollBeyondLastLine: false,
        wordWrapColumn: 'on',
        hideCursorInOverviewRuler: true,
        minimap: {
          enabled: false
        },
        lineNumbersMinChars: 0,
        scrollbar: {
          useShadows: false
        }
      }}
    />
  )
}
