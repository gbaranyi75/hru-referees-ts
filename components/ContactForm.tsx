"use client";
import React, { useState } from "react";
import InputField from "./common/InputField";
import PrimaryButton from "./common/PrimaryButton";
import TextArea from "./common/TextArea";
import Label from "./common/Label";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";

const CONTACTS = {
  phone: "+36304146068",
  email: "rugbyreferee.hungary@gmail.com",
};

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState<boolean>(false);

  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    try {
      setSending(true);
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contactForm: {
            name,
            email,
            message,
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setName("");
        setEmail("");
        setMessage("");
        toast.success("Sikeres email küldés");
      } else {
        toast.error(data.message || "Hiba történt az üzenet küldésekor.");
      }
    } catch (err) {
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
                onChange={(e) => setName(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>Email</Label>
              <InputField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>Üzenet</Label>
              <TextArea
                placeholder="Ide írhatod a üzeneted..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <PrimaryButton
              type="submit"
              text={sending ? "Küldés..." : "Elküldöm"}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
