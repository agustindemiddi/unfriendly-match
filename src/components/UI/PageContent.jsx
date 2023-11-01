const PageContent = ({ title, children }) => {
  return (
    <>
      <h1>{title.toUpperCase()}</h1>
      {children}
    </>
  );
};
export default PageContent;
