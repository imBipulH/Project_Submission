/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Input } from './Input'
import axiosInstance from '../utils/axiosinstance'

const Upload = ({ handleColseUpload, getAllProject }) => {
  const [error, setError] = useState('')
  const [data, setData] = useState({
    githubLink: '',
    previewLink: ''
  })

  // Handle Upload Links
  const handleUploadLinks = async e => {
    e.preventDefault()
    const { githubLink, previewLink } = data
    if (!githubLink) {
      setError('Github Link is required')
      return
    }
    if (!previewLink) {
      setError('Preview Link is required')
      return
    }
    setError('')

    try {
      const response = await axiosInstance.post('/upload-links', {
        githubLink: githubLink,
        previewLink: previewLink
      })

      if (response.data && response.data.error) {
        setError(response.data.message)
        return
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken)
      }
      setData({
        githubLink: '',
        previewLink: ''
      })
      setError('Project uploaded successfully!')
      handleColseUpload()
      getAllProject()
    } catch (error) {
      const err = error.response.data.error.message.split('(')[0]
      setError(err)
    }
  }

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  return (
    <div className='absolute w-full top-20 '>
      <div className='container relative bg-white rounded max-w-screen-md shadow-xl mt-14 pb-14'>
        <span
          className='material-symbols-outlined absolute right-4 top-2 text-white text-3xl cursor-pointer hover:bg-teal-400 rounded duration-200 p-1'
          onClick={handleColseUpload}
        >
          close
        </span>
        <h2 className='bg-teal-500 text-3xl py-4 text-center text-white'>
          Upload Your Project-Links Here
        </h2>
        <div className='container w-full bg-white relative pt-10 px-20'>
          {error && <p className='text-sm text-red-500'>* {error}</p>}
          <Input
            title='GitHub Link'
            name='githubLink'
            type='text'
            value={data.githubLink}
            placeholder='Enter your github link..'
            onChange={e => handleChange(e)}
          />
          <Input
            title='Preview Link'
            name='previewLink'
            type='text'
            value={data.previewLink}
            placeholder='Enter your preview link..'
            onChange={e => handleChange(e)}
          />
          <button
            onClick={handleUploadLinks}
            className='bg-teal-500 w-full py-2 rounded text-white active:bg-teal-400 hover:shadow-xl'
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}

export default Upload
