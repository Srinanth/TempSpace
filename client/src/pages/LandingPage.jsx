import Layout from '../components/layout/layout';
import JoinSpaceForm from '../features/auth/join';

const LandingPage = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4">
         <div className="relative z-10 w-full flex justify-center">
            <div className="w-full max-w-lg">
               <JoinSpaceForm />
            </div>
         </div>
      </div>
    </Layout>
  );
};
export default LandingPage;