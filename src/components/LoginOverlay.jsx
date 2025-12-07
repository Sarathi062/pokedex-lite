import { useEffect } from "react";

export default function LoginOverlay({ onLogin }) {
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: "YOUR_CLIENT_ID.apps.googleusercontent.com",
      callback: handleLogin,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      { theme: "filled_blue", size: "large", width: "250" }
    );
  }, []);

  function handleLogin(response) {
    const jwt = response.credential;

    const payload = JSON.parse(atob(jwt.split(".")[1]));

    const user = {
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
      jwt,
    };

    localStorage.setItem("user", JSON.stringify(user));
    onLogin(user);
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <h2>Login to Continue</h2>
        <div id="googleBtn"></div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backdropFilter: "blur(6px)",
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  box: {
    background: "white",
    padding: "2rem",
    borderRadius: 12,
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
  },
};
