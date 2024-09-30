import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import { default as bareKy } from "ky";
import type { UserResponse } from "~/routes/api/user";
export type User = UserResponse; // re-export.

export default createRoot(() => {
  const [state, setState] = createStore({
    token: localStorage.getItem("token"),
    user: null as UserResponse | null
  });
  
  const preserveToken = (token: string) => {
    localStorage.setItem("token", token);
    setState({ token });
  }

  const logout = () => {
    localStorage.removeItem("token");
    setState({ token: null, user: null });
  }

  const ky = () => bareKy.extend({
    headers: {
      Authorization: `Bearer ${state.token}`
    }
  })

  const checkToken = async () => {
    if (!state.token) {
      return;
    }

    try {
      const response = await ky().get("/api/user", {
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      }).json<UserResponse>();

      setState("user", response);
    }
    catch {
      logout();
    }
  }
  

  return {
    ky,

    preserveToken,
    checkToken,
    logout,

    get token() {
      return state.token
    },

    get user() {
      return state.user
    }
  };
})