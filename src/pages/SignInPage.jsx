import { Navigate } from 'react-router-dom';

import Section from '../components/UI/Section';
import SignIn from '../components/SignIn/SignIn';

import { getUserAuthCtx } from '../context/AuthContext';

const SignInPage = () => {
  const { user } = getUserAuthCtx();

  if (user) {
    return <Navigate to='/' />;
  }

  return (
    <Section>
      <SignIn />
    </Section>
  );
};

export default SignInPage;
