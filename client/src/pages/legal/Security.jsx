import React from 'react';
import Layout from '../../components/layout/layout';
import { Shield, Lock, Trash2, Cloud } from 'lucide-react';

const Security = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-4xl text-slate-900 dark:text-white">
        <div className="mb-12 text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 text-indigo-500" />
          <h1 className="text-4xl font-bold mb-4">Security</h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">Simple, honest details about how we handle your files.</p>
        </div>

        <div className="space-y-12">
          <section className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
              <Lock className="text-emerald-500" /> HTTPS Encryption
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We force <strong>HTTPS</strong> on all connections. This means when you upload or download a file, it travels over an encrypted connection (TLS) so your ISP or public Wi-Fi provider cannot see the contents of your files, only that you are connected to our site.
            </p>
          </section>

          <section className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
              <Trash2 className="text-rose-500" /> File Deletion
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              When a space expires (or you manually delete it), our system:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
              <li>Removes the entry from our database immediately.</li>
              <li>Triggers a command to delete the actual file from our storage.</li>
              <li>We do not keep hidden backups. Once deleted, we cannot recover your files.</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="flex items-center gap-3 text-2xl font-bold mb-4">
              <Cloud className="text-blue-500" /> Cloud Infrastructure
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              We do not own physical servers. We host our application on standard, reputable cloud platforms (like Render/AWS) which manage physical security and network firewalls. We trust their infrastructure to keep the underlying hardware secure.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Security;