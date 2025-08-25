

import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FaqSection from '../components/about/FaqSection';
import { apiFetch } from '../utilss/apifetch'; // Adjust the import path as necessary

const Contact = () => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await apiFetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('✅ Message sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('❌ Failed to send message.');
      }
    } catch (error) {
      console.error(error);
      setStatus('❌ Server error.');
    }
  };

  return (
    <>
      <Navbar
        searchQuery=""
        onSearchChange={() => {}}
        onCartClick={() => {}}
        onContactClick={() => {}}
      />

      {/* Banner (unchanged)... */}

      {/* Contact Form Section */}
      <section className="w-full flex justify-center bg-gray-50 py-16">
        <div className="max-w-3xl w-full px-6">
          <form onSubmit={handleSubmit} className="bg-white p-10 rounded-xl shadow-lg space-y-8">
            <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-6 text-center">
              Get in Touch
            </h2>

            <div>
              <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3"
                placeholder="Your Name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3"
                placeholder="Your message..."
                rows={6}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
            >
              Send Message
            </button>

            {status && <p className="text-center text-green-600">{status}</p>}
          </form>
        </div>
      </section>

      <FaqSection />
      <Footer />
    </>
  );
};

export default Contact;

