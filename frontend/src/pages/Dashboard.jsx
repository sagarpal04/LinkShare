import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, addLink, deleteLink } from "../api";
import { Plus, Trash2, LogOut, Copy, ExternalLink, Link as LinkIcon } from "lucide-react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch (error) {
      navigate("/login");
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title || !url) return;
    try {
      const res = await addLink({ title, url });
      setUser({ ...user, links: res.data });
      setTitle("");
      setUrl("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteLink(id);
      setUser({ ...user, links: res.data });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`http://localhost:5173/${user.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>Loading...</div>;

  return (
    <>
      <nav className="nav-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ background: "var(--primary-color)", padding: "0.5rem", borderRadius: "50%" }}>
            <LinkIcon size={20} color="white" />
          </div>
          <span style={{ fontWeight: "700", fontSize: "1.25rem" }}>LinkHub</span>
        </div>
        <button onClick={handleLogout} className="btn" style={{ background: "transparent", color: "#cbd5e1" }}>
          <LogOut size={20} /> Logout
        </button>
      </nav>

      <div className="container" style={{ marginTop: "2rem" }}>
        <div className="glass-card animate-fade-in" style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Your Public Link</h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", alignItems: "center", background: "rgba(0,0,0,0.2)", padding: "1rem", borderRadius: "8px" }}>
            <span style={{ color: "#94a3b8", wordBreak: "break-all" }}>{window.location.origin}/{user.username}</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/${user.username}`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }} className="btn" style={{ background: "rgba(255,255,255,0.1)", padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
                {copied ? "Copied!" : <><Copy size={16} /> Copy</>}
              </button>
              <a href={`/${user.username}`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
                <ExternalLink size={16} /> View
              </a>
            </div>
          </div>
        </div>

        <div className="glass-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <h3 style={{ marginBottom: "1.5rem", fontSize: "1.25rem" }}>Add New Link</h3>
          <form onSubmit={handleAdd} style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "flex-end", marginBottom: "2rem" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "#cbd5e1" }}>Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="My Portfolio"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div style={{ flex: "1 1 300px" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", color: "#cbd5e1" }}>URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: "0.75rem 1.5rem", height: "46px" }}>
              <Plus size={20} /> Add
            </button>
          </form>

          <h3 style={{ marginBottom: "1rem", fontSize: "1.25rem" }}>Your Links</h3>
          {user.links.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "2rem" }}>No links added yet.</p>
          ) : (
            <div>
              {user.links.map((link) => (
                <div key={link._id} className="link-item">
                  <div>
                    <h4 style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{link.title}</h4>
                    <a href={link.url} target="_blank" rel="noreferrer" style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                      {link.url}
                    </a>
                  </div>
                  <button onClick={() => handleDelete(link._id)} className="btn btn-danger" style={{ padding: "0.5rem" }}>
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
