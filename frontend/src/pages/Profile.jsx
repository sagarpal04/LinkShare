import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile } from "../api";
import { ExternalLink, Link as LinkIcon } from "lucide-react";

function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const res = await getPublicProfile(username);
      setUser(res.data);
    } catch (err) {
      setError("User not found");
    }
  };

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>404</h2>
        <p style={{ color: "#94a3b8" }}>{error}</p>
      </div>
    );
  }

  if (!user) return <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "4rem 2rem" }}>
      <div className="animate-fade-in" style={{ width: "100%", maxWidth: "600px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "0.5rem" }}>@{user.username}</h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {user.links.length === 0 ? (
            <p style={{ textAlign: "center", color: "#94a3b8" }}>No links available yet.</p>
          ) : (
            user.links.map((link, i) => (
              <a 
                key={link._id || i} 
                href={link.url} 
                target="_blank" 
                rel="noreferrer" 
                className="profile-link"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", position: "relative", zIndex: 1 }}>
                  <span>{link.title}</span>
                </div>
              </a>
            ))
          )}
        </div>

        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <a href="/" style={{ color: "#94a3b8", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <LinkIcon size={16} /> powered by LinkHub 
          </a>
        </div>
      </div>
    </div>
  );
}

export default Profile;
