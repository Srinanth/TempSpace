import React from 'react';
import Layout from '../../components/layout/layout';
import { Cookie, AlertTriangle } from 'lucide-react';

const Cookies = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl text-slate-900 dark:text-white">
        <div className="flex items-center gap-3 mb-8">
            <Cookie className="w-10 h-10 text-indigo-500" />
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
        </div>
        
        <div className="prose dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Do we use Cookies?</h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg font-medium">
              No. We do not use cookies.
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Unlike the big file tools that use cookies to track you across the web to serve ads or limit your daily usage , TempSpace is truly ephemeral. We have no ads, we don't sell data, and we don't track your history.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">What we use instead (Local Storage)</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              To make the application function, we save small pieces of data in your browser's <strong>Local Storage</strong>. This data stays on your device and is never sent to any third parties.
            </p>
            
            <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mt-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                    <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Key Name</th>
                    <th className="py-3 px-4 font-semibold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-3 px-4 font-mono text-sm text-indigo-600 dark:text-indigo-400 font-bold">auth_token</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        Keeps you logged into your current Space. If you created the space, this token also grants you <strong>Admin rights</strong>.
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="py-3 px-4 font-mono text-sm text-indigo-600 dark:text-indigo-400 font-bold">theme</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        Remembers if you prefer Dark Mode or Light Mode.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Managing Data</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Since this data is stored in your browser, you can clear it at any time by clearing your browser's cache or "Local Storage" data.
            </p>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 p-4 rounded-xl flex gap-4">
               <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0 mt-1" />
               <div>
                  <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-1">Important Warning</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300/80 leading-relaxed">
                    If you are the Creator/Admin of an active space, <strong>clearing your Local Storage will result in the permanent loss of Admin access.</strong> 
                    <br/><br/>
                    Because we do not use accounts or passwords, your Admin rights are tied exclusively to the data in your browser. If you delete it, we cannot recover your access, and you will become a standard user.
                  </p>
               </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Cookies;