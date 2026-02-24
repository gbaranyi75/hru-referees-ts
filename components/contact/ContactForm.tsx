"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react/dist/iconify.js";
import InputField from "../common/InputField";
import DisabledButton from "../common/DisabledButton";
import PrimaryButton from "../common/PrimaryButton";
import TextArea from "../common/TextArea";
import Label from "../common/Label";

const CONTACTS = {
  phone: "+36304146068",
  email: "rugbyreferee.hungary@gmail.com",
};

// Validációs konstansok (egyezzen az API-val)
const VALIDATION = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  EMAIL_MIN: 5,
  EMAIL_MAX: 255,
  MESSAGE_MIN: 10,
  MESSAGE_MAX: 5000,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Client-side validációs függvény
function validateForm(
  name: string,
  email: string,
  message: string,
): string | null {
  const trimmedName = name.trim();
  if (!trimmedName) return "A név megadása kötelező";
  if (trimmedName.length < VALIDATION.NAME_MIN)
    return `A név legalább ${VALIDATION.NAME_MIN} karakterből kell, hogy álljon`;
  if (trimmedName.length > VALIDATION.NAME_MAX)
    return `A név maximum ${VALIDATION.NAME_MAX} karakterből állhat`;

  const trimmedEmail = email.trim();
  if (!trimmedEmail) return "Az email cím megadása kötelező";
  if (
    trimmedEmail.length < VALIDATION.EMAIL_MIN ||
    trimmedEmail.length > VALIDATION.EMAIL_MAX
  )
    return "Az email cím érvénytelen";
  if (!VALIDATION.EMAIL_REGEX.test(trimmedEmail))
    return "Az email cím formátuma érvénytelen";

  const trimmedMessage = message.trim();
  if (!trimmedMessage) return "Az üzenet megadása kötelező";
  if (trimmedMessage.length < VALIDATION.MESSAGE_MIN)
    return `Az üzenet legalább ${VALIDATION.MESSAGE_MIN} karakterből kell, hogy álljon`;
  if (trimmedMessage.length > VALIDATION.MESSAGE_MAX)
    return `Az üzenet maximum ${VALIDATION.MESSAGE_MAX} karakterből állhat`;

  return null;
}

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState<boolean>(false);

 // const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //setStatus(null);

    // Client-side validáció
    const validationError = validateForm(name, email, message);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setSending(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setName("");
        setEmail("");
        setMessage("");
        toast.success("Sikeres email küldés");
      } else {
        toast.error(data.error || "Hiba történt az üzenet küldésekor.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Hiba történt az üzenet küldésekor.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col justify-start items-start">
          <label className="text-lg font-semibold mb-2">
            Lépj velünk kapcsolatba!
          </label>

          <p className="mb-4 text-gray-600">
            Ha kérdésed van, vagy szeretnél többet megtudni a játékvezetésssel
            kapcsolatban, hívj minket vagy küldj egy emailt!
          </p>
          <p className="mb-2 text-gray-600">Telefon:</p>
          <div className="flex items-center gap-3">
            <Icon
              icon="lucide:phone"
              width="20"
              height="20"
              className="text-blue-500"
            />
            <a
              href={`tel:${CONTACTS.phone}`}
              className="text-blue-500 hover:underline">
              {CONTACTS.phone}
            </a>
          </div>
          <p className="mb-2 mt-6 text-gray-600">Email:</p>
          <div className="flex items-center gap-3">
            <Icon
              icon="lucide:mail"
              width="20"
              height="20"
              className="text-blue-500"
            />
            <a
              href={`mailto:${CONTACTS.email}`}
              className="text-blue-500 hover:underline">
              {CONTACTS.email}
            </a>
          </div>
        </div>
        <div>
          <div className="text-lg font-semibold mb-2">Kapcsolati űrlap</div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4">
            <div className="col-span-2 lg:col-span-1">
              <Label>Név</Label>
              <InputField
                type="text"
                value={name}
                required={true}
                onChange={(e) => setName(e.target.value)}
                placeholder="Írd be a neved..."
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>Email</Label>
              <InputField
                type="email"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>Üzenet</Label>
              <TextArea
                placeholder="Ide írhatod az üzeneted (legalább 10 karakter)..."
                value={message}
                required={true}
                onChange={(e) => setMessage(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            {sending && <DisabledButton text="Küldés..." />}
            {!sending && (
              <PrimaryButton
                type="submit"
                text="Elküldöm"
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
