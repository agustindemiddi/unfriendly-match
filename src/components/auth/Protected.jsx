import { Navigate } from 'react-router-dom';

import { getUserAuthCtx } from '../../context/authContext';

const Protected = ({ children }) => {
  const { user } = getUserAuthCtx();

  if (!user) {
    return <Navigate to='/' />;
  }

  return children;
};

export default Protected;
