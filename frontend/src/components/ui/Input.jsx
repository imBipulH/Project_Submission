/* eslint-disable react/prop-types */
export const Input = ({ title, type, name, placeholder, value, onChange }) => {
  return (
    <div className='my-8'>
      <p className='my-2'>{title}</p>
      <input
        className='text-md border px-3 py-2 w-full outline-none'
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
