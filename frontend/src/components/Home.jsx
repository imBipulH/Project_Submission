import { useEffect, useState } from 'react'
import Upload from './ui/Upload'
import axiosInstance from './utils/axiosinstance'
import { getInitials } from './ui/helper'

const Home = () => {
  const [showUpload, setShowUpload] = useState(false)
  const [allProject, setAllProjects] = useState([])
  const [user, setUser] = useState()

  // Get All Projects
  const getAllProject = async () => {
    try {
      const response = await axiosInstance.get('/project-links')
      if (response.data) {
        setAllProjects(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Get User
  const getUser = async () => {
    try {
      const response = await axiosInstance.get('/get-user')
      if (response) {
        setUser(response.data.user)
      }
    } catch (error) {
      console.log(error)
      window.location.href = '/login'
    }
  }

  // Delte Projects Link
  const deleteLinks = async linkId => {
    try {
      const response = await axiosInstance.delete(`/delete/${linkId}`)

      if (response.data && response.data.message) {
        console.log(response.data.message)
        getAllProject()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllProject()
    getUser()
  }, [])

  const onLogOut = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  const handleColseUpload = () => {
    setShowUpload(false)
  }

  return (
    <>
      <div className={`${showUpload && 'blur-sm'}`}>
        <div className='relative'>
          <div className=' flex justify-between items-center px-8 py-4 text-white bg-teal-500 text-3xl'>
            <h2 className=' text-center '>
              Project&apos;s Submission Dashboard
            </h2>
            <div className='flex items-center gap-2'>
              <p className='w-12 aspect-square flex items-center justify-center rounded-full text-teal-500 font-medium bg-slate-100'>
                {user && getInitials(user.fullName)}
              </p>
              <p>{user && user.fullName}</p>
              <p
                className='text-sm flex items-center gap-2 ml-4 cursor-pointer'
                onClick={onLogOut}
              >
                <span className='material-symbols-outlined'>logout</span>
              </p>
            </div>
          </div>

          {/* Container Part */}
          <div className='container h-full relative pt-10'>
            {allProject.map((item, i) => (
              <div key={item._id} className='flex justify-center gap-8 my-2'>
                <p className='bg-teal-50 text-teal-700 px-4 py-2 rounded'>
                  {i + 1}
                </p>
                <h4 className='bg-teal-50 min-w-52 text-teal-700 px-4 py-2 rounded'>
                  {item.user.fullName}
                </h4>
                <h4 className='bg-teal-50 min-w-52 text-teal-700 px-4 py-2 rounded'>
                  {item.user.email}
                </h4>
                <button
                  className={` px-4 py-2 rounded text-white  hover:shadow-xl ${
                    item.user._id == user._id || user.role == 'teacher'
                      ? 'cursor-pointer bg-teal-500 active:bg-teal-400'
                      : 'cursor-not-allowed bg-teal-50 text-teal-700'
                  }`}
                >
                  {item.user._id == user._id || user.role == 'teacher' ? (
                    <a
                      className={`${
                        item.user._id == user._id
                          ? 'cursor-pointer'
                          : 'cursor-not-allowed'
                      }`}
                      href={
                        item.user._id == user._id || user.role == 'teacher'
                          ? item.githubLink
                          : ''
                      }
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      GitHub Link
                    </a>
                  ) : (
                    <p className='bg-teal-50'>GitHub Link</p>
                  )}
                </button>
                <button className='bg-teal-500 px-4 py-2 rounded text-white active:bg-teal-400 hover:shadow-xl'>
                  <a href={item.previewLink} target='_blank' className=''>
                    Preview Link
                  </a>
                </button>
                <div className='flex items-center'>
                  <span
                    onClick={() => deleteLinks(item._id)}
                    className={`${
                      item.user._id == user._id
                        ? 'text-teal-500 hover:text-red-500 cursor-pointer'
                        : 'text-gray-300 select-none'
                    }  material-symbols-outlined `}
                  >
                    delete
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Add Button */}
        <button
          className='absolute bottom-4 right-4 bg-teal-500 text-white p-4 rounded-md text-2xl'
          onClick={() => setShowUpload(!showUpload)}
        >
          Add new project{' '}
          <span className='material-symbols-outlined text-3xl'></span>
        </button>
      </div>
      {showUpload && (
        <Upload
          handleColseUpload={handleColseUpload}
          getAllProject={getAllProject}
        />
      )}
    </>
  )
}

export default Home
