export const parseTokenFromLocalStorage = () => {
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const token = userProfile.token;
  return token;
};
