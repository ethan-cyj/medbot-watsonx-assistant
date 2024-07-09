'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import WatsonAssistantChat from './components/WatsonAssistantChat';
import Image from 'next/image';

const HomeContent = () => {
  const searchParams = useSearchParams();
  const patient_id = parseInt(searchParams.get('patient_id') || '1', 10);
  const visit_id = parseInt(searchParams.get('visit_id') || '1', 10);

  return (
    <>
      <Head>
        <title>Welcome to IBM Hospital</title>
        <meta name="description" content="Welcome to our hospital. We provide the best healthcare services." />
      </Head>
      <WatsonAssistantChat patient_id={patient_id} visit_id={visit_id} />
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-50">
        <div className="w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <div className="flex items-center mb-4 space-x-4">
            <Image src="/icons/main.svg" alt="Main Icon" width={100} height={85} />
            <h1 className="text-4xl font-bold text-blue-600">Welcome to IBM Hospital</h1>
          </div>
          <p className="mb-8 text-gray-700 lg:ml-4">
            We provide comprehensive healthcare services with compassion and care. Our team of experienced doctors and
            nurses are here to ensure you receive the best medical treatment.
          </p>
        </div>

        <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-3 lg:text-left gap-8">
          <a
            href="/services"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:shadow-lg flex flex-col items-center"
          >
            <Image src="/icons/services.svg" alt="Services Icon" width={198} height={169} className="mb-4" />
            <h2 className="mb-3 text-2xl font-semibold text-blue-600">
              Our Services
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-75">
              Explore the wide range of medical services we offer to our patients.
            </p>
          </a>

          <a
            href="/about-us"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:shadow-lg flex flex-col items-center"
          >
            <Image src="/icons/about-us.svg" alt="About Us Icon" width={198} height={169} className="mb-4" />
            <h2 className="mb-3 text-2xl font-semibold text-blue-600">
              About Us
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-75">
              Learn more about our hospital, our mission, and our team.
            </p>
          </a>

          <a
            href="/contact"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:shadow-lg flex flex-col items-center"
          >
            <Image src="/icons/contact.svg" alt="Contact Icon" width={198} height={169} className="mb-4" />
            <h2 className="mb-3 text-2xl font-semibold text-blue-600">
              Contact Us
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-75">
              Get in touch with us for appointments, inquiries, and more.
            </p>
          </a>
        </div>

        <footer className="w-full max-w-5xl mx-auto mt-12">
          <div className="flex flex-col items-center justify-center border-t border-gray-300 py-8">
            <p className="text-sm text-gray-500">© 2024 IBM Hospital. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
