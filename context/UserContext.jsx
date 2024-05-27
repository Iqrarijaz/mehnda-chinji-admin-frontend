import { createContext, useContext, useState } from "react";
import { LIST_USERS } from "@/app/api/users";
import { useQuery } from "react-query";

export const userContext = createContext();
export const useUserContext = () => useContext(userContext);

function UserContextProvider({ children }) {
  const [users, setUsers] = useState({
    pages: null,
    search_keyword: "",
    current_page: null,
  });

  const queryKey = ["userList", users];
  const userList = useQuery({
    queryKey,
    queryFn: () => LIST_USERS(users),
    enabled: true,
  });

  function onChange(data) {
    setUsers(old => ({ ...old, ...data }));
  }

  return (
    <userContext.Provider value={{ users, userList, onUserChange: onChange }}>
      {children}
    </userContext.Provider>
  );
}

export default UserContextProvider;
