import { unwrapResult } from '@reduxjs/toolkit'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { useDispatch } from 'react-redux'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

const Editor = ({ value, onChange }) => {
  const dispatch = useDispatch()

  const uploadCallback = file => {
    return new Promise(async resolve => {
      let results = await dispatch(uploadImage(file))

      results = unwrapResult(results)

      resolve({
        data: {
          link: results.image.url
        }
      })
    })
  }

  return (
    <EditorWrapper>
      <ReactDraftWysiwyg
        toolbarStyle={{
          alignItems: 'center'
        }}
        editorState={value}
        onEditorStateChange={onChange}
        placeholder='Insert text here ...'
        previewImage
        uploadCallback={uploadCallback}
        uploadEnabled
        editorStyle={{
          height: '300px',
          overflowY: 'auto'
        }}
      />
    </EditorWrapper>
  )
}

export default Editor
