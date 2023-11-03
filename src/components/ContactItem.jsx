const ContactItem = ({ item }) => {
  return (
    <>
      <h2>{item.name}</h2>
      <p>contactId: {item.id}</p>
      <p>description: {item.description}</p>
      <img src={item.image} alt='' />
    </>
  );
};
export default ContactItem;
