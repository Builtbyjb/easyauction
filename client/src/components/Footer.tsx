import { useState } from "react";
import { Mail, Send, GitGraphIcon } from "lucide-react";

export default function Footer() {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the feedback to your server
    console.log("Feedback submitted:", feedback);
    setFeedback("");
    alert("Thank you for your feedback!");
  };

  return (
    <footer className="bg-zinc-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <GitGraphIcon className="mr-2 h-5 w-5" />
                <a
                  href="https://github.com/builtbyjb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                <a
                  href="mailto:awotideajibolat@gmail.com"
                  className="hover:text-blue-400 transition-colors"
                >
                  contact@builtbyjb
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-blue-400 transition-colors">
                  Active Listings
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Feedback Form */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Send Feedback</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  className="w-full p-2 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={3}
                  placeholder="Your feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center transition-colors"
              >
                <Send className="mr-2 h-4 w-4" />
                Send
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>
            &copy; {new Date().getFullYear()} Builtbyjb. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
