import { Landing } from "./pages";
import {Header} from "./components"
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  return (
    <div className="bg-gray-900 text-gray-200">
      <Header user={user} setUser={setUser} />
      <Landing user={user} />
    </div>
  );
}

export default App;
