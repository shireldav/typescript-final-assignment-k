import { useState } from "react";
import type { SubmitEvent } from "react"; //on form event is general and we learnt about it in html, I think it is submit event, the stack overflow article I read is pretty old so makes sense why it is different
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { login } from "../services/ticketApi";

const inputClass = "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2";

//admin login page
export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSub = async (e: SubmitEvent) => {
    e.preventDefault();
    if (username.trim() === "" || password === "") {
      setError("Please enter your username and password");
      return;
    }
    doApi();
  };

  const doApi = async () => {
    setIsLoading(true);
    setError(null);
    const response = await login({ username: username.trim(), password });
    setIsLoading(false);

    if (response.success) {
      localStorage.setItem("token", response.data.token); //save the token, this is what "logged in" means
      nav("/dashboard");
    } else {
      //server says invalid username or password and never points out exacly which is wrong for security reasons
      setError(response.error);
    }
  };

  return (
    <form onSubmit={onSub} className="mx-auto max-w-sm space-y-4 rounded border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-bold">Admin login</h1>
      <label className="block">
        Username
        <input value={username} onChange={(e) => setUsername(e.target.value)} className={inputClass} />
      </label>
      <label className="block">
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
      </label>
      {error && <ErrorMessage message={error} />}
      <button type="submit" disabled={isLoading}
        className="w-full rounded bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800 disabled:opacity-60">
        {isLoading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
