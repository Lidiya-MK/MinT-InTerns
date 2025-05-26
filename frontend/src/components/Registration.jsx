export default function Registration({ view, formData, setFormData, handleRegisterSubmit, handleRegisterSupervisor }) {
  return (
    <section className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">
        {view === "register-admin" ? "Register New Administrator" : "Register New Supervisor"}
      </h3>
      <form
        onSubmit={view === "register-admin" ? handleRegisterSubmit : handleRegisterSupervisor}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="password"
          placeholder="6-digit Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full border border-gray-300 p-2 rounded"
        />
        <button type="submit" className="w-full bg-[#D25B24] text-white p-2 rounded">
          {view === "register-admin" ? "Register Administrator" : "Register Supervisor"}
        </button>
      </form>
    </section>
  );
}
