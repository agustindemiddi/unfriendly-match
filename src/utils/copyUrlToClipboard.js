const copyUrlToClipboard = async () => {
  try {
    const currentUrl = window.location.href;
    await navigator.clipboard.writeText(currentUrl);
    alert('Tournament URL copied! You can share it now!');
  } catch (error) {
    console.error('Unable to copy URL to clipboard', error);
  }
};

export default copyUrlToClipboard;
