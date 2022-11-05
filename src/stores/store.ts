import { defineStore } from "pinia";
import { gql, GraphQLClient } from "graphql-request";

interface State {
  speckleAPI: GraphQLClient;
  isAuthenticated: boolean;
  userInfo: {
    name: string;
    avatar: string;
  } | null;
}

export const useStore = defineStore("default", {
  state: (): State => {
    return {
      speckleAPI: new GraphQLClient(
        import.meta.env.VITE_SERVER_URL + "/graphql"
      ),
      userInfo: null,
      isAuthenticated: false,
    };
  },
  actions: {
    goToSpeckleAuthPage() {
      const challenge =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      localStorage.setItem("CHALLENGE", challenge);

      (window as Window).location = `${
        import.meta.env.VITE_SERVER_URL
      }/authn/verify/${import.meta.env.VITE_APP_SPECKLE_ID}/${challenge}`;
    },

    async exchangeAccessCode(accessCode: string) {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/token/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessCode: accessCode,
            appId: import.meta.env.VITE_APP_SPECKLE_ID,
            appSecret: import.meta.env.VITE_APP_SPECKLE_SECRET,
            challenge: localStorage.getItem("CHALLENGE"),
          }),
        }
      );
      const data = await res.json();
      if (data.token) {
        // If retrieving the token was successful, remove challenge and set the new token and refresh token
        localStorage.removeItem("CHALLENGE");
        localStorage.setItem("SPECKLE_APP_TOKEN", data.token);
        localStorage.setItem("SPECKLE_APP_REFRESH_TOKEN", data.refreshToken);
      }
      return data;
    },

    async fetchUserInfo() {
      const token = localStorage.getItem("SPECKLE_APP_TOKEN");

      if (!token) return;

      const query = gql`
        query {
          activeUser {
            name
            avatar
          }
        }
      `;

      const headers = { authorization: `Bearer ${token}` };

      const response = await this.speckleAPI.request(query, null, headers);

      this.userInfo = response.activeUser;
      this.isAuthenticated = true;
    },

    async signOut() {
      localStorage.removeItem("SPECKLE_APP_TOKEN");
      localStorage.removeItem("SPECKLE_APP_REFRESH_TOKEN");
      location.reload();
    },
  },
});
