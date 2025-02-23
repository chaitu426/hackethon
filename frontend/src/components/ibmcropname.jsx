import { useState } from "react";

const API_BASE_URL = "http://localhost:3000"; // Change this if the backend URL differs

async function getToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/get-token`);
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error fetching token:", error);
    return null;
  }
}

async function apiPost(token, payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, payload }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error making API request:", error);
    return null;
  }
}

export default function IBMMLComponent() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputFields, setInputFields] = useState([""]); // Manage input fields
  const [inputValues, setInputValues] = useState([""]); // Manage input values

  const handlePrediction = async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const payload = {
      input_data: [
        {
          fields: inputFields,
          values: [inputValues],
        },
      ],
    };

    const result = await apiPost(token, payload);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div>
      <h2>IBM ML Prediction</h2>
      <div>
        <label>Fields (comma-separated): </label>
        <input
          type="text"
          value={inputFields.join(",")}
          onChange={(e) => setInputFields(e.target.value.split(","))}
        />
      </div>
      <div>
        <label>Values (comma-separated): </label>
        <input
          type="text"
          value={inputValues.join(",")}
          onChange={(e) => setInputValues(e.target.value.split(","))}
        />
      </div>
      <button onClick={handlePrediction} disabled={loading}>
        {loading ? "Loading..." : "Get Prediction"}
      </button>
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
