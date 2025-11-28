import { Link } from "react-router-dom";
import { useAuth } from "../context/hooks/Auth.Hook"
import { useOrder } from "../context/hooks/Order.Hook";


const Profile = () => {
  const {user, logout} = useAuth();
  const {viewOrders}= useOrder();
  console.log(user);
  const handleLogout = () => {
    logout();
    window.location.reload();

  }
   if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-3">You are not logged in ❌</h2>
        <p className="mb-4">Please login or sign up to continue.</p>

        <Link className="text-blue-600 underline" to="/login">
          Go to Login Page
        </Link>
      </div>
    );
  }

    return (
    <div>
      Profile

      <div className="p-4 border w-1/3">
        <h2 className="font-bold text-lg mb-2">User Information</h2>
        <p><span className="font-semibold">Name:</span> {user?.username}</p>
        <p><span className="font-semibold">Email:</span> {user?.email}</p>
        <p><span className="font-semibold">Joined On:</span> {new Date(user?.createdAt || "").toLocaleDateString()}</p>
      </div>
      <div>
        <button onClick={handleLogout}>Logout</button>
        <Link to="/order" onClick={()=>viewOrders()}>Check order history</Link>

      </div>
    </div>
  )
}

export default Profile
