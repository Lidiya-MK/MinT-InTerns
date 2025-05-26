// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/landing"
import Form from "./pages/form"
import { Toaster } from "react-hot-toast"
import InternLogin from "./pages/internLogin";
import SupervisorLogin from "./pages/supervisorLogin";
import AdminLogin from "./pages/adminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import InternDashboard from "./pages/internDashboard";

function App() {
  return (
    <Router>
      {/* Toast container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#D1FAE5",
            color: "#065F46",
            border: "1px solid #34D399",
            fontWeight: "bold",
          },
        }}
      />

      {/* Routes */}
      <Routes>
        <Route path="/landing" element={<Home />} />
        <Route path="/apply" element={<Form />} />
        <Route path="/intern-login" element={<InternLogin />} />
        <Route path="/supervisor-login" element={<SupervisorLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
         <Route path="/internDashboard" element={<InternDashboard />} /> 

      </Routes>
    </Router>
  )
}

export default App




























// import {
//   Home,
//   BarChart3,
//   Users,
//   Settings,
// } from "lucide-react"
// import { Card, CardContent } from "../src/components/card"
// import { useEffect, useRef, useState } from "react"

// const navItems = [
//   { icon: <Home className="h-5 w-5" />, label: "Dashboard" },
//   { icon: <Users className="h-5 w-5" />, label: "Users" },
//   { icon: <BarChart3 className="h-5 w-5" />, label: "Reports" },
//   { icon: <Settings className="h-5 w-5" />, label: "Settings" },
// ]

// const statuses = {
//   accepted: "text-green-600 bg-green-100",
//   rejected: "text-red-600 bg-red-100",
//   pending: "text-yellow-600 bg-yellow-100",
// }

// function generateInterns(start, count = 10) {
//   const genders = ["male", "female"]
//   return Array.from({ length: count }, (_, i) => {
//     const id = start + i
//     const statusKeys = Object.keys(statuses)
//     const gender = genders[id % 2]
//     const status = statusKeys[id % statusKeys.length]
//     return {
//       id,
//       name: `Intern ${id}`,
//       cgpa: (Math.random() * 2 + 2).toFixed(2), // 2.00 - 4.00
//       avatar: `https://i.pravatar.cc/100?img=${id % 70}`,
//       status,
//       gender,
//       applicationDate: new Date(Date.now() - Math.random() * 1e10), // random past date
//     }
//   })
// }

// function App() {
//   const [interns, setInterns] = useState(() => generateInterns(1))
//   const [filter, setFilter] = useState("all")
//   const loaderRef = useRef()

//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting) {
//         setInterns((prev) => [...prev, ...generateInterns(prev.length + 1)])
//       }
//     })
//     if (loaderRef.current) observer.observe(loaderRef.current)
//     return () => observer.disconnect()
//   }, [])

//   const applyFilter = (list) => {
//     let sorted = [...list]
//     switch (filter) {
//       case "cgpa":
//         return sorted.sort((a, b) => b.cgpa - a.cgpa)
//       case "female":
//         return sorted.filter((i) => i.gender === "female")
//       case "male":
//         return sorted.filter((i) => i.gender === "male")
//       case "date":
//         return sorted.sort(
//           (a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)
//         )
//       default:
//         return sorted
//     }
//   }

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white shadow-md p-5">
//         <h1 className="text-xl font-bold mb-6">MinTinTerns</h1>
//         <nav className="space-y-4">
//           {navItems.map((item) => (
//             <div
//               key={item.label}
//               className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 cursor-pointer"
//             >
//               {item.icon}
//               <span>{item.label}</span>
//             </div>
//           ))}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8 overflow-y-auto">
//         <header className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-800">Admin Dashboard</h2>
//           <p className="text-gray-500">Welcome Back Mr. Denber</p>
//         </header>

//         {/* Dashboard cards */}
//         <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <Card>
//             <CardContent className="p-5">
//               <h3 className="text-lg font-semibold">Users</h3>
//               <p className="text-2xl font-bold text-blue-600 mt-2">1,245</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-5">
//               <h3 className="text-lg font-semibold">Revenue</h3>
//               <p className="text-2xl font-bold text-green-600 mt-2">$18,200</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-5">
//               <h3 className="text-lg font-semibold">Pending Orders</h3>
//               <p className="text-2xl font-bold text-yellow-600 mt-2">57</p>
//             </CardContent>
//           </Card>
//         </section>

//         {/* Intern list */}
//         <section>
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-2xl font-bold text-gray-800">Intern List</h3>
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="p-2 rounded-md border border-gray-300 text-gray-700"
//             >
//               <option value="all">All</option>
//               <option value="cgpa">Sort by CGPA</option>
//               <option value="female">Female only</option>
//               <option value="male">Male only</option>
//               <option value="date">Sort by Application Date</option>
//             </select>
//           </div>

//           <div className="space-y-4">
//             {applyFilter(interns).map((intern) => (
//               <div
//                 key={intern.id}
//                 className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between"
//               >
//                 <div className="flex items-center space-x-4">
//                   <img
//                     src={intern.avatar}
//                     alt={intern.name}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                   <div>
//                     <p className="font-semibold text-gray-800">{intern.name}</p>
//                     <p className="text-sm text-gray-500">
//                       ID: {intern.id} · Applied:{" "}
//                       {new Date(intern.applicationDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-gray-700 font-medium">{intern.cgpa}</p>
//                 <span
//                   className={`px-3 py-1 rounded-full text-sm font-medium ${statuses[intern.status]}`}
//                 >
//                   {intern.status}
//                 </span>
//               </div>
//             ))}
//             <div ref={loaderRef} className="h-10" />
//           </div>
//         </section>
//       </main>
//     </div>
//   )
// }

// export default App




















// import { useState, useEffect } from "react"
// import * as Switch from "@radix-ui/react-switch"
// import "./App.css"

// function App() {
//   const [darkMode, setDarkMode] = useState(() => {
//     return localStorage.getItem("theme") === "dark"
//   })

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add("dark")
//       localStorage.setItem("theme", "dark")
//     } else {
//       document.documentElement.classList.remove("dark")
//       localStorage.setItem("theme", "light")
//     }
//   }, [darkMode])

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white transition-colors duration-300">
//       {/* Header */}
//       <header className="flex justify-between items-center p-6 max-w-6xl mx-auto">
//         <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
//           MinT InTerns
//         </h1>
//         <div className="flex items-center space-x-4">
//           <span className="text-sm">Dark Mode</span>
//           <Switch.Root
//             className="w-12 h-6 bg-gray-300 dark:bg-zinc-800 rounded-full relative transition-colors"
//             checked={darkMode}
//             onCheckedChange={setDarkMode}
//           >
//             <Switch.Thumb className="block w-5 h-5 bg-white dark:bg-indigo-400 rounded-full shadow-sm transform translate-x-1 dark:translate-x-6 transition-transform duration-200" />
//           </Switch.Root>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="flex flex-col items-center justify-center text-center py-20 px-6">
//         <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
//           Empowering Interns at{" "}
//           <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text animate-pulse">
//             MinT
//           </span>
//         </h2>
//         <p className="max-w-xl text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
//           A modern project management platform tailored for interns. Track progress, collaborate easily, and shine through structured support.
//         </p>
//         <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition duration-300 relative overflow-hidden group">
//           <span className="relative z-10">Get Started</span>
//           <div className="absolute inset-0 bg-indigo-500 opacity-30 blur-xl group-hover:opacity-50 transition duration-500" />
//         </button>
//       </section>

//       {/* Features Section */}
//       <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pb-20">
//         {[
//           {
//             title: "Track Projects",
//             desc: "Visualize and manage intern project workflows seamlessly.",
//           },
//           {
//             title: "Collaborate",
//             desc: "Communicate and update in real-time with team members.",
//           },
//           {
//             title: "Evaluate Progress",
//             desc: "Built-in performance tracking and reporting tools.",
//           },
//         ].map(({ title, desc }) => (
//           <div
//             key={title}
//             className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl hover:shadow-indigo-500/30 transition duration-300 border dark:border-zinc-700"
//           >
//             <h3 className="text-xl font-semibold mb-2">{title}</h3>
//             <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
//           </div>
//         ))}
//       </section>

//       {/* Footer */}
//       <footer className="text-center py-8 border-t dark:border-zinc-800 text-sm text-gray-500 dark:text-gray-400">
//         &copy; {new Date().getFullYear()} MinT InTerns. Built with ❤️.
//       </footer>
//     </div>
//   )
// }

// export default App
