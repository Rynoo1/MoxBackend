import { useEffect, useState } from 'react'
import { User } from '../models/UserModel'

const ProfileCard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem('userId')

    if (userId) {
      fetch(`http://localhost:5183/api/user/${userId}`)
        .then((response) => response.json())
        .then((data: User) => setUser(data))
        .catch((error) => console.error('Error fetching user data: ', error))
    }
  }, [])

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <img src={user.Avatar} alt="Avatar" className="rounded-full w-24 h-24 mx-auto" />
      <h2 className="text-center text-xl font-semibold mt-2">{user.UserName}</h2>
      <p className="text-center text-gray-600">{user.Email}</p>
      {/* <p className="text-center text-gray-600">{user.AppRoles}</p> */}
    </div>
  )
}

export default ProfileCard
