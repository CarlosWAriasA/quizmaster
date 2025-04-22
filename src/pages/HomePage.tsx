import { Button } from "flowbite-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const HomePage = () => {
  const { logout } = useContext(AuthContext);
  return (
    <div className="text-black">
      <Button onClick={logout} className="bg-red-500 hover:bg-red-700">
        Logout
      </Button>
    </div>
  );
};

export default HomePage;
