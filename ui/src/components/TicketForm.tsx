import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import ErrorMessage from "./ErrorMessage";
import { categories, isCategory, isPriority, priorities } from "../types/ticket";
import type { CreateTicketInput, TicketFormErrors, TicketFormState } from "../types/ticket";

interface TicketFormProps {
  //a function that sends the ticket, returns an error text, or null if it successful
  onSend: (ticket: CreateTicketInput) => Promise<string | null>;
}

const emptyForm: TicketFormState = {
  customerName: "", email: "", phone: "", title: "",
  category: "", priority: "", description: "",
};

//checks the form and returns an error msg for each wrong field, or stays an empty object whichc means no errors found
function validate(form: TicketFormState): TicketFormErrors {
  const errors: TicketFormErrors = {};

  if (form.customerName.trim() === "") errors.customerName = "Full name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = "Please enter a valid email address";
  if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone.trim())) errors.phone = "Please enter a valid phone number";
  if (form.title.trim().length < 3) errors.title = "Title is required (at least 3 characters)";
  if (!isCategory(form.category)) errors.category = "Please choose a category";
  if (!isPriority(form.priority)) errors.priority = "Please choose a priority";
  if (form.description.trim().length < 10) errors.description = "Description is required (at least 10 characters)";

  return errors;
}

//tailwind classes we use continuosly
const inputClass = "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2";
const errorClass = "mt-1 text-sm text-red-700";

export default function TicketForm({ onSend }: TicketFormProps) {
  const [form, setForm] = useState<TicketFormState>(emptyForm);
  const [errors, setErrors] = useState<TicketFormErrors>({});
  const [isSending, setIsSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  //singular onchange function for all fields, instead of onchange for each one
  //the "name" of the input is the key in the state, so for email field it would be email, etc
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { //e for event
    setForm({ ...form, [e.target.name]: e.target.value }); //copy the old form and change only this field
  };

  const onSub = async (e: SubmitEvent) => {
    e.preventDefault(); //preventing the browser from reloading the page
    setServerError(null);

    const foundErrors = validate(form);
    setErrors(foundErrors); //show error msgs under the fields
    if (Object.keys(foundErrors).length > 0) {
      return; //there are errors, so we do not send the form
    }

    //validate() already checked these, but typescript is unaware, so we check again with the guards
    if (!isCategory(form.category) || !isPriority(form.priority)) {
      return;
    }

    setIsSending(true);
    const error = await onSend({
      customerName: form.customerName.trim(), //trim to remove spaces from start and end
      email: form.email.trim(),
      phone: form.phone.trim(),
      title: form.title.trim(),
      category: form.category,
      priority: form.priority,
      description: form.description.trim(),
    });
    setIsSending(false);
    if (error) {
      setServerError(error); 
    }
  };


  return (
    <form onSubmit={onSub} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          Full Name
          <input name="customerName" value={form.customerName} onChange={onChange} className={inputClass} />
          {errors.customerName && <p className={errorClass}>{errors.customerName}</p>}
        </label>

        <label className="block">
          Email
          <input name="email" type="email" value={form.email} onChange={onChange} className={inputClass} />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </label>

        <label className="block">
          Phone
          <input name="phone" type="tel" value={form.phone} onChange={onChange} className={inputClass} />
          {errors.phone && <p className={errorClass}>{errors.phone}</p>}
        </label>

        <label className="block">
          Title
          <input name="title" value={form.title} onChange={onChange} className={inputClass} />
          {errors.title && <p className={errorClass}>{errors.title}</p>}
        </label>

        <label className="block">
          Category
          <select name="category" value={form.category} onChange={onChange} className={inputClass}>
            <option value="">Choose a category</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className={errorClass}>{errors.category}</p>}
        </label>

        <label className="block">
          Priority
          <select name="priority" value={form.priority} onChange={onChange} className={inputClass}>
            <option value="">Choose a priority</option>
            {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.priority && <p className={errorClass}>{errors.priority}</p>}
        </label>
      </div>

      <label className="block">
        Description
        <textarea name="description" rows={5} value={form.description} onChange={onChange} className={inputClass} />
        {errors.description && <p className={errorClass}>{errors.description}</p>}
      </label>

      {/* reason server failed */}
      {serverError && <ErrorMessage message={serverError} />}

      <button type="submit" disabled={isSending}
        className="rounded bg-teal-700 px-5 py-2 font-semibold text-white hover:bg-teal-800 disabled:opacity-60">
        {isSending ? "Sending..." : "Send ticket"}
      </button>
    </form>
  );
}


