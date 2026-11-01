import {api} from "../api";
import { useState } from "react";

function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};

    if (name.trim() === "") newErrors.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Enter a valid email";
    if (password.length < 8) newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const res = await api("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        setServerMessage(data.message || "Signup failed");
        return;
      }

      setServerMessage(data.message);
      setSubmitted(true);
    } catch (err) {
      setServerMessage("Could not reach the server");
    }
  }

  if (submitted) {
    return (
      <div className="page">
        <h1>Thank you, {name}!</h1>
        <p>{serverMessage}</p>
        <p>You can now log in from the Login page.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Registration</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" autoComplete="name" required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
        {errors.name && <p className="error-msg">{errors.name}</p>}

        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <p className="error-msg">{errors.email}</p>}

        <label htmlFor="password">Password</label>
        <input id="password" autoComplete="new-password" required minLength={8} maxLength={72} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {errors.password && <p className="error-msg">{errors.password}</p>}

        <button type="submit">Submit</button>
      </form>
      {serverMessage && !submitted && <p className="error-msg">{serverMessage}</p>}
    </div>
  );
}

export default Registration;