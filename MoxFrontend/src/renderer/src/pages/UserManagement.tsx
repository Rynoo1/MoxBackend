const UserManagement: React.FC = () => {
  return (
    <div className="w-full">
      <header className="flex justify-between items-center mt-30 bg-white shadow-md">
        <h1 className="text-4xl font-semibold">Profile</h1>
        {/* <span className="text-gray-600">{formattedDate}</span> */}
      </header>

      <div className="divider divider-neutral"></div>

      <main className="px-6 py-4">
        {/* {username && (
          <div className="text-center mb-10">
            <h2 className="text-3xl font-light">Welcome, {username}</h2>
          </div>
        )} */}

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-100 mb-10">
          <p className="text-4xl font-bold text-blue-600 mt-10">Profile Picture</p>
          <div className="avatar">
            <div className="w-24 h-24 rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
            </div>
          </div>
        </div> */}

        <div className="divider divider-neutral"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-100 mb-10 mt-10">
          <p className="text-4xl font-bold text-blue-600">Users</p>
          <p className="text-4xl font-bold text-blue-600">Username</p>
        </div>

        <ul className="list bg-base-100 rounded-box shadow-md">
          {/* <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Most played songs this week</li> */}

          <li className="list-row">
            <div>
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/profile/demo/1@94.webp" // User profile pic
              />
            </div>
            <div>
              <div>Dio Lupa</div>
              <div className="text-xs uppercase font-semibold opacity-60">Remaining Reason</div>
            </div>
            <button className="btn btn-square btn-ghost">
              <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 3L20 12 6 21 6 3z"></path>
                </g>
              </svg>
            </button>
            <button className="btn btn-square btn-ghost">
              <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </g>
              </svg>
            </button>
          </li>

          <li className="list-row">
            <div>
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/profile/demo/4@94.webp"
              />
            </div>
            <div>
              <div>Ellie Beilish</div>
              <div className="text-xs uppercase font-semibold opacity-60">Bears of a fever</div>
            </div>
            <button className="btn btn-square btn-ghost">
              <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 3L20 12 6 21 6 3z"></path>
                </g>
              </svg>
            </button>
            <button className="btn btn-square btn-ghost">
              <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </g>
              </svg>
            </button>
          </li>

          <li className="list-row">
            <div>
              <img
                className="size-10 rounded-box"
                src="https://img.daisyui.com/images/profile/demo/3@94.webp"
              />
            </div>
            <div>
              <div>Sabrino Gardener</div>
              <div className="text-xs uppercase font-semibold opacity-60">Cappuccino</div>
            </div>
            <button className="btn btn-square btn-ghost">
              <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M6 3L20 12 6 21 6 3z"></path>
                </g>
              </svg>
            </button>
            <button className="btn btn-square btn-ghost">
              <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </g>
              </svg>
            </button>
          </li>
        </ul>

        {/* <div className="divider divider-neutral"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10 mt-10">
          <p className="text-4xl font-bold text-blue-600">Email</p>
          <p className="text-4xl font-bold text-blue-600">Email</p>
        </div>

        <div className="divider divider-neutral"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10 mt-10">
          <p className="text-4xl font-bold text-blue-600">Username</p>
          <p className="text-4xl font-bold text-blue-600">Username</p>
        </div> */}
      </main>
    </div>
  )
}

export default UserManagement
