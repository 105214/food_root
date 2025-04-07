import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Spinner, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./css/allusers.css";
const backendurl=import.meta.env.VITE_BACKEND_URL







const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${backendurl}/admin/allusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.users);
      } catch (err) {
        setError("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center">All Users</h2>
      {loading && <Spinner animation="border" variant="primary" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <div className="table-responsive">
          <Table striped bordered hover className="mt-3">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role || "User"}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="danger"
                        className="deletebutton"
                        size="sm"
                        onClick={() => navigate(`/admin/deleteuser/${user._id}`)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default AllUsers;
























// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Table, Container, Spinner, Alert } from "react-bootstrap";
// import "./css/allusers.css"
// const AllUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUsers = async () => {
//         const token = localStorage.getItem("token"); // ✅ Define before using
    
//         if (!token) {
//             setError("No token found. Please log in.");
//             setLoading(false);
//             return;
//         }
    
//         try {
//             const response = await axios.get("http://localhost:3001/api/admin/allusers", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setUsers(response.data.users);
//         } catch (err) {
//             setError("Failed to fetch users. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };
    
      

//     fetchUsers();
//   }, []);

//   return (
//     <Container className="mt-4">
//       <h2 className="text-center">All Users</h2>

//       {loading && <Spinner animation="border" variant="primary" />}
//       {error && <Alert variant="danger">{error}</Alert>}

//       {!loading && !error && (
//         <div className="table-responsive">
//           <Table striped bordered hover className="mt-3">
//             <thead className="table-dark">
//               <tr>
//                 <th>#</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Role</th>
//                 <th>Joined Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.length > 0 ? (
//                 users.map((user, index) => (
//                   <tr key={user._id}>
//                     <td>{index + 1}</td>
//                     <td>{user.name}</td>
//                     <td>{user.email}</td>
//                     <td>{user.role || "User"}</td>
//                     <td>{new Date(user.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="text-center">
//                     No users found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         </div>
//       )}
//     </Container>
//   );
// };

// export default AllUsers;
