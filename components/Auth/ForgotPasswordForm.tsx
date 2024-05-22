"use client";

import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase-config";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleForgotPassword = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    // check if email is empty
    if (!email) {
      setError("Email is required");
      return;
    }

    // check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSubmitted(true);
        setTimeout(() => {
          router.push("/signin");
        }, 5000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        setError(errorMessage);
      });
  };
  return (
    <div className="">
      {submitted ? (
        <SubmittedMessage />
      ) : (
        <form>
          <div className="grid gap-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm mb-2 dark:text-white"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primaryDark focus:ring-primaryDark disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                  required
                  aria-describedby="email-error"
                />
                <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                  <svg
                    className="size-5 text-red-500"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                  </svg>
                </div>
              </div>
              <p className="hidden text-xs text-red-600 mt-2" id="email-error">
                Please include a valid email address so we can get back to you
              </p>
            </div>
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

            <button
              onClick={handleForgotPassword}
              type="submit"
              className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-white hover:bg-primaryDark disabled:opacity-50 disabled:pointer-events-none"
            >
              Reset password
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const SubmittedMessage: React.FC = () => {
  return (
    <div className="min-h-60 flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
      <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
        {/* email svg */}
        <svg
          viewBox="0 0 24 24"
          className="
            w-12 h-12 lg:w-24 lg:h-24
                  text-gray-800 dark:text-white/80 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.025 17H3.707l5.963-5.963L12 12.83l2.33-1.794 1.603 1.603a5.463 5.463 0 0 1 1.004-.41l-1.808-1.808L21 5.9v6.72a5.514 5.514 0 0 1 1 .64V5.5A1.504 1.504 0 0 0 20.5 4h-17A1.504 1.504 0 0 0 2 5.5v11A1.5 1.5 0 0 0 3.5 18h9.525c-.015-.165-.025-.331-.025-.5s.01-.335.025-.5zM3 16.293V5.901l5.871 4.52zM20.5 5c.009 0 .016.005.025.005L12 11.57 3.475 5.005c.009 0 .016-.005.025-.005zm-2 8a4.505 4.505 0 0 0-4.5 4.5 4.403 4.403 0 0 0 .05.5 4.49 4.49 0 0 0 4.45 4h.5v-1h-.5a3.495 3.495 0 0 1-3.45-3 3.455 3.455 0 0 1-.05-.5 3.498 3.498 0 0 1 5.947-2.5H20v.513A2.476 2.476 0 0 0 18.5 15a2.5 2.5 0 1 0 1.733 4.295A1.497 1.497 0 0 0 23 18.5v-1a4.555 4.555 0 0 0-4.5-4.5zm0 6a1.498 1.498 0 0 1-1.408-1 1.483 1.483 0 0 1-.092-.5 1.5 1.5 0 0 1 3 0 1.483 1.483 0 0 1-.092.5 1.498 1.498 0 0 1-1.408 1zm3.5-.5a.5.5 0 0 1-1 0v-3.447a3.639 3.639 0 0 1 1 2.447z" />
          <path fill="none" d="M0 0h24v24H0z" />
        </svg>

        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Email sent ✅
        </h2>

        <p className="mt-2 text-sm text-center px-5 text-gray-800 dark:text-neutral-300">
          We&apos;ve sent you an email with a link to reset your password!
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
