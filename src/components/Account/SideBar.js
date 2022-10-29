import React from "react";
import { useState } from "react";
import Dashboard from "../../Dashboard";

export default function SideBar({ content }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentSidebarTab, setCurrentSidebarTab] = useState(null);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isSubHeaderOpen, setIsSubHeaderOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex  antialiased text-gray-900 bg-gray-100 dark:bg-dark dark:text-light">
        {/* <!-- Sidebar --> */}
        <div className="flex flex-shrink-0 transition-all">
          {isSidebarOpen && (
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
            ></div>
          )}

          {isSidebarOpen && (
            <div className="fixed inset-y-0 z-10 w-16 bg-white"></div>
          )}

          {/* <!-- Mobile bottom bar --> */}
          <nav
            aria-label="Options"
            className="fixed inset-x-0 bottom-0 flex flex-row-reverse items-center justify-between px-4 py-2 bg-white border-t border-indigo-100 sm:hidden shadow-t rounded-t-3xl"
          >
            {/* <!-- Menu button --> */}
            <button
              onClick={() =>
                isSidebarOpen && currentSidebarTab == "linksTab"
                  ? setIsSidebarOpen(false)
                  : (setIsSidebarOpen(true), setCurrentSidebarTab("linksTab"))
              }
              className={
                isSidebarOpen && currentSidebarTab == "linksTab"
                  ? "text-white bg-indigo-600"
                  : "text-gray-500 bg-white" +
                    "p-2 transition-colors rounded-lg shadow-md hover:bg-indigo-800 hover:text-white focus:outline-none focus:ring focus:ring-indigo-600 focus:ring-offset-white focus:ring-offset-2"
              }
            >
              <span className="sr-only">Toggle sidebar</span>
              <svg
                aria-hidden="true"
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </button>

            {/* <!-- Logo --> */}
            <a href="/">
              <img
                className="w-10 h-auto"
                src="https://raw.githubusercontent.com/kamona-ui/dashboard-alpine/main/public/assets/images/logo.png"
                alt="K-UI"
              />
            </a>

            {/* <!-- User avatar button --> */}
            <div
              className="relative flex items-center flex-shrink-0 p-2"
              // x-data="{ isOpen: false }"
            >
              <button
                onClick={() => setIsOpen(!isOpen)}
                //   @click="isOpen = !isOpen; $nextTick(() => {isOpen ? $refs.userMenu.focus() : null})"
                className="transition-opacity rounded-lg opacity-80 hover:opacity-100 focus:outline-none focus:ring focus:ring-indigo-600 focus:ring-offset-white focus:ring-offset-2"
              >
                <img
                  className="w-8 h-8 rounded-lg shadow-md"
                  src="https://avatars.githubusercontent.com/u/57622665?s=460&u=8f581f4c4acd4c18c33a87b3e6476112325e8b38&v=4"
                  alt="Ahmed Kamel"
                />
                <span className="sr-only">User menu</span>
              </button>
              {isOpen && (
                <div
                  // @click.away="isOpen = false"
                  // @keydown.escape="isOpen = false"
                  // x-ref="userMenu"
                  tabIndex="-1"
                  className="absolute w-48 py-1 mt-2 origin-bottom-left bg-white rounded-md shadow-lg left-10 bottom-14 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-label="user menu"
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </a>

                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Settings
                  </a>

                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* <!-- Left mini bar --> */}
          <nav
            aria-label="Options"
            className="z-20 flex-col items-center flex-shrink-0 hidden w-16 py-4 bg-white border-r-2 border-indigo-100 shadow-md sm:flex rounded-tr-3xl rounded-br-3xl"
          >
            {/* <!-- Logo --> */}
            <div className="flex-shrink-0 py-4">
              <a href="/">
                <img
                  className="w-10 h-auto"
                  src="https://raw.githubusercontent.com/kamona-ui/dashboard-alpine/main/public/assets/images/logo.png"
                  alt="K-UI"
                />
              </a>
            </div>
            <div className="flex flex-col items-center flex-1 p-2 space-y-4">
              {/* <!-- Menu button --> */}
              <button
                onClick={() =>
                  isSidebarOpen && currentSidebarTab == "linksTab"
                    ? setIsSidebarOpen(false)
                    : (setIsSidebarOpen(true), setCurrentSidebarTab("linksTab"))
                }
                className={
                  (isSidebarOpen && currentSidebarTab == "linksTab"
                    ? "text-white bg-indigo-600"
                    : "text-gray-500 ") +
                  " p-2 transition-colors rounded-lg shadow-md hover:bg-indigo-800 hover:text-white focus:outline-none focus:ring focus:ring-indigo-600 focus:ring-offset-white focus:ring-offset-2"
                }
              >
                <span className="sr-only">Toggle sidebar</span>
                <svg
                  aria-hidden="true"
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h7"
                  />
                </svg>
              </button>
              {/* <!-- Messages button --> */}
              <button
                onClick={() =>
                  isSidebarOpen && currentSidebarTab == "messagesTab"
                    ? setIsSidebarOpen(false)
                    : (setIsSidebarOpen(true),
                      setCurrentSidebarTab("messagesTab"))
                }
                className={
                  (isSidebarOpen && currentSidebarTab == "messagesTab"
                    ? "text-white bg-indigo-600"
                    : "text-gray-500 ") +
                  " p-2 transition-colors rounded-lg shadow-md hover:bg-indigo-800 hover:text-white focus:outline-none focus:ring focus:ring-indigo-600 focus:ring-offset-white focus:ring-offset-2"
                }
              >
                <span className="sr-only">Toggle message panel</span>
                <svg
                  aria-hidden="true"
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </button>
              {/* <!-- Notifications button --> */}
              <button
                onClick={() =>
                  isSidebarOpen && currentSidebarTab == "notificationsTab"
                    ? setIsSidebarOpen(false)
                    : (setIsSidebarOpen(true),
                      setCurrentSidebarTab("notificationsTab"))
                }
                className={
                  (isSidebarOpen && currentSidebarTab == "notificationsTab"
                    ? "text-white bg-indigo-600"
                    : "text-gray-500 ") +
                  " p-2 transition-colors rounded-lg shadow-md hover:bg-indigo-800 hover:text-white focus:outline-none focus:ring focus:ring-indigo-600 focus:ring-offset-white focus:ring-offset-2"
                }
              >
                <span className="sr-only">Toggle notifications panel</span>
                <svg
                  aria-hidden="true"
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
            </div>

            {/* <!-- User avatar --> */}
            <div className="relative flex items-center flex-shrink-0 p-2">
              <button
                //   onClick={}
                onMouseOver={() => setIsOpen(!isOpen)}
                onClick={() => setIsOpen(!isOpen)}
                //   onMouseLeave={() => setIsOpen(!isOpen)}
                onMouseOut={() => setIsOpen(!isOpen)}
                // @click="isOpen = !isOpen; $nextTick(() => {isOpen ? $refs.userMenu.focus() : null})"
                className="transition-opacity rounded-lg opacity-80 hover:opacity-100 focus:outline-none focus:ring focus:ring-indigo-600 focus:ring-offset-white focus:ring-offset-2"
              >
                <img
                  className="w-10 h-10 rounded-lg shadow-md"
                  src="https://avatars.githubusercontent.com/u/57622665?s=460&u=8f581f4c4acd4c18c33a87b3e6476112325e8b38&v=4"
                  alt="Ahmed Kamel"
                />
                <span className="sr-only">User menu</span>
              </button>
              {isOpen && (
                <div
                  // @click.away="isOpen = false"
                  // @keydown.escape="isOpen = false"
                  x-ref="userMenu"
                  tabIndex="-1"
                  className="absolute w-48 py-1 mt-2 origin-bottom-left bg-white rounded-md shadow-lg left-10 bottom-14 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-label="user menu"
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </a>

                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Settings
                  </a>

                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </nav>

          {isSidebarOpen && (
            <div
              //   x-transition:enter="transform transition-transform duration-300"
              //   x-transition:enter-start="-translate-x-full"
              //   x-transition:enter-end="translate-x-0"
              //   x-transition:leave="transform transition-transform duration-300"
              //   x-transition:leave-start="translate-x-0"
              //   x-transition:leave-end="-translate-x-full"
              className="fixed inset-y-0 left-0 z-10 flex-shrink-0 w-64 bg-white border-r-2 border-indigo-100 shadow-lg sm:left-16 rounded-tr-3xl rounded-br-3xl sm:w-72 lg:static lg:w-64"
            >
              {currentSidebarTab == "linksTab" && (
                <nav aria-label="Main" className="flex flex-col h-full">
                  {/* <!-- Logo --> */}
                  <div className="flex items-center justify-center flex-shrink-0 py-10">
                    <a href="#">
                      <svg
                        className="text-indigo-600"
                        width="96"
                        height="53"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M7.691 34.703L13.95 28.2 32.09 52h8.087L18.449 23.418 38.594.813h-8.157L7.692 26.125V.812H.941V52h6.75V34.703zm27.61-7.793h17.156v-5.308H35.301v5.308zM89.19 13v22.512c0 3.703-1.02 6.574-3.058 8.613-2.016 2.04-4.934 3.059-8.754 3.059-3.773 0-6.68-1.02-8.719-3.059-2.039-2.063-3.058-4.945-3.058-8.648V.813h-6.68v34.874c.047 5.297 1.734 9.458 5.062 12.481 3.328 3.023 7.793 4.535 13.395 4.535l1.793-.07c5.156-.375 9.234-2.098 12.234-5.168 3.024-3.07 4.547-7.02 4.57-11.848V13h-6.785zM89 8h7V1h-7v7z"
                        />
                      </svg>
                      <img
                        className="w-24 h-auto"
                        src="https://raw.githubusercontent.com/kamona-ui/dashboard-alpine/main/public/assets/images/logo.png"
                        alt="K-UI"
                      />
                    </a>
                  </div>

                  {/* <!-- Links --> */}
                  <div className="flex-1 px-4 space-y-2 overflow-hidden hover:overflow-auto">
                    <a
                      href="#"
                      className="flex items-center w-full space-x-2 text-white bg-indigo-600 rounded-lg"
                    >
                      <span
                        aria-hidden="true"
                        className="p-2 bg-indigo-700 rounded-lg"
                      >
                        <svg
                          className="w-6 h-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      </span>
                      <span>Home</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center space-x-2 text-indigo-600 transition-colors rounded-lg group hover:bg-indigo-600 hover:text-white"
                    >
                      <span
                        aria-hidden="true"
                        className="p-2 transition-colors rounded-lg group-hover:bg-indigo-700 group-hover:text-white"
                      >
                        <svg
                          className="w-6 h-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                      <span>Pages</span>
                    </a>
                  </div>
                </nav>
              )}

              {currentSidebarTab == "messagesTab" && (
                <section className="px-4 py-6">
                  <h2 className="text-xl">Messages</h2>
                </section>
              )}

              {currentSidebarTab == "notificationsTab" && (
                <section className="px-4 py-6">
                  <h2 className="text-xl">Notifications</h2>
                </section>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <header className="relative flex items-center justify-between flex-shrink-0 p-4">
            <form action="#" className="flex-1">
              {/* <!--  --> */}
            </form>
            <div className="items-center hidden ml-4 sm:flex">
              <button
                onClick={() => setIsSettingsPanelOpen(true)}
                // @click="isSettingsPanelOpen = true"
                className="p-2 mr-4 text-gray-400 bg-white rounded-lg shadow-md hover:text-gray-600 focus:outline-none focus:ring focus:ring-white focus:ring-offset-gray-100 focus:ring-offset-4"
              >
                <span className="sr-only">Settings</span>
                <svg
                  aria-hidden="true"
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>

              {/* <!-- Github link --> */}
              <a
                href="https://github.com/kamona-ui/dashboard-alpine"
                target="_blank"
                className="p-2 text-white bg-black rounded-lg shadow-md hover:text-gray-200 focus:outline-none focus:ring focus:ring-black focus:ring-offset-gray-100 focus:ring-offset-2"
              >
                <span className="sr-only">github link</span>
                <svg
                  aria-hidden="true"
                  className="w-6 h-6"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.026,2c-5.509,0-9.974,4.465-9.974,9.974c0,4.406,2.857,8.145,6.821,9.465 c0.499,0.09,0.679-0.217,0.679-0.481c0-0.237-0.008-0.865-0.011-1.696c-2.775,0.602-3.361-1.338-3.361-1.338 c-0.452-1.152-1.107-1.459-1.107-1.459c-0.905-0.619,0.069-0.605,0.069-0.605c1.002,0.07,1.527,1.028,1.527,1.028 c0.89,1.524,2.336,1.084,2.902,0.829c0.091-0.645,0.351-1.085,0.635-1.334c-2.214-0.251-4.542-1.107-4.542-4.93 c0-1.087,0.389-1.979,1.024-2.675c-0.101-0.253-0.446-1.268,0.099-2.64c0,0,0.837-0.269,2.742,1.021 c0.798-0.221,1.649-0.332,2.496-0.336c0.849,0.004,1.701,0.115,2.496,0.336c1.906-1.291,2.742-1.021,2.742-1.021 c0.545,1.372,0.203,2.387,0.099,2.64c0.64,0.696,1.024,1.587,1.024,2.675c0,3.833-2.33,4.675-4.552,4.922 c0.355,0.308,0.675,0.916,0.675,1.846c0,1.334-0.012,2.41-0.012,2.737c0,0.267,0.178,0.577,0.687,0.479 C19.146,20.115,22,16.379,22,11.974C22,6.465,17.535,2,12.026,2z"
                  ></path>
                </svg>
              </a>
            </div>

            {/* <!-- Mobile sub header button --> */}
            <button
              onClick={() => setIsSubHeaderOpen(!isSubHeaderOpen)}
              className="p-2 text-gray-400 bg-white rounded-lg shadow-md sm:hidden hover:text-gray-600 focus:outline-none focus:ring focus:ring-white focus:ring-offset-gray-100 focus:ring-offset-4"
            >
              <span className="sr-only">More</span>

              <svg
                aria-hidden="true"
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>

            {/* <!-- Mobile sub header --> */}
            {isSubHeaderOpen && (
              <div
                // x-transition:enter="transform transition-transform"
                // x-transition:enter-start="translate-y-full opacity-0"
                // x-transition:enter-end="translate-y-0 opacity-100"
                // x-transition:leave="transform transition-transform"
                // x-transition:leave-start="translate-y-0 opacity-100"
                // x-transition:leave-end="translate-y-full opacity-0"
                //   @click.away="isSubHeaderOpen = false"
                className="absolute flex items-center justify-between p-2 bg-white rounded-md shadow-lg sm:hidden top-16 left-5 right-5"
              >
                {/* <!-- Seetings button --> */}
                <button
                  onClick={() => (
                    setIsSettingsPanelOpen(true), setIsSubHeaderOpen(false)
                  )}
                  className="p-2 text-gray-400 bg-white rounded-lg shadow-md hover:text-gray-600 focus:outline-none focus:ring focus:ring-white focus:ring-offset-gray-100 focus:ring-offset-4"
                >
                  <span className="sr-only">Settings</span>
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                {/* <!-- Messages button --> */}
                <button
                  onClick={() => (
                    setIsSidebarOpen(true),
                    setCurrentSidebarTab("messagesTab"),
                    setIsSubHeaderOpen(false)
                  )}
                  className="p-2 text-gray-400 bg-white rounded-lg shadow-md hover:text-gray-600 focus:outline-none focus:ring focus:ring-white focus:ring-offset-gray-100 focus:ring-offset-4"
                >
                  <span className="sr-only">Toggle message panel</span>
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </button>
                {/* <!-- Notifications button --> */}
                <button
                  onClick={() => (
                    setIsSidebarOpen(true),
                    setCurrentSidebarTab("notificationsTab"),
                    setIsSubHeaderOpen(false)
                  )}
                  className="p-2 text-gray-400 bg-white rounded-lg shadow-md hover:text-gray-600 focus:outline-none focus:ring focus:ring-white focus:ring-offset-gray-100 focus:ring-offset-4"
                >
                  <span className="sr-only">Toggle notifications panel</span>
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
                {/* <!-- Github link --> */}
                <a
                  href="https://github.com/kamona-ui/dashboard-alpine"
                  target="_blank"
                  className="p-2 text-white bg-black rounded-lg shadow-md hover:text-gray-200 focus:outline-none focus:ring focus:ring-black focus:ring-offset-gray-100 focus:ring-offset-2"
                >
                  <span className="sr-only">github link</span>
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12.026,2c-5.509,0-9.974,4.465-9.974,9.974c0,4.406,2.857,8.145,6.821,9.465 c0.499,0.09,0.679-0.217,0.679-0.481c0-0.237-0.008-0.865-0.011-1.696c-2.775,0.602-3.361-1.338-3.361-1.338 c-0.452-1.152-1.107-1.459-1.107-1.459c-0.905-0.619,0.069-0.605,0.069-0.605c1.002,0.07,1.527,1.028,1.527,1.028 c0.89,1.524,2.336,1.084,2.902,0.829c0.091-0.645,0.351-1.085,0.635-1.334c-2.214-0.251-4.542-1.107-4.542-4.93 c0-1.087,0.389-1.979,1.024-2.675c-0.101-0.253-0.446-1.268,0.099-2.64c0,0,0.837-0.269,2.742,1.021 c0.798-0.221,1.649-0.332,2.496-0.336c0.849,0.004,1.701,0.115,2.496,0.336c1.906-1.291,2.742-1.021,2.742-1.021 c0.545,1.372,0.203,2.387,0.099,2.64c0.64,0.696,1.024,1.587,1.024,2.675c0,3.833-2.33,4.675-4.552,4.922 c0.355,0.308,0.675,0.916,0.675,1.846c0,1.334-0.012,2.41-0.012,2.737c0,0.267,0.178,0.577,0.687,0.479 C19.146,20.115,22,16.379,22,11.974C22,6.465,17.535,2,12.026,2z"
                    ></path>
                  </svg>
                </a>
              </div>
            )}
          </header>

          <div className="">
            {/* <!-- Main --> */}
            <main className="">
              {/* <!-- Content --> */}
              {content}
            </main>
          </div>
        </div>
      </div>

      {isSettingsPanelOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setIsSettingsPanelOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      {/* //   <!-- Panel --> */}
      {isSettingsPanelOpen && (
        <section
          //   x-transition:enter="transform transition-transform duration-300"
          //   x-transition:enter-start="translate-x-full"
          //   x-transition:enter-end="translate-x-0"
          //   x-transition:leave="transform transition-transform duration-300"
          //   x-transition:leave-start="translate-x-0"
          //   x-transition:leave-end="translate-x-full"
          className="fixed inset-y-0 right-0 w-64 bg-white border-l border-indigo-100 rounded-l-3xl"
        >
          <div className="px-4 py-8">
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
        </section>
      )}
    </>
  );
}
