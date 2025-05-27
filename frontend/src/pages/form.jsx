import React, { useState, useEffect } from "react"
import * as Label from "@radix-ui/react-label"
import toast from "react-hot-toast"

const universities = [
  "Adama Science and Technology University",
  "Addis Ababa Science & Technology University",
  "Addis Ababa University",
  "Adigrat University",
  "Aksum University",
  "Ambo University",
  "Arba Minch University",
  "Assosa University",
  "Bahir Dar University",
  "Bule Hora University",
  "Debre Birhan University",
  "Debre Markos University",
  "Dilla University",
  "Dire Dawa University",
  "Ethiopian Civil Service University",
  "Gondar University",
  "Haramaya University",
  "Hawassa University",
  "Jigjiga University",
  "Jimma University",
  "Madawalabu University",
  "Mekelle Institute of Technology",
  "Mekelle University",
  "Mizan Tepi University",
  "Semera University",
  "Unity University",
  "Wolaita Sodo University",
  "Wolkite University",
  "Wollega University",
  "Wollo University",
]

const Form = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    university: "",
    cgpa: "",
    profile: null,
    documents: [],
    cohort: "",
  })

  const [cohorts, setCohorts] = useState([])

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/cohort")
        const data = await res.json()
        setCohorts(data)
      } catch (err) {
        console.error("Failed to fetch cohorts:", err)
      }
    }

    fetchCohorts()
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setForm((prev) => ({
        ...prev,
        [name]: files.length === 1 ? files[0] : Array.from(files),
      }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", form.name)
    formData.append("email", form.email)
    formData.append("university", form.university)
    formData.append("CGPA", form.cgpa)
   const selectedCohort = cohorts.find((c) => c.name === form.cohort)
if (!selectedCohort) {
  toast.error("Invalid cohort selected.")
  return
}
formData.append("cohort", selectedCohort._id)

    

    if (form.profile) {
      formData.append("profilePicture", form.profile)
    }

    if (form.documents.length > 0) {
      form.documents.forEach((doc) => {
        formData.append("documents", doc)
      })
    }

    try {
      const res = await fetch("http://localhost:5000/api/interns/apply", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Submission failed")

      const data = await res.json()
      toast.success("Application submitted successfully!", {
        style: {
          background: "#D1FAE5",
          color: "#065F46",
          border: "1px solid #34D399",
          fontWeight: "bold",
        },
      })

      console.log(data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to submit application.")
    }
  }

  return (
    <div className="min-h-screen py-16 px-6 md:px-20 bg-zinc-50">
      <h1 className="text-4xl font-bold mb-10 text-center text-[#144145]">
        Internship Application Form
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-lg border space-y-8"
      >
        <div>
          <Label.Root htmlFor="name" className="block mb-2 font-medium">
            Full Name
          </Label.Root>
          <input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border bg-zinc-100"
          />
        </div>

        <div>
          <Label.Root htmlFor="email" className="block mb-2 font-medium">
            Email
          </Label.Root>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border bg-zinc-100"
          />
        </div>

        <div>
          <Label.Root htmlFor="university" className="block mb-2 font-medium">
            University
          </Label.Root>
          <input
            list="university-list"
            name="university"
            id="university"
            value={form.university}
            onChange={handleChange}
            required
            placeholder="Start typing..."
            className="w-full p-3 rounded-lg border bg-zinc-100"
          />
          <datalist id="university-list">
            {universities.map((uni) => (
              <option key={uni} value={uni} />
            ))}
          </datalist>
        </div>

        <div>
          <Label.Root htmlFor="cgpa" className="block mb-2 font-medium">
            CGPA (0 - 4)
          </Label.Root>
          <input
            type="number"
            name="cgpa"
            id="cgpa"
            step="0.01"
            min="0"
            max="4"
            value={form.cgpa}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border bg-zinc-100"
          />
        </div>

        <div>
          <Label.Root htmlFor="cohort" className="block mb-2 font-medium">
            Select Internship Cohort
          </Label.Root>
          <select
            name="cohort"
            id="cohort"
            value={form.cohort}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border bg-zinc-100"
          >
            <option value="">-- Select a cohort --</option>
            {cohorts.map((cohort) => (
             <option key={cohort._id} value={cohort.name}>
  {cohort.name}
</option>

            ))}
          </select>
        </div>

        <div>
          <Label.Root htmlFor="profile" className="block mb-2 font-medium">
            Profile Picture
          </Label.Root>
          <input
            type="file"
            name="profile"
            id="profile"
            accept="image/*"
            onChange={handleChange}
            required
            className="w-full p-2 rounded-lg border bg-zinc-100"
          />
        </div>

        <div>
          <Label.Root htmlFor="documents" className="block mb-2 font-medium">
            Upload a clear image of your latest university transcript
          </Label.Root>
          <input
            type="file"
            name="documents"
            id="documents"
            multiple
            accept="image/*,application/pdf"
            onChange={handleChange}
            className="w-full p-2 rounded-lg border bg-zinc-100"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-6 bg-[#D25B24] hover:bg-[#b3471c] text-white rounded-lg font-semibold text-lg transition duration-300 shadow-md"
        >
          Submit Application
        </button>
      </form>
    </div>
  )
}

export default Form
