import { useState } from "react";
import api from "./services/api";
import "./App.css";

function App() {

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roleId, setRoleId] = useState("");

  const [file, setFile] = useState(null);
  const [batches, setBatches] = useState([]);

  const [message, setMessage] = useState("");


  // =========================
  // REGISTER
  // =========================

  const register = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post("/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role_id: roleId
      });

      setMessage(
        response.data.message ||
        "Registration successful"
      );

      // Clear fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setRoleId("");

      // Go back to login
      setShowRegister(false);

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Registration failed"
      );
    }
  };


  // =========================
  // LOGIN
  // =========================

  const login = async (e) => {

    e.preventDefault();

    try {

      const response = await api.post("/login", {
        email,
        password
      });

      const jwt = response.data.data.result;

      localStorage.setItem("token", jwt);

      setToken(jwt);

      setMessage("Login successful");

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Login failed"
      );
    }
  };


  // =========================
  // UPLOAD
  // =========================

  const uploadFile = async () => {

    if (!file) {
      setMessage("Please select a CSV file");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {

      const response = await api.post(
        "/upload",
        formData
      );

      setMessage(
        `Upload successful. Batch ID: ${response.data.data.batch_id}`
      );

      loadBatches();

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Upload failed"
      );
    }
  };


  // =========================
  // GET BATCHES
  // =========================

  const loadBatches = async () => {

    try {

      const response = await api.get("/batches");

      setBatches(response.data.data || []);

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Failed to load batches"
      );
    }
  };


  // =========================
  // APPROVE
  // =========================

  const approveBatch = async (id) => {

    try {

      const response = await api.put(
        `/batches/${id}/approve`
      );

      setMessage(response.data.message);

      loadBatches();

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Approval failed"
      );
    }
  };


  // =========================
  // LOGOUT
  // =========================

  const logout = () => {

    localStorage.removeItem("token");

    setToken(null);
    setBatches([]);
  };


  // ==================================================
  // REGISTER SCREEN
  // ==================================================

  if (!token && showRegister) {

    return (

      <div className="login">

        <div className="card">

          <h1>Transaction Import Tool</h1>

          <h2>Create Account</h2>

          <form onSubmit={register}>

            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Role ID"
              value={roleId}
              onChange={(e) =>
                setRoleId(e.target.value)
              }
              required
            />

            <button type="submit">
              Register
            </button>

          </form>

          {message && (
            <p>{message}</p>
          )}

          <p>
            Already have an account?
          </p>

          <button
            onClick={() => {
              setShowRegister(false);
              setMessage("");
            }}
          >
            Go to Login
          </button>

        </div>

      </div>
    );
  }


  // ==================================================
  // LOGIN SCREEN
  // ==================================================

  if (!token) {

    return (

      <div className="login">

        <div className="card">

          <h1>Transaction Import Tool</h1>

          <h2>Login</h2>

          <form onSubmit={login}>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            <button type="submit">
              Login
            </button>

          </form>

          {message && (
            <p>{message}</p>
          )}

          <p>
            Don't have an account?
          </p>

          <button
            onClick={() => {
              setShowRegister(true);
              setMessage("");
            }}
          >
            Register
          </button>

        </div>

      </div>
    );
  }


  // ==================================================
  // DASHBOARD
  // ==================================================

  return (

    <div>

      <header>

        <h2>Transaction Import Tool</h2>

        <button onClick={logout}>
          Logout
        </button>

      </header>


      <main>

        <h1>Dashboard</h1>


        {/* UPLOAD */}

        <section className="card">

          <h2>Upload Transactions</h2>

          <input
            type="file"
            accept=".csv"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
          />

          <button onClick={uploadFile}>
            Upload CSV
          </button>

        </section>


        {message && (
          <div className="message">
            {message}
          </div>
        )}


        {/* BATCHES */}

        <section className="card">

          <div className="section-header">

            <h2>Uploaded Batches</h2>

            <button onClick={loadBatches}>
              Load Batches
            </button>

          </div>


          <table>

            <thead>

              <tr>
                <th>File</th>
                <th>Status</th>
                <th>Total</th>
                <th>Valid</th>
                <th>Invalid</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {batches.map((batch) => (

                <tr key={batch.id}>

                  <td>
                    {batch.file_name}
                  </td>

                  <td>
                    {batch.status}
                  </td>

                  <td>
                    {batch.total_records}
                  </td>

                  <td>
                    {batch.valid_records}
                  </td>

                  <td>
                    {batch.invalid_records}
                  </td>

                  <td>

                    {batch.status === "PENDING" && (

                      <button
                        onClick={() =>
                          approveBatch(batch.id)
                        }
                      >
                        Approve
                      </button>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </section>

      </main>

    </div>
  );
}

export default App;