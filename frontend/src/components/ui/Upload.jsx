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
      console.log(error)
    }
  }

  const handleChange = e => {
    console.log(e)
    setData({ ...data, [e.target.name]: e.target.value })
  }

  return (
    <div className='absolute w-full top-20 '>
      <span
        className='material-symbols-outlined absolute right-20 top-0 text-teal-500 text-4xl cursor-pointer hover:bg-teal-50 rounded-full duration-200 p-2'
        onClick={handleColseUpload}
      >
        close
      </span>
      <div className='container rounded'>
        <h2 className='bg-teal-500 text-3xl py-4 text-center text-white'>
          Upload Your Project-Links Here
        </h2>
        <div className='container w-full bg-white relative pt-10 px-20'>
          {error && <p className='text-sm text-red-500'>{error}</p>}
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
