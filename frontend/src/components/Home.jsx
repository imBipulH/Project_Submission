import { useEffect, useState } from 'react'
import Upload from './ui/Upload'
import axiosInstance from './utils/axiosinstance'
import { getInitials } from './ui/helper'

const Home = () => {
  const [showUpload, setShowUpload] = useState(false)
  const [showLogout, setShowLogout] = useState(false)
  const [allProject, setAllProjects] = useState([])
  const [deleteLink, setDeleteLink] = useState(null)
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

  const handleToggleLogout = () => {
    setShowLogout(!showLogout)
  }

  const handleColseUpload = () => {
    setShowUpload(false)
  }

  const handleDeleteClick = item => {
    if (item && item.user._id == user._id) {
      setDeleteLink(item._id)
    }
  }

  return (
    <>
      <div className={`${showUpload && 'blur-sm'}`}>
        {/* Navbar Part Start */}
        <div className='relative'>
          <div className='fixed md:static flex justify-between items-center px-2 md:px-8 py-4 text-white bg-teal-500 md:text-3xl z-10'>
            <h2 className='md:text-center max-w-[50dvw]'>
              Project&apos;s Submission Dashboard
            </h2>
            <div className='flex flex-row-reverse items-center gap-2 relative'>
              {/* Logout Card */}
              {showLogout && (
                <p
                  className='absolute top-16 bg-teal-400 px-4 py-2 text-sm flex items-center gap-2 ml-4 cursor-pointer'
                  onClick={onLogOut}
                >
                  <span className='text-sm md:text-xl'>Logout</span>
                  <span className='material-symbols-outlined text-sm md:text-xl'>
                    logout
                  </span>
                </p>
              )}

              <p
                className='w-12 aspect-square flex items-center justify-center rounded-full text-teal-500 font-medium bg-slate-100 cursor-pointer text-xl'
                onClick={handleToggleLogout}
              >
                {user && getInitials(user.fullName)}
              </p>
              <p className='min-w-fit text-xl'>{user && user.fullName}</p>
            </div>
          </div>

          {/* Container Part */}
          <div className='container h-full relative pt-20 md:pt-8 pb-14'>
            {allProject.map((item, i) => (
              <div
                key={item._id}
                className='flex flex-wrap md:flex-row justify-center gap-2 sm:gap-8 py-2 my-2 border md:border-none shadow-md md:shadow-none'
              >
                <p className=' bg-teal-50 text-teal-700 px-4 py-2 rounded'>
                  {i + 1}
                </p>
                <h4 className='bg-teal-50 min-w-52 text-teal-700 px-4 py-2 rounded'>
                  {item.user.fullName}
                </h4>
                <h4 className='bg-teal-50 min-w-52 text-teal-700 px-4 py-2 rounded'>
                  {item.user.email}
                </h4>
                {item.user._id == user._id || user.role == 'teacher' ? (
                  <button
                    className="px-4 py-2 rounded hover:shadow-xl 
                        'cursor-pointer bg-teal-500 text-white active:bg-teal-400'
                        '"
                  >
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
                  </button>
                ) : (
                  <button className='px-4 py-2 rounded hover:shadow-xl  cursor-not-allowed bg-teal-50 text-teal-700'>
                    GitHub Link
                  </button>
                )}
                <button className='bg-teal-500 px-4 py-2 rounded text-white active:bg-teal-400 hover:shadow-xl'>
                  <a href={item.previewLink} target='_blank' className=''>
                    Preview Link
                  </a>
                </button>
                <div className='flex items-center relative'>
                  {deleteLink == item._id && (
                    <div className='absolute top-0 right-14 bg-teal-50 flex flex-col min-w-44 py-8 px-8 justify-center border shadow-md'>
                      <p className='text-center mb-4 text-2xl'>Are you sure?</p>
                      <div className='flex justify-center gap-2'>
                        <button
                          className='px-4 py-2 bg-red-500 active:bg-red-400 text-white rounded'
                          onClick={() => deleteLinks(item._id)}
                        >
                          Delete
                        </button>
                        <button
                          className='px-4 py-2 bg-teal-500 active:bg-teal-400 text-white rounded'
                          onClick={() => setDeleteLink(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  <span
                    onClick={() => handleDeleteClick(item)}
                    className={`${
                      item.user._id == user._id
                        ? 'text-teal-500 hover:text-red-500 cursor-pointer'
                        : 'text-gray-300 select-none cursor-not-allowed'
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
          className='fixed bottom-4 md:bottom-4 right-4 bg-teal-500 text-white p-4 rounded-md md:text-2xl'
          onClick={() => setShowUpload(!showUpload)}
        >
          Add new project
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
