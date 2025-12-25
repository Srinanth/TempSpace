import Layout from '../../components/layout/layout';

const Privacy = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl text-slate-900 dark:text-white">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Data We Collect</h2>
            <p>We believe in data minimization. We only collect what is strictly necessary to provide the service:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-slate-600 dark:text-slate-300">
              <li><strong>Uploaded Files:</strong> Stored temporarily until the space expires.</li>
              <li><strong>Metadata:</strong> Filenames, file sizes, and timestamps necessary to display the dashboard.</li>
              <li><strong>IP Addresses:</strong> Logged temporarily for rate-limiting and preventing abuse (DDoS protection).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Data</h2>
            <p className="text-slate-600 dark:text-slate-300">
              We do not sell, trade, or rent your personal identification information to others. We use your data solely to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2 text-slate-600 dark:text-slate-300">
              <li>Facilitate the transfer of files between you and your recipients.</li>
              <li>Maintain the stability and security of our servers.</li>
              <li>Comply with legal obligations if required.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Data Retention</h2>
            <p className="text-slate-600 dark:text-slate-300">
              Files are automatically deleted when the Space timer expires (usually 24 hours). Metadata associated with the space is deleted simultaneously. We may retain generic server access logs for up to 30 days for security auditing purposes.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;