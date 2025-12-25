import React from 'react';
import Layout from '../../components/layout/layout';

const Terms = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl text-slate-900 dark:text-white">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-600 dark:text-slate-300">
              By accessing or using TempSpace, you agree to be bound by these Terms. If you do not agree, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Acceptable Use</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              You agree not to use TempSpace to upload, share, or store:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
              <li>Malware, viruses, or malicious code.</li>
              <li>Pirated software, movies, music, or other copyrighted media.</li>
              <li>Content that violates copyright or intellectual property laws.</li>
              <li>Illegal content, including child sexual abuse material (CSAM) or content promoting terrorism.</li>
              <li>Content meant to harass, abuse, or harm others.</li>
            </ul>
            <p className="dark:text-slate-300 mt-4 font-semibold text-rose-500">
              Violation of these terms will result in immediate termination of access and deletion of files.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Disclaimer of Warranties</h2>
            <p className="text-slate-600 dark:text-slate-300">
              The service is provided "AS IS" without warranties of any kind. We do not guarantee that files will be available forever (in fact, they are guaranteed to disappear) or that the service will be error-free. You use this service at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
            <p className="text-slate-600 dark:text-slate-300">
              TempSpace shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service, including loss of data.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;