import { Navigate } from 'react-router-dom';

import PageContent from '../components/UI/PageContent';
import SignIn from '../components/SignIn/SignIn';

import { getUserAuthCtx } from '../context/AuthContext';

const SignInPage = () => {
  const { user } = getUserAuthCtx();

  if (user) {
    return <Navigate to='/' />;
  }

  return (
    <PageContent title='Sign In'>
      <SignIn />
    </PageContent>
  );
};

export default SignInPage;
